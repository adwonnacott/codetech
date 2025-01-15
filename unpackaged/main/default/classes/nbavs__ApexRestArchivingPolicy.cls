/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
@RestResource(urlMapping='/ArchivingPolicy/*')
global class ApexRestArchivingPolicy {
    global ApexRestArchivingPolicy() {

    }
    @HttpGet
    global static List<nbavs.ApexRestArchivingPolicy.ArchivingPolicy> getArchivingPolicies() {
        return null;
    }
global class ArchivingPolicy {
    global Integer id;
    global String name;
    global ArchivingPolicy() {

    }
}
}
