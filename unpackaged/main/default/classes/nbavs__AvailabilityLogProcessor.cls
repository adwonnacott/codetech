/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class AvailabilityLogProcessor implements Database.Batchable<SObject>, Database.Stateful {
    global Map<Id,nbavs__AvailabilityLog__c> prevs;
    global Integer runningTotal;
    global List<Id> userIdList;
    global AvailabilityLogProcessor(Set<Id> userIdSet) {

    }
    global void execute(Database.BatchableContext BC, List<nbavs__AvailabilityLog__c> scope) {

    }
    global void finish(Database.BatchableContext BC) {

    }
    global Database.QueryLocator start(Database.BatchableContext BC) {
        return null;
    }
}
