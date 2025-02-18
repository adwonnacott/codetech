/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class BatchUserUpdate implements Database.AllowsCallouts, Database.Batchable<SObject> {
    global String query;
    global Set<Id> userIdSet;
    global BatchUserUpdate(Set<Id> userIdSet) {

    }
    global void execute(Database.BatchableContext BC, List<nbavs__User__c> scope) {

    }
    global void finish(Database.BatchableContext BC) {

    }
    global Database.QueryLocator start(Database.BatchableContext BC) {
        return null;
    }
}
