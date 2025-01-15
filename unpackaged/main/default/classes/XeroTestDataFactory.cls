@isTest
public class XeroTestDataFactory {
    public static Xero_API_Settings__c createXeroSettings(){
        Xero_API_Settings__c settings = new Xero_API_Settings__c();
        settings.Consumer_Key__c = 'KEYABC123';
        settings.Consumer_Secret__c = 'SECRETABC123';
        settings.Redirect_URI__c = 'https://www.google.com';
        settings.Scope__c = 'accounting.transactions openid profile email accounting.contacts accounting.settings offline_access';
        settings.Tenant_ID__c = 'abc12345-6789-1023-4312-845382023';
        settings.Tenant_Name__c = 'Xero Test';
        settings.Webhook_Private_Key__c = 'WEBHOOKKEY12345';
        settings.Xero_API_Tokens_Record_Name__c = 'Default';

        return settings;
    }

    public static Xero_API_Tokens__c createXeroApiTokenRecord(){
        Xero_API_Tokens__c apiTokenRec = new Xero_API_Tokens__c(
            Name = 'Default',
            Access_TokeN__c = 'ACCESSTOKEN1234567',
            Refresh_Token__c = 'REFRESHTOKEN123123123',
            Expires_In__c = DateTime.now().addMinutes(30)
        );

        return apiTokenRec;
    }

    public static Account createAccount(){
        Account acctRec = new Account(
            Name = 'Test Account'
        );

        return acctRec;
    }

    public static Contact createContact(){
        Contact cont = new Contact(
            FirstName = 'Harley',
            LastName = 'Davidson'
        );

        return cont;
    }
}