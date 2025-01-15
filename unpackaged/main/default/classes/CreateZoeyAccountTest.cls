@IsTest
public class CreateZoeyAccountTest {

    @IsTest
    static void scenario1() {
        
        Test.startTest();

        RequestMock fakeResponse = new RequestMock(200,'OK','{"total": 638,"page": 1,"pages": 128,"account_code": "1234"}',null);

        Test.setMock(HttpCalloutMock.class, fakeResponse);
        
        Id standard = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Standard').getRecordTypeId();

        Account acct = new Account(
            Name                        = 'TestAcct',
            RecordTypeId                = standard,
            PaymentType__c              = 'Direct Debit', 
            BillingAddressLine1__c      = '1 The Street',
            BillingAddressLine2__c      = 'AddressLine2',
            BillingAddressLine3__c      = 'AddressLine3',
            BillingAddressLine4__c      = 'AddressLine4',
            BillingAddressPostcode__c   = 'SW12 3ED',
            EmailAddress__c             = 'test1234@gmail.com', 
            Phone                       = '+447800444444',
            TaxType__c                  = 'Domestic Business'
        );
        insert acct;  
        
        System.assert(acct.Id != null, 'Account record is created');

        List<Id> Ids = new  List<Id>();
        Ids.add(acct.Id);

        CreateZoeyAccount.callCreateAPI(Ids);

        Test.stopTest();

    }

    @IsTest
    static void scenario2() {
        
        Test.startTest();


        // RequestMock tokenFakeResponse = new RequestMock(200,'OK','{"token": "1234567"}', null);
        // Test.setMock(HttpCalloutMock.class, tokenFakeResponse);

        RequestMock fakeResponse = new RequestMock(200,'OK','{"token": "1234567","total": 638,"page": 1,"pages": 128,"account_code": "1234"}',null);

        Test.setMock(HttpCalloutMock.class, fakeResponse);
        
        Id standard = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Standard').getRecordTypeId();

        Account acct = new Account(
            Name                        = 'TestAcct',
            RecordTypeId                = standard,
            PaymentType__c              = 'Direct Debit', 
            BillingAddressLine1__c      = '1 The Street',
            BillingAddressLine2__c      = 'AddressLine2',
            BillingAddressLine3__c      = 'AddressLine3',
            BillingAddressLine4__c      = 'AddressLine4',
            BillingAddressPostcode__c   = 'SW12 3ED',
            EmailAddress__c             = 'test1234@gmail.com', 
            Phone                       = '+447800444444',
            TaxType__c                  = 'Domestic Business'
        );
        insert acct;  
        
        System.assert(acct.Id != null, 'Account record is created');

        List<Id> Ids = new  List<Id>();
        Ids.add(acct.Id);

        CreateZoeyAccount.callCreateAPI(Ids);

        Test.stopTest();

    }

    @IsTest
    static void scenario3() {
        
        Test.startTest();


        // RequestMock tokenFakeResponse = new RequestMock(200,'OK','{"token": "1234567"}', null);
        // Test.setMock(HttpCalloutMock.class, tokenFakeResponse);

        RequestMock fakeResponse = new RequestMock(200,'OK','{"token": "1234567","total": 638,"page": 1,"pages": 128,"account_code": "1234"}',null);

        Test.setMock(HttpCalloutMock.class, fakeResponse);
        
        Id standard = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Standard').getRecordTypeId();

        Account acct = new Account(
            Name                        = 'TestAcct',
            RecordTypeId                = standard,
            PaymentType__c              = 'Direct Debit', 
            BillingAddressLine1__c      = '1 The Street',
            BillingAddressLine2__c      = 'AddressLine2',
            BillingAddressLine3__c      = 'AddressLine3',
            BillingAddressLine4__c      = 'AddressLine4',
            BillingAddressPostcode__c   = 'SW12 3ED',
            EmailAddress__c             = 'test1234@gmail.com', 
            Phone                       = '+447800444444',
            TaxType__c                  = 'Domestic Consumer'
        );
        insert acct;  
        
        System.assert(acct.Id != null, 'Account record is created');

        List<Id> Ids = new  List<Id>();
        Ids.add(acct.Id);

        CreateZoeyAccount.callCreateAPI(Ids);

        Test.stopTest();

    }
}