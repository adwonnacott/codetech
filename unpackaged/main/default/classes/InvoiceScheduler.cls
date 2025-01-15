/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 01-15-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
global with sharing class InvoiceScheduler implements Schedulable {
    global void execute(SchedulableContext ctx){
        
        if(Test.isRunningTest()){
            Database.executebatch(new InvoiceBatch(), 10);
        } else {
            Database.executebatch(new InvoiceBatch(), 1);
        }
    }
}