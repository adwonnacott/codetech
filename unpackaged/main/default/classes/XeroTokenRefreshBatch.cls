public class XeroTokenRefreshBatch implements Database.Batchable<sObject>, Schedulable, Database.Stateful, Database.AllowsCallouts {
    public void execute(SchedulableContext sc) {
        Database.executeBatch(new XeroTokenRefreshBatch(), 1);
    }

    public Database.QueryLocator start(Database.BatchableContext BC) {
        Xero_API_Settings__c settings = Xero_API_Settings__c.getOrgDefaults();
        String xeroApiTokensRecName = settings.Xero_API_Tokens_Record_Name__c;
        String query = 'SELECT Id, Access_Token__c, Refresh_Token__c, Expires_In__c FROM Xero_API_Tokens__c WHERE Name = :xeroApiTokensRecName';
        return Database.getQueryLocator(query);
    }

    public void execute(Database.BatchableContext BC, List<Xero_API_Tokens__c> scope) {
        Xero_API_Tokens__c xeroApiTokens = scope[0];
        XeroAuthUtility.refreshAccessToken(xeroApiTokens);
    }

    public void finish(Database.BatchableContext BC){

    }
}