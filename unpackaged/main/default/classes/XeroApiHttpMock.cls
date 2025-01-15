@isTest
public class XeroApiHttpMock implements HttpCalloutMock{
    public HttpResponse respond(HttpRequest req){
        HttpResponse resp;

        String endpoint = req.getEndpoint();
        if(endpoint == 'https://identity.xero.com/connect/token'){
            resp = new HttpResponse();
            resp.setStatusCode(200);
            resp.setStatus('OK');

            String reqBody = req.getBody();
            if(reqBody.contains('grant_type=authorization_code')){
                XeroAuthUtility.TokenResponse tokenResp = new XeroAuthUtility.TokenResponse();
                tokenResp.refresh_token = 'REFTOKEN123';
                tokenResp.access_token = 'ACCTOKEN123';
                tokenResp.expires_in = 1800;
                resp.setBody(JSON.serialize(tokenResp));
            } else if(reqBody.contains('grant_type=refresh_token')){
                XeroAuthUtility.TokenResponse tokenResp = new XeroAuthUtility.TokenResponse();
                tokenResp.refresh_token = 'REFTOKEN123REFRESH';
                tokenResp.access_token = 'ACCTOKEN123REFRESH';
                tokenResp.expires_in = 1800;
                resp.setBody(JSON.serialize(tokenResp));
            }
        } else if(endpoint == 'https://api.xero.com/connections'){
            resp = new HttpResponse();
            resp.setStatusCode(200);
            resp.setStatus('OK');

            XeroAuthUtility.TenantResponse tenantResp = new XeroAuthUtility.TenantResponse();
            tenantResp.tenantId = 'TENANTID123';
            tenantResp.tenantType = 'Somethin';
            tenantResp.tenantName = 'Xero Test';
            resp.setBody(JSON.serialize(new List<XeroAuthUtility.TenantResponse>{tenantResp}));
        } else if(endpoint.contains('/api.xro/2.0/Contacts/')){
            resp = new HttpResponse();
            resp.setStatusCode(200);
            resp.setStatus('OK');

            CreateXeroContact.XeroContacts xeroConts = (CreateXeroContact.XeroContacts)JSON.deserialize(req.getBody(), CreateXeroContact.XeroContacts.class);
            xeroConts.Contacts[0].ContactId = 'COOLID1234';

            resp.setBody(JSON.serialize(xeroConts));
        } else if(endpoint.contains('/api.xro/2.0/Invoices')){
            resp = new HttpResponse();
            resp.setStatusCode(200);
            resp.setStatus('OK');

            ProcessXeroEventsBatch.XeroInvoicesResponse xeroInvResp = new ProcessXeroEventsBatch.XeroInvoicesResponse();
            xeroInvResp.Id = 'RESPID123';
            xeroInvResp.Status = 'OK';
            xeroInvResp.ProviderName = 'Testing';
            xeroInvResp.Invoices = new List<ProcessXeroEventsBatch.XeroInvoice>();
        
            ProcessXeroEventsBatch.XeroInvoice xeroInv = new ProcessXeroEventsBatch.XeroInvoice();
            xeroInv.AmountCredited = 100;
            xeroInv.AmountDue = 100;
            xeroInv.AmountPaid = 100;
            xeroInv.FullyPaidOnDate = null;
            xeroInv.DateString = '2023-01-02';
            xeroInv.DueDateString = '2023-01-02';
            xeroInv.Reference = 'ABC1234';
            xeroInv.InvoiceNumber = 'INV123';
            xeroInv.Status = 'PAID';
            xeroInv.SubTotal = 100;
            xeroInv.Total = 100;
            xeroInv.TotalTax = 5;
            xeroInv.Type = 'ACCREC';
            xeroInv.Contact = new ProcessXeroEventsBatch.XeroContact();
            xeroInv.Contact.ContactId = 'COOLID1234';
            xeroInv.InvoiceID = 'INVOICEID1234';
            xeroInv.LineItems = new List<ProcessXeroEventsBatch.XeroLineItem>();

            ProcessXeroEventsBatch.XeroLineItem xeroLineItem1 = new ProcessXeroEventsBatch.XeroLineItem();
            xeroLineItem1.AccountCode = 'ACC123';
            xeroLineItem1.Description = 'Test description';
            xeroLineItem1.ItemCode = 'ITEM1';
            xeroLineItem1.LineAmount = 50;
            xeroLineItem1.Quantity = 1;
            xeroLineItem1.UnitAmount = 50;
            xeroLineItem1.LineItemID = 'LINEITEMID1';
            xeroInv.LineItems.add(xeroLineItem1);

            ProcessXeroEventsBatch.XeroLineItem xeroLineItem2 = new ProcessXeroEventsBatch.XeroLineItem();
            xeroLineItem2.AccountCode = 'ACC123';
            xeroLineItem2.Description = 'Test description';
            xeroLineItem2.ItemCode = 'ITEM2';
            xeroLineItem2.LineAmount = 50;
            xeroLineItem2.Quantity = 2;
            xeroLineItem2.UnitAmount = 25;
            xeroLineItem2.LineItemID = 'LINEITEMID2';
            xeroInv.LineItems.add(xeroLineItem2);

            xeroInvResp.Invoices.add(xeroInv);

            resp.setBody(JSON.serialize(xeroInvResp));
        }

        return resp;
    }
}