/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class NatterboxPhoneCall implements Database.AllowsCallouts, System.Queueable {
    @InvocableMethod(label='Natterbox Phone Call' description='Make Phone Call')
    global static void makePhoneCall(List<nbavs.NatterboxPhoneCall.PhoneCallObject> phoneCallObjects) {

    }
global class PhoneCallObject {
    @InvocableVariable(label='Present CLI' description='Insert custom CLI' required=false)
    global String cli;
    @InvocableVariable(label='Custom Variables' description='Insert custom variables as JSON object' required=false)
    global String customVariables;
    @InvocableVariable(label='Caller' description='Select the Caller' required=true)
    global String fromNumber;
    @InvocableVariable(label='Originator Object Id' description='Insert originator object Id' required=true)
    global String recordId;
    @InvocableVariable(label='Region' description='Region from which call should originate' required=false)
    global String region;
    @InvocableVariable(label='Called' description='Select the Called number' required=true)
    global String toNumber;
    global PhoneCallObject() {

    }
}
}
