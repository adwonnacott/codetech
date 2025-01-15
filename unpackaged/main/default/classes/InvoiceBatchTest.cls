/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 01-15-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
@isTest
public class InvoiceBatchTest {
    @TestSetup
    static void makeData(){

        Account acc = new Account(
            Name = 'Test Account'
        );
        insert acc;

        List<Xero_Invoice__c> invoices = new  List<Xero_Invoice__c>();
        
        for( Integer i = 1; i < 10; i++ ){
            Xero_Invoice__c invoice = new Xero_Invoice__c(
                Account__c = acc.Id
            );
            
            invoices.add(invoice);
        }

        insert invoices;

    }

    @isTest
    static void scenario() {

        List<Xero_Invoice__c> invoices = [SELECT Id FROM Xero_Invoice__c];
        System.debug('Xero_Invoice' + invoices);

        Test.startTest();
        System.schedule('Invoice Update', '0 6 * * * ?', new InvoiceScheduler());
        Test.stopTest();
    }
}