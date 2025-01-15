/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class NBCallCenter {
    global NBCallCenter() {

    }
    webService static natterbox.NBCallCenter.Config config() {
        return null;
    }
    webService static natterbox.NBCallCenter.Config configEx(String sfProfileId, String sfUserId, String sfLanguage, String sfLocale) {
        return null;
    }
global class AllowedRelatedToObjectType {
    @WebService
    webService String keyPrefix;
    @WebService
    webService String label;
    @WebService
    webService String name;
    global AllowedRelatedToObjectType() {

    }
}
global class CallLog {
    @WebService
    webService List<natterbox.NBCallCenter.AllowedRelatedToObjectType> allowedRelatedToObjectTypes;
    @WebService
    webService List<natterbox.NBCallCenter.LogObjectField> fields;
    @WebService
    webService List<natterbox.NBCallCenter.Picklist> picklists;
    @WebService
    webService List<natterbox.NBCallCenter.RecordType> recordTypes;
    global CallLog() {

    }
}
global class Config {
    @WebService
    webService Double apiVersion;
    @WebService
    webService natterbox.NBCallCenter.CallLog callLog;
    @WebService
    webService natterbox__nbCallCenterConfig__c nbCallCenterConfig;
    @WebService
    webService List<natterbox.NBCallCenter.ConfigField> nbCallCenterConfigFields;
    @WebService
    webService natterbox__nbSoftphoneConfig__c nbSoftphoneConfig;
    @WebService
    webService List<natterbox.NBCallCenter.ConfigField> nbSoftphoneConfigFields;
    @WebService
    webService natterbox.NBCallCenter.OrgDetails orgDetails;
    @WebService
    webService Boolean personAccountsEnabled;
    @WebService
    webService List<natterbox.NBCallCenter.PhoneField> phoneFields;
    @WebService
    webService natterbox.NBCallCenter.QuickCase quickCase;
    @WebService
    webService natterbox.NBCallCenter.UserDetails userDetails;
    @WebService
    webService String version;
}
global class ConfigField {
    @WebService
    webService String name;
    @WebService
    webService String value;
    global ConfigField() {

    }
}
global class Field {
    @WebService
    webService String name;
    global Field() {

    }
}
global class LogObjectField {
    @WebService
    webService String label;
    @WebService
    webService Integer length;
    @WebService
    webService String name;
    global LogObjectField() {

    }
}
global class OrgDetails {
    @WebService
    webService String language;
    @WebService
    webService String locale;
    global OrgDetails() {

    }
}
global class PhoneField {
    @WebService
    webService List<natterbox.NBCallCenter.Field> fields;
    @WebService
    webService Boolean hasAccountRef;
    @WebService
    webService String keyPrefix;
    @WebService
    webService String label;
    @WebService
    webService String name;
    global PhoneField() {

    }
}
global class Picklist {
    @WebService
    webService String controllerName;
    @WebService
    webService List<natterbox.NBCallCenter.PicklistItem> items;
    @WebService
    webService String label;
    @WebService
    webService Boolean multi;
    @WebService
    webService String name;
    global Picklist() {

    }
}
global class PicklistItem {
    @WebService
    webService String label;
    @WebService
    webService String validForEncoded;
    @WebService
    webService String value;
    global PicklistItem() {

    }
}
global class QuickCase {
    @WebService
    webService List<natterbox.NBCallCenter.LogObjectField> fields;
    @WebService
    webService List<natterbox.NBCallCenter.Picklist> picklists;
    @WebService
    webService List<natterbox.NBCallCenter.RecordType> recordTypes;
    global QuickCase() {

    }
}
global class RecordType {
    @WebService
    webService String id;
    @WebService
    webService String label;
    @WebService
    webService String name;
    @WebService
    webService List<natterbox.NBCallCenter.RecordTypePicklist> picklists;
    global RecordType() {

    }
}
global class RecordTypePicklist {
    @WebService
    webService String name;
    @WebService
    webService String validForEncoded;
    global RecordTypePicklist() {

    }
}
global class UserDetails {
    @WebService
    webService String language;
    @WebService
    webService String locale;
    @WebService
    webService String userId;
    global UserDetails() {

    }
}
}
