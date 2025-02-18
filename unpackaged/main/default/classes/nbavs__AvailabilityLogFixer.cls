/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class AvailabilityLogFixer implements Database.Batchable<SObject>, Database.Stateful {
    global List<nbavs__AvailabilityLog__c> deletes;
    global Integer exeCount;
    global String report;
    global Map<Id,nbavs__AvailabilityLog__c> runningTotal;
    global Integer totalDeletes;
    global Integer totalNegatives;
    global Integer totalUpdates;
    global AvailabilityLogFixer() {

    }
    global void execute(Database.BatchableContext BC, List<nbavs__AvailabilityLog__c> scope) {

    }
    global void finish(Database.BatchableContext BC) {

    }
    global Database.QueryLocator start(Database.BatchableContext BC) {
        return null;
    }
}
