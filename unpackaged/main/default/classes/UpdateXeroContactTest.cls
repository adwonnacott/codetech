@isTest
public class UpdateXeroContactTest {
    @testSetup
    static void setup(){
        insert XeroTestDataFactory.createXeroSettings();
        insert XeroTestDataFactory.createXeroApiTokenRecord();

        Contact billingCont = XeroTestDataFactory.createContact();
        insert billingCont;

        Account acctRec = XeroTestDataFactory.createAccount();
        acctRec.Billing_Contact__c = billingCont.Id;
        insert acctRec;
    }

    @isTest
    static void testCallCreateAPI(){
        Test.setMock(HttpCalloutMock.class, new XeroApiHttpMock());

        List<Xero_Log_Activity__c> logActs = [SELECT Id FROM Xero_Log_Activity__c];
        Assert.areEqual(0, logActs.size());

        Account acctRec = [SELECT Id, Xero_Contact_ID__c FROM Account WHERE Name = 'Test Account'];
        Assert.isNull(acctRec.Xero_Contact_ID__c);

        Test.startTest();
        UpdateXeroContact.callCreateAPI(new List<Id>{acctRec.Id});
        Test.stopTest();

        acctRec = [SELECT Id, Xero_Contact_ID__c FROM Account WHERE Id = :acctRec.Id];
        Assert.areEqual('COOLID1234', acctRec.Xero_Contact_ID__c);

        logActs = [SELECT Id FROM Xero_Log_Activity__c];
        Assert.areEqual(1, logActs.size());
    }
}