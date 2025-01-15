'use strict';

// Declare app level module which depends on views, and components
var securePayApp = angular.module('securePayApp', [
    'ngRoute',
    'controllers',
    'ui-notification',
    'ngCookies'
]);
securePayApp.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    //$locationProvider.hashPrefix('!');
    //$locationProvider.html5Mode({enabled: true, requireBase: false});
    $routeProvider.when('/1', {
        templateUrl: '/view/state1.html',
        controller: 'step1Ctrl'
    }).when('/2', {
        templateUrl: '/view/state2.html',
        controller: 'step2Ctrl'
    }).when('/3', {
        templateUrl: '/view/state3.html',
        controller: 'step3Ctrl'
    }).otherwise({redirectTo: '/1'});
}]);

securePayApp.factory('httpRequestInterceptor', ['VISUALFORCE', function (VISUALFORCE) {
    return {
        //server templates from local or remote
        request: function (config) {
            if (config.method === 'GET' && config.url.indexOf('.html') != -1) {
                if (typeof VISUALFORCE != "undefined") {
                    config.url = (VISUALFORCE.resource_securePay || '') + config.url;
                }
                //config.url = 'http://localhost:8888/app/' + config.url;
            }
            return config;
        }
    }
}]);

securePayApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
}]);

securePayApp.config(['NotificationProvider', function(NotificationProvider) {
    NotificationProvider.setOptions({
        delay: 3000,
        startTop: 2,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'center',
        positionY: 'top',
        templateUrl: '/view/notification.html',
        replaceMessage: true
    });
}]);

securePayApp.directive('svgLink', ['VISUALFORCE', function (VISUALFORCE) {
    return {
        link: function (scope, element, attrs) {
            var path = ((VISUALFORCE && VISUALFORCE.resource_slds) || '') + '/assets/icons/' + (attrs.s || 'utility') + '-sprite/svg/symbols.svg#' + attrs.i;
            attrs.$set('xlink:href', path);
        }
    }
}]);

securePayApp.value('VISUALFORCE', {});
var getActiveCallDone = false;
var fieldCopy = [];
var infoLevel = 0x3;

function infoStr(level, str) {
    if (infoLevel & level)
        console.log(str);
}

function getNested(def, obj) {
	var args = Array.prototype.slice.call(arguments, 2);
	for(var i=0; i<args.length; ++i) {
		if (!obj || !obj.hasOwnProperty(args[i]))
			return def;
		obj = obj[args[i]];
	}
	return obj;
}
function showSessionDetails($scope) {
    infoStr(0x0001, "showSessionDetails()");
	var a = document.getElementById('sessionDetailsModal');
	if (a) {
		var webSessionId = getNested('N/A', $scope, 'model', 'sessionData', 'sessionId');
		var callChannelId = getNested('N/A', $scope, 'model', 'uuid');
        var linkId = getNested('N/A', $scope, 'model', 'sessionData', 'linkId');
		var primaryCallId = getNested('N/A', $scope, 'model', 'securePaySession', 'CallDetails', 'PrimaryCallId');
		var secondaryCallId = getNested('N/A', $scope, 'model', 'securePaySession', 'CallDetails', 'SecondaryCallId');
		var caller = getNested('N/A', $scope, 'model', 'securePaySession', 'CallDetails', 'CallerNumber');
		var called = getNested('N/A', $scope, 'model', 'securePaySession', 'CallDetails', 'CalledNumber');
		a.innerHTML =
			"<p><b>Session Details</b></p><br>" +
			"<table>" +
			"<tr><td><nobr><b>Current Time (UTC)</b></td><td><nobr>" + (new Date()).toUTCString() + "</td></tr>" +
			"<tr><td><nobr><b>Web Session ID</b></td><td><nobr>" + webSessionId + "</td></tr>" +
			"<tr><td><nobr><b>Call channel ID</b></td><td><nobr>" + callChannelId + "</td></tr>" +
            "<tr><td><nobr><b>Link ID</b></td><td><nobr>" + linkId + "</td></tr>" +
			"<tr><td><nobr><b>Primary Call ID</b></td><td><nobr>" + primaryCallId + "</td></tr>" +
			"<tr><td><nobr><b>Secondary Call ID</b></td><td><nobr>" + secondaryCallId + "</td></tr>" +
			"<tr><td><nobr><b>Caller Number</b></td><td><nobr>" + caller + "</td></tr>" +
			"<tr><td><nobr><b>Called Number</b></td><td><nobr>" + called + "</td></tr>" +
			"</table><br>";
		a.style.visibility = 'visible';
		var element = document.createElement("input");
		element.type = "button";
		element.value = "Ok";
		element.onclick = function() { a.style.visibility = 'hidden'; };
		a.appendChild(element);
	}
}

////////////////////////////////////////////////////////////////////////////////
// DataService
securePayApp.factory('DataService', ['$q', '$cookies', 'VISUALFORCE', function ($q, $cookies, VISUALFORCE) {
    var factory = {};

    factory.model = {"responseFields":{}};

    factory.getFormData = function (id, formName) {
        var deferred = $q.defer();
        this.remoting(deferred, "SecurePay.getFormData", {"id":id, "formName": formName}, false);
        return deferred.promise;
    };

    factory.activateSecureChannelWithPIN = function (parameters) {
        var deferred = $q.defer();
        this.remoting(deferred, "SecurePay.activateSecureChannelWithPIN", parameters, false);
        return deferred.promise;
    };

    factory.activateSecureChannel = function (parameters) {
        var deferred = $q.defer();
        this.remoting(deferred, "SecurePay.activateSecureChannel", parameters, false);
        return deferred.promise;
    };

    factory.getActiveCall = function (parameters) {
        var deferred = $q.defer();
        this.remoting(deferred, "SecurePay.getActiveCall", parameters, false);
        return deferred.promise;
    };

    factory.initSession = function (parameters) {
        var deferred = $q.defer();
        this.remoting(deferred, "SecurePay.initSession", parameters, false);
        return deferred.promise;
    };

    factory.webCallback = function (parameters) {
        infoStr(0x0001, "factory.webCallback(" + parameters + ")");
        var deferred = $q.defer();
        this.remoting(deferred, "SecurePay.webCallback", parameters, false);
        return deferred.promise;
    };

    factory.completeSecureTransaction = function () {
        var deferred = $q.defer();
        this.remoting(deferred, "SecurePay.completeSecureTransaction", {"requestData": angular.toJson(factory.model.requestFields), "responseData": angular.toJson(factory.model.securePaySession)}, false);
        return deferred.promise;
    };

    factory.remoting = function (deferred, method, parameters, notification) {
        Visualforce.remoting.Manager.invokeAction(
            VISUALFORCE.namespacePrefix + method,
            parameters,
            function (result, event) {
                if (event.status) {
                    notification ? deferred.resolve(event) : deferred.resolve(result);
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

    var webSocket;

    factory.initNotification = function () {
        if (typeof webSocket != 'undefined') {
            webSocket.onclose = function () {
                webSocket = new WebSocket(factory.model.notificationURL);
                webSocket.onmessage = function (message) {
                    handleMessage(message);
                };
            };
            webSocket.close();
        } else {
            webSocket = new WebSocket(factory.model.notificationURL);
            webSocket.onmessage = function (message) {
                handleMessage(message);
            };
        }
    };

    var handleMessage = function (message) {
        infoStr(0x0002, "factory.handleMessage()");
        var messageData = JSON.parse(message.data);
        infoStr(0x0004, "factory.handleMessage(" + JSON.stringify(messageData) + ")");
        if (messageData.$type == 'PciPal.Web.Communication.ServerMessages.SessionStatusMessage, PCIPAL.Web') {
            factory.model.responseFields.CardPAN = buildMaskedInput(messageData.Session.VariableData.CardPAN.DigitsCollected, '*');
            factory.model.responseFields.CardCV2 = buildMaskedInput(messageData.Session.VariableData.CardCV2.DigitsCollected, '*');
            factory.model.responseFields.expiry = buildMaskedInput(messageData.Session.VariableData.expiry.DigitsCollected, '*');
            factory.model.securePaySession = messageData.Session;
            setPrompt();
            if (typeof factory.updateModel === 'function') {
                factory.updateModel();
            }
            // If transaction accepted then note last UUID
            if (getNested(null, messageData, 'Session', 'VariableData', 'decision', 'Value') == 'ACCEPT') {
                $cookies.put("lastUUID", factory.model.uuid);
            }
        }
    };

    var setPrompt = function() {
        if (factory.model.securePaySession.IsMediaLinked) {
            if (factory.model.securePaySession.VariableData.CardPAN.IsCurrent) {
                factory.model.prompt = factory.model.prompts.pan;
            } else if (factory.model.securePaySession.VariableData.expiry.IsCurrent) {
                factory.model.prompt = factory.model.prompts.expiry;
            } else if (factory.model.securePaySession.VariableData.CardCV2.IsCurrent) {
                factory.model.prompt = factory.model.prompts.cv2;
            }
        }  else {
            factory.model.prompt = factory.model.prompts.secure;
            getActiveCallDone = false;
        }
    };

    var buildMaskedInput = function(length, char) {
        return new Array(length + 1).join(char).replace(/(\*{4})/g, '$1 ').replace(/(^\s+|\s+$)/,'');
    };

    factory.send = function (message) {
        webSocket.send(JSON.stringify(message));
    };

    return factory;
}]);

function webCallback(DataService, Notification, parameter, okCallback) {
    try {
        DataService.webCallback(parameter).then(function (result) {
            if (okCallback) {
                okCallback(result);
            }
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    } catch (error) {
        Notification.error({"message": "Web Callback failed: " + error.message});
    }
}

function goToParent() {
    var r = document.URL.match(/\?id=([^&]+)/);
    window.location = '/' + (r && r.length == 2 ? r[1] : '');
}

var controllers = angular.module('controllers', []);

////////////////////////////////////////////////////////////////////////////////
// controller - step1Ctrl
controllers.controller('step1Ctrl', ['$scope', '$location', '$cookies', 'DataService', 'Notification', function ($scope, $location, $cookies, DataService, Notification) {
    $scope.model = DataService.model;

    $scope.changed = null;

    $scope.webCallback = function (parameter) {
        webCallback(DataService, Notification, parameter, arguments.length >= 2 ? arguments[1] : null);
    };

    $scope.reSendCheck = function () {
        if ($scope.changed) {
            $scope.webCallback('reSend ' + $scope.changed);
            $scope.changed = null;
        }
    };

    $scope.updateFieldCopy = function () {
        fieldCopy = [];
        $scope.model.requestFields.forEach(function(e) {
            fieldCopy.push([e.targetName, e.value]);
        });
    };

    $scope.getFormData = function (id, formName) {
        try {
            DataService.getFormData(id, formName).then(function (result) {
                $scope.model.requestFields = result.formFields;
                $scope.model.fieldMapping = result.fieldMapping;
                $scope.model.prompts = result.prompts;
                $scope.model.prompt = $scope.model.prompts.secure;
                $scope.model.notificationURL = result.notificationURL;
                $scope.model.reasonCodes = result.reasonCodes;
                $scope.updateFieldCopy();
                DataService.initNotification();
            }, function (error) {
                Notification.error(error);
            }).finally(function () {
                //$scope.processing = null;
            });
        } catch (error) {
            Notification.error({"message": "Form Data Error: " + error.message});
        }
    };

    if (!getActiveCallDone) {
        $scope.getFormData($location.search().id, $location.search().form);
    }

    $scope.getActiveCall = function () {
        infoStr(0x0001, "step1Ctrl.getActiveCall()");
        // See what request fields have changed
        var changed = '';
        $scope.model.requestFields.forEach(function(e) {
            if (e.targetName == 'Amount') {
                // Make sure value has no more then 2 decimal places otherwise the amount ends up being 0
                var a = ('' + e.value).split('.');
                e.value = (a[0].length ? a[0] : '0') + '.' + (a.length >= 2 ? a[1].substr(0, 2) : '00');
            }
            fieldCopy.forEach(function(e2) {
                if (e.targetName === e2[0] && e.value !== e2[1])
                    changed += (changed.length ? '&' : '') + e.targetName + '=' + encodeURI(e.value);
            });
        });
        // Upload copy
        $scope.updateFieldCopy();
        // If one or more request fields have changed, make a note for call to $scope.reSendCheck() further on
        if (changed.length)
            $scope.changed = changed;
        // If we've already retrieved active calls
        if (getActiveCallDone) {
            $scope.reSendCheck();
            $scope.webCallback('resetCardCV2', function(result) {
                $scope.webCallback('resetExpiry', function(result) {
                    $scope.webCallback('resetCardPAN', function(result) {
                        $location.path('/2');
                    });
                });
            });
        }
        // Else get active calls
        else {
            getActiveCallDone = true;
            try {
                DataService.getActiveCall(null).then(function (result) {
                    if (angular.isArray(result)) {
                        if (result.length == 1) {
                            $scope.model.uuid = result[0].uuid;
                            $scope.initSession();
                        } else {
                            $scope.model.activeChannels = result;
                            $scope.model.channelMode = true;
                        }
                    }
                }, function (error) {
                    Notification.error(error);
                    getActiveCallDone = false;
                }).finally(function () {
                    //$scope.processing = null;
                });
            } catch (error) {
                Notification.error({"message": "Payment Integration failed: " + error.message});
            }
        }
    };

    $scope.initSession = function () {
        // If we've already performed a successful transaction for this call
        var lastUUID = $cookies.get('lastUUID');
        infoStr(0x0001, "step1Ctrl.initSession() - uuid '" + $scope.model.uuid + "' last '" + lastUUID + "'");
        if ($scope.model.uuid == lastUUID) {
            Notification.error({"message": "Only one transaction allowed per call"});
            getActiveCallDone = false;
        }
        else {
            try {
                DataService.initSession($scope.buildRequestParameters()).then(function (result) {
                    $scope.model.sessionData = result;
                    $scope.registerSession();
                    $scope.activateSecureChannel();
                    $scope.reSendCheck();
                    $location.path('/2');
                }, function (error) {
                    Notification.error(error);
                }).finally(function () {
                    //$scope.processing = null;
                });
            } catch (error) {
                Notification.error({"message": "Payment Integration failed: " + error.message});
            }
        }
    };

    $scope.registerSession = function () {
        DataService.send($scope.model.sessionData);
    };

    $scope.buildRequestParameters = function () {
        var parameters = {};
        angular.forEach($scope.model.requestFields, function (value, key) {
            parameters[value.targetName] = value.value;
        }, this);
        parameters.uuid = $scope.model.uuid;
        return JSON.stringify(parameters);
    };

    $scope.selectChannel = function (channel) {
        $scope.model.uuid = channel.uuid;
        $scope.initSession();
    };

    $scope.activateSecureChannel = function () {
        try {
           DataService.activateSecureChannel(null).then(function (result) {
               if (result) {
                   //no nothing, UI will change to reflect the new status
               }
            }, function (error) {
                Notification.error(error);
            }).finally(function () {
                //$scope.processing = null;
            });
        } catch (error) {
            Notification.error({"message": "Payment Integration failed: " + error.message});
        }
    };

    $scope.showSessionDetails = function () {
        showSessionDetails($scope);
    };
}]);

////////////////////////////////////////////////////////////////////////////////
// controller - step2Ctrl
controllers.controller('step2Ctrl', ['$scope', '$location', '$cookies', 'DataService', 'Notification', function ($scope, $location, $cookies, DataService, Notification) {
    $scope.model = DataService.model;

    $scope.webCallback = function (parameter) {
        webCallback(DataService, Notification, parameter, arguments.length >= 2 ? arguments[1] : null);
    };

    $scope.restart = function () {
        $scope.webCallback('reSecure', function(result) {
            $scope.webCallback('reStart', function(result) {
                $location.path('/1');
            });
        });
    };

    $scope.completeSecureTransaction = function () {
        try {
            DataService.completeSecureTransaction().then(function (result) {
                if (result) {
                    $scope.model.securePaymentObjectId = result;
                }
            }, function (error) {
                Notification.error(error);
            }).finally(function () {
                //$scope.processing = null;
            });
        } catch (error) {
            Notification.error({"message": "Transaction completion failed: " + error.message});
        }
    };

    $scope.processPayment = function () {
        $scope.webCallback('processPayment', function(result) {
            $scope.completeSecureTransaction();
        });
    }

    $scope.navigate = function (path) {
        $location.path(path);
    };

    DataService.updateModel = function() {
        $scope.$digest();
    };

    $scope.goToParent = function () {
        goToParent();
    };

    $scope.goToRecord = function () {
        window.location = '/' + $scope.model.securePaymentObjectId;
    };

    $scope.showSessionDetails = function () {
        showSessionDetails($scope);
    };
}]);

////////////////////////////////////////////////////////////////////////////////
// controller - step3Ctrl
controllers.controller('step3Ctrl', ['$scope', '$location', '$cookies', 'DataService', 'Notification', function ($scope, $location, $cookies, DataService, Notification) {
    $scope.model = DataService.model;

    $scope.navigate = function (path) {
        $location.path(path);
    };

    $scope.goToParent = function () {
        goToParent();
    };

    $scope.goToRecord = function () {
        window.location = '/' + $scope.model.securePaymentObjectId;
    };

    $scope.showSessionDetails = function () {
        showSessionDetails($scope);
    };
}]);
