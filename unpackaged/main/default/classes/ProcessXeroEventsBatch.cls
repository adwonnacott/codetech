public class ProcessXeroEventsBatch implements Database.Batchable<String>, Database.AllowsCallouts, Database.Stateful{
    private final String webhookReqBody;
    private final List<String> xeroInvIds;

    public ProcessXeroEventsBatch(String webhookReqBody) {
        this.webhookReqBody = webhookReqBody;
        this.xeroInvIds = new List<String>();

        XeroWebhookRequest parsedWebhookReq = (XeroWebhookRequest)JSON.deserialize(webhookReqBody, XeroWebhookRequest.class);
        if(parsedWebhookReq != null && parsedWebhookReq.events != null && parsedWebhookReq.events.size() > 0){
            //Get Xero Contact/Invoice IDs
            for(XeroEvent xeroEvt : parsedWebhookReq.events){
                if(xeroEvt.eventCategory == 'INVOICE'){
                    if(!this.xeroInvIds.contains(xeroEvt.resourceId)){
                        this.xeroInvIds.add(xeroEvt.resourceId);
                    }
                }
            }
        }
    }

    public List<String> start(Database.BatchableContext bc){
        return this.xeroInvIds;
    }

    public void execute(Database.BatchableContext bc, List<String> scope){
        //Get Authentication settings
        Xero_API_Settings__c apiSettings = Xero_API_Settings__c.getOrgDefaults();

        List<Xero_Log_Activity__c> xeroLogActivities = new List<Xero_Log_Activity__c>();

        try{
            String tenantId = apiSettings.Tenant_ID__c;

            if(tenantId != null){
                //Variables to store new SF records
                List<Xero_Invoice__c> xeroInvoicesToUpsert = new List<Xero_invoice__c>();
                List<Xero_Invoice_Line_Item__c> xeroInvoiceLinesToUpsert = new List<Xero_Invoice_Line_Item__c>();

                //Create Xero Invoice and Xero Invoice Line Items
                List<XeroInvoiceAndLines> invAndLinesList = new List<XeroInvoiceAndLines>();
                if(!scope.isEmpty()){
                    HttpRequest req = XeroApiUtility.getXeroHttpRequest('GET', '/api.xro/2.0/Invoices', null);
                    req.setEndpoint(req.getEndpoint()+'?IDs='+String.join(scope, ','));
                    req.setHeader('xero-tenant-id', tenantId);
                    req.setTimeout(20000);
                    Http http = new Http();
                    HttpResponse resp = http.send(req);

                    System.debug('Xero GET Invoices Status: '+resp.getStatus()+' '+resp.getStatusCode());
                    System.debug('Xero GET Invoices Response Body: '+resp.getBody());
                    if(resp.getStatus() == 'OK' && resp.getStatusCode() == 200){
                        XeroInvoicesResponse xeroInvoicesResp = (XeroInvoicesResponse)JSON.deserialize(resp.getBody(), XeroInvoicesResponse.class);
                        System.debug('Xero GET Invoices Response Body Status: '+xeroInvoicesResp.Status);
                        if(xeroInvoicesResp.Status == 'OK'){
                            Map<String, Xero_Invoice__c> xeroInvoicesMap = new Map<String, Xero_Invoice__c>();
                            for(Xero_Invoice__c xeroInvoice : [SELECT 
                                                                    Id, 
                                                                    Xero_Invoice_ID__c,
                                                                    (SELECT
                                                                            Id,
                                                                            Xero_Line_Item_ID__c
                                                                        FROM
                                                                            Xero_Invoice_Line_Items__r) 
                                                                FROM Xero_Invoice__c 
                                                                WHERE Xero_Invoice_ID__c IN :scope]){
                                xeroInvoicesMap.put(xeroInvoice.Xero_Invoice_ID__c, xeroInvoice);
                            }
                            
                            Set<String> xeroContactIds = new Set<String>();
                            for(XeroInvoice xeroInv : xeroInvoicesResp.Invoices){
                                if(xeroInv.Type == 'ACCREC' && xeroInv.Status != 'DRAFT' && xeroInv.Status != 'SUBMITTED'){
                                    xeroContactIds.add(xeroInv.Contact.ContactId);
                                }
                            }
                            
                            Map<String, Account> accountsMap = new Map<String, Account>();
                            for(Account acctRec : [SELECT Id, Xero_Contact_ID__c FROM Account WHERE Xero_Contact_ID__c IN :xeroContactIds]){
                                accountsMap.put(acctRec.Xero_Contact_ID__c, acctRec);
                            }

                            for(XeroInvoice xeroInv : xeroInvoicesResp.Invoices){
                                if(xeroInv.Type == 'ACCREC' && xeroInv.Status != 'DRAFT' && xeroInv.Status != 'SUBMITTED'){
                                    if(accountsMap.containsKey(xeroInv.Contact.ContactID)){
                                        XeroInvoiceAndLines invAndLines = new XeroInvoiceAndLines();
                                        invAndLines.xeroInvoice = xeroInv;
                                        invAndLines.xeroLineItems = xeroInv.LineItems;
        
                                        Xero_Invoice__c updatedXeroInv = new Xero_Invoice__c(
                                            Id = (xeroInvoicesMap.containsKey(xeroInv.InvoiceID) ? xeroInvoicesMap.get(xeroInv.InvoiceID).Id : null),
                                            Account__c = accountsMap.get(xeroInv.Contact.ContactId).Id,
                                            Amount_Credited__c = xeroInv.AmountCredited,
                                            Amount_Due__c = xeroInv.AmountDue,
                                            Amount_Paid__c = xeroInv.AmountPaid,
                                            Fully_Paid_On_Date__c = (xeroInv.FullyPaidOnDate != null ? getConvertedEpoch(xeroInv.FullyPaidOnDate) : null),
                                            Invoice_Date__c = (xeroInv.DateString != null ? Date.valueOf(xeroInv.DateString) : null),
                                            Invoice_Due_Date__c = (xeroInv.DueDateString != null ? Date.valueOf(xeroInv.DueDateString) : null),
                                            Invoice_Reference__c = xeroInv.Reference,
                                            Invoice_Number__c = xeroInv.InvoiceNumber,
                                            Invoice_Status__c = xeroInv.Status,
                                            Paid__c = (xeroInv.Status != null && xeroInv.Status == 'PAID' ? true : false),
                                            SubTotal__c = xeroInv.SubTotal,
                                            Total__c = xeroInv.Total,
                                            TotalTax__c = xeroInv.TotalTax,
                                            Xero_Invoice_ID__c = xeroInv.InvoiceID 
                                        );
                                        xeroInvoicesToUpsert.add(updatedXeroInv);
                                        invAndLines.sfXeroInvoice = updatedXeroInv;
        
                                        if(xeroInv.LineItems != null && xeroInv.LineItems.size() > 0){
                                            //Get existing Xero Invoice Line Items and put to Map if any
                                            List<Xero_Invoice_Line_Item__c> existingLineItems = (xeroInvoicesMap.containsKey(xeroInv.InvoiceID) ? xeroInvoicesMap.get(xeroInv.InvoiceID).Xero_Invoice_Line_Items__r : new List<Xero_Invoice_Line_Item__c>());
                                            Map<String, Xero_Invoice_Line_Item__c> lineItemIdToLineItemMap = new Map<String, Xero_Invoice_Line_Item__c>();
                                            for(Xero_Invoice_Line_Item__c xeroLineItem : existingLineItems){
                                                lineItemIdToLineItemMap.put(xeroLineItem.Xero_Line_Item_ID__c, xeroLineItem);
                                            }
                                            
                                            invAndLines.sfXeroLineItems = new List<Xero_Invoice_Line_Item__c>();
                                            for(XeroLineItem xeroLineItem : xeroInv.LineItems){
                                                Xero_Invoice_Line_Item__c updatedXeroLineItm = new Xero_Invoice_Line_Item__c(
                                                    Id = (lineItemIdToLineItemMap.containsKey(xeroLineItem.LineItemID) ? lineItemIdToLineItemMap.get(xeroLineItem.LineItemID).Id : null),
                                                    Account_Code__c = xeroLineItem.AccountCode,
                                                    Description__c = xeroLineItem.Description,
                                                    Item_Code__c = xeroLineItem.ItemCode,
                                                    Line_Amount__c = xeroLineItem.LineAmount,
                                                    Quantity__c = xeroLineItem.Quantity,
                                                    Unit_Amount__c = xeroLineItem.UnitAmount,
                                                    Xero_Line_Item_ID__c = xeroLineItem.LineItemID
                                                );
                                                xeroInvoiceLinesToUpsert.add(updatedXeroLineItm);
                                                invAndLines.sfXeroLineItems.add(updatedXeroLineItm);
                                            }
                                        }
        
                                        //Xero Log Activity creation
                                        invAndLines.logActivity = new Xero_Log_Activity__c(
                                            Object__c = 'Xero Invoice',
                                            Action__c = (updatedXeroInv.Id == null ? 'Create in Salesforce' : 'Update in Salesforce'),
                                            Xero_ID__c = invAndLines.xeroInvoice.InvoiceID,
                                            JSON_Request__c = webhookReqBody
                                        );  

                                        invAndLinesList.add(invAndLines);

                                    }
                                }
                            }
                        }
                    }
                }

                //Upsert Xero Invoice and Xero Lines
                if(invAndLinesList.size() > 0){
                    //Upsert Xero Invoices
                    upsert xeroInvoicesToUpsert;

                    if(xeroInvoiceLinesToUpsert.size() > 0){
                        for(XeroInvoiceAndLines invAndLines : invAndLinesList){
                            for(Xero_Invoice_Line_Item__c xeroLineItem : invAndLines.sfXeroLineItems){
                                if(xeroLineItem.Id == null){
                                    xeroLineItem.Xero_Invoice__c = invAndLines.sfXeroInvoice.Id;
                                }
                            }
                        }

                        //Upsert Xero Invoice Lines
                        upsert xeroInvoiceLinesToUpsert;
                    }

                    for(XeroInvoiceAndLines invAndLines : invAndLinesList){
                        invAndLines.logActivity.Xero_Invoice__c = invAndLines.sfXeroInvoice.Id;
                        invAndLines.logActivity.Outcome__c = 'Success';

                        xeroLogActivities.add(invAndLines.logActivity);
                    }
                }
            } else {
                throw new XeroApiException('No Xero Tenant ID found.');
            }
        } catch(Exception ex){
            System.debug('stack trace: '+ex.getStackTraceString());
            System.debug('error: '+ex.getMessage());
            xeroLogActivities.add(new Xero_Log_Activity__c(
                Object__c = 'Xero Invoice',
                Action__c = 'Create in Salesforce',
                Outcome__c = 'Error',
                Error_Code__c = ex.getMessage(),
                JSON_Request__c = webhookReqBody
            ));
        }
    }

    public void finish(Database.BatchableContext bc){

    }

    public Date getConvertedEpoch(String str){
        String epochTime = str.substringBetween('(',')').subStringBefore('+');
        Long timestamp = Long.valueOf(epochTime);
        return Date.valueOf(DateTime.newInstance(timestamp));
    }

    public class XeroWebhookRequest {
        public List<XeroEvent> events;
    }

    public class XeroEvent {
        public String resourceUrl;
        public String resourceId;
        public String tenantId;
        public String tenantType;
        public String eventCategory;
        public String eventType;
        public String eventDateUtc;
    }

    public class XeroContactsResponse {
        public String Id;
        public String Status;
        public String ProviderName;
        public String DateTimeUTC;
        public List<XeroContact> Contacts;
    }

    public class XeroContact {
        public String ContactID;
        public String Name;
    }

    public class XeroInvoicesResponse {
        public String Id;
        public String Status;
        public String ProviderName;
        public String DateTimeUTC;
        public List<XeroInvoice> Invoices;
    }

    public class XeroInvoice {
        public Decimal AmountCredited;
        public Decimal AmountDue;
        public Decimal AmountPaid;
        public String FullyPaidOnDate;
        public String DateString;
        public String DueDateString;
        public String Reference;
        public String InvoiceNumber;
        public String Status;
        public Decimal SubTotal;
        public Decimal Total;
        public Decimal TotalTax;
        public String Type;
        public XeroContact Contact;
        public String InvoiceID;
        public List<XeroLineItem> LineItems;
    }

    public class XeroLineItem {
        public String AccountCode;
        public String Description;
        public String ItemCode;
        public Decimal LineAmount;
        public Decimal Quantity;
        public Decimal UnitAmount;
        public String LineItemID;
    }

    public class XeroInvoiceAndLines {
        public XeroInvoice xeroInvoice;
        public Xero_Invoice__c sfXeroInvoice;
        public List<XeroLineItem> xeroLineItems;
        public List<Xero_Invoice_Line_Item__c> sfXeroLineItems;
        public Xero_Log_Activity__c logActivity;
    }
}