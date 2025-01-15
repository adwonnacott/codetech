@isTest
public class XeroAuthUtilityTest {
    @testSetup
    static void setup(){
        insert XeroTestDataFactory.createXeroSettings();
        insert XeroTestDataFactory.createXeroApiTokenRecord();
    }

    @isTest
    static void testGetXeroApiSettings(){
        Xero_API_Settings__c settings = XeroAuthUtility.getXeroApiSettings();
        Assert.isNotNull(settings);
    }
    
    @isTest
    static void testUpsertXeroApiSettings(){
        Xero_API_Settings__c settings = Xero_API_Settings__c.getOrgDefaults();
        Assert.areEqual('KEYABC123', settings.Consumer_Key__c);

        settings.Consumer_Key__c = 'KEY123ABC';
        XeroAuthUtility.upsertXeroApiSettings(settings);

        settings = Xero_API_Settings__c.getOrgDefaults();
        Assert.areEqual('KEY123ABC', settings.Consumer_Key__c);
    }
    
    @isTest
    static void testRevokeXeroApiTokens(){
        List<Xero_API_Tokens__c> tokensList = [SELECT Id FROM Xero_API_Tokens__c];
        Assert.isTrue(tokensList.size() > 0);

        XeroAuthUtility.revokeXeroApiTokens();

        tokensList = [SELECT Id FROM Xero_API_Tokens__c];
        Assert.isTrue(tokensList.size() == 0);
    }
    
    @isTest
    static void testScheduleRefreshTokenBatch(){
        List<CronTrigger> refreshTokenJobs = [SELECT 
                                                    Id, 
                                                    CronJobDetail.Id, 
                                                    CronJobDetail.Name 
                                                FROM CronTrigger 
                                                WHERE CronJobDetail.Name LIKE 'XeroTokenRefreshBatch%'];
        if(!refreshTokenJobs.isEmpty()){
            for(CronTrigger cronTrig : refreshTokenJobs){
                System.abortJob(cronTrig.Id);
            }
        }

        XeroAuthUtility.scheduleRefreshTokenBatch();
    }
    
    @isTest
    static void testGetAuthURL(){
        String authUrl = XeroAuthUtility.getAuthURL('TESTCLIENTID');
        Assert.isTrue(authUrl.contains('TESTCLIENTID'));
    }
    
    @isTest
    static void testExchangeCodeToToken(){

        Test.setMock(HttpCalloutMock.class, new XeroApiHttpMock());

        Test.startTest();
        XeroAuthUtility.TokenResponse tokenResp = XeroAuthUtility.exchangeCodeToToken('somecode12345');
        Test.stopTest();

        Assert.areEqual('REFTOKEN123', tokenResp.refresh_token);
        Assert.areEqual('ACCTOKEN123', tokenResp.access_token);
        Assert.areEqual(1800, tokenResp.expires_in);

        
        Xero_API_Settings__c settings = Xero_API_Settings__c.getOrgDefaults();

        List<Xero_API_Tokens__c> apiTokens = [SELECT Id, Access_Token__c, Refresh_Token__c, Expires_In__c FROM Xero_API_Tokens__c WHERE Name = :settings.Xero_API_Tokens_Record_Name__c];
        Assert.isTrue(apiTokens.size() == 1);
        Assert.areEqual('REFTOKEN123', apiTokens[0].Refresh_Token__c);
        Assert.areEqual('ACCTOKEN123', apiTokens[0].Access_Token__c);
        Assert.isNotNull(apiTokens[0].Expires_In__c);
    }
    
    @isTest
    static void testGetTenantId(){
        Test.setMock(HttpCalloutMock.class, new XeroApiHttpMock());

        Test.startTest();
        XeroAuthUtility.TenantResponse tenantResp = XeroAuthUtility.getTenantId('TESTACCESSTOKEN123');
        Test.stopTest();

        Assert.areEqual('TENANTID123', tenantResp.tenantId);
        Assert.areEqual('Somethin', tenantResp.tenantType);
        Assert.areEqual('Xero Test', tenantResp.tenantName);
    }
    
    @isTest
    static void testRefreshAccessToken(){
        Test.setMock(HttpCalloutMock.class, new XeroApiHttpMock());

        Xero_API_Settings__c settings = Xero_API_Settings__c.getOrgDefaults();

        List<Xero_API_Tokens__c> apiTokens = [SELECT Id, Access_Token__c, Refresh_Token__c, Expires_In__c FROM Xero_API_Tokens__c WHERE Name = :settings.Xero_API_Tokens_Record_Name__c];
        Test.startTest();
        XeroAuthUtility.refreshAccessToken(apiTokens[0]);
        Test.stopTest();

        apiTokens = [SELECT Id, Access_Token__c, Refresh_Token__c, Expires_In__c FROM Xero_API_Tokens__c WHERE Name = :settings.Xero_API_Tokens_Record_Name__c];
        Assert.areEqual('REFTOKEN123REFRESH', apiTokens[0].Refresh_Token__c);
        Assert.areEqual('ACCTOKEN123REFRESH', apiTokens[0].Access_Token__c);
        Assert.isNotNull(apiTokens[0].Expires_In__c);
    }
}