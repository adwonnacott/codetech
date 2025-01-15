@isTest
public class XeroWebhookHandlerTest {
    @testSetup
    static void setup(){
        insert XeroTestDataFactory.createXeroSettings();
        insert XeroTestDataFactory.createXeroApiTokenRecord();

        Account acctRec = XeroTestDataFactory.createAccount();
        acctRec.Xero_Contact_ID__c = 'COOLID1234';
        insert acctRec;
    }

    @isTest
    static void testWebhookHandler(){
        RestRequest req = new RestRequest(); 
        req.requestURI = '/services/apexrest/XeroWebhookHandler/';
        req.httpMethod = 'POST';

        //Create test webhook request
        ProcessXeroEventsBatch.XeroWebhookRequest webhookReq = new ProcessXeroEventsBatch.XeroWebhookRequest();
        webhookReq.events = new List<ProcessXeroEventsBatch.XeroEvent>();
        ProcessXeroEventsBatch.XeroEvent xeroEvt = new ProcessXeroEventsBatch.XeroEvent();
        xeroEvt.resourceId = 'SOMEINVID12345';
        xeroEvt.eventCategory = 'INVOICE';
        webhookReq.events.add(xeroEvt);

        req.requestBody = Blob.valueOf(JSON.serialize(webhookReq));

        Xero_API_Settings__c settings = Xero_API_Settings__c.getOrgDefaults();

        req.headers.put('x-xero-signature', XeroWebhookHandler.generateHmacSHA256Signature(req.requestBody.toString(), settings.Webhook_Private_Key__c));
        RestContext.request = req;

        RestResponse res = new RestResponse();
        RestContext.response = res;

        List<Xero_Invoice__c> invoices = [SELECT Id FROM Xero_Invoice__c];
        Assert.areEqual(0, invoices.size());

        List<Xero_Invoice_Line_Item__c> invoiceLines = [SELECT Id FROM Xero_Invoice_Line_Item__c];
        Assert.areEqual(0, invoiceLines.size());

        Test.setMock(HttpCalloutMock.class, new XeroApiHttpMock());

        Test.startTest();
        XeroWebhookHandler.handleWebhookRequest();
        Test.stopTest();

        invoices = [SELECT Id FROM Xero_Invoice__c];
        Assert.areEqual(1, invoices.size());

        invoiceLines = [SELECT Id FROM Xero_Invoice_Line_Item__c];
        Assert.areEqual(2, invoiceLines.size());
    }
}