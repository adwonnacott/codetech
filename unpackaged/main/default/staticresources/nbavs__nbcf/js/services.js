'use strict';


/* Services */


//
// Simple service to create a prompt.
//
app.factory('prompt', [function () {

    /* Uncomment the following to test that the prompt service is working as expected.
     return function () {
     return "Test!";
     }
     */

    // Return the browsers prompt function.
    return prompt;
}]);


app.factory('DataService', ['$http', '$q', 'VISUALFORCE', function ($http, $q, VISUALFORCE) {

    var queryUrl = "https://nbsfdcproxy.herokuapp.com/services/data/v30.0/query/";
    var sObjectsUrl = "https://nbsfdcproxy.herokuapp.com/services/data/v30.0/sobjects/";
    var restUrl = "https://nbsfdcproxy.herokuapp.com/services/apexrest/";


    var factory = {};

    var cache = {};

    factory.getCache = function (element) {
        if (cache.hasOwnProperty(element)) {
            return cache[element];
        } else {
            return null;
        }
    };

    factory.setCache = function (element, data) {
        cache[element] = data;
    };

    factory.cancel = function (promise) {
        // If the promise does not contain a hook into the deferred timeout,
        // the simply ignore the cancel request.
        if (
            promise &&
            promise._httpTimeout &&
            promise._httpTimeout.reject
        ) {
            promise._httpTimeout.reject();
        }
    };

    factory.getLicenseCache = function () {
        var deferred = $q.defer();
        if (cache.hasOwnProperty('license')) {
            deferred.resolve(cache.license);
        } else {
           factory.getLicense().then(function (result) {
                cache.license = angular.isArray(result) ? result[0] : result;
                deferred.resolve(cache.license);
                },
                deferred.reject);
        }
        return deferred.promise;
    };

    factory.getLicense = function () {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.getLicense", null, false);
        } else {
            this.restAPI(deferred, queryUrl, "GET", "SELECT Id, Manager__c, Numbers__c, PBX__c, Record__c,Insights__c FROM License_v1__c LIMIT 1");
        }
        return deferred.promise;
    };

    factory.getSFUser = function (id) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.getSFUser", id, false);
        } else {
            this.restAPI(deferred, queryUrl, "GET", "SELECT Id, Name FROM User WHERE Id = '"+id+"' LIMIT 1");
        }
        return deferred.promise;
    };

    factory.getAPISettings = function () {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.getAPISettings", null, false);
        } else {
            this.restAPI(deferred, queryUrl, "GET", "SELECT Id, ConnectorId__c, DevOrgId__c, NotifyEmailAddress__c, OrganizationId__c  FROM API_v1__c LIMIT 1");
        }
        return deferred.promise;
    };

    factory.getArchivingPolicies = function (id) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.getArchivingPolicies", id, false);
        } else {
            this.restAPI(deferred, restUrl + 'ArchivingPolicy', "GET", null, null, "data");
        }
        return deferred.promise;
    };

    factory.getSounds = function (id) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.getSounds", id, false);
        } else {
            this.restAPI(deferred, queryUrl, "GET", "SELECT Id, Name, Id__c, Tag__c, Description__c FROM Sound__c ORDER BY Tag__c LIMIT 50000");
        }
        return deferred.promise;
    };

    factory.getPredefinedMacros = function () {
        var deferred = $q.defer();
        var macros = predefinedMacros;
        deferred.resolve(macros);
        return deferred.promise;
    };

    factory.getPhoneNumbers = function (id) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.getPhoneNumbers", id, false);
        } else {
            this.restAPI(deferred, queryUrl, "GET", "SELECT Id, Name, Number__c, DDI_Number__c, CallFlow__c, CallFlow__r.Name, User__c, User__r.Name FROM PhoneNumber__c ORDER BY Name LIMIT 50000");
        }
        return deferred.promise;
    };

    factory.getDataConnectors = function (id) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.getDataConnectors", id, false);
        } else {
            this.restAPI(deferred, queryUrl, "GET", "SELECT Id, Name, Id__c FROM DataConnector__c ORDER BY Name LIMIT 50000");
        }
        return deferred.promise;
    };

    factory.getSObjects = function () {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.getSObjects", null, false);
        } else {
            this.restAPI(deferred, sObjectsUrl, "GET", null, null, 'sobjects');
        }
        return deferred.promise;
    };

    factory.getSObjectFields = function (sObject) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.getSObjectFields", sObject, false);
        } else {
            this.restAPI(deferred, sObjectsUrl + sObject + '/describe/', "GET", null, null, 'fields');
        }
        return deferred.promise;
    };

    factory.query = function (query) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.query", query, false, false); // retain namespace prefix
        } else {
            this.restAPI(deferred, queryUrl, "GET", query, null);
        }
        return deferred.promise;
    };

    factory.getPresets = function (type) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.getPresets", type, false);
        } else {
            this.restAPI(deferred, queryUrl, "GET", "SELECT Name, Value__c FROM Preset__c WHERE Type__c = '" + type + "' ORDER BY Name LIMIT 1000");
        }
        return deferred.promise;
    };

    factory.getUsers = function (id) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.getUsers", id, false);
        } else {
            this.restAPI(deferred, queryUrl, "GET", "SELECT Id, Name, Id__c, CTI__c, PBX__c, Manager__c, Record__c FROM User__c ORDER BY Name LIMIT 50000");
        }
        return deferred.promise;
    };

    factory.getSFUsers = function (id) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.getSFUsers", id, false);
        } else {
            this.restAPI(deferred, queryUrl, "GET", "SELECT Id, Name FROM User WHERE IsActive = true ORDER BY Name LIMIT 50000");
        }
        return deferred.promise;
    };

    factory.getGroups = function (id) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.getGroups", id, false);
        } else {
            this.restAPI(deferred, queryUrl, "GET", "SELECT Id, Name, Id__c, PBX__c, Manager__c, Record__c FROM Group__c ORDER BY Name LIMIT 50000");
        }
        return deferred.promise;
    };

    factory.getChatterGroups = function (id) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.getChatterGroups", id, false);
        } else {
            this.restAPI(deferred, queryUrl, "GET", "SELECT Id, Name From CollaborationGroup ORDER BY Name LIMIT 50000");
        }
        return deferred.promise;
    };

    factory.getSkills = function (id) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.getSkills", id, false);
        } else {
            this.restAPI(deferred, queryUrl, "GET", "SELECT Id, Name, Id__c, Weight__c, Description__c FROM Skill__c ORDER BY Name LIMIT 50000");
        }
        return deferred.promise;
    };

    factory.getCallFlows = function () {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.getCallFlows", null, false);
        } else {
            this.restAPI(deferred, queryUrl, "GET", "SELECT Id, Id__c, Name, Source__c, Type__c, Status__c, Description__c, CreatedBy.Id, CreatedBy.Name, CreatedDate, LastModifiedBy.Id, LastModifiedBy.Name, LastModifiedDate FROM CallFlow__c ORDER BY Source__c, Type__c, Name");
        }
        return deferred.promise;
    };

    factory.getCallFlow = function (id) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.getCallFlow", id, false);
        } else {
            this.restAPI(deferred, queryUrl, "GET", "SELECT Id, Id__c, Name, Source__c, Type__c, Status__c, Description__c, Body__c, LastModifiedDate FROM CallFlow__c WHERE Id = '" + id + "'", null);
        }
        return deferred.promise;
    };


    factory.saveCallFlow = function (callFlow) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.saveCallFlow", callFlow, false);
        } else {
            this.restAPI(deferred, restUrl + 'CallFlow', "POST", null, JSON.stringify(callFlow).replace(/Id__c/g, "RemoteId").replace(/__c/g, ""), "data");
        }
        return deferred.promise;
    };

    factory.deleteCallFlow = function (id) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.deleteCallFlow", id, true);
        } else {
            this.restAPI(deferred, restUrl + 'CallFlow/' + id, "DELETE", null, null, "data");
        }
        return deferred.promise;
    };

    factory.testCreate = function (sObject) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.testCreate", sObject, false);
        } else {
            deferred.reject(angular.toJson(sObject));
        }
        return deferred.promise;
    };

    factory.testUpdate = function (sObject) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.testUpdate", sObject, false);
        } else {
            deferred.reject(angular.toJson(sObject));
        }
        return deferred.promise;
    };


    factory.encryptPolicy = function (policy) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.encryptPolicy", policy, false, false);
        } else {
            deferred.reject({"status": 501, "message": "Not Implemented."});
        }
        return deferred.promise;
    };

    factory.decryptPolicy = function (policy) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.decryptPolicy", policy, false, false);
        } else {
            deferred.reject({"status": 501, "message": "Not Implemented."});
        }
        return deferred.promise;
    };
    
    factory.checkRecordAccess = function (id) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.performGrabRecordAccess", id, false);
        } else {
        	deferred.reject({"status": 501, "message": "Not Implemented."});
        }
        return deferred.promise;
    };
    
    factory.checkCreateNewPolicyAccess = function (id) {
        var deferred = $q.defer();
        if (typeof Visualforce != "undefined") {
            this.remoting(deferred, "CallFlowRemoting.performCheckCreateAccessRoutingPolicy", id, false);
        } else {
        	deferred.reject({"status": 501, "message": "Not Implemented."});
        }
        return deferred.promise;
    };

    factory.remoting = function (deferred, method, parameters, notification, removeNamespacePrefix) {
        var that = this;
        removeNamespacePrefix = typeof removeNamespacePrefix !== 'undefined' ? removeNamespacePrefix : true;
        Visualforce.remoting.Manager.invokeAction(
            VISUALFORCE.namespacePrefix + method,
            parameters,
            function (result, event) {
                if (event.status) {
                    notification ? deferred.resolve(event) : deferred.resolve(removeNamespacePrefix ? that.handleNameSpacePrefix(result) : result);
                } else {
                    if (event.hasOwnProperty('message') && event.message.indexOf('Logged in') !== -1) {
                        event.message = 'Invalid session or session timeout, please refresh this page.';
                    }
                    deferred.reject(event);
                }
            },
            {buffer: false, escape: false, timeout: 120000}
        );
    };

    factory.handleNameSpacePrefix = function (result) {
        var underscorePrefix = VISUALFORCE.namespacePrefix.replace('.','__');
        if (underscorePrefix != '') { //rebuild result to remove namespace prefix
            if (angular.isArray(result)) {
                angular.forEach(result, function (item, key) {//each item in result
                    if (angular.isObject(item)) {
                        angular.forEach(item, function (value, field) {//each field in item
                            if (field != null && field.indexOf(underscorePrefix) == 0) { // it is a namespace field
                                item[field.substr(underscorePrefix.length)] = value;
                                delete item[field];
                            };
                        }, null);
                    }
                }, null);
            } else {
                if (angular.isObject(result)) {
                    angular.forEach(result, function (value, field) {//each field in item
                        if (field != null && field.indexOf(underscorePrefix) == 0) { // it is a namespace field
                            result[field.substr(underscorePrefix.length)] = value;
                            delete result[field];
                        };
                    }, null);
                }
            }
            return result;
        } else { // no namespace prefix, return original result
            return result
        }
    };

    factory.restAPI = function (deferred, url, method, query, data, resultType) {
        //if (typeof $rootScope.authToken == "undefined" || $rootScope.authToken == null) {
        if (localStorage.getItem('authToken') == "undefined" || localStorage.getItem('authToken') == null) {
            deferred.reject({"status": 401, "message": "No AuthToken."});
            return factory;
        }

        var req = {
            method: method,
            url: url,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('authToken')
            },
            data: null
        };
        if (query) {
            req.url = req.url + "?q=" + query;
        }
        if (data) {
            req.data = data;
        }

        $http(req).then(
            function (result) {
                deferred.resolve(resultType ? (resultType == "data" ? result.data : result.data[resultType]) : result.data.records)
            }
            ,
            function (error) {
                deferred.reject(error)
            }
        );
    };
    return factory;
}]);
