public with sharing class UpdateXeroContact {
    @InvocableMethod(label='Update Xero Contact')
    public static void callCreateAPI(List<Id> acctIds) {
        System.debug('Update Xero Contact');
        updateXeroContact(acctIds);
    }
    
    @future(callout = true)
    public static void updateXeroContact(List<Id> acctIds){
        //Get Tenant Id
        String tenantId = Xero_API_Settings__c.getOrgDefaults().Tenant_ID__c;
        
        List<Xero_Log_Activity__c> xeroLogActivities = new List<Xero_Log_Activity__c>();

        try {
            List<Account> acctRecs = [SELECT 
                                            Id, 
                                            Name, 
                                            Xero_Contact_ID__c,
                                            Billing_Contact__c, 
                                            Billing_Contact__r.FirstName, 
                                            Billing_Contact__r.LastName, 
                                            Billing_Contact__r.Email, 
                                            Primary_Contact__c,
                                            Primary_Contact__r.FirstName,
                                            Primary_Contact__r.LastName,
                                            Primary_Contact__r.Email,
                                            BillingCity,
                                            BillingState,
                                            BillingCountry,
                                            BillingPostalCode,
                                            BillingAddressLine2__c,
                                            BillingAddressLine3__c,
                                            BillingAddressLine4__c,
                                            BillingAddressLine1__c,
                                            BillingAddressPostcode__c,
                                            ShippingCity,
                                            ShippingState,
                                            ShippingCountry,
                                            ShippingPostalCode,
                                            ZoeyAccountCode__c,
                                            Phone
                                        FROM Account 
                                        WHERE Id IN :acctIds];

            XeroContacts xeroConts = new XeroContacts();
            xeroConts.Contacts = new List<XeroContact>();

            for(Account acctRec : acctRecs){
                //Update Xero Contact
                XeroContact xeroCont    = new XeroContact();
                xeroCont.ContactId      = acctRec.Xero_Contact_ID__c;
                xeroCont.Name           = acctRec.Name;
                xeroCont.ContactNumber  = acctRec.Id;
                xeroCont.AccountNumber  = acctRec.ZoeyAccountCode__c;

                if(acctRec.Billing_Contact__c != null){
                    xeroCont.FirstName      = acctRec.Billing_Contact__r.FirstName;
                    xeroCont.LastName       = acctRec.Billing_Contact__r.LastName;
                    xeroCont.EmailAddress   = acctRec.Billing_Contact__r.Email;
                }

                XeroAddress billingAddr     = new XeroAddress();
                billingAddr.AddressType     = 'POBOX';
                billingAddr.City            = acctRec.BillingAddressLine2__c;
                billingAddr.Region          = acctRec.BillingAddressLine3__c;
                billingAddr.Country         = acctRec.BillingAddressLine4__c;
                billingAddr.PostalCode      = acctRec.BillingAddressPostcode__c;
                
                billingAddr.AddressLine1    = acctRec.BillingAddressLine1__c;
                billingAddr.AddressLine2    = acctRec.BillingAddressLine2__c;
                billingAddr.AddressLine3    = acctRec.BillingAddressLine3__c;
                billingAddr.AddressLine4    = acctRec.BillingAddressLine4__c;
                
                XeroAddress shippingAddr = new XeroAddress();
                shippingAddr.AddressType    = 'STREET';
                shippingAddr.City           = acctRec.ShippingCity;
                shippingAddr.Region         = acctRec.ShippingState;
                shippingAddr.PostalCode     = acctRec.ShippingPostalCode;
                shippingAddr.Country        = acctRec.ShippingCountry;

                XeroPhones phone    = new XeroPhones();
                phone.PhoneNumber   = acctRec.Phone;

                xeroCont.Addresses  = new List<XeroAddress>{billingAddr, shippingAddr};
                xeroCont.Phones     = new List<XeroPhones>{phone};

                //Add to Request
                xeroConts.Contacts.add(xeroCont);
            }

            if(xeroConts.Contacts != null && !xeroConts.Contacts.isEmpty()){
                HttpRequest createContReq = XeroApiUtility.getXeroHttpRequest('POST', '/api.xro/2.0/Contacts/', JSON.serialize(xeroConts));
                createContReq.setHeader('xero-tenant-id', tenantId);
                Http createContHttp = new Http();
                HttpResponse createContResp = createContHttp.send(createContReq);
        
                if(createContResp.getStatus() == 'OK' && createContResp.getStatusCode() == 200){
                    System.debug('Xero Contact updated successfully!');
                    System.debug('body: '+createContResp.getBody());
                    XeroContacts xeroContsResponse = (XeroContacts)JSON.deserialize(createContResp.getBody(), XeroContacts.class);

                    List<Account> updatedAccts = new List<Account>();
                    for(XeroContact xeroCont : xeroContsResponse.Contacts){
                        updatedAccts.add(new Account(
                            Id = xeroCont.ContactNumber,
                            Xero_Contact_ID__c = xeroCont.ContactID
                        ));

                        xeroLogActivities.add(new Xero_Log_Activity__c(
                            Object__c = 'Account',
                            Action__c = 'Update in Xero',
                            Xero_ID__c = xeroCont.ContactID,
                            Account__c = xeroCont.ContactNumber,
                            Outcome__c = 'Success',
                            JSON_Request__c = JSON.serialize(xeroConts)
                        ));
                    }
                    if(updatedAccts.size() > 0){
                        update updatedAccts;
                    }
                } else {
                    throw new XeroApiException('Failed to update Contact: '+createContResp.getStatus()+' '+createContResp.getStatusCode()+' - '+createContResp.getBody());
                }
            }
        } catch(Exception ex){
            String errMessage = ex.getMessage();
            for(Id acctId : acctIds){
                xeroLogActivities.add(new Xero_Log_Activity__c(
                    Object__c = 'Account',
                    Action__c = 'Update in Xero',
                    Account__c = acctId,
                    Outcome__c = 'Error',
                    Error_Code__c = errMessage,
                    JSON_Request__c = errMessage
                ));
            }
        }

        if(xeroLogActivities.size() > 0){
            insert xeroLogActivities;
        }
    }

    public class XeroContacts {
        public List<XeroContact> Contacts;
    }

    public class XeroContact {
        public String ContactID;
        public String ContactNumber;
        public String Name;
        public String FirstName;
        public String LastName;
        public String EmailAddress;
        public List<XeroAddress> Addresses;
        public List<XeroPhones> Phones;
        public String Website;
        public String AccountNumber;
    }

    public class XeroPhones { 
        public String PhoneNumber;
    }

    public class XeroAddress {
        public String AddressType;
        public String City;
        public String Region;
        public String PostalCode;
        public String Country;
        public String AddressLine1;
        public String AddressLine2;
        public String AddressLine3;
        public String AddressLine4;
    }
}