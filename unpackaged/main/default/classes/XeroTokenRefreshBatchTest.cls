@isTest
public class XeroTokenRefreshBatchTest {
    @testSetup
    static void setup(){
        insert XeroTestDataFactory.createXeroSettings();
        insert XeroTestDataFactory.createXeroApiTokenRecord();
    }

    @isTest
    static void testExecuteBatch(){
        Test.setMock(HttpCalloutMock.class, new XeroApiHttpMock());

        Test.startTest();
        Database.executeBatch(new XeroTokenRefreshBatch());
        Test.stopTest();
        
        Xero_API_Settings__c settings = Xero_API_Settings__c.getOrgDefaults();

        List<Xero_API_Tokens__c> apiTokens = [SELECT Id, Access_Token__c, Refresh_Token__c, Expires_In__c FROM Xero_API_Tokens__c WHERE Name = :settings.Xero_API_Tokens_Record_Name__c];
        Assert.areEqual('REFTOKEN123REFRESH', apiTokens[0].Refresh_Token__c);
        Assert.areEqual('ACCTOKEN123REFRESH', apiTokens[0].Access_Token__c);
        Assert.isNotNull(apiTokens[0].Expires_In__c);
    }
}