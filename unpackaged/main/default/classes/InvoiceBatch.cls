/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 01-15-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
global with sharing class InvoiceBatch implements Database.Batchable<sObject> {
    global Database.Querylocator start(Database.BatchableContext bc){
        String query = 'SELECT Id FROM Xero_Invoice__c';
        return Database.getQuerylocator(query);
    } 

    global void execute(Database.BatchableContext bc, List<Xero_Invoice__c> invoices){
        System.debug('Execute' + invoices.size());

        if( invoices.size() > 0 ){
            for( Xero_Invoice__c invoice : invoices ){
                invoice.Invoice_Batch_Last_Update__c = DateTime.now();
            }
        }

        System.debug('invoices invoices invoices' + invoices);
        update invoices;
    }

    global void finish(Database.BatchableContext bc){
        System.debug('Finish');
    }
}