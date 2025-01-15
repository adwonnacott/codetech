/**
 /**
 * Created by Doru on 30/03/2016.
 */

'use strict';

/* Controllers */

var controllers = angular.module('controllers', []);

controllers.controller('WeekDaysController', ['$scope', function ($scope) {

    $scope.model = {};
    $scope.model.days = [
        {'label': 'Sun', 'index': 0, checked: false},
        {'label': 'Mon', 'index': 1, checked: false},
        {'label': 'Tue', 'index': 2, checked: false},
        {'label': 'Wed', 'index': 3, checked: false},
        {'label': 'Thu', 'index': 4, checked: false},
        {'label': 'Fri', 'index': 5, checked: false},
        {'label': 'Sat', 'index': 6, checked: false},
    ];
    //process existing values
    angular.forEach($scope.model.days, function (value, key) {
        if (~$scope.days.indexOf(value.index)) {
            value.checked = true;
        };
    }, null);


    //update value on change
    $scope.processDays = function () {
        $scope.days = '';
        angular.forEach($scope.model.days, function (value, key) {
            if (value.checked) {
                $scope.days += value.index;
            }
        }, null);
    };
}]);

controllers.controller('ResetDaysController', ['$scope', function ($scope) {

    $scope.model = {};
    $scope.model.days = [
        {'label': 'Sun', 'index': 0, checked: false},
        {'label': 'Mon', 'index': 1, checked: false},
        {'label': 'Tue', 'index': 2, checked: false},
        {'label': 'Wed', 'index': 3, checked: false},
        {'label': 'Thu', 'index': 4, checked: false},
        {'label': 'Fri', 'index': 5, checked: false},
        {'label': 'Sat', 'index': 6, checked: false},
    ];
    //process existing values
    $scope.days = $scope.days || [];
    angular.forEach($scope.model.days, function (value, key) {
        if (~$scope.days.indexOf(value.index)) {
            value.checked = true;
        };
    }, null);


    //update value on change
    $scope.processDays = function () {
        $scope.days = [];
        angular.forEach($scope.model.days, function (value, key) {
            if (value.checked) {
                $scope.days.push(value.index);
            }
        }, null);
    };
}]);


controllers.controller('HoursArrayController', ['$scope', function ($scope) {

    $scope.model = {};
    $scope.model.hours = [];

    for (var i = 0; i < 24; i++) {
        $scope.model.hours.push({'label': i, 'index': i, checked: false});
    };


    $scope.hours = $scope.hours || [];
    //process existing values
    angular.forEach($scope.model.hours, function (value, key) {
        if (~$scope.hours.indexOf(value.index)) {
            value.checked = true;
        };
    }, null);


    //update value on change
    $scope.processChanges = function () {
        $scope.hours = [];
        angular.forEach($scope.model.hours, function (value, key) {
            if (value.checked) {
                $scope.hours.push(value.index);
            }
        }, null);
    };
}]);


controllers.controller('InputToArrayController', ['$scope', function ($scope) {

    $scope.model = {};
    $scope.model.value = null;

    $scope.model.value = $scope.value ? $scope.value.join($scope.separator) : '';

    //update value on change
    $scope.processChanges = function () {
        $scope.value = $scope.model.value ? $scope.model.value.split($scope.separator) : ($scope.null ? null : []);
        $scope.invalid = $scope.validateFrom();
    };


    $scope.validateFrom = function() {
        var reEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        var reToken = /\$\([A-Z][A-Za-z0-9\.\[\]\@\_\-]+?\)/g;
        if (angular.isArray($scope.value)) {
            for (var i = 0; i < $scope.value.length; i++) {
                var matchEmail = reEmail.test($scope.value[i]);
                var matchToken = reToken.test($scope.value[i]);
                if (!matchEmail && !matchToken) {
                    return true;
                }
            }
        }
        return false;
    };
}]);


//ModFinish_VoiceMail START
controllers.controller('ModFinishVoiceMail', ['$scope', '$filter', 'DataService', 'Notification', '$q', function ($scope, $filter, DataService, Notification, $q) {

    $scope.$watch('item.data.config.customSettings', function (newValue, oldValue) {
        if (newValue != oldValue) {
            if (!newValue) {
                delete $scope.item.data.variables.emailSettings;
                delete $scope.item.data.variables.ccSettings;
                $scope.item.data.config.emailSettings = false;
                $scope.item.data.config.ccSettings = false;
            }
        }
    });

    $scope.$watch('item.data.config.emailSettings', function (newValue, oldValue) {
        if (newValue != oldValue) {
            if (!newValue) {
                delete $scope.item.data.variables.emailSettings;
            } else {
                $scope.item.data.variables.emailSettings = $scope.item.data.variables.emailSettings || {"sendTo" : {"behaviour": "DEFAULT"}, "attachRecording": false, "keepCopy": false};
            }
        }
    });

    $scope.$watch('item.data.config.ccSettings', function (newValue, oldValue) {
        if (newValue != oldValue) {
            if (!newValue) {
                delete $scope.item.data.variables.ccSettings;
            } else {
                $scope.item.data.variables.ccSettings = $scope.item.data.variables.ccSettings || {"behaviour": "DEFAULT"};
            }
        }
    });


    $scope.model = {};

    $scope.model.mailboxTypeOptions = [
        {'label': 'User', 'value': 'USER'},
        {'label': 'Group', 'value': 'GROUP'},
        {'label': 'Number Owner', 'value': 'DDI_USER'},
    ];

    $scope.model.emailSettingsSendToBehaviourOptions = [
        {'label': 'Send to the default recipient list', 'value': 'DEFAULT'},
        {'label': 'Send to these recipients (in addition to the defaults)', 'value': 'DEFAULT_AND_SPECIFIED'},
        {'label': 'Send only to these recipients', 'value': 'SPECIFIED'},
    ];

    $scope.model.ccSettingsBehaviourOptions = [
        {'label': 'Cc only the default mailbox list', 'value': 'DEFAULT'},
        {'label': 'Cc these mailboxes (in addition to the defaults)', 'value': 'DEFAULT_AND_SPECIFIED'},
        {'label': 'Cc only to these mailboxes', 'value': 'SPECIFIED'},
    ];


    $scope.handleMailboxTypeChange = function() {
        switch ($scope.item.data.variables.mailbox.type) {
            case 'USER':
                $scope.item.data.variables.mailbox.userId = $scope.model.users.length > 0 ? $scope.model.users[0].Id__c : null;
                delete $scope.item.data.variables.mailbox.groupId;
                break;
            case 'GROUP':
                $scope.item.data.variables.mailbox.groupId = $scope.model.groups.length > 0 ? $scope.model.groups[0].Id__c : null;
                delete $scope.item.data.variables.mailbox.userId;
                break;
            default:
                delete $scope.item.data.variables.mailbox.groupId;
                delete $scope.item.data.variables.mailbox.userId;
        }
    };

    $scope.handleEmailSettingsSendToBehaviourChange = function() {
        switch ($scope.item.data.variables.emailSettings.sendTo.behaviour) {
            case 'DEFAULT':
                delete $scope.item.data.variables.emailSettings.sendTo.toAddresses;
                break;
            default:
                $scope.item.data.variables.emailSettings.sendTo.toAddresses = $scope.item.data.variables.emailSettings.sendTo.toAddresses || [];
        }
    };

    $scope.handleCcSettingsBehaviourChange = function() {
        switch ($scope.item.data.variables.ccSettings.behaviour) {
            case 'DEFAULT':
                delete $scope.item.data.variables.ccSettings.userIds;
                break;
            default:
                $scope.item.data.variables.ccSettings.userIds = $scope.item.data.variables.ccSettings.userIds || [];
        }
    };


    $scope.model.groups = [];

    $scope.getUsersPromise = function() {
        var deferred = $q.defer();
        if ($scope.model.users != null) {
            deferred.resolve($scope.model.users);
        } else {
            DataService.getUsers(null).then(function (result) {
                $scope.model.users = result;
                deferred.resolve($scope.model.users);
            }, function (error) {
                Notification.error(error);
            }).finally(function () {
                deferred.reject(error);
            });

        }
        return deferred.promise;
    };


    //get Groups
    $scope.getGroups = function () {
        DataService.getGroups(null).then(function (result) {
            $scope.model.groups = $filter('filter')(result, function (item) {
                if (item.PBX__c || item.Manager__c ) {
                    return true;
                }
                return false;
            });
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };

    //load init data
    $scope.getGroups();


}]);
//ModFinish_VoiceMail END


//ModActionModifyCharacteristic START
controllers.controller('ModActionModifyCharacteristic', ['$scope', '$filter', 'DataService', 'Notification', function ($scope, $filter, DataService, Notification) {

    $scope.$watch('item', function (newValue, oldValue) {
        if (newValue && oldValue && (newValue.data.configCustom == 'ModAction_ModifyCharacteristic')) {
            $scope.init();
        }
    });


    $scope.model = {};
    $scope.model.selectedTab = $scope.item.data.config.hasOwnProperty('builtInProperties') ? 'preset' : 'custom';

    $scope.model.rePropertyName = /^[A-Za-z0-9_]{1,32}$/;
    $scope.model.notifyPropertyNamesInvalidMessage = 'Invalid format: Property names must conform to the regex /^[A-Za-z0-9_]{1,32}$/';


    $scope.model.booleanOptions = [
        {"value": true, "label": "true"},
        {"value": false, "label": "false"}
    ];

    $scope.model.presetOptions = [
        {"name":"sipAutoAnswer", "label": "Auto Answer SIP Device", "type":"boolean", "value" : false},
        {"name":"withholdCli", "label": "Withhold CLI", "type":"boolean", "value" : false},
        {"name":"internalCli", "label": "Internal CLI", "type":"text", "value" : ""},
        {"name":"externalCli", "label": "External CLI", "type":"text", "value" : ""},
        {"name":"earlyMedia", "label": "Early Media", "type":"earlyMedia", "value" : {"format": "http_mp3","data": null}, "formatOptions": [{"value": "http_mp3", "label": "HTTP MP3"},{"value": "shout", "label": "Shoutcast"},{"value": "tone", "label": "Tone stream"}]},
        {"name":"holdMusic", "label": "Hold Music", "type":"holdMusic", "value" : {"format": "moh","data": "classical"}, "mohOptions": [{"value": "classical", "label": "Classical"},{"value": "african", "label": "African"},{"value": "blues", "label": "Blues"},{"value": "disco", "label": "Disco"},{"value": "folk", "label": "Folk"},{"value": "funky", "label": "Funky"},{"value": "jazz", "label": "Jazz"},{"value": "modern", "label": "Modern"}], "formatOptions": [{"value": "moh", "label": "Built in"}, {"value": "http_mp3", "label": "HTTP MP3"},{"value": "shout", "label": "Shoutcast"},{"value": "tone", "label": "Tone stream"}]},
        {"name":"homeCountryCode", "label": "Home Country Code", "type":"text", "value" : "44"},
        {"name":"voice", "label": "Default Voice", "type":"picklist", "value" : "EN-GB_AMY", "picklistValues" : 
            [
                "DA-DK_ANNA_AI",
                "DA-DK_MADS",
                "DA-DK_NAJA",
                "NL-NL_FLEUR_AI",
                "NL_LOTTE",
                "NL-NL_RUBEN",
                "NL_SASKIA",
                "NL_WILLEM",
                "EN-AU_AMELIA_AI",
                "EN_NICOLE",
                "EN-AU_NOAH_AI",
                "EN-AU_OLIVIA_AI",
                "EN_RUSSELL",
                "EN-AU_WILLIAM_AI",
                "EN-GB_AMY",
                "EN-GB_BRIAN",
                "EN_EMMA",
                "EN-GB_HANNAH_AI",
                "EN_KATE",
                "EN-GB_LEWIS_AI",
                "EN-GB_LUCY_AI",
                "EN_SIMON",
                "EN-GB_THOMAS_AI",
                "EN-IN_ADITI",
                "EN-IN_RAVEENA",
                "EN_CHIPMUNK",
                "EN-US_EMILY_AI",
                "EN_ERIC",
                "EN-US_EVELYN_AI",
                "EN_IVY",
                "EN_JENNIFER",
                "EN-US_JOANNA",
                "EN_JOEY",
                "EN-US_JUSTIN",
                "EN_KENDRA",
                "EN_KIMBERLY",
                "EN-US_LIAM_AI",
                "EN-US_MATTHEW",
                "EN-US_MICHAEL_AI",
                "EN-US_OLIVER_AI",
                "EN_SALLI",
                "EN-US_SOPHIA_AI",
                "FR_CA_CHANTAL",
                "FR-CA_FELIX_AI",
                "FR-CA_FLORENCE_AI",
                "FR-CA_JULIETTE_AI",
                "FR-CA_RAPHAEL_AI",
                "FR-FR_ADELE_AI",
                "FR_CELINE",
                "FR-FR_CURTIS_AI",
                "FR-FR_DANIELLE_AI",
                "FR-FR_JASPER_AI",
                "FR-FR_LEA",
                "FR_MATHIEU",
                "DE-DE_ELIAS_AI",
                "DE-DE_ERIKA_AI",
                "DE_HANS",
                "DE-DE_LEONIE_AI",
                "DE_MARLENE",
                "DE-DE_MARTINA_AI",
                "DE-DE_OSKAR_AI",
                "DE-DE_VICKI",
                "HI-IN_ADITI",
                "IS_DORA",
                "IS_KARL",
                "IT-IT_BIANCA",
                "IT_CARLA",
                "IT_GIORGIO",
                "JA-JP_KANNA_AI",
                "JA-JP_MIZUKI",
                "JA-JP_TAKUMI",
                "KO-KR_HYUN_AI",
                "KO-KR_JI-SU_AI",
                "KO-KR_KWAN_AI",
                "KO-KR_SEO-YUN_AI",
                "KO-KR_SEOYEON",
                "CMN-CN_ZHIYU",
                "NB-NO_ANITA_AI",
                "NB_NO_LIV",
                "PL_AGNIESZKA",
                "PL-PL_ANTONI_AI",
                "PL-PL_DOMINIK_AI",
                "PL-PL_ELENA_AI",
                "PL_EWA",
                "PL-PL_IGA_AI",
                "PL_JACEK",
                "PL_JAN",
                "PL_MAJA",
                "PL-PL_MONIKA_AI",
                "PT_BR_RICARDO",
                "PT_BR_VITORIA",
                "PT-BR_IZABEL_AI",
                "PT-PT_ADRIANO_AI",
                "PT-PT_CRISTIANO",
                "PT-PT_INES",
                "PT-PT_JERONIMO_AI",
                "PT-PT_MARISSA_AI",
                "PT-PT_ROSA_AI",
                "RO_CARMEN",
                "RU-RU_GENNADI_AI",
                "RU-RU_IVAN_AI",
                "RU-RU_MAXIM",
                "RU-RU_NATASHA_AI",
                "RU-RU_TANYA_AI",
                "RU_TATYANA",
                "SK-SK_NINA_AI",
                "ES_CONCHITA",
                "ES_ENRIQUE",
                "ES-ES_LUCIA",
                "ES-ES_VALERIA_AI",
                "ES-MX_MIA",
                "ES_US_MIGUEL",
                "ES-US_PENELOPE",
                "SV_SE_ASTRID",
                "SV-SE_ELSA_AI",
                "TR-TR_AYLA_AI",
                "TR_FILIZ",
                "TR-TR_NESRIN_AI",
                "TR-TR_OMER_AI",
                "TR-TR_YESIM_AI",
                "TR-TR_YUSEF_AI",
                "UK-UA_LIZA_AI",
                "CY_GERAINT",
                "CY_GWYNETH"
            ] },
        {"name":"callQueuePriority", "label": "Call Queue Priority", "type":"number", "value" : 5, "min": 1, "max" : 10},
        {"name":"solidCallThreshold", "label": "Solid Call Threshold", "type":"number", "value" : 60, "min": 1, "max" : 999999},
        {"name":"alertInfoUrl", "label": "Wav Ringer File", "type":"text", "value" : "http://"},
        {"name":"alertInfoText", "label": "Text Ringer", "type":"text", "value" : ""},
        {"name":"ctiWhisper", "label": "CTI Whisper Text", "type":"text", "value" : ""},
        {"name":"ctiRecordPop", "label": "CTI Custom Record Pop", "type":"text", "value" : ""},
        {"name":"transcriptionLanguage", "label": "SCV Transcription Language", "type":"picklist", "value" : "en", "picklistValues" : 
            [
                "zh",
                "zh-CN",
                "zh-TW",
                "nl",
                "en",
                "en-AU",
                "en-IN",
                "en-NZ",
                "en-GB",
                "en-US",
                "fr",
                "fr-CA",
                "de",
                "hi",
                "hi-Latn",
                "id",
                "it",
                "ja",
                "ko",
                "pt",
                "pt-BR",
                "pt-PT",
                "ru",
                "es",
                "es-419",
                "sv",
                "tr",
                "uk",
            ] },
        {"name":"callQueueWeight", "label": "Call Queue Weight", "type":"number", "value" : 1, "min" : 1, "max" : 10},
    ];

    $scope.changeFieldType = function (field) {
        var preset = $filter('filter')($scope.model.presetOptions, {name: field.name}, true)[0];
        angular.copy(preset, field);
    };

    $scope.addBuiltInProperty = function () {
        var newBuiltInProperty = $scope.buildNewBuiltInProperty();
        if (newBuiltInProperty) {
            $scope.item.data.config.builtInProperties.push(newBuiltInProperty);
        }
    };

    $scope.buildNewBuiltInProperty = function () {
        //find a property not already set
        var availableProperty = $filter('notInArray')($scope.model.presetOptions, $scope.item.data.config.builtInProperties, 'name') || [];
        if (availableProperty.length > 0) {
            return angular.copy(availableProperty[0]);
        } else {
            Notification.error('No more available Built In Properties.');
            return null;
        }
    };

    $scope.addCustomProperty = function () {
            $scope.item.data.config.customProperties.push({"name":null, "value":null, export:false});
    };


    //init special attributes
    $scope.init = function () {

        for (var prop in $scope.item.data.config.builtInProperties) {
            if ($scope.item.data.config.builtInProperties[prop].name == 'voice') {
                for (var opt in $scope.model.presetOptions) {
                    if ($scope.model.presetOptions[opt].name == 'voice') {
                        $scope.item.data.config.builtInProperties[prop].picklistValues =
                            $scope.model.presetOptions[opt].picklistValues;
                        console.log("fixed up voice preset list");
                        break;
                    }
                }
                break;
            }
        }

        if (!$scope.item.data.config.connectorId) {
            //get API Settings
            DataService.getAPISettings(null).then(function (result) {
                $scope.model.settings = result[0];
                $scope.item.data.config.connectorId = $scope.model.settings.ConnectorId__c;
                $scope.item.data.config.devOrgId = $scope.model.settings.DevOrgId__c;
                $scope.item.data.variables.notifyEmailAddress = $scope.model.settings.NotifyEmailAddress__c;
            }, function (error) {
                Notification.error(error);
            }).finally(function () {
                //$scope.processing = null;
            });
        }

        $scope.selectInitTab();
    };

    $scope.selectInitTab = function () {
        $scope.model.selectedTab = $scope.item.data.config.hasOwnProperty('builtInProperties') ? 'preset' : 'custom';
        if ($scope.item.data.config.hasOwnProperty('builtInProperties') && $scope.item.data.config.builtInProperties.length == 0 && $scope.item.data.config.customProperties.length > 0) {
            $scope.model.selectedTab = 'custom';
        }
    };


    $scope.toggleMacroModeMoh = function (field) {
        if (field.macroModeMoh) {
            field.value.data = 'classical';
        }
        field.macroModeMoh = !field.macroModeMoh;
    };

    $scope.toggleMacroModeNumber = function (field) {
        if (field.macroModeNumber) {
            field.value = 5;
        }
        field.macroModeNumber = !field.macroModeNumber;
    };

}]);
//ModActionModifyCharacteristic END



//ModActionRequestSkills START
controllers.controller('ModActionRequestSkills', ['$scope', '$filter', 'DataService', 'Notification', function ($scope, $filter, DataService, Notification) {

    $scope.$watch('item', function (newValue, oldValue) {
        if (newValue && oldValue && (newValue.data.configCustom == 'ModAction_RequestSkills')) {
            $scope.init();
        }
    });


    $scope.model = {};

    //init special attributes
    $scope.init = function () {
        if (!$scope.item.data.config.connectorId) {
            //get API Settings
            DataService.getAPISettings(null).then(function (result) {
                $scope.model.settings = result[0];
                $scope.item.data.config.connectorId = $scope.model.settings.ConnectorId__c;
                $scope.item.data.config.devOrgId = $scope.model.settings.DevOrgId__c;
                $scope.item.data.variables.notifyEmailAddress = $scope.model.settings.NotifyEmailAddress__c;
            }, function (error) {
                Notification.error(error);
            }).finally(function () {
                //$scope.processing = null;
            });
        }
    };


    $scope.skillWeightChange = function (skill, preset, asc) {
        skill.minStep = preset ? 10 : 1;
        skill.maxStep = preset ? 10 : 1;
        skill.minWeight = Math.max(1, skill.minWeight);
        skill.maxWeight = Math.max(1, skill.maxWeight);
        if (asc) {
            skill.maxWeight = Math.max(skill.maxWeight || 100, skill.minWeight || 1);
        } else {
            skill.minWeight = Math.min(skill.maxWeight || 100, skill.minWeight || 1);
        }

        $scope.buildSkillLabel(skill);
    };

    $scope.buildSkillLabel = function(skill) {
        switch (skill.minWeight) {
            case 0 : skill.minLabel = 'Minimal'; break;
            case 1 : skill.minLabel = 'Minimal'; break;
            case 10 : skill.minLabel = 'Basic'; break;
            case 20 : skill.minLabel = 'Novice'; break;
            case 40 : skill.minLabel = 'Intermediate'; break;
            case 60 : skill.minLabel = 'Advanced'; break;
            case 80 : skill.minLabel = 'Expert'; break;
            case 100 : skill.minLabel = 'Guru'; break;
            default : skill.minLabel = 'Custom';
        }

        switch (skill.maxWeight) {
            case 0 : skill.maxLabel = 'Minimal'; break;
            case 1 : skill.maxLabel = 'Minimal'; break;
            case 10 : skill.maxLabel = 'Basic'; break;
            case 20 : skill.maxLabel = 'Novice'; break;
            case 40 : skill.maxLabel = 'Intermediate'; break;
            case 60 : skill.maxLabel = 'Advanced'; break;
            case 80 : skill.maxLabel = 'Expert'; break;
            case 100 : skill.maxLabel = 'Guru'; break;
            default : skill.maxLabel = 'Custom';
        }
    };

    $scope.addSkill = function () {
        var newSkill = $scope.buildNewSkill();
        if (newSkill) {
            newSkill.minStep = 1;
            newSkill.maxStep = 1;
            newSkill.minWeight = 1;
            newSkill.maxWeight = 100;
            $scope.buildSkillLabel(newSkill);
            $scope.item.data.config.skills.push(newSkill);
        }
    };

    $scope.buildNewSkill = function () {
        //find a skill not already set
        var availableSkill = $filter('notInArray')($scope.model.skills, $scope.item.data.config.skills, 'Id') || [];
        if (availableSkill.length > 0) {
            return angular.copy(availableSkill[0]);
        } else {
            Notification.error('No more available Skills.');
            return null;
        }
    };

    $scope.changeSkill = function (skill) {
        var selectedSkill = $filter('filter')($scope.model.skills, {Id: skill.Id}, true)[0];
        selectedSkill.minStep = 1;
        selectedSkill.maxStep = 1;
        selectedSkill.minWeight = skill.minWeight;
        selectedSkill.maxWeight = skill.maxWeight;
        $scope.buildSkillLabel(selectedSkill);
        angular.copy(selectedSkill, skill);
    };

    //get Skills
    $scope.getSkills = function () {
        DataService.getSkills(null).then(function (result) {
            $scope.model.skills = result;
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };

    //load init data
    $scope.model.skills = [];
    $scope.getSkills();

}]);
//ModActionRequestSkills END




//ModActionRule START
controllers.controller('ModActionRule', ['$scope', '$filter', 'DataService', 'Notification', function ($scope, $filter, DataService, Notification) {

    $scope.$watch('item', function (newValue, oldValue) {
        if (newValue && oldValue && (newValue.data.configCustom == 'ModAction_Rule')) {
            $scope.init();
        }
    });


    $scope.model = {};

    $scope.model.timeZones = timezones;


    $scope.model.operators = {
        "countryCode": [
            {"label": "matches", "value": true},
            {"label": "does not match", "value": false},
        ],
        "numberMatch": [
            {"label": "matches", "value": true},
            {"label": "does not match", "value": false},
        ],
        "evaluate": [
            {"label": "equals", "value": "=="},
            {"label": "not equals", "value": "!="},
            {"label": "greater than", "value": ">"},
            {"label": "greater  or equal", "value": ">="},
            {"label": "less than", "value": "<"},
            {"label": "less or equal", "value": "<="},
            {"label": "like", "value": "like"},
            {"label": "not like", "value": "notlike"}
        ],
        "timeOfDay": [
            {"label": "All", "value": "all"},
            {"label": "Between", "value": "between"},
            {"label": "Not Between", "value": "notbetween"},
        ],
    };

    $scope.model.numberTypeOptions = [
        {"label": "Called Number", "value": "CALLED"},
        {"label": "Caller Number", "value": "CALLER"},
    ];

    $scope.model.countryCodeOptions = countryCodes;

    $scope.model.day = {
        '0': false,
        '1': false,
        '2': false,
        '3': false,
        '4': false,
        '5': false,
        '6': false
    };


    $scope.addRuleAnd = function (type) {
        $scope.item.data.config.rules[type].push([$scope.buildNewRule(type)]);
    };

    $scope.addRuleOr = function (rule, type) {
        rule.push($scope.buildNewRule(type));
    };

    $scope.buildNewRule = function (type) {

        var rule = {};

        switch (type) {
            case 'evaluate' :
                rule.lhs = '';
                rule.rhs = '';
                rule.operator = '=='
                break;
            case 'numberMatch' :
                rule.numberType = 'CALLED';
                rule.matches = true;
                rule.number = '';
                break;
            case 'countryCode':
                rule.numberType = 'CALLED';
                rule.matches = true;
                rule.countryCode = 'GBR';
                break;
            case 'callerIdWithheld':
                rule.withheld = true;
                break;
            case 'timeOfDay':
                rule.startTime = moment().format("hh:mm:ss");
                rule.endTime = moment().add(1, 'hour').format("hh:mm:ss");
                rule.timeBetween = 'all';
                rule.startDate = moment().format("YYYY-MM-DD");
                rule.endDate = moment().add(1, 'day').format("YYYY-MM-DD");
                rule.dateBetween = 'all';
                rule.days = "";
                rule.timeZone = 'Europe/London';
                break;


        }
        return rule;
    };

    $scope.model.timeRegex = /^((?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$)/;

    $scope.checkEmptyRuleAnd = function (type, ruleAnd, index) {
        if (ruleAnd.length == 0) {
            $scope.item.data.config.rules[type].splice(index, 1);
        }
    };

    $scope.selectInitTab = function () {
        $scope.model.selectedTab = 'timeOfDay';
        for (var rule in $scope.item.data.config.rules) {
            if ($scope.item.data.config.rules[rule].length > 0) {
                $scope.model.selectedTab = rule;
                break;
            }
        }
    };

    //init special attributes
    $scope.init = function () {
        if (!$scope.item.data.variables.notifyEmailAddress) {
            //get API Settings
            DataService.getAPISettings(null).then(function (result) {
                $scope.model.settings = result[0];
                $scope.item.data.config.devOrgId = $scope.model.settings.DevOrgId__c;
                $scope.item.data.variables.notifyEmailAddress = $scope.model.settings.NotifyEmailAddress__c;
            }, function (error) {
                Notification.error(error);
            }).finally(function () {
                //$scope.processing = null;
            });
        }

        $scope.selectInitTab();
    };

    //$scope.init();

}]);
//ModActionRule END


//ModAction_Notify START
controllers.controller('ModActionNotify', ['$scope', '$filter', 'DataService', 'Notification', function ($scope, $filter, DataService, Notification) {

    $scope.$watch('item', function (newValue, oldValue) {
        if (newValue && oldValue && (newValue.data.configCustom == 'ModAction_Notify')) {
            $scope.init();
        }
    });

    $scope.$watch('model.selectedTab', function (newValue, oldValue) {
        if (newValue == 'chatter') {
            if ($scope.model.chatterGroups.length == 0) {
                $scope.getChatterGroups();
            }
        }
    });


    $scope.model = {};
    $scope.model.targetOptions = [
        {'label': 'User', 'value': 'user'},
        {'label': 'User Id', 'value': 'userId'},
        {'label': 'Group', 'value': 'group'},
        {'label': 'Group Id', 'value': 'groupId'},
        {'label': 'Record', 'value': 'record'}
    ];

    $scope.model.visibilityOptions = [
        {'label': 'All Users', 'value': 'allUsers'},
        {'label': 'Internal Users', 'value': 'internalUsers'}
    ];

    $scope.model.notificationTypeOptions = [
        {'label': 'Call', 'value': 'CHANNEL'},
        {'label': 'User', 'value': 'USER'},
        {'label': 'Org', 'value': 'ORG'}
    ];

    $scope.model.notificationCallTypeOptions = [
        {'label': 'This leg', 'value': 'SELF'}//,
//        {'label': 'Other leg', 'value': 'PEER'}
    ];

    $scope.model.users = [];
    $scope.model.chatterDisabled = false;
    $scope.model.recordAccess;
    $scope.model.createPolicyAccess = false;
    $scope.model.chatterGroups = [];

    //get SUsers
    $scope.getSFUsers = function () {
        DataService.getSFUsers(null).then(function (result) {
            $scope.model.users = result;
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };

    //get Chatter Groups
    $scope.getChatterGroups = function () {
        DataService.getChatterGroups(null).then(function (result) {
            $scope.model.chatterGroups = result;
        }, function (error) {
            if (error.message == 'Chatter is not enabled for this organization') {
                $scope.model.chatterDisabled = true;
                $scope.model.selectedTab = 'email';
                Notification.warning(error);
            } else {
                Notification.error(error);
            }
        }).finally(function () {
            //$scope.processing = null;
        });
    };



    $scope.model.sendNowOptions = [
        {"label" : "Now", "value": true},
        {"label" : "When call ends", "value": false}
    ];

    $scope.model.whichPolicyAttemptOptions = [
        {"label" : "First attempt", "value": "FIRST"},
        {"label" : "All attempts", "value": "ALL"},
        {"label" : "Retries only", "value": "RETRIES"}
    ];




    $scope.addNotifyItem = function (type) {
        $scope.item.data.subItems[type].push($scope.buildNotifyItem(type));
    };

    $scope.buildNotifyItem = function (type) {
        var subItem = {};
        switch (type) {
            case 'email':
                subItem.id = $scope.newId();
                subItem.variables = angular.copy($scope.item.data.config[type]);
                subItem.name = 'Email';
                subItem.templateId = $scope.item.data.emailTemplateId;
                break
            case 'sms':
                subItem.id = $scope.newId();
                subItem.variables = angular.copy($scope.item.data.config[type]);
                subItem.name = 'SMS';
                subItem.templateId = $scope.item.data.smsTemplateId;
                break;
            case 'chatter':
                subItem  = angular.copy($scope.item.data.config[type]);
                subItem.target = $scope.model.users[0].Id;
                break;
            case 'notification':
                subItem  = angular.copy($scope.item.data.config[type]);
                subItem.targetOrgID = $scope.item.data.config.OrgId;
                break;
        }

        return subItem;
    };


    $scope.selectInitTab = function () {
        $scope.model.selectedTab = 'email';
        for (var item in $scope.item.data.subItems) {
            if ($scope.item.data.subItems[item].length > 0) {
                $scope.model.selectedTab = item;
                break;
            }
        }
    };

    //init special attributes
    $scope.init = function () {
        $scope.selectInitTab();

        $scope.item.data.scriptInfo = {
            chatter: {scriptId: $scope.newId(), scriptParentId: $scope.newId()},
            notification: {scriptId: $scope.newId(), scriptParentId: $scope.newId()}
        };

        DataService.getAPISettings(null).then(function (result) {
            $scope.model.settings = result[0];
            $scope.item.data.config.connectorId = $scope.model.settings.ConnectorId__c;
            $scope.item.data.config.devOrgId = $scope.model.settings.DevOrgId__c;
            $scope.item.data.config.OrgId = $scope.model.settings.OrganizationId__c;
            $scope.item.data.config.chatterScript.notifyEmailAddress = $scope.model.settings.NotifyEmailAddress__c;

        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });

    };

    $scope.getSFUsers();

}]);
//ModAction_Notify END


//ModAction_Record START
controllers.controller('ModActionRecord', ['$scope', '$filter', 'DataService', 'Notification', function ($scope, $filter, DataService, Notification) {

    $scope.model = {};
   
    $scope.model.channelOptions = [
        {"name": "This Leg", "value": "A"},
        {"name": "Other Leg", "value": "B"},
        
    ];

    $scope.model.beepOptions = [
        {"name": "Off", "value": "OFF"},
        {"name": "Called party only", "value": "CALLED"},
        {"name": "Calling party only", "value": "CALLER"},
        {"name": "Both parties", "value": "BOTH"}
    ];


    //get Archiving Policies
    $scope.model.archivingPolicies = [];
    $scope.getArchivingPolicies = function () {
        DataService.getArchivingPolicies(null).then(function (result) {
            $scope.model.archivingPolicies = result;
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };


    //execute now
    $scope.getArchivingPolicies();

}]);
//ModAction_Record END

//ModAction_RecordAnalyse START
controllers.controller('ModActionRecordAnalyse', ['$scope', '$filter', 'DataService', 'Notification', function ($scope, $filter, DataService, Notification) {

    $scope.model = {};
   
    $scope.model.selectedTab = $scope.item.data.config.hasOwnProperty('builtInProperties') ? 'preset' : 'custom';
    

     //get Archiving Policies
    let policies = DataService.getCache('archivingPoliciesList');
    $scope.model.archivingPolicies = policies;
    $scope.item.data.config.record.archivePolicyId = ($scope.item.data.config.record.archivePolicyId == policies[1].id ?policies[1].id :policies[0].id);
    
    $scope.model.channelOptions = [
        {"name": "This Leg", "value": "SELF"},
        {"name": "Other Leg", "value": "PEER"},
        {"name": "Both", "value": "BOTH"},
    ];

    $scope.model.insightOptions = [
        {"name": "Configure Insight for this Call", "value": "Main"},
        {"name": "Disable Insight for this Call", "value": "Disable"},
        {"name": "Use existing Insight configuration for this call", "value": "Default"},
    ];
   
    $scope.filterInchannel = function(item) {
        if( $scope.item.data.config.record.channel == 'SELF' || $scope.item.data.config.record.channel == 'PEER'){
             return  (item.value == $scope.item.data.config.record.channel);
        }
        else{
            return $scope.model.channelOptions;
        }
        
    };
    $scope.model.startOptions = [
        {"name": "Now", "value": "IMMEDIATE","insight" : false},
        {"name": "On Connect", "value": "ON_CONNECT"},
        {"name": "On Demand", "value": "ON_DEMAND"},
        
    ];
    $scope.filterStart = function(item) {
       if($scope.model.Insight === true)
        {
           
             return  (item.value !== 'IMMEDIATE');
        }
        if($scope.item.data.config.record.start !== 'ON_DEMAND'){
            $scope.item.data.config.pauseAllowed = false;
            $scope.item.data.config.stopAllowed = false;
        }
       return $scope.model.startOptions;
        
    };
    
    

    $scope.model.languageOptions = [
        {"name": "English US", "value": "EN-US", "default": true},
        {"name": "English UK", "value": "EN-UK"},
        {"name":"French", "value": "EN-AU"},
        {"name":"German", "value": "FR-FR"},
        {"name":"Italian", "value": "IT-IT"},
        {"name":"Dutch", "value": "NL-NL"},
        {"name":"Portuguese, Brazil", "value": "PT-BR"},
        {"name":"Spanish, Latin Am", "value": "ES-LA"},
        {"name":"Spanish, Spain", "value": "ES-ES"},
        
    ];
    $scope.model.regionOptions = [
        {"name": "US", "value": "US", "default": true},
        {"name": "EU", "value": "EU"},
        
    ];
    

    $scope.model.beepOptions = [
        {"name": "Off", "value": "NONE"},
        {"name": "Called party only", "value": "SELF"},
        {"name": "Calling party only", "value": "PEER"},
        {"name": "Both parties", "value": "BOTH"}
    ];


    $scope.selectInitTab = function () {
        $scope.model.selectedTab = $scope.item.data.config.hasOwnProperty('builtInProperties') ? 'preset' : 'custom';
        if ($scope.item.data.config.hasOwnProperty('builtInProperties') && $scope.item.data.config.builtInProperties.length == 0 && $scope.item.data.config.customProperties.length > 0) {
            $scope.model.selectedTab = 'custom';
        }
    };
    $scope.selectInitTab();
   
    $scope.checkInsight = function (){
     var license = false;
        angular.forEach($scope.model.license, function (value, key) {
            if (key === 'Insights__c') {
                license = value;
            }
        }, null);
        return license;
    };
    
    $scope.getLicenseOnce = function () {
        DataService.getLicenseCache().then(function (result) {
            $scope.model.license = result;
            $scope.model.Insight = $scope.checkInsight();
            $scope.item.data.config.insight.isEnabled = $scope.checkInsight();
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };


     if (!$scope.item.data.config.connectorId) {
        //get API Settings
        DataService.getAPISettings(null).then(function (result) {
            $scope.model.settings = result[0];
            $scope.item.data.config.connectorId = $scope.model.settings.ConnectorId__c;
            $scope.item.data.config.devOrgId = $scope.model.settings.DevOrgId__c;
            $scope.item.data.variables.notifyEmailAddress = $scope.model.settings.NotifyEmailAddress__c;
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    }

   $scope.getLicenseOnce();


    
    


}]);
//ModAction_RecordAnalysis END

//ModPolicy_ToCall START
controllers.controller('ModPolicyToCall', ['$scope', '$filter', 'DataService', 'Notification', function ($scope, $filter, DataService, Notification) {

    $scope.model = {};

    //get CALL Policies
    $scope.model.callPolicies = [];
    $scope.getCallPolicies = function () {
        DataService.getCallFlows().then(function (result) {
            //$scope.model.callPolicies = $filter('filter')(result, {Type__c: 'POLICY_TYPE_CALL'}, true);
            $scope.model.callPolicies = $filter("filter")(result, function (item) {
                if (item.Type__c != 'POLICY_TYPE_CALL' || item.Id == $scope.$parent.viewModel.data.id ) {
                    return false;
                }
                return true;
            });

        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };


    //execute now
    $scope.getCallPolicies();

}]);
//ModPolicy_ToCall END

//ModPolicy_ToNonCall START
controllers.controller('ModPolicyToNonCall', ['$scope', '$filter', 'DataService', 'Notification', function ($scope, $filter, DataService, Notification) {

    $scope.model = {};

    //get NON_CALL Policies
    $scope.model.nonCallPolicies = [];
    $scope.getNonCallPolicies = function () {
        DataService.getCallFlows().then(function (result) {
            $scope.model.nonCallPolicies = $filter('filter')(result, {Type__c: 'POLICY_TYPE_DATA_ANALYTICS'}, true);
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };


    //execute now
    $scope.getNonCallPolicies();

}]);
//ModPolicy_ToNonCall END


//ModConnect_Queue START
controllers.controller('ModConnectQueue', ['$scope', '$filter', 'DataService', 'Notification', function ($scope, $filter, DataService, Notification) {


    $scope.$watch('item', function (newValue, oldValue) {
        if (newValue && oldValue && (newValue.data.configCustom == 'ModConnect_Queue')) {
            $scope.init();
        }
    });

    $scope.data = {};
    $scope.model = {};
    $scope.model.selectedTab = 'groups';

    $scope.model.autoAnswerEnabled = $scope.item.data.config?.callQueue?.autoAnswer ? $scope.item.data.config.callQueue.autoAnswer === 'ENABLED' : false;
    $scope.model.disableCtiReject = undefined;
    $scope.model.lowestRingtime = 300;

    $scope.model.updateConfigForLuaScript = () => {
        if($scope.item.data.configForLuaScript) {
            $scope.item.data.configForLuaScript.callQueue.autoAnswer = $scope.item.data.config.callQueue.autoAnswer;
            $scope.item.data.configForLuaScript.callQueue.autoAnswerDelay = $scope.item.data.config.callQueue.autoAnswerDelay;
            $scope.item.data.configForLuaScript.callQueue.ringerAlert = $scope.item.data.config.callQueue.ringerAlert;
            $scope.item.data.configForLuaScript.callQueue.disableCtiReject = $scope.item.data.config.callQueue.disableCtiReject;
        } else return;
    }

    $scope.model.getLowestRingTime = () => {
        if($scope.item.data.variables.ringTargets && $scope.item.data.variables.ringTargets.length) {
            $scope.model.lowestRingtime = $scope.item.data.variables.ringTargets.reduce((result, item) => {
                let ringTime = result.length ? result[0].ringTime: item.ringTime;
                if (item.ringTime < ringTime) {
                ringTime = item.ringTime;
                result.length = 0;
                }
                if (item.ringTime === ringTime) {
                result.push(item);
                }
                return result;
            }, [])[0].ringTime;
        } else return undefined;
    }

    if($scope.item.data.variables.ringTargets && $scope.item.data.variables.ringTargets.length) {
        $scope.model.getLowestRingTime();
    }

    if($scope.item.data.config?.callQueue?.disableCtiReject !== undefined) {
        $scope.model.disableCtiReject = !$scope.item.data.config.callQueue.disableCtiReject;
    } else {
        $scope.model.disableCtiReject = true; // default value
    }
    $scope.model.autoAnswerSeconds = 5;

    $scope.model.handleAutoAnswer = () => {
        if($scope.model.autoAnswerEnabled) {
            $scope.item.data.config.callQueue.autoAnswer = 'ENABLED';
        } else {
            $scope.item.data.config.callQueue.autoAnswer = 'DISABLED';
        }

        $scope.model.updateConfigForLuaScript();
    }

    $scope.model.handleDisableCtiReject = () => {
        if($scope.model.disableCtiReject) {
            $scope.item.data.config.callQueue.disableCtiReject = false;
        } else {
            $scope.item.data.config.callQueue.disableCtiReject = true;
        }

        $scope.model.updateConfigForLuaScript();
    }

    $scope.model.sounds = [
        { label: "Ring", value: "RING"},
        { label: "Beep", value: "BEEP" },
    ]

    $scope.model.customHoldMusicWarning = "By allowing Natterbox to access the selected external Streaming Media source for provision of Hold Music, you understand and agree that: \n\n1/ Natterbox is unable to guarantee consistent provision of service for any elements that are dependant on streaming media provided by an external source; in this case for the provision of \"Hold Music\".\n\n2/ You take on the sole and full responsibility for ensuring that you have abided by any relevant licensing or copyright schemes that are associated with the Streaming Media Source, and agree that Natterbox will not be held responsible for any license infringements that may arise out of your use of this Streaming Media source on the Natterbox Service.\n\n <strong>Click on this notification to acknowledge that you understand and accept these terms.</strong>";

    $scope.model.queueAlgorithmTypes = [
        {"label" : "Ordered by Priority, Time Queued", "value": "priority"},
        {"label" : "Weighted Queuing Time", "value": "weighted"},
    ];

    $scope.model.holdMusicTypes = [
        {"label" : "Auto", "value": "AUTO"},
        {"label" : "Preset", "value": "PRESET"},
        {"label" : "Custom", "value": "CUSTOM"},
    ];

    $scope.model.showAddGroupDialog = false;
    $scope.model.showAnnouncementDialog = false

    $scope.model.distributionOptions = [
        {"label" : "Longest Idle", "value": "LONGEST_IDLE"},
        {"label" : "Sequential", "value": "SEQUENTIAL"},
        {"label" : "Least Talk", "value": "LEAST_TALK"},
        {"label" : "Least Calls", "value": "LEAST_CALLS"},
        {"label" : "All Agents", "value": "ALL_AGENTS"}
    ];

    $scope.model.announcementTypeOptions = [
        {"label" : "Sound", "value": "SOUND"},
        {"label" : "TTS", "value": "TTS"}
    ];

    $scope.model.chimeFormatOptions = [
        {"label" : "Sound", "value": "TAG"},
        {"label" : "Text To Speech", "value": "TTS"},
        {"label" : "Tone", "value": "SOUND_TONE"},
        {"label" : "MP3 via HTTP", "value": "SOUND_MP3"},
        {"label" : "Shoutcast", "value": "SOUND_SHOUTCAST"}
    ];


    $scope.model.keyOptions = [
        {'label': 'No acknowledgement required', 'value': ''},
        {'label': '0', 'value': '0'},
        {'label': '1', 'value': '1'},
        {'label': '2', 'value': '2'},
        {'label': '3', 'value': '3'},
        {'label': '4', 'value': '4'},
        {'label': '5', 'value': '5'},
        {'label': '6', 'value': '6'},
        {'label': '7', 'value': '7'},
        {'label': '8', 'value': '8'},
        {'label': '9', 'value': '9'},
        {'label': '#', 'value': '#'},
        {'label': '*', 'value': '*'}
    ];

    $scope.model.keyOptionsNotEmpty = $scope.model.keyOptions.slice(1);

    $scope.model.skillModeOption = [
        {"label" : "Built in", "value": "BUILT_IN"},
        {"label" : "Lua", "value": "HOOK"}
    ];

    $scope.model.skillAlgorithmOptions = [
        {"label" : "Sum", "value": "SUM"},
        {"label" : "Maximum", "value": "MAXIMUM"}
    ];

    $scope.model.defaultSkills = {
        "enabled": false,
        "hook": null,
        "mode": "BUILT_IN",
        "parameters": {
            "agentsRequireAllSkills": false,
            "ignoreUnskilledAgents": false,
            "unskilledAgentsDeferTime": 10,
            "algorithm": "SUM"
        }
    };

    $scope.model.cliPresentationMainOptions = [
        {"label" : "Withhold", "value": "WITHHOLD"},
        {"label" : "Specified", "value": "SPECIFIED"},
        {"label" : "Default", "value": "DEFAULT"}
    ];

    $scope.model.cliPresentationCustomOptions = $scope.model.cliPresentationMainOptions.slice(0,2);

    $scope.model.aclOptions = [
        {"label" : "Any", "value": "ANY"},
        {"label" : "Allow", "value": "MATCH"},
        {"label" : "Block", "value": "NO_MATCH"}
    ];

    $scope.model.maximumAttemptsArr = [1,2,3,4,5];

    $scope.model.chimeOnceOptions = [
        {"label" : "Once", "value": true},
        {"label" : "Every Loop", "value": false}
    ];

    $scope.model.chimeRuleBooleanOptions = [
        {"label" : "And", "value": "AND"},
        {"label" : "Or", "value": "OR"}
    ];

    $scope.model.chimeRuleOperatorOptions = [
        {"label" : "<>", "value": "NEQ"},
        {"label" : "==", "value": "EQ"},
        {"label" : ">=", "value": "GTEQ"},
        {"label" : "<=", "value": "LTEQ"},
        {"label" : ">", "value": "GT"},
        {"label" : "<", "value": "LT"},
        {"label" : "Starts With", "value": "STARTS"},
        {"label" : "Ends With", "value": "ENDS"},
        {"label" : "Contains", "value": "CONTAINS"}
    ];

    $scope.model.e164Regex = "^[1-9]\\d{8,14}$";
    $scope.model.httpRegex = '^(((http|https):\\/\\/[-a-zA-Z0-9+&@#/%?=~_|!:,;]+([\\-\\.]{1}[-a-zA-Z0-9+&@#/%?=~_|]+)*\\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\\/.*)?)|(\\$\\([A-Z][A-Za-z0-9\\.\\[\\]_-]+\\)))$';
    $scope.model.callQueueWeightRegex = '^([1-9]|10|\\$\\([A-Za-z0-9]+\\))$';
    $scope.model.transferAfterConnectRegex = '^[A-Za-z0-9-_ \\.\\!\\~\\*\'\\(\\)\\&\\=\\+\\$\\,\\;\\?\\/\\{\\}\\<\\>\\^\\%\\$\\£\\@\\#\\|]{0,1024}$';

    $scope.validateRegex = function(value, target) {
        try {
            new RegExp(value);
            $scope.model[target] = false;
        } catch(e) {
            $scope.model[target] = true;
        }
     };

    $scope.item.data.hoursErr = false;
    $scope.item.data.minutesErr = false;
    $scope.item.data.secondsErr = false;
    $scope.containers = [];
    $scope.attemptM = [];
    $scope.container = {};

    $scope.setDefaultValues = function (value) {
        if(value==true){
            if(!$scope.item.data.configForLuaScript.callBack.maximumAttempts) {
                $scope.item.data.configForLuaScript.callBack.maximumAttempts = 3;
            }
            $scope.addDuration($scope.item.data.configForLuaScript.callBack.maximumAttempts);
        }
    }

    $scope.addDuration = function (value) {
        $scope.containers = [];
        if(!$scope.item.data.configForLuaScript.callBack.attemptDelays) {
            for (var i = 0; i < value; i++) {
                $scope.containers.push({"h":0,"m":15, "s":0});
            }
        } else {
            if($scope.item.data.configForLuaScript.callBack.attemptDelays.length > value) {
                $scope.item.data.configForLuaScript.callBack.attemptDelays = $scope.item.data.configForLuaScript.callBack.attemptDelays.splice(0, value); // remove attemptDelays which was removed from maximumAttempts 
            }
            var existingValArray = $scope.item.data.configForLuaScript.callBack.attemptDelays;
            for (var i = 0; i < value; i++) {
                if(!existingValArray[i] || isNaN(existingValArray[i])) {
                    existingValArray[i] = 900;
                }
                var ms = $scope.fmtHHMMSS(existingValArray[i]).split(':');
                var hours = ms[0] == null || isNaN(ms[0])? '00' : ms[0];
                var minutes = ms[1] == null || isNaN(ms[1])? '00' : ms[1];
                var seconds = ms[2] == null || isNaN(ms[2])? '00' : ms[2];
                $scope.containers.push({"h":Number(hours), "m":Number(minutes), "s":Number(seconds)});
            }
        }
        $scope.calculateDelay();
    }

    $scope.fmtHHMMSS = function(seconds) {
        if(seconds < 3600) { 
            return "00:" + new Date(seconds * 1000).toISOString().substring(14, 19);
        }
        return new Date(seconds * 1000).toISOString().substring(11, 19);
    }

    $scope.calculateDelay = function() {
        $scope.item.data.hoursErr = false;
        $scope.item.data.minutesErr = false;
        $scope.item.data.secondsErr = false;
        for (var i=0; i < $scope.containers.length; i++) {
            var hours = parseInt($scope.containers[i].h);
            var minutes = parseInt($scope.containers[i].m);
            var seconds = parseInt($scope.containers[i].s);

            if(isNaN(hours) || hours < 0 || hours > 23) {
                
                $scope.item.data.hoursErr = true;
                hours = 0;
            }
            if(isNaN(minutes) || minutes < 0 || minutes > 59) {
                $scope.item.data.minutesErr = true;
                minutes = 15;
            }
            if(isNaN(seconds) || seconds < 0 || seconds > 59) {
                $scope.item.data.secondsErr = true;
                seconds = 0;
            }
            $scope.attemptM[i] = hours * 60 * 60 + minutes * 60 + seconds;
            
        }
        $scope.item.data.configForLuaScript.callBack.attemptDelays = $scope.attemptM;
    }

    $scope.addCustomCLI = function () {
        $scope.item.data.configForLuaScript.callBack.customCli.push({"cliRegex":"", "cliPresentation": "SPECIFIED", "cli":""});
    };

    $scope.addChimeRule = function () {
        $scope.model.selectedChime.rules.push({"lhTerm":"", "operator": "EQ", "rhTerm": "", "boolean": "AND"});
    };
    
    $scope.handleSkillBasedGroup = function() {
      var hasSkillsBasedGroup = false;
        angular.forEach($scope.item.data.variables.ringTargets, function (value, key) {
            if (value.hasOwnProperty('skills') && value.skills.enabled) {
                hasSkillsBasedGroup = true;
            };
        }, null);
        $scope.model.hasSkillsBasedGroup = hasSkillsBasedGroup;
        if ($scope.model.hasSkillsBasedGroup == false) {
            $scope.item.data.configForLuaScript.callBack.enabled = false;
        }
    };

    $scope.model.hasSkillsBasedGroupNotification = 'Callback can only be enabled if there are one or more Skills Based routing groups configured';

    $scope.switchToRulesBasedAnnouncements = function () {
        angular.forEach($scope.item.data.variables.announcements, function (value, key) {
            var newChime = {};
            newChime.chimeOnce = true;
            newChime.delay = $scope.item.data.variables.announcePeriod;
            newChime.format = value.type == 'SOUND' ? 'TAG' : 'TTS';
            newChime.chime = value.type == 'SOUND' ? ($scope.data.soundsMap[value.soundId]) : value.text;
            newChime.rules = [];
            $scope.item.data.configForLuaScript.chime.push(newChime);
        }, null);

        if ($scope.item.data.configForLuaScript.chime.length==0) {
            var newChime = {};
            newChime.chimeOnce = true;
            newChime.delay = $scope.item.data.variables.announcePeriod;
            newChime.format = 'TAG';
            newChime.chime = $scope.data.sounds.length > 0 ? $scope.data.sounds[0].tag : null;
            newChime.rules = [];
            $scope.item.data.configForLuaScript.chime.push(newChime);
        }
    };

    //lua script
    $scope.model.showModalScriptEditor = false;

    $scope.model.initScript = '--';
    $scope.model.initScript += '\r\n-- connectorId: The Id of the Salesforce connector to be used with sf_query and sf_store methods';
    $scope.model.initScript += '\r\nlocal connectorId = #connectorId#';
    $scope.model.initScript += '\r\n\r\n-- nameSpacePrefix: The prefix used by AVS';
    $scope.model.initScript += '\r\nlocal nameSpacePrefix = \'nbavs\'';
    $scope.model.initScript += '\r\n\r\n-- User: #user#';
    $scope.model.initScript += '\r\n-- Date: #date#';
    $scope.model.initScript += '\r\n-- Time: #time#';
    $scope.model.initScript += '\r\n--';
    $scope.model.initScript += '\r\n\r\n--continue your script here';
    $scope.model.initScript += '\r\n\r\n\r\n';

    $scope.setRingTargetScript = function () {
        var dateRegex = /\r\n-- Date: .*\r\n/;
        var timeRegex = /\r\n-- Time: .*\r\n/;
        $scope.model.selectedRingTarget.skills.script = $scope.model.initScript;
        $scope.model.selectedRingTarget.skills.script = $scope.model.selectedRingTarget.skills.script.replace(dateRegex, '\r\n-- Date: ' + moment().format('DD/MM/YYYY') + '\r\n');
        $scope.model.selectedRingTarget.skills.script = $scope.model.selectedRingTarget.skills.script.replace(timeRegex, '\r\n-- Time: ' + moment().format('HH:mm:ss') + '\r\n');
    };

    $scope.setRingTargetScriptVars = function () {
        if ($scope.model.connectorId) $scope.model.selectedRingTarget.skills.script = $scope.model.selectedRingTarget.skills.script.replace("#connectorId#", $scope.model.connectorId);
        if ($scope.model.user) $scope.model.selectedRingTarget.skills.script = $scope.model.selectedRingTarget.skills.script.replace("#user#", $scope.model.user.Name);
    };


    //init special attributes
    $scope.init = function () {
        if (!$scope.item.data.config.screenHook) {
            //append new data structure
            $scope.item.data.configScreen = {
                "announcement": null,
                "acceptKey": "",
                "waitForResponse": 10,
                "repeat": 5
            };
            $scope.item.data.variablesScreen = {
                "script": null,
                "notifyEmailAddress": null,
                "notifyHttpUrl": null,
                "nextId": null
            };

            //set screen hook id
            $scope.item.data.config.screenHook = $scope.newId().replace(/-/g, '');

            //set additional components Id's
            $scope.item.data.queueId = $scope.newId();
            $scope.item.data.queueParentId = $scope.newId();
            $scope.item.data.screenId = $scope.newId();
            $scope.item.data.screenParentId = $scope.newId();

            //get API Settings
            DataService.getAPISettings(null).then(function (result) {
                $scope.model.settings = result[0];
                $scope.item.data.config.devOrgId = $scope.model.settings.DevOrgId__c;
                $scope.item.data.variablesScreen.notifyEmailAddress = $scope.model.settings.NotifyEmailAddress__c;
            }, function (error) {
                Notification.error(error);
            }).finally(function () {
                //$scope.processing = null;
            });
        };

        if (!$scope.item.data.hasOwnProperty('skillHookParentId')) {
            $scope.item.data.skillHookParentId = $scope.newId();
        }

        if (!$scope.item.data.hasOwnProperty('configForLuaScript')) {
            $scope.item.data.configForLuaScript = {
                "callBack": {
                    "enabled": false,
                    "activationKey": "#",
                    "activationPosition": 10,
                    "activationElapsedTime": 300,
                    "leaveVoiceMail": true,
                    "acl": "ANY",
                    "aclRegex": "",
                    "maximumAttempts": 3,
                    "attemptDelays": [900,900,900],
                    "cli": "",
                    "cliPresentation": "SPECIFIED",
                    "customCli": []

                },
                "chime": [],
                "callQueue" : { "algorithm": "priority", "transferAfterConnect": null }
            };
        } else {
            if ($scope.item.data.configForLuaScript.hasOwnProperty('callBack')) {
                if (!$scope.item.data.configForLuaScript.callBack.hasOwnProperty('activationElapsedTime')) {
                    $scope.item.data.configForLuaScript.callBack.activationElapsedTime = 300;
                }
                if (!$scope.item.data.configForLuaScript.callBack.hasOwnProperty('maximumAttempts')) {
                    $scope.item.data.configForLuaScript.callBack.maximumAttempts = 3;
                }
                if (!$scope.item.data.configForLuaScript.callBack.hasOwnProperty('attemptDelays')) {
                    $scope.item.data.configForLuaScript.callBack.attemptDelays = [900,900,900];
                }
            }
        }

        $scope.item.data.config.callQueue = $scope.item.data.config.callQueue || {};
        $scope.item.data.config.callQueue.algorithm = $scope.item.data.configForLuaScript.callQueue.algorithm;
        $scope.item.data.config.callQueue.transferAfterConnect = $scope.item.data.configForLuaScript.callQueue.transferAfterConnect;

        $scope.item.data.config.callQueue.autoAnswer = $scope.item.data.config.callQueue.autoAnswer || "DEFAULT";
        $scope.item.data.config.callQueue.ringerAlert = $scope.item.data.config.callQueue.ringerAlert || "RING";
        if($scope.item.data.config.callQueue.autoAnswerDelay == undefined) {
            $scope.item.data.config.callQueue.autoAnswerDelay = 5;
        }

        $scope.item.data.config.callQueue.disableCtiReject = $scope.item.data.config.callQueue.disableCtiReject !== undefined ?$scope.item.data.config.callQueue.disableCtiReject : false;

        $scope.item.data.configForLuaScript.callQueue.autoAnswer = $scope.item.data.config.callQueue.autoAnswer;
        $scope.item.data.configForLuaScript.callQueue.autoAnswerDelay = $scope.item.data.config.callQueue.autoAnswerDelay;
        $scope.item.data.configForLuaScript.callQueue.ringerAlert = $scope.item.data.config.callQueue.ringerAlert;
        $scope.item.data.configForLuaScript.callQueue.disableCtiReject = $scope.item.data.config.callQueue.disableCtiReject;

        $scope.handleSkillBasedGroup();
        $scope.setDefaultValues(true);
    };


    $scope.initRingTargetScriptVars = function () {
        if ($scope.model.user == null) {
            //get API Settings
            DataService.getAPISettings(null).then(function (result) {
                $scope.model.settings = result[0];
                $scope.model.connectorId = $scope.model.settings.ConnectorId__c;
                $scope.model.devOrgId = $scope.model.settings.DevOrgId__c;
                $scope.model.notifyEmailAddress = $scope.model.settings.NotifyEmailAddress__c;

                DataService.getSFUser(null).then(function (result) {
                    $scope.model.user = result[0];
                }, function (error) {
                    //Notification.error(error);
                }).finally(function () {
                    $scope.setRingTargetScriptVars();
                });

            }, function (error) {
                Notification.error(error);
            }).finally(function () {
                //$scope.processing = null;
            });
        } else {
            $scope.setRingTargetScriptVars();
        }
    };


    $scope.model.selectedRingTarget = null;
    $scope.model.selectedAnnouncement = null;

    $scope.initNewRingTarget = function () {
        $scope.model.selectedRingTarget = {
            "groupId":null,
            "distribution":{"algorithm":"LONGEST_IDLE"},
            "wrapUpTime": 60,
            "wrapUpFailedTime": 60,
            "ringTime": 30,
            "screenCaller": false,
            "callWaiting": false,
            "skills": angular.copy($scope.model.defaultSkills)
        };

        if ($scope.model.groups.length > 0) {
            $scope.model.selectedRingTarget.groupId = $scope.model.groups[0].Id__c;
        }
        $scope.model.mode = 'add';
        $scope.model.showRingTargetDialog = true;
        $scope.model.distributionAlgorithmError = null;
    };

    $scope.handleSkillEngineMode = function () {
        if ($scope.model.selectedRingTarget.skills.mode == 'HOOK' && $scope.model.selectedRingTarget.skills.script == null) {
            //add lua hook
            $scope.model.selectedRingTarget.skills.hook = $scope.newId();
            $scope.setRingTargetScript();
            $scope.initRingTargetScriptVars();
        }
    };

    $scope.initNewAnnouncement = function () {
        $scope.model.selectedAnnouncement = {
            "type":"SOUND",
            "soundId":null
        };

        if ($scope.data.sounds.length > 0) {
            $scope.model.selectedAnnouncement.soundId = $scope.data.sounds[0].soundId;
        }
        $scope.model.mode = 'add';
        $scope.model.showAnnouncementDialog = true;
    };

    $scope.initNewChime = function () {
        $scope.model.selectedChime = {
            "chimeOnce": true,
            "delay": $scope.item.data.variables.announcePeriod,
            "format":"TAG",
            "chime":null,
            "rules": []
        };

        if ($scope.data.sounds.length > 0) {
            $scope.model.selectedChime.chime = $scope.data.sounds[0].tag;
        }
        $scope.model.mode = 'add';
        $scope.model.showChimeDialog = true;
    } ;

    $scope.handleDistributionRuleChange = function () {
        $scope.handleAllAgentsDistributionRule();
        switch ($scope.model.selectedRingTarget.distribution.algorithm) {
            case 'LEAST_TALK':
            case 'LEAST_CALLS':
                $scope.model.selectedRingTarget.distribution.resetDays = $scope.model.selectedRingTarget.distribution.resetDays || [];
                $scope.model.selectedRingTarget.distribution.resetHours = $scope.model.selectedRingTarget.distribution.resetHours || [];
                if ($scope.model.selectedRingTarget.wrapUpFailedTime == null || $scope.model.selectedRingTarget.wrapUpFailedTime < 10) {
                    $scope.model.selectedRingTarget.wrapUpFailedTime = 10;
                }
                break;
            case 'ALL_AGENTS':
                $scope.model.selectedRingTarget.skills.enabled = false;
                $scope.model.selectedRingTarget.wrapUpTime = 0;
                $scope.model.selectedRingTarget.wrapUpFailedTime = 0;
                delete $scope.model.selectedRingTarget.distribution.resetDays;
                delete $scope.model.selectedRingTarget.distribution.resetHours;
                break;
            default:
                delete $scope.model.selectedRingTarget.distribution.resetDays;
                delete $scope.model.selectedRingTarget.distribution.resetHours;
                if ($scope.model.selectedRingTarget.wrapUpFailedTime == null || $scope.model.selectedRingTarget.wrapUpFailedTime < 10) {
                $scope.model.selectedRingTarget.wrapUpFailedTime = 10;
            }

        }
    };

    $scope.handleAllAgentsDistributionRule = function() {
        $scope.model.distributionAlgorithmError = null;
        $scope.item.data.variables.ringTargets.some(hasAllAgentsDistributionAlgorithm);
    };

    function hasAllAgentsDistributionAlgorithm(element, index, array) {
        if ($scope.model.selectedRingTarget.$$hashKey == element.$$hashKey) { //selected one
            if ($scope.model.selectedRingTarget.distribution.algorithm == 'ALL_AGENTS') { // change to all agents
                if (index < (array.length - 1)) { // not the last one
                    $scope.model.distributionAlgorithmError = 'A Group with \'All Agents\' distribution rule cannot be in any position other than last.';
                    $scope.model.selectedRingTarget.distribution.algorithm = 'LONGEST_IDLE';
                    return true;
                }
            }
        } else { //others
            if (element.distribution.algorithm == 'ALL_AGENTS') { // other have all agents distribution rule
                if ($scope.model.selectedRingTarget.distribution.algorithm == 'ALL_AGENTS') {
                    $scope.model.distributionAlgorithmError = 'Cannot have more than one group inside a single call queue to use the \'All Agents\' distribution rule'
                    $scope.model.selectedRingTarget.distribution.algorithm = 'LONGEST_IDLE';
                    return true;
                } else {
                    if ($scope.model.selectedRingTarget.$$hashKey == null) {
                        $scope.model.distributionAlgorithmError = 'A Group with \'All Agents\' distribution rule cannot be in any position other than last.';
                        $scope.model.selectedRingTarget.distribution.algorithm = 'LONGEST_IDLE';
                        return true;
                    }
                }
            }
        }
        return false;
    }


    $scope.editRingTarget = function(ringTarget) {
        if (!ringTarget.hasOwnProperty('skills')) {
            ringTarget.skills = angular.copy($scope.model.defaultSkills);
        }
        $scope.model.selectedRingTarget = ringTarget;
        $scope.model.mode = 'edit';
        $scope.model.showRingTargetDialog = true;
        $scope.model.distributionAlgorithmError = null;
    };

    $scope.editAnnouncement = function(announcement) {
        $scope.model.selectedAnnouncement = announcement;
        $scope.model.mode = 'edit';
        $scope.model.showAnnouncementDialog = true;
    };


    $scope.editChime = function(chime) {
        $scope.model.selectedChime = chime;
        $scope.model.mode = 'edit';
        $scope.model.showChimeDialog = true;
    };

    $scope.addRingTarget = function () {
        $scope.item.data.variables.ringTargets = $scope.item.data.variables.ringTargets || [];
        //check old all agents distribution algorithm
        var hasAllAgents = $scope.item.data.variables.ringTargets.some(hasAllAgentsDistributionAlgorithm);
        if (!hasAllAgents) {
            $scope.item.data.variables.ringTargets.push(angular.copy($scope.model.selectedRingTarget));
            $scope.model.showRingTargetDialog = false;
        }
        $scope.handleSkillBasedGroup();
    };

    $scope.addAnnouncement = function () {
        if ($scope.model.selectedAnnouncement.type == 'TTS' && ($scope.model.selectedAnnouncement.text == "" || $scope.model.selectedAnnouncement.text == null || $scope.model.selectedAnnouncement.text == undefined)) {
            $scope.model.showAnnouncementDialog = true;
        } else {
            if ($scope.model.mode=='add') {
                $scope.item.data.variables.announcements = $scope.item.data.variables.announcements || [];
                $scope.item.data.variables.announcements.push(angular.copy($scope.model.selectedAnnouncement));
            }
            $scope.model.showAnnouncementDialog = false;
        }
    };

    $scope.addChime = function () {
        $scope.item.data.configForLuaScript.chime = $scope.item.data.configForLuaScript.chime || [];
        $scope.item.data.configForLuaScript.chime.push(angular.copy($scope.model.selectedChime));
        $scope.model.showChimeDialog = false;
    };

    $scope.validationAddChime = function () {
        if($scope.model.selectedChime.chime == null){
            $scope.model.showChimeDialog= true;
        }
        else{
            if($scope.model.mode=='add')
            {
              $scope.addChime();
            }
            $scope.model.showChimeDialog=false;
        }
    };


    $scope.validateAnnouncement = function () {
      switch ($scope.model.selectedAnnouncement.type) {
          case 'TTS':
              $scope.model.selectedAnnouncement.text = $scope.model.selectedAnnouncement.text || "";
              delete $scope.model.selectedAnnouncement.soundId;
              break;
          case 'SOUND':
              $scope.model.selectedAnnouncement.soundId = $scope.model.selectedAnnouncement.soundId || ($scope.data.sounds.length > 0 ? $scope.data.sounds[0].soundId : null);
              delete $scope.model.selectedAnnouncement.text;
              break;
      }
    };

    $scope.handleHoldMusicChange = function() {
        switch ($scope.item.data.config.holdMusicType) {
            case "AUTO" : $scope.item.data.variables.holdMusic = {"type":"AUTO"}; break;
            case "PRESET" : $scope.item.data.variables.holdMusic = {"type":"PRESET", "preset": $scope.item.data.config.holdMusicPreset}; break;
            case "CUSTOM" :
                $scope.item.data.variables.holdMusic = {"type":"CUSTOM", "url": $scope.item.data.config.holdMusicUrl};
                Notification.warning({'message':$scope.model.customHoldMusicWarning, delay: null});
                break;
        }
    };

    $scope.handleQueueAlgorithmChange = function() {
        $scope.item.data.configForLuaScript.callQueue.algorithm = $scope.item.data.config.callQueue.algorithm;
    };

    $scope.handleTransferAfterConnectChange = function() {
        $scope.item.data.configForLuaScript.callQueue.transferAfterConnect = $scope.item.data.config.callQueue.transferAfterConnect;
    };

    $scope.swapPriority = function(array, a, b){
        try {
            array[a] = array.splice(b, 1, array[a])[0];
        } catch (error) {
            console.log(error);
        }
    };



    //get Groups
    $scope.model.groups = [];
    $scope.model.groupsMap = {};
    $scope.getGroups = function () {
        DataService.getGroups(null).then(function (result) {
            $scope.model.groups = $filter('filter')(result, {Manager__c: true}, true);
            angular.forEach(result, function (value, key) {
                $scope.model.groupsMap[value.Id__c] = value.Manager__c ? value.Name : '__ invalid group __';
            }, null);
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };

    //get Hold Music Options
    $scope.model.holdMusicOptions = [];
    $scope.getHoldMusicOptions = function () {
        DataService.getPresets('HoldMusic').then(function (result) {
            $scope.model.holdMusicOptions = result;
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };

    //get Sounds Options
    $scope.data = {}
    $scope.data.sounds = [];
    $scope.data.soundsMap = [];
    $scope.getSounds = function () {
        $scope.data.sounds = DataService.getCache('sounds');
        $scope.data.soundsMap = DataService.getCache('soundsMap');
        console.log('got sounds', $scope.data.sounds, $scope.data.soundsMap);
    };


    $scope.getLicenseOnce = function () {
        DataService.getLicenseCache().then(function (result) {
            $scope.model.license = result;
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };

    $scope.getLicenseOnce();

    //execute now
    $scope.getGroups();
    $scope.getSounds();
    $scope.getHoldMusicOptions();


    //boot ace editor
    $scope.aceLoaded = function(_editor){
        // Editor part
        var _session = _editor.getSession();
        var _renderer = _editor.renderer;

        // Options
        _editor.setReadOnly(false);
        _session.setUndoManager(new ace.UndoManager());
        _renderer.setShowGutter(true);
        _editor.setTheme('ace/theme/eclipse');
        _session.setMode('ace/mode/lua');
        _session.setNewLineMode("windows");

        _editor.setOptions({
            enableSnippets: true,
            enableLiveAutocompletion: true,
            enableBasicAutocompletion: true,
            showPrintMargin: false,
            useSoftTabs: false,
            //fontSize: 12,
            showInvisibles: true,
            behavioursEnabled: true,
            tabSize: 4,
            wrap: false,
            useWorker: true,
            highlightActiveLine : true,
        });

        // Events
        //_editor.on("changeSession", function(){ console.log('change session') });
        //_session.on("change", function(){ console.log('change') });
        //fix notice scroll bug
        _editor.$blockScrolling = Infinity;


        //block top section

        var blockScriptHeader = function(startHi, endHi, startEdit, endEdit, disableEdit) {
            if (disableEdit) {
                var old$tryReplace = _editor.$tryReplace;
                _editor.$tryReplace = function (range, replacement) {
                    return intersects(range) ? null : old$tryReplace.apply(this, arguments);
                }
                var oldInsert = _session.insert;
                _session.insert = function (position, text) {
                    return oldInsert.apply(this, [position, outsideRange(position) ? text : ""]);
                }
                var oldRemove = _session.remove;
                _session.remove = function (range) {
                    return intersects(range) ? false : oldRemove.apply(this, arguments);
                }
                var oldMoveText = _session.moveText;
                _session.moveText = function (fromRange, toPosition, copy) {
                    if (intersects(fromRange) || !outsideRange(toPosition)) return fromRange;
                    return oldMoveText.apply(this, arguments)
                }
            }

            var Range = ace.require('ace/range').Range;

            var range = new Range(startEdit, 0, endEdit, 100);
            var rangeHighlight = new Range(startHi, 0, endHi, 100);

            var outsideRange = function (position) {
                var s0 = range.start;
                if (position.row < s0.row || (position.row == s0.row && position.column <= s0.column)) return true; // position must be before range.start
                var e0 = range.end;
                if (position.row > e0.row || (position.row == e0.row && position.column >= e0.column)) return true; // or after range.end
                return false;
            }
            var intersects = function (withRange) {
                var e = withRange.end, s0 = range.start, s = withRange.start, e0 = range.end;
                if (e.row < s0.row || (e.row == s0.row && e.column <= s0.column)) return false; // withRange.end must be before range.start
                if (s.row > e0.row || (s.row == e0.row && s.column >= e0.column)) return false; // or withRange.start must be after range.end
                return true;
            }

            _session.addMarker(rangeHighlight, "readonly-highlight");
            _editor.focus(); // To focus the ace editor

            setTimeout(function(){
                _editor.scrollToLine(14, true, true, function () {});
                _editor.gotoLine(14, 0, true);
            }, 2000);
        };

        blockScriptHeader(0, 11, 0, 6, true);

    };

    $scope.model.countries = countryCodes;


}]);
//ModConnect_Queue END


//ModNumber_Public START
controllers.controller('ModNumber_Public', ['$scope', '$location', '$route', '$filter', 'DataService', 'Notification', function ($scope, $location, $route, $filter, DataService, Notification) {

    $scope.model = {};

    $scope.loadDetail = function (id) {
        $scope.model.showNumbersDialog = false;
        $location.path('/detail/').search({id: id});
        $route.updateParams({id: id});
        $route.reload();
    };

    //get phone numbers
    $scope.getPhoneNumbers = function () {
        DataService.getPhoneNumbers(null).then(function (result) {
            $scope.model.allPhoneNumbers = result;
            $scope.rebuildItemsName();
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };

    $scope.rebuildItemsName = function () {
        angular.forEach($scope.node.data.subItems, function (value, key) {
            try {
                value.name = $filter('filter')($scope.model.allPhoneNumbers, {Number__c: value.variables.publicNumber}, true)[0].Name;
            } catch (error) {
                console.log(error);
            }
        }, null);
    };

    $scope.showNumbersDialog = function () {
        //get other ModNumber_Public from this policy
        var otherPublicNumbers = [];

        angular.forEach($scope.viewModel.nodes, function (value, key) {
            if (value.data.templateId == 3 && value.data.id != $scope.node.data.id && value.data.subItems.length > 0) {
                otherPublicNumbers.push(value.data.subItems[0]);
            }
        }, null);

        //select the ones selected in the current node
        $scope.model.currentPhoneNumbers = $filter('selectPublicNumbers')(angular.copy($scope.model.allPhoneNumbers), $scope.node.data.subItems);
        //disable the ones selected in other nodes, other policies and DDI numbers
        $scope.model.currentPhoneNumbers = $filter('disableOtherPublicNumbersAndDDI')($scope.model.currentPhoneNumbers, otherPublicNumbers, $scope.viewModel.data.id);
        $scope.model.showNumbersDialog = true;
    };


    $scope.buildModNumberSubItems = function () {
        var items = [];
        for (var i = 0; i < $scope.model.currentPhoneNumbers.length; i++) {
            if ($scope.model.currentPhoneNumbers[i].selected) {
                items.push($scope.buildModNumberPublic($scope.model.currentPhoneNumbers[i]));
            }
        }
        return items;
    };

    $scope.buildModNumberPublic = function (publicNumber) {
        var item = {
            "name": publicNumber.Name,
            "templateId": 3,
            "id": $scope.newId(),
            "variables": {
                "callerIdName": null,
                "billModel": "STANDARD",
                "delayBeforeAnswering": 0,
                "ringtone": "AUTO",
                "publicNumber": publicNumber.Number__c,
                "nextId": null
            },
        };
        return item;
    };

    $scope.addSelectedNumbers = function () {

        $scope.model.showNumbersDialog = false;
        $scope.node.data.subItems = $scope.buildModNumberSubItems();
        $scope.node.adjustOutputY();

    };

    $scope.cancelSelectedNumbers = function () {
        $scope.model.showNumbersDialog = false;
    };


    $scope.toggleSelectNumbers = function () {

        angular.forEach($scope.model.currentPhoneNumbers, function (value, key) {
            if (value.disabled !== true) {
                value.selected = $scope.model.selectAllNumbers;
            }
        }, null);
    };


    $scope.getPhoneNumbers();


}]);
//ModNumber_Public END

//SF QUERY START
controllers.controller('SalesforceQuery', ['$scope', '$filter', 'DataService', 'Notification', 'VISUALFORCE', function ($scope, $filter, DataService, Notification, VISUALFORCE) {

    $scope.$watch('item', function (newValue, oldValue) {
        if (newValue && oldValue && (newValue.data.configCustom == 'ModConnector_SFQuery')) {
            $scope.getSObjectFields();
            $scope.setTriggerFromConfig();
        }
    });

    var previousPromises = [];

    $scope.rejectPromises = false;


    $scope.areaConfigSOQL = {
        autocomplete: [{
            words: ['SELECT', 'UPDATE', 'DELETE', 'INSERT'],
            cssClass: 'highlight sqlMain',
            autocompleteOnSpace: false
        },
            {
                words: ['WHERE', 'FROM', 'ORDER BY', 'LIMIT', 'JOIN'],
                cssClass: 'highlight sqlQuery',
                autocompleteOnSpace: false
            },
            {
                words: ['users', 'messages', 'friends', 'events'],
                cssClass: 'highlight tables'
            },
            {
                words: [/\$\(([A-Z][\w_\.\[\]\d\@\{\}]+)\)/gi],
                cssClass: 'highlight macro'

            }
        ]
    };

    $scope.model = {};

    //$scope.model.dataConnectors = [];
    $scope.model.sObjects = [];
    $scope.model.sObjectFields = [];

    $scope.model.showQueryResults = false;
    $scope.model.queryRecords = [];

    $scope.model.availableFields = [];
    $scope.model.selectedFields = [];

    $scope.model.orderDirectionOptions = [
        "ASC",
        "DESC"
    ];

    /*
     $scope.model.logicalOperators = [
     "AND",
     "OR"
     ];
     */

    $scope.model.booleanOptions = [
        "true",
        "false"
    ];


    $scope.model.operators = [

        {
            'label': '=',
            'value': '=',
            'type': ['address', 'anytype', 'base64', 'boolean', 'calculated', 'combobox', 'currency', 'date', 'datetime', 'datacategorygroupreference', 'double', 'email', 'encryptedstring', 'id', 'integer', 'junctionidlist', 'location', 'masterrecord', 'multipicklist', 'percent', 'phone', 'picklist', 'reference', 'textarea', 'time', 'url']
        },
        {
            'label': '!=',
            'value': '!=',
            'type': ['address', 'anytype', 'base64', 'boolean', 'calculated', 'combobox', 'currency', 'date', 'datetime', 'datacategorygroupreference', 'double', 'email', 'encryptedstring', 'id', 'integer', 'junctionidlist', 'location', 'masterrecord', 'multipicklist', 'percent', 'phone', 'picklist', 'reference', 'textarea', 'time', 'url']
        },
        {'label': '<', 'value': '<', 'type': ['integer', 'double', 'date', 'time', 'datetime', 'currency', 'percent']},
        {'label': '>', 'value': '>', 'type': ['integer', 'double', 'date', 'time', 'datetime', 'currency', 'percent']},
        {
            'label': '<=',
            'value': '<=',
            'type': ['integer', 'double', 'date', 'time', 'datetime', 'currency', 'percent']
        },
        {
            'label': '>=',
            'value': '>=',
            'type': ['integer', 'double', 'date', 'time', 'datetime', 'currency', 'percent']
        },
        {'label': 'like', 'value': 'LIKE', 'type': ['string', 'email', 'phone', 'url']},
        {'label': 'not like', 'value': 'NOT LIKE', 'type': ['string', 'email', 'phone', 'url']},
    ];


    $scope.addFieldAnd = function () {
        $scope.item.data.config.filterFields = $scope.item.data.config.filterFields || [];
        $scope.item.data.config.filterFields.push([$scope.buildNewFilterField([])]);
    };

    $scope.addFieldOr = function (fieldAnd) {
        fieldAnd.push($scope.buildNewFilterField(fieldAnd));
    };

    $scope.checkEmptyFieldAnd = function (fieldAnd, index) {
        if (fieldAnd.length == 0) {
            $scope.item.data.config.filterFields.splice(index, 1);
        }
    };


    $scope.buildNewFilterField = function (existingFields) {
        //find a field not already selected
        var availableFields = $filter('notInArray')($filter('filter')($scope.model.sObjectFields, {filterable: true}), existingFields, 'name') || [];
        if (availableFields.length > 0) {
            var sObjectField = angular.copy(availableFields[0]);
            var field = {
                "name": sObjectField.name,
                "type": sObjectField.type,
                "value": "",
                "operator": "=",
                "logicalOperator": "AND"
            };
            return field;
        } else {
            Notification.error('No more available fields.');
            return null;
        }
    };


    $scope.changeFieldType = function (field) {
        var sObjectField = $filter('filter')($scope.model.sObjectFields, {name: field.name}, true)[0];
        field.type = sObjectField.type;
        if (sObjectField.type == 'picklist') {
            field.picklistValues = sObjectField.picklistValues;
        } else {
            field.picklistValues = [];
        }
    };

    $scope.testQuery = function () {
        //check for selected fields
        if ($scope.item.data.config.soql.indexOf('SELECT  FROM') !== -1) {
            Notification.error({'message' : 'No fields selected for query. Please select at least one field.'});
            return;
        }
        $scope.checkTokens();
    };

    $scope.checkTokens = function () {
        $scope.model.tokens = [];
        var _soql = angular.copy($scope.item.data.config.soql);
        var _tokenPattern = /\$\(([A-Z][\w_\.\[\]\d\@\{\}]+)\)/g;
        var _tokens = $filter('unique')(_soql.match(_tokenPattern));

        angular.forEach(_tokens, function (value, key) {
            $scope.model.tokens.push({"token": value, "value": value});
        }, null);

        if ($scope.model.tokens.length > 0) {
            $scope.model.showTokensForm = true;
        }
        else {
            $scope.executeTestQuery(_soql);
        }
    };

    $scope.replaceTokens = function () {
        try {
            var _soql = angular.copy($scope.item.data.config.soql);
            var _tokenPattern = /\$\(([A-Z][\w_\.\[\]\d\@\{\}]+)\)/g;
            angular.forEach($scope.model.tokens, function (value, key) {
                var _tokens = (value.value.match(_tokenPattern))
                if (_tokens) {
                    throw new Error("Please replace all tokens: " + value.value);
                }
                var regex = new RegExp(value.token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
                _soql = _soql.replace(regex, value.value);
            }, null);
            $scope.model.showTokensForm = false;
            $scope.executeTestQuery(_soql);
        } catch (error) {
            Notification.warning(error);
        }
    };

    $scope.executeTestQuery = function (soql) {
        $scope.model.lastSOQL = soql;
        var lastRequest = DataService.query(soql).then(function (result) {
            $scope.model.queryRecords = result;
            $scope.model.showQueryResults = true;
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
        previousPromises.push(lastRequest);
    };


    $scope.setTriggerFromConfig = function () {
        $scope.model.triggerOptionsQuery = {
            "RECORDS_FOUND": false,
            "RECORDS_NOT_FOUND": false,
            "SF_ERROR": false
        };

        angular.forEach($scope.item.data.config.trigger, function (value, key) {
            if ($scope.model.triggerOptionsQuery.hasOwnProperty(value)) {
                $scope.model.triggerOptionsQuery[value] = true;
            }
        }, null);
    };


    $scope.updateTrigger = function () {

        $scope.item.data.config.trigger = [];

        angular.forEach($scope.model.triggerOptionsQuery, function (value, key) {
            if (value) {
                $scope.item.data.config.trigger.push(key);
            }
        }, null);

        if ($scope.item.data.config.trigger.length > 0) {
            $scope.item.data.outputConnectorsAllowed = true;
        } else {
            $scope.item.data.outputConnectorsAllowed = false;
            if ($scope.item.connected) {
                $scope.viewModel.deleteItemConnection($scope.node, $scope.item);
            }
        }

        $scope.updateScript();
    };


    //get Settings
    $scope.getAPISettings = function () {
        var lastRequest = DataService.getAPISettings(null).then(function (result) {
            $scope.model.settings = result[0];
            $scope.item.data.config.connectorId = $scope.model.settings.ConnectorId__c;
            $scope.item.data.config.devOrgId = $scope.model.settings.DevOrgId__c;
            $scope.item.data.variables.notifyEmailAddress = $scope.model.settings.NotifyEmailAddress__c;

            $scope.updateScript();
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
        previousPromises.push(lastRequest);
    };

    //get sObjects
    $scope.getSObjects = function () {
        var lastRequest = DataService.getSObjects(null).then(function (result) {
            $scope.model.sObjects = result;
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
        previousPromises.push(lastRequest);
    };


    //get sObject Fields
    $scope.getSObjectFields = function () {
        $scope.model.availableFields = [];
        $scope.model.selectedFields = [];
        var lastRequest = DataService.getSObjectFields($scope.item.data.config.sObject).then(function (result) {
            $scope.model.sObjectFields = result;
            if (!$scope.rejectPromises) {
                $scope.filterAllFields();
                $scope.updateSOQL();
            }
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
        previousPromises.push(lastRequest);
    };


    $scope.filterAllFields = function () {
        $scope.model.selectedFields = $filter('inArray')($scope.model.sObjectFields, $scope.item.data.config.selectedFields, 'name') || [];
        $scope.model.availableFields = $filter('notInArray')($scope.model.sObjectFields, $scope.model.selectedFields, 'name');
    };


    $scope.sObjectChange = function () {
        $scope.model.availableFields = [];
        $scope.getSObjectFields();

    };

    $scope.updateSOQL = function () {

        if ($scope.item.data.config.mode == 'builder') {
            //push selected fields into item config
            $scope.item.data.config.selectedFields = $scope.model.selectedFields;

            //process selected fields
            var selectedFields = [];

            for (var i = 0; i < $scope.model.selectedFields.length; ++i) {
                selectedFields.push($scope.model.selectedFields[i].name);
            }

            var soql = 'SELECT ';
            soql += selectedFields.join(', ');

            soql += ' FROM ';
            soql += $scope.item.data.config.sObject;

            //add filter
            if ($scope.item.data.config.filterFields.length > 0) {
                soql += ' WHERE (';


                for (var i = 0; i < $scope.item.data.config.filterFields.length; i++) {
                    soql += ' ( ';

                    var fieldAnd = $scope.item.data.config.filterFields[i];


                    for (var j = 0; j < fieldAnd.length; j++) {
                        var field = fieldAnd[j];
                        soql += field.operator == 'NOT LIKE' ? ('(NOT ' + field.name + ' LIKE ' + $scope.buildFieldValue(field) + ')') : (field.name + ' ' + field.operator + ' ' + $scope.buildFieldValue(field));
                        if (j < fieldAnd.length - 1) {
                            soql += ' OR ';
                        }
                    }

                    soql += ' ) ';
                    if (i < $scope.item.data.config.filterFields.length - 1) {
                        soql += ' AND ';
                    }
                }

                soql += ')';
            }

            soql += ' ORDER BY ';
            soql += $scope.item.data.config.orderBy.field;
            soql += ' ';
            soql += $scope.item.data.config.orderBy.direction;

            soql += ' LIMIT ';
            soql += $scope.item.data.config.resultSize;

            $scope.item.data.config.soql = soql;
            $scope.updateScript();
        }
    };


    $scope.updateScript = function () {
        var config = {};
        config.connectorId = $scope.item.data.config.connectorId;
        config.soql = $scope.item.data.config.soql;
        config.resultSet = $scope.item.data.config.resultSet;
        config.trigger = $scope.item.data.config.trigger;
        config.namespacePrefix = VISUALFORCE.hasOwnProperty('namespacePrefix') ? VISUALFORCE.namespacePrefix.replace('.','') : '';
        config.policyType = $scope.item.data.type;
        var script = "local jsonData = [[\r";
        script += angular.toJson(config);
        script += "\r]]\r\rlocal loaded_chunk = assert(loadfile('local://" + $scope.item.data.config.devOrgId + "/QuerySalesForceCPBXV1'))\rloaded_chunk()\rres = execute(jsonData)\rreturn res\r\r\r";
        $scope.item.data.variables.script = script;
    };


    $scope.buildFieldValue = function (field) {
        switch (field.type) {
            case 'double':
            case 'integer':
            case 'boolean':
            case 'date':
                return field.value;
                break;
            default:
                return "'" + field.value + "'";
        }
    };

    //get Data Connectors
    //$scope.getDataConnectors();

    if ($scope.item.data.config.connectorId == null) {
        $scope.getAPISettings();
    };

    //now get sObjects
    $scope.getSObjects();


    //angular sortable list for slds multiselect

    var deleted = null;
    var selected = '';
    var s = '';
    var d = null;
    var countForUp = null;
    var countForDown = null;
    var countForAdd = null;
    var countForDelete = null;


    $scope.add = function (val) {
        countForAdd = 1;
        selected = $scope.model.availableFields[val];
        d = val;
    }

    $scope.addToDisplayArray = function () {
        if (countForAdd == 1) {
            $scope.model.selectedFields.push(selected);
            $scope.model.availableFields.splice(d, 1);
            selected = '';
            d = null;
            countForAdd--;
            $scope.updateSOQL();
        }
    }

    $scope.delete = function (val) {
        countForUp = 1;
        countForDown = 1;
        countForDelete = 1;
        s = $scope.model.selectedFields[val];
        deleted = val;
    }

    $scope.deleteFromDisplayArray = function () {
        if (countForDelete == 1) {
            $scope.model.selectedFields.splice(deleted, 1);
            $scope.model.availableFields.push(s);
            s = '';
            deleted = null;
            countForUp--;
            countForDown--;
            countForDelete--;
            $scope.updateSOQL();
        }
    }

    $scope.up = function () {
        if (countForUp == 1) {
            if (deleted != 0) {
                var temp = $scope.model.selectedFields[deleted];
                $scope.model.selectedFields[deleted] = $scope.model.selectedFields[deleted - 1];
                $scope.model.selectedFields[deleted - 1] = temp;
                $scope.delete(deleted - 1);
                $scope.select(temp);
                $scope.updateSOQL();
            }
        }
        //countForDelete = null;
        //countForUp = null;
    }

    $scope.down = function () {
        if (countForDown == 1) {
            if (deleted != ($scope.model.selectedFields.length - 1)) {
                var temp = $scope.model.selectedFields[deleted];
                $scope.model.selectedFields[deleted] = $scope.model.selectedFields[deleted + 1];
                $scope.model.selectedFields[deleted + 1] = temp;
                $scope.delete(deleted + 1);
                $scope.select(temp);
                $scope.updateSOQL();
            }
        }
        //countForDelete = null;
        //countForDown = null;
    }

    $scope.select = function (item) {
        $scope.selectedVal = item;
    }

    $scope.isActive = function (item) {
        return $scope.selectedVal === item;
    }


}]);
//SF QUERY END

//SF CREATE START
controllers.controller('SalesforceCreate', ['$scope', '$filter', 'DataService', 'Notification', 'VISUALFORCE', function ($scope, $filter, DataService, Notification, VISUALFORCE) {


    $scope.$watch('item', function (newValue, oldValue) {
        if (newValue && oldValue && (newValue.data.configCustom == 'ModConnector_SFCreate')) {
            $scope.getSObjectFields();
            $scope.setTriggerFromConfig();
        }
    });

    $scope.model = {};

    //$scope.model.dataConnectors = [];
    $scope.model.sObjects = [];
    $scope.model.sObjectFields = [];


    $scope.model.booleanOptions = [
        "true",
        "false"
    ];

    $scope.testCreate = function () {
        $scope.checkTokensCreate();
    };


    $scope.checkTokensCreate = function () {
        $scope.model.tokens = [];
        var fields = angular.toJson(angular.copy($scope.item.data.config.fields));

        var _tokenPattern = /\$\(([A-Z][\w_\.\[\]\d\@\{\}]+)\)/g;
        //add tokens from fields
        var _tokens = fields.match(_tokenPattern);

        //add token from ownerId
        if ($scope.item.data.config.ownerId) {
            var _tokensOwnerId = $scope.item.data.config.ownerId.match(_tokenPattern);
            if (_tokensOwnerId) {
                if (_tokens) {
                    _tokens = _tokensOwnerId.concat(_tokens);
                } else {
                    _tokens = _tokensOwnerId;
                }
            }
        }

        var _tokens = $filter('unique')(_tokens);

        angular.forEach(_tokens, function (value, key) {
            $scope.model.tokens.push({"token": value, "value": value});
        }, null);

        if ($scope.model.tokens.length > 0) {
            $scope.model.showTokensForm = true;
        }
        else {
            $scope.executeTestCreate($scope.item.data.config.ownerId, angular.copy($scope.item.data.config.fields));
        }
    };


    $scope.replaceTokensCreate = function () {
        try {
            var ownerId = angular.copy($scope.item.data.config.ownerId);
            var fields = angular.toJson(angular.copy($scope.item.data.config.fields));
            var _tokenPattern = /\$\(([A-Z][\w_\.\[\]\d\@\{\}]+)\)/g;
            angular.forEach($scope.model.tokens, function (value, key) {
                var _tokens = (value.value.match(_tokenPattern))
                if (_tokens) {
                    throw new Error("Please replace all tokens: " + value.value);
                }
                var regex = new RegExp(value.token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
                fields = fields.replace(regex, value.value);
                ownerId = ownerId.replace(regex, value.value);
            }, null);
            $scope.model.showTokensForm = false;
            $scope.executeTestCreate(ownerId, angular.fromJson(fields));
        } catch (error) {
            Notification.warning(error);
        }
    };

    $scope.executeTestCreate = function (ownerId, fields) {
        try {
            DataService.testCreate($scope.buildCreateObject(ownerId, fields)).then(function (result) {
                result.message = 'Your Create Test was successful.';
                Notification.success(result.message);
            }, function (error) {
                Notification.error(error);
            }).finally(function () {
                //$scope.processing = null;
            });
        } catch (error) {
            Notification.error({"message": "Your Create Test failed: " + error.message});
        }
    };


    $scope.buildCreateObject = function (ownerId, fields) {
        var vfRemoteVar = {};
        vfRemoteVar.sobjectType = $scope.item.data.config.sObject;
        if (ownerId) {
            vfRemoteVar.ownerId = ownerId;
        }
        angular.forEach(fields, function (field, key) {
            switch(field.type) {
                case 'date' :
                    var dateObject = moment(new Date(field.value));
                    if (field.value != dateObject.format("YYYY-MM-DD")) {
                        throw new Error("Invalid Date: " + field.value + '. Correct format is: YYYY-MM-DD.');
                    }
                    vfRemoteVar[field.name] = dateObject.valueOf();
                    break;
                default: vfRemoteVar[field.name] = field.value;
            }
        }, null);
        return vfRemoteVar;
    };

    $scope.changeFieldType = function (field) {
        var sObjectField = $filter('filter')($scope.model.sObjectFields, {name: field.name}, true)[0];
        field.type = sObjectField.type;
        if (sObjectField.type == 'picklist') {
            field.picklistValues = sObjectField.picklistValues;
        } else {
            field.picklistValues = [];
        }
    };


    $scope.setTriggerFromConfig = function () {
        $scope.model.triggerOptionsStore = {
            "RECORD_CREATED": false,
            "SF_ERROR": false
        };

        angular.forEach($scope.item.data.config.trigger, function (value, key) {
            if ($scope.model.triggerOptionsStore.hasOwnProperty(value)) {
                $scope.model.triggerOptionsStore[value] = true;
            }
        }, null);
    };


    $scope.updateTrigger = function () {

        $scope.item.data.config.trigger = [];

        angular.forEach($scope.model.triggerOptionsStore, function (value, key) {
            if (value) {
                $scope.item.data.config.trigger.push(key);
            }
        }, null);

        if ($scope.item.data.config.trigger.length > 0) {
            $scope.item.data.outputConnectorsAllowed = true;
        } else {
            $scope.item.data.outputConnectorsAllowed = false;
            if ($scope.item.connected) {
                $scope.viewModel.deleteItemConnection($scope.node, $scope.item);
            }
        }

        $scope.updateScript();
    };


    //get Settings
    $scope.getAPISettings = function () {
        DataService.getAPISettings(null).then(function (result) {
            $scope.model.settings = result[0];
            $scope.item.data.config.connectorId = $scope.model.settings.ConnectorId__c;
            $scope.item.data.config.devOrgId = $scope.model.settings.DevOrgId__c;
            $scope.item.data.variables.notifyEmailAddress = $scope.model.settings.NotifyEmailAddress__c;

            $scope.updateScript();
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });

    };

    //get sObjects
    $scope.getSObjects = function () {
        DataService.getSObjects(null).then(function (result) {
            $scope.model.sObjects = $filter('notOwnObject')(result);
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });

    };


    //get sObject Fields
    $scope.getSObjectFields = function () {
        DataService.getSObjectFields($scope.item.data.config.sObject).then(function (result) {
            $scope.model.sObjectFields = result;
            $scope.buildCreateFields();
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });

    };


    $scope.sObjectChange = function () {
        $scope.getSObjectFields();
    };


    $scope.buildCreateFields = function () {

        $scope.item.data.config.fields = $filter('inArray')($scope.item.data.config.fields, $filter('filter')($scope.model.sObjectFields, {createable: true}), 'name') || [];

        $scope.model.storeRequiredFields = [];

        //add required fields
        angular.forEach($filter('filter')($scope.model.sObjectFields, {
                createable: true,
                nillable: false,
                defaultedOnCreate: false
            }) || [], function (value, key) {

            var addField = true;

            if ($scope.item.data.config.sObject == 'Lead' && value.name == 'IsConverted') {
                addField = false;
            }
            if (value.name == 'OwnerId') {
                addField = false;
            }

            if (addField) {
                $scope.model.storeRequiredFields.push({"name": value.name, "value": value.defaultValue, "type": value.type, "picklistValues": value.picklistValues});
            }
        });

        angular.forEach($scope.model.storeRequiredFields, function (value, key) {
            var existingField = $filter('filter')($scope.item.data.config.fields, {name: value.name}, true) || [];
            if (existingField.length > 0) {
                existingField[0].required = true;
            } else {
                value.required = true;
                $scope.item.data.config.fields.push(value);
            }
        });
    };

    $scope.addStoreRow = function () {
        var newField = $scope.buildNewStoreField();
        if (newField) {
            $scope.item.data.config.fields.push($scope.buildNewStoreField());
            $scope.updateScript();
        }
    };

    $scope.buildNewStoreField = function () {
        //find a field not already selected
        var availableFields = $filter('notInArray')($filter('filter')($scope.model.sObjectFields, {createable: true}), $scope.item.data.config.fields, 'name') || [];
        if (availableFields.length > 0) {
            var field = {
                "name": availableFields[0].name,
                "value": "",
                "type": availableFields[0].type,
                "picklistValues": availableFields[0].picklistValues
            };
            return field;
        } else {
            Notification.error('No more available fields.');
            return null;
        }
    };


    $scope.updateScript = function () {
        var config = {};
        config.connectorId = $scope.item.data.config.connectorId;
        config.sObject = $scope.item.data.config.sObject;
        config.fields = $scope.cleanFields($scope.item.data.config.fields);
        config.ownerId = $scope.item.data.config.ownerId;
        config.resultSet = $scope.item.data.config.resultSet;
        config.trigger = $scope.item.data.config.trigger;

        angular.forEach(config.fields, function (value, key) {
            if (value.hasOwnProperty('required')) {
                delete value.required;
            }
        });

        config.namespacePrefix = VISUALFORCE.hasOwnProperty('namespacePrefix') ? VISUALFORCE.namespacePrefix.replace('.','') : '';
        config.policyType = $scope.item.data.type;

        var script = "local jsonData = [[\r";
        script += angular.toJson(config);
        script += "\r]]\r\rlocal loaded_chunk = assert(loadfile('local://" + $scope.item.data.config.devOrgId + "/CreateSalesForceCPBXV1'))\rloaded_chunk()\rres = execute(jsonData)\rreturn res\r\r\r";

        $scope.item.data.variables.script = script;
    };

    $scope.cleanFields = function (fields) {
        var fields = angular.copy(fields);
        angular.forEach(fields, function (field, key) {
            delete field.type;
            delete field.picklistValues;
        });
        return fields;
    };

    if ($scope.item.data.config.connectorId == null) {
        $scope.getAPISettings();
    };

    //now get the sObjects
    $scope.getSObjects();


}]);
//SF CREATE END


//SF UPDATE START
controllers.controller('SalesforceUpdate', ['$scope', '$filter', 'DataService', 'Notification', 'VISUALFORCE', function ($scope, $filter, DataService, Notification, VISUALFORCE) {

    $scope.$watch('item', function (newValue, oldValue) {
        if (newValue && oldValue && (newValue.data.configCustom == 'ModConnector_SFUpdate')) {
            $scope.getSObjectFields();
            $scope.setTriggerFromConfig();
        }
    });

    $scope.model = {};

    //$scope.model.dataConnectors = [];
    $scope.model.sObjects = [];
    $scope.model.sObjectFields = [];


    $scope.model.booleanOptions = [
        "true",
        "false"
    ];


    $scope.testUpdate = function () {
        $scope.checkTokensUpdate();
    };


    $scope.checkTokensUpdate = function () {
        $scope.model.tokens = [];
        var fields = angular.toJson(angular.copy($scope.item.data.config.fields));

        var _tokenPattern = /\$\(([A-Z][\w_\.\[\]\d\@\{\}]+)\)/g;
        //add tokens from fields
        var _tokens = fields.match(_tokenPattern);

        //add token from recordId
        if ($scope.item.data.config.recordId) {
            var _tokensRecordId = $scope.item.data.config.recordId.match(_tokenPattern);
            if (_tokensRecordId) {
                if (_tokens) {
                    _tokens = _tokensRecordId.concat(_tokens);
                } else {
                    _tokens = _tokensRecordId;
                }
            }
        }

        var _tokens = $filter('unique')(_tokens);

        angular.forEach(_tokens, function (value, key) {
            $scope.model.tokens.push({"token": value, "value": value});
        }, null);

        if ($scope.model.tokens.length > 0) {
            $scope.model.showTokensForm = true;
        } else {
            $scope.executeTestUpdate($scope.item.data.config.recordId, angular.copy($scope.item.data.config.fields));
        }
    };

    $scope.replaceTokensUpdate = function () {
        try {
            var recordId = angular.copy($scope.item.data.config.recordId);
            var fields = angular.toJson(angular.copy($scope.item.data.config.fields));
            var _tokenPattern = /\$\(([A-Z][\w_\.\[\]\d\@\{\}]+)\)/g;
            angular.forEach($scope.model.tokens, function (value, key) {
                var _tokens = (value.value.match(_tokenPattern))
                if (_tokens) {
                    throw new Error("Please replace all tokens: " + value.value);
                }
                var regex = new RegExp(value.token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
                fields = fields.replace(regex, value.value);
                recordId = recordId.replace(regex, value.value);
            }, null);
            $scope.model.showTokensForm = false;
            $scope.executeTestUpdate(recordId, angular.fromJson(fields));
        } catch (error) {
            Notification.warning(error);
        }
    };


    $scope.executeTestUpdate = function (recordId, fields) {
        try {
            DataService.testUpdate($scope.buildUpdateObject(recordId, fields)).then(function (result) {
                result.message = 'Your Store Test was successful.';
                Notification.success(result.message);
            }, function (error) {
                Notification.error(error);
            }).finally(function () {
                //$scope.processing = null;
            });
        } catch (error) {
            Notification.error({"message": "Your Store Test failed: " + error.message});
            $scope.model.saving = false;
        }
    };


    $scope.buildUpdateObject = function (recordId, fields) {
        var vfRemoteVar = {};
        vfRemoteVar.sobjectType = $scope.item.data.config.sObject;
        vfRemoteVar.Id = recordId;
        angular.forEach(fields, function (field, key) {
            switch(field.type) {
                case 'date' :
                    var dateObject = moment(new Date(field.value));
                    if (field.value != dateObject.format("YYYY-MM-DD")) {
                        throw new Error("Invalid Date: " + field.value + '. Correct format is: YYYY-MM-DD.');
                    }
                    vfRemoteVar[field.name] = dateObject.valueOf();
                    break;
                default: vfRemoteVar[field.name] = field.value;;
            }
        }, null);
        return vfRemoteVar;
    };

    $scope.changeFieldType = function (field) {
        var sObjectField = $filter('filter')($scope.model.sObjectFields, {name: field.name}, true)[0];
        field.type = sObjectField.type;
        if (sObjectField.type == 'picklist') {
            field.picklistValues = sObjectField.picklistValues;
        } else {
            field.picklistValues = [];
        }
    };

    $scope.setTriggerFromConfig = function () {
        $scope.model.triggerOptionsStore = {
            "RECORD_CREATED": false,
            "SF_ERROR": false
        };

        angular.forEach($scope.item.data.config.trigger, function (value, key) {
            if ($scope.model.triggerOptionsStore.hasOwnProperty(value)) {
                $scope.model.triggerOptionsStore[value] = true;
            }
        }, null);
    };


    $scope.updateTrigger = function () {

        $scope.item.data.config.trigger = [];

        angular.forEach($scope.model.triggerOptionsStore, function (value, key) {
            if (value) {
                $scope.item.data.config.trigger.push(key);
            }
        }, null);

        if ($scope.item.data.config.trigger.length > 0) {
            $scope.item.data.outputConnectorsAllowed = true;
        } else {
            $scope.item.data.outputConnectorsAllowed = false;
            if ($scope.item.connected) {
                $scope.viewModel.deleteItemConnection($scope.node, $scope.item);
            }
        }

        $scope.updateScript();
    };


    //get Settings
    $scope.getAPISettings = function () {
        DataService.getAPISettings(null).then(function (result) {
            $scope.model.settings = result[0];
            $scope.item.data.config.connectorId = $scope.model.settings.ConnectorId__c;
            $scope.item.data.config.devOrgId = $scope.model.settings.DevOrgId__c;
            $scope.item.data.variables.notifyEmailAddress = $scope.model.settings.NotifyEmailAddress__c;

            $scope.updateScript();
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });

    };

    //get sObjects
    $scope.getSObjects = function () {
        DataService.getSObjects(null).then(function (result) {
            $scope.model.sObjects = $filter('notOwnObject')(result);
            //$scope.getSObjectFields();
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });

    };


    //get sObject Fields
    $scope.getSObjectFields = function () {
        DataService.getSObjectFields($scope.item.data.config.sObject).then(function (result) {
            $scope.model.sObjectFields = result;
            $scope.buildUpdateFields();
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });

    };


    $scope.sObjectChange = function () {
        $scope.getSObjectFields();
    };


    $scope.buildUpdateFields = function () {

        $scope.item.data.config.fields = $filter('inArray')($scope.item.data.config.fields, $filter('filter')($scope.model.sObjectFields, {updateable: true}), 'name') || [];

        if ($scope.item.data.config.fields.length == 0) {
            $scope.addStoreRow();
        }
    };

    $scope.addStoreRow = function () {
        var newField = $scope.buildNewStoreField();
        if (newField) {
            $scope.item.data.config.fields.push($scope.buildNewStoreField());
            $scope.updateScript();
        }
    };

    $scope.buildNewStoreField = function () {
        //find a field not already selected
        var availableFields = $filter('notInArray')($filter('filter')($scope.model.sObjectFields, {updateable: true}), $scope.item.data.config.fields, 'name') || [];
        if (availableFields.length > 0) {
            var field = {
                "name": availableFields[0].name,
                "value": "",
                "type": availableFields[0].type,
                "picklistValues": availableFields[0].picklistValues
            };
            return field;
        } else {
            Notification.error('No more available fields.');
            return null;
        }


    };

    $scope.updateScript = function () {


        var config = {};
        config.connectorId = $scope.item.data.config.connectorId;
        config.sObject = $scope.item.data.config.sObject;
        config.fields = $scope.cleanFields($scope.item.data.config.fields);
        config.recordId = $scope.item.data.config.recordId;
        config.resultSet = $scope.item.data.config.resultSet;
        config.trigger = $scope.item.data.config.trigger;

        config.namespacePrefix = VISUALFORCE.hasOwnProperty('namespacePrefix') ? VISUALFORCE.namespacePrefix.replace('.','') : '';
        config.policyType = $scope.item.data.type;

        var script = "local jsonData = [[\r";
        script += angular.toJson(config);
        script += "\r]]\r\rlocal loaded_chunk = assert(loadfile('local://" + $scope.item.data.config.devOrgId + "/UpdateSalesForceCPBXV1'))\rloaded_chunk()\rres = execute(jsonData)\rreturn res\r\r\r";

        $scope.item.data.variables.script = script;
    };

    $scope.cleanFields = function (fields) {
        var fields = angular.copy(fields);
        angular.forEach(fields, function (field, key) {
            delete field.type;
            delete field.picklistValues;
        });
        return fields;
    };

    if ($scope.item.data.config.connectorId == null) {
        $scope.getAPISettings();
    };

    //now get the sObjects
    $scope.getSObjects();

}]);
//SF UPDATE END

//ModConnect START
controllers.controller('ModConnectController', ['$scope', '$filter', 'DataService', 'Notification', '$q', function ($scope, $filter, DataService, Notification, $q) {

    $scope.model = {};
    $scope.model.selectedTab = 'connect';

    $scope.$watchCollection('viewModel.data.connections', function (newValue, oldValue) {
        $scope.findStarts();
    });

    $scope.$watch('item', function (newValue, oldValue) {
        if (newValue && oldValue && (newValue.data.configCustom == 'ModConnect_ModDevelop_Script' || newValue.data.configCustom == 'ModConnect_FollowMe_ModDevelop_Script')) {
            $scope.setTriggerFromConfig();
        }
    });

    //object to hold find start checked nodes in order to avoid recursion when nodes outputs returns to previous checked nodes
    $scope.findStartCheckedNodes = {};

    $scope.findStarts = function () {
        $scope.model.starts = {};
        $scope.model.starts.public = false;
        $scope.model.starts.ddi = false;
        $scope.model.starts.extension = false;
        $scope.model.starts.outbound = false;
        $scope.model.starts.default = false;

        angular.forEach($scope.viewModel.nodes, function (value, key) {
            if (value.data.templateId == 3) $scope.findNodeStart('public', value, true);
            if (value.data.templateId == 38) $scope.findNodeStart('ddi', value, true);
            if (value.data.templateId == 31 || value.data.templateId == 3100000) $scope.findNodeStart('extension', value, true);
            if (value.data.templateId == 39) $scope.findNodeStart('outbound', value, true);
            if (value.data.templateId == 2) $scope.findNodeStart('fromPolicy', value, true);
        });
    };

    $scope.enableAllStarts = function () {
        angular.forEach($scope.model.starts, function (value, key) {
            $scope.model.starts[key] = true;
        });
    };

    $scope.findNodeStart = function (item, node, reset) {
        if (reset) {
            $scope.findStartCheckedNodes[item] = {};
        }
        $scope.findStartCheckedNodes[item][node.data.id] = true;

        //check node connected to
        if (node.data.hasOwnProperty('connectedTo') && node.data.connectedTo != 'finish') {
            if (node.data.connectedTo == $scope.node.data.id) {
                $scope.model.starts[item] = true;
                if (item == 'fromPolicy') {
                    $scope.enableAllStarts();
                }
                return;
            } else {
                if (!$scope.findStartCheckedNodes[item].hasOwnProperty(node.data.connectedTo)) {
                    $scope.findNodeStart(item, $scope.viewModel.findNode(node.data.connectedTo));
                }
            }
        }
        //check children connected to
        if (node.outputs.length > 0) {
            angular.forEach(node.outputs, function (value, key) {
                if (value.data.hasOwnProperty('connectedTo') && value.data.connectedTo != 'finish') {
                    if (value.data.connectedTo == $scope.node.data.id) {
                        $scope.model.starts[item] = true;
                        if (item == 'fromPolicy') {
                            $scope.enableAllStarts();
                        }
                        return;
                    } else {
                        if (!$scope.findStartCheckedNodes[item].hasOwnProperty(value.data.connectedTo)) {
                            $scope.findNodeStart(item, $scope.viewModel.findNode(value.data.connectedTo));
                        }
                    }
                }
            }, null);
        }
    };

    //$scope.findStarts();


    //init special attributes
    $scope.init = function () {
        if (!$scope.item.data.connectId) {
            $scope.item.data.connectId = $scope.newId();
            $scope.item.data.connectParentId = $scope.newId();
            $scope.item.data.screenId = $scope.newId();
            $scope.item.data.screenParentId = $scope.newId();

            //set screen hook id
            $scope.item.data.config.screenHook = $scope.newId().replace(/-/g, '');

            //get API Settings
            DataService.getAPISettings(null).then(function (result) {
                $scope.model.settings = result[0];
                $scope.item.data.config.devOrgId = $scope.model.settings.DevOrgId__c;
                $scope.item.data.variables.notifyEmailAddress = $scope.model.settings.NotifyEmailAddress__c;
            }, function (error) {
                Notification.error(error);
            }).finally(function () {
                //$scope.processing = null;
            });


        }
    };

    $scope.init();
    
    $scope.model.ddiMethods = [
        "NUMBER",
        //remove divert for now
        //"DIVERT",
        "DDI_USER",
        "USER",
        "GROUP"
    ];
    $scope.model.publicMethods = [
        "NUMBER",
        "USER",
        "GROUP"
    ];
    $scope.model.outboundMethods = [
        "NUMBER",
        "REQUESTED",
        "GROUP"
    ];
    $scope.model.extensionMethods = [
        "NUMBER",
        "REQUESTED",
        "GROUP"
    ];
    $scope.model.defaultMethods = [
        "NUMBER",
        "GROUP"
    ];


    $scope.model.callWaitingOptions = [
        true,
        false
    ];
    $scope.model.hangupActionOptions = [
        "Hangup",
        "Voicemail"
    ];

    $scope.model.campEntryOptions = [
        "RING_TONE",
        "MUSIC"
    ];

    $scope.model.musicOptions = [
        "moh://default",
        "moh://classical",
        "moh://african",
        "moh://blues",
        "moh://disco",
        "moh://funky",
        "moh://jazz",
        "moh://modern"
    ];

    $scope.model.keyOptions = [
        {'label': 'No acknowledgement required', 'value': ''},
        {'label': '0', 'value': '0'},
        {'label': '1', 'value': '1'},
        {'label': '2', 'value': '2'},
        {'label': '3', 'value': '3'},
        {'label': '4', 'value': '4'},
        {'label': '5', 'value': '5'},
        {'label': '6', 'value': '6'},
        {'label': '7', 'value': '7'},
        {'label': '8', 'value': '8'},
        {'label': '9', 'value': '9'},
        {'label': '#', 'value': '#'},
        {'label': '*', 'value': '*'}
    ];

    $scope.model.transferAfterConnectRegex = '^[A-Za-z0-9-_ \\.\\!\\~\\*\'\\(\\)\\&\\=\\+\\$\\,\\;\\?\\/\\{\\}\\<\\>\\^\\%\\$\\£\\@\\#\\|]{0,1024}$';

    $scope.model.campKeyOptions = $scope.model.keyOptions.filter(function(item) {
        return item.value !== '';
    });

    $scope.getUsersPromise = function() {
        var deferred = $q.defer();
        if ($scope.model.users != null) {
            deferred.resolve($scope.model.users);
        } else {
            DataService.getUsers(null).then(function (result) {
                $scope.model.users = result;
                deferred.resolve($scope.model.users);
            }, function (error) {
                Notification.error(error);
            }).finally(function () {
                deferred.reject(error);
            });
        }
        return deferred.promise;
    };

    //get Groups
    $scope.getGroups = function () {
        DataService.getGroups(null).then(function (result) {
            $scope.model.groups = $filter('filter')(result, function (item) {
                if (item.PBX__c || item.Manager__c ) {
                    return true;
                }
                return false;
            });
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });

    };


    $scope.getAPISettings = function () {
        DataService.getAPISettings(null).then(function (result) {
            $scope.model.settings = result[0];
            $scope.item.data.variables.notifyEmailAddress = $scope.model.settings.NotifyEmailAddress__c;
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });

    };


    if ($scope.item.data.variables.notifyEmailAddress == null) {
        $scope.getAPISettings();
    };


    $scope.setTriggerFromConfig = function () {
        $scope.model.triggerOptions = {
            "CALL_CONNECTED": false,
            "CALL_NOT_CONNECTED": false,
            "CAMP_EXIT": false
        };

        angular.forEach($scope.item.data.config.trigger, function (value, key) {
            if ($scope.model.triggerOptions.hasOwnProperty(value)) {
                $scope.model.triggerOptions[value] = true;
            }
        }, null);
    };

    $scope.updateTrigger = function () {

        $scope.item.data.config.trigger = [];

        angular.forEach($scope.model.triggerOptions, function (value, key) {
            if (value) {
                $scope.item.data.config.trigger.push(key);
            }
        }, null);

        if ($scope.item.data.config.trigger.length > 0) {
            $scope.item.data.outputConnectorsAllowed = true;
        } else {
            $scope.item.data.outputConnectorsAllowed = false;
            if ($scope.item.connected) {
                $scope.viewModel.deleteItemConnection($scope.node, $scope.item);
            }
        }

    };

    $scope.handleTransferAfterConnectChange = function() {
        if ($scope.item.data.config.transferAfterConnect != null && $scope.item.data.config.transferAfterConnect != '') {
            $scope.item.data.config.hangupAfterBridge = false;
        }
    };

    $scope.getGroups();

    $scope.getLicenseOnce = function () {
        DataService.getLicenseCache().then(function (result) {
            $scope.model.license = result;
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };

    $scope.getLicenseOnce();

}]);
//ModConnect END



//ModConnect_FollowMe_ModDevelop_Script START
controllers.controller('ModConnectFollowMeController', ['$scope', '$filter', 'DataService', 'Notification', '$q', function ($scope, $filter, DataService, Notification, $q) {

    $scope.model = {};
    $scope.model.selectedTab = 'connect';

    $scope.$watch('item', function (newValue, oldValue) {
        if (newValue && oldValue && (newValue.data.configCustom == 'ModConnect_ModDevelop_Script' || newValue.data.configCustom == 'ModConnect_FollowMe_ModDevelop_Script')) {
            $scope.setTriggerFromConfig();
        }
    });

    $scope.$watch('model.selectedCallTarget.method', function (newValue, oldValue) {
        if (newValue && oldValue) $scope.handleMethodChange();
    });



    $scope.handleMethodChange = function () {
        switch ($scope.model.selectedCallTarget.method) {
            case 'NUMBER':
                //$scope.model.selectedCallTarget.target = null;
                break;
            case "USER":
                if ($scope.model.selectedCallTarget.target == null && $scope.model.users != null && $scope.model.users.length > 0) {
                    $scope.model.selectedCallTarget.target = $scope.model.users[0].Id__c;
                }
                break;
            case "GROUP":
                if ($scope.model.selectedCallTarget.target == null && $scope.model.groups.length > 0) {
                    $scope.model.selectedCallTarget.target = $scope.model.groups[0].Id__c;
                }
                break;
        }
    };




    $scope.model.methods = [
        {"value": "NUMBER", "name": "Number"},
        {"value": "USER", "name": "User"},
        {"value": "GROUP", "name": "Group"}
    ];


    $scope.model.callWaitingOptions = [
        true,
        false
    ];
    $scope.model.hangupActionOptions = [
        "Hangup",
        "Voicemail"
    ];

    $scope.model.campEntryOptions = [
        "RING_TONE",
        "MUSIC"
    ];

    $scope.model.musicOptions = [
        "moh://default",
        "moh://classical",
        "moh://african",
        "moh://blues",
        "moh://disco",
        "moh://funky",
        "moh://jazz",
        "moh://modern"
    ];

    $scope.model.keyOptions = [
        {'label': 'No acknowledgement required', 'value': ''},
        {'label': '0', 'value': '0'},
        {'label': '1', 'value': '1'},
        {'label': '2', 'value': '2'},
        {'label': '3', 'value': '3'},
        {'label': '4', 'value': '4'},
        {'label': '5', 'value': '5'},
        {'label': '6', 'value': '6'},
        {'label': '7', 'value': '7'},
        {'label': '8', 'value': '8'},
        {'label': '9', 'value': '9'},
        {'label': '#', 'value': '#'},
        {'label': '*', 'value': '*'}
    ];

    $scope.model.transferAfterConnectRegex = '^[A-Za-z0-9-_ \\.\\!\\~\\*\'\\(\\)\\&\\=\\+\\$\\,\\;\\?\\/\\{\\}\\<\\>\\^\\%\\$\\£\\@\\#\\|]{0,1024}$';

    $scope.model.campKeyOptions = $scope.model.keyOptions.filter(function (item) {
        return item.value !== '';
    });

    $scope.getAPISettings = function () {
        DataService.getAPISettings(null).then(function (result) {
            $scope.model.settings = result[0];
            $scope.item.data.variables.notifyEmailAddress = $scope.model.settings.NotifyEmailAddress__c;
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };


    if ($scope.item.data.variables.notifyEmailAddress == null) {
        $scope.getAPISettings();
    };


    $scope.setTriggerFromConfig = function () {
        $scope.model.triggerOptions = {
            "CALL_CONNECTED": false,
            "CALL_NOT_CONNECTED": false,
            "CAMP_EXIT": false
        };

        angular.forEach($scope.item.data.config.trigger, function (value, key) {
            if ($scope.model.triggerOptions.hasOwnProperty(value)) {
                $scope.model.triggerOptions[value] = true;
            }
        }, null);
    };

    $scope.updateTrigger = function () {

        $scope.item.data.config.trigger = [];

        angular.forEach($scope.model.triggerOptions, function (value, key) {
            if (value) {
                $scope.item.data.config.trigger.push(key);
            }
        }, null);

        if ($scope.item.data.config.trigger.length > 0) {
            $scope.item.data.outputConnectorsAllowed = true;
        } else {
            $scope.item.data.outputConnectorsAllowed = false;
            if ($scope.item.connected) {
                $scope.viewModel.deleteItemConnection($scope.node, $scope.item);
            }
        }

    };


    $scope.model.selectedCallTarget = null;

    $scope.initNewCallTarget = function () {
        $scope.model.selectedCallTarget = {
            "method": "NUMBER",
            "target": null,
            "start": 0,
            "connectTimeout": 30,
            "screen": false
        };

        $scope.model.mode = 'add';
        $scope.model.showCallTargetDialog = true;
    };

    $scope.editCallTarget = function (callTarget) {
        $scope.model.selectedCallTarget = callTarget;
        $scope.model.mode = 'edit';
        $scope.model.showCallTargetDialog = true;
    };

    $scope.addCallTarget = function () {
        $scope.item.data.config.followMe = $scope.item.data.config.followMe || [];
        $scope.item.data.config.followMe.push(angular.copy($scope.model.selectedCallTarget));
        $scope.model.showCallTargetDialog = false;
    };

    $scope.swapPriority = function (array, a, b) {
        try {
            array[a] = array.splice(b, 1, array[a])[0];
        } catch (error) {
            console.log(error);
        }
    };


    //get Groups
    $scope.model.groups = [];
    $scope.model.groupsMap = {};
    $scope.getGroups = function () {
        DataService.getGroups(null).then(function (result) {
            $scope.model.groups = $filter('filter')(result, function (item) {
                if (item.PBX__c || item.Manager__c ) {
                    return true;
                }
                return false;
            });
            angular.forEach(result, function (value, key) {
                $scope.model.groupsMap[value.Id__c] = (value.PBX__c || value.Manager__c) ? value.Name : '__ invalid Group __';
            }, null);
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };

    //get users
    $scope.model.usersMap = {};

    $scope.getUsersPromise = function() {
        var deferred = $q.defer();
        if ($scope.model.users != null) {
            deferred.resolve($scope.model.users);
        } else {
            DataService.getUsers(null).then(function (result) {
                $scope.model.users = $filter('filter')(result, function (item) {
                    if (item.PBX__c || item.Manager__c ) {
                        return true;
                    }
                    return false;
                });
                angular.forEach(result, function (value, key) {
                    $scope.model.usersMap[value.Id__c] = (value.PBX__c || value.Manager__c)  ? value.Name : '__ invalid User __';
                }, null);
                deferred.resolve($scope.model.users);
            }, function (error) {
                Notification.error(error);
            }).finally(function () {
                deferred.reject(error);
            });

        }
        return deferred.promise;
    };

    $scope.handleTransferAfterConnectChange = function() {
        if ($scope.item.data.config.transferAfterConnect != null && $scope.item.data.config.transferAfterConnect != '') {
            $scope.item.data.config.hangupAfterBridge = false;
        }
    };

    $scope.getGroups();


    $scope.getLicenseOnce = function () {
        DataService.getLicenseCache().then(function (result) {
            $scope.model.license = result;
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };


    $scope.getLicenseOnce();

    //init special attributes
    $scope.init = function () {
        if (!$scope.item.data.connectId) {
            $scope.item.data.connectId = $scope.newId();
            $scope.item.data.connectParentId = $scope.newId();
            $scope.item.data.screenId = $scope.newId();
            $scope.item.data.screenParentId = $scope.newId();

            //set screen hook id
            $scope.item.data.config.screenHook = $scope.newId().replace(/-/g, '');

            //get API Settings
            DataService.getAPISettings(null).then(function (result) {
                $scope.model.settings = result[0];
                $scope.item.data.config.devOrgId = $scope.model.settings.DevOrgId__c;
                $scope.item.data.variables.notifyEmailAddress = $scope.model.settings.NotifyEmailAddress__c;
            }, function (error) {
                Notification.error(error);
            }).finally(function () {
                //$scope.processing = null;
            });
        }
        if ($scope.item.data.config.followMe.length > 0) {
            //get users
            $scope.getUsersPromise();
        }
    };

    $scope.init();


}]);
//ModConnect_FollowMe_ModDevelop_Script END


//ModDevelopScript START
controllers.controller('ModDevelopScriptController', ['$scope', 'DataService', 'Notification', function ($scope, DataService, Notification) {

    $scope.model = {};
    $scope.model.showModalEditor = false;

    var reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var reMacro = /\$\([A-Z][A-Za-z0-9\.\[\]\@\_\-]+?\)/g;
    $scope.model.emailOrMacroRegex = reEmail;
    $scope.model.notifyEmailAddressInvalidMessage = 'Invalid format: Require Email Address.';

    $scope.model.initScript = '--';
    $scope.model.initScript += '\r\n-- connectorId: The Id of the Salesforce connector to be used with sf_query and sf_store methods';
    $scope.model.initScript += '\r\nlocal connectorId = #connectorId#';
    $scope.model.initScript += '\r\n\r\n-- nameSpacePrefix: The prefix used by AVS';
    $scope.model.initScript += '\r\nlocal nameSpacePrefix = \'nbavs\'';
    $scope.model.initScript += '\r\n\r\n-- User: #user#'
    $scope.model.initScript += '\r\n-- Date: #date#';
    $scope.model.initScript += '\r\n-- Time: #time#';
    $scope.model.initScript += '\r\n--';
    $scope.model.initScript += '\r\n\r\n--continue your script here';
    $scope.model.initScript += '\r\n\r\n\r\n';

    $scope.updateScriptDateTime = function () {
        var dateRegex = /\r\n-- Date: .*\r\n/;
        var timeRegex = /\r\n-- Time: .*\r\n/;
        $scope.model.initScript = $scope.model.initScript.replace(dateRegex, '\r\n-- Date: ' + moment().format('DD/MM/YYYY') + '\r\n');
        $scope.model.initScript = $scope.model.initScript.replace(timeRegex, '\r\n-- Time: ' + moment().format('HH:mm:ss') + '\r\n');
    };

    $scope.updateScriptDateTime();

    //init vars for new items
    if ($scope.item.data.variables.script == null) {
        $scope.item.data.variables.script = $scope.model.initScript;
        //get org settings
        DataService.getAPISettings(null).then(function (result) {
            $scope.model.settings = result[0];
            $scope.model.connectorId = $scope.model.settings.ConnectorId__c;
            $scope.model.devOrgId = $scope.model.settings.DevOrgId__c;
            $scope.model.notifyEmailAddress = $scope.model.settings.NotifyEmailAddress__c;

            DataService.getSFUser(null).then(function (result) {
                $scope.model.user = result[0];
                $scope.completeInitScript();
            }, function (error) {
                //Notification.error(error);
            }).finally(function () {
                $scope.completeInitScript();
            });

        }, function (error) {
            //Notification.error(error);
        }).finally(function () {
            $scope.completeInitScript();
        });
    }

    $scope.completeInitScript = function () {
        if ($scope.model.connectorId) $scope.item.data.variables.script = $scope.item.data.variables.script.replace("#connectorId#", $scope.model.connectorId);
        if ($scope.model.user) $scope.item.data.variables.script = $scope.item.data.variables.script.replace("#user#", $scope.model.user.Name);
    };


    //boot ace editor
    $scope.aceLoaded = function(_editor){
        // Editor part
        var _session = _editor.getSession();
        var _renderer = _editor.renderer;

        // Options
        _editor.setReadOnly(false);
        _session.setUndoManager(new ace.UndoManager());
        _renderer.setShowGutter(true);
        _editor.setTheme('ace/theme/eclipse');
        _session.setMode('ace/mode/lua');
        _session.setNewLineMode("windows");

        _editor.setOptions({
            enableSnippets: true,
            enableLiveAutocompletion: true,
            enableBasicAutocompletion: true,
            showPrintMargin: false,
            useSoftTabs: false,
            //fontSize: 12,
            showInvisibles: true,
            behavioursEnabled: true,
            tabSize: 4,
            wrap: false,
            useWorker: true,
            highlightActiveLine : true,
        });

        // Events
        //_editor.on("changeSession", function(){ console.log('change session') });
        //_session.on("change", function(){ console.log('change') });
        //fix notice scroll bug
        _editor.$blockScrolling = Infinity;


        //block top section

        var blockScriptHeader = function(startHi, endHi, startEdit, endEdit, disableEdit) {
            if (disableEdit) {
                var old$tryReplace = _editor.$tryReplace;
                _editor.$tryReplace = function (range, replacement) {
                    return intersects(range) ? null : old$tryReplace.apply(this, arguments);
                }
                var oldInsert = _session.insert;
                _session.insert = function (position, text) {
                    return oldInsert.apply(this, [position, outsideRange(position) ? text : ""]);
                }
                var oldRemove = _session.remove;
                _session.remove = function (range) {
                    return intersects(range) ? false : oldRemove.apply(this, arguments);
                }
                var oldMoveText = _session.moveText;
                _session.moveText = function (fromRange, toPosition, copy) {
                    if (intersects(fromRange) || !outsideRange(toPosition)) return fromRange;
                    return oldMoveText.apply(this, arguments)
                }
            }

            var Range = ace.require('ace/range').Range;

            var range = new Range(startEdit, 0, endEdit, 100);
            var rangeHighlight = new Range(startHi, 0, endHi, 100);

            var outsideRange = function (position) {
                var s0 = range.start;
                if (position.row < s0.row || (position.row == s0.row && position.column <= s0.column)) return true; // position must be before range.start
                var e0 = range.end;
                if (position.row > e0.row || (position.row == e0.row && position.column >= e0.column)) return true; // or after range.end
                return false;
            }
            var intersects = function (withRange) {
                var e = withRange.end, s0 = range.start, s = withRange.start, e0 = range.end;
                if (e.row < s0.row || (e.row == s0.row && e.column <= s0.column)) return false; // withRange.end must be before range.start
                if (s.row > e0.row || (s.row == e0.row && s.column >= e0.column)) return false; // or withRange.start must be after range.end
                return true;
            }

            _session.addMarker(rangeHighlight, "readonly-highlight");
            _editor.focus(); // To focus the ace editor

            setTimeout(function(){
                _editor.scrollToLine(14, true, true, function () {});
                _editor.gotoLine(14, 0, true);
            }, 1000);
        };

        blockScriptHeader(0, 11, 0, 6, true);

    };


}]);
//ModDevelop_Script END


controllers.controller('appCtrl', ['$scope', '$rootScope', '$http', '$route', '$routeParams', '$location', '$interval', '$filter', 'prompt', 'DataService', 'Notification', 'VISUALFORCE', function ($scope, $rootScope, $http, $route, $routeParams, $location, $interval, $filter, prompt, DataService, Notification, VISUALFORCE) {

    $scope.location = $location;
    $scope.referrer = document.referrer;
    $scope.model = {};

    //
    // Code for the delete key.
    //
    var deleteKeyCode = 46;

    //
    // Code for control key.
    //
    var ctrlKeyCode = 17;

    //
    // Set to true when the ctrl key is down.
    //
    var ctrlDown = false;

    //
    // Code for A key.
    //
    var aKeyCode = 65;

    //
    // Code for esc key.
    //
    var escKeyCode = 27;



    //mobile touch support
    $scope.onHammer = function (e) {
        if (event.type.match(/^touch/) && (event.target.tagName == 'rect' || event.target.tagName == 'text')) {
            switch (e.type) {
                case 'panstart':
                    $scope.model.initTranslateX = ($scope.chartViewModel.data.translateX || 0);
                    $scope.model.initTranslateY = ($scope.chartViewModel.data.translateY || 0);
                    break;
                case 'panmove':
                    //fix delayed panstart
                    if ($scope.model.initTranslateX === undefined) {
                        $scope.model.initTranslateX = ($scope.chartViewModel.data.translateX || 0);
                    }
                    if ($scope.model.initTranslateY === undefined) {
                        $scope.model.initTranslateY = ($scope.chartViewModel.data.translateY || 0);
                    }
                    $scope.chartViewModel.data.translateX = Math.min(0, $scope.model.initTranslateX + e.deltaX);
                    $scope.chartViewModel.data.translateY = Math.min(0, $scope.model.initTranslateY + e.deltaY);
                    break;
                case 'pinchin':
                    if ($scope.model.pinching !== true) $scope.zoomOut();
                    $scope.model.pinching = true;
                    break;
                case 'pinchout':
                    if ($scope.model.pinching !== true) $scope.zoomIn();
                    $scope.model.pinching = true;
                    break;
                case 'pinchend':
                    $scope.model.pinching = false;
            }
        }
    };


    //
    // Event handler for key-down on the flowchart.
    //
    $scope.keyDown = function (evt) {

        if (evt.keyCode === ctrlKeyCode) {

            ctrlDown = true;
            evt.stopPropagation();
            evt.preventDefault();
        }
    };

    //
    // Event handler for key-up on the flowchart.
    //
    $scope.keyUp = function (evt) {

        if (evt.keyCode === deleteKeyCode) {
            //
            // Delete key.
            //
            //$scope.chartViewModel.deleteSelected();
        }

        if (evt.keyCode == aKeyCode && ctrlDown) {
            //
            // Ctrl + A
            //
            $scope.chartViewModel.selectAll();
        }

        if (evt.keyCode == escKeyCode) {
            // Escape.
            //$scope.chartViewModel.deselectAll();
        }

        if (evt.keyCode === ctrlKeyCode) {
            ctrlDown = false;

            evt.stopPropagation();
            evt.preventDefault();
        }
    };




  $scope.policyTypeLocked = function () {
      //locked if saved remote
      if ($scope.chartViewModel.data && $scope.chartViewModel.data.remoteId) return true;
      //locked if more than one item
      if ($scope.chartViewModel.data.nodes && $scope.chartViewModel.data.nodes.length > 1) return true;
      //else unlocked
      return false;
  };


    $scope.chartOptionsDialog = false;
    //
    // Show chart options.
    //
    $scope.showChartOptionsDialog = function () {

        $scope.chartOptionsDialog = true;
        //deselect all to close the potential node editor
        if ($scope.chartViewModel) $scope.chartViewModel.deselectAll();
    };
    $scope.hideChartOptionsDialog = function () {

        $scope.chartOptionsDialog = false;
    };

    $scope.saveChartOptions = function () {
        if ($scope.chartViewModel && $scope.chartViewModel.data.type != null && $scope.chartViewModel.data.name != null) {
            $scope.hideChartOptionsDialog();
        } else {
            Notification.warning({'message':'Invalid Options.', delay: null});
        }
    };

    $scope.cancelNewChartOptions = function () {
        $location.path( "/list/" );
    };

    $scope.model.uploadedPolicy = null;
    $scope.model.importMode = 'clone';
    $scope.model.settings = null;

    $scope.model.policyImportOptions = [
        {'label': 'Clone', 'value': 'clone'},
        {'label': 'Exact copy', 'value': 'copy'}
    ];


    $scope.getAPISettings = function () {
        try {
            //get API Settings
            DataService.getAPISettings(null).then(function (result) {
                $scope.model.settings = result[0];
            }, function (error) {
                Notification.error(error);
            }).finally(function () {
                //$scope.processing = null;
            });
        } catch (error) {
        Notification.error({"message": "Cannot get API settings: " + error.message});
        }
    };

    //get Archiving Policies
    $scope.getArchivingPolicies = function () {
        DataService.getArchivingPolicies(null).then(function (result) {
            if (angular.isArray(result) && result.length > 0) {
                $scope.model.defaultArchivingPolicyId = result[0].id;
            } else {
                Notification.warning({"message": "Cannot get default archiving policy"});
            }
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };

    $scope.getSFUser = function () {
        DataService.getSFUser(null).then(function (result) {
            $scope.model.user = result[0];
        }, function (error) {
            Notification.warning({"message": "Cannot get default user"});
        }).finally(function () {
           //nothing
        });
    };

    $scope.checkRecordAccess = function (id) {
        DataService.checkRecordAccess(id).then(function (result) {
            $scope.model.recordAccess = result;
        }, function (error) {
            Notification.warning({"message": "Cannot define record access level"});
        }).finally(function () {
           //nothing
        });
    };
    
    $scope.checkCreateNewPolicyAccess = function (id) {
        DataService.checkCreateNewPolicyAccess(id).then(function (result) {
        	$scope.model.createPolicyAccess = result;
        	console.log(result);
        }, function (error) {
            Notification.warning({"message": "Cannot define record access level"});
        }).finally(function () {
           //nothing
        });
    };
    
    $scope.exportPolicy = function (encrypted) {
        Notification.clearAll();
        try {
            $scope.exportFile($scope.chartViewModel.data.name + ".txt", JSON.stringify($scope.chartViewModel.data), encrypted);
        } catch (error) {
            Notification.error({"message": "Cannot export policy: " + error.message});
        }
    };

    $scope.exportFile = function (fileName, body, encrypted, type) {
        try {
            encrypted = encrypted === false ? false : true;
            type = type || "text/plain;charset=utf-8";
            if (encrypted) {
                DataService.encryptPolicy(body).then(function (result) {
                    var blob = new Blob([result], {type: type});
                    saveAs(blob, fileName);
                }, function (error) {
                    Notification.error({"message": "Cannot encrypt policy: " + error.message});
                }).finally(function () {
                    //$scope.processing = null;
                });
            } else {
                var blob = new Blob([body], {type: type});
                saveAs(blob, fileName);
            }
        } catch (error) {
            Notification.error({"message": "Cannot export file: " + error.message});
        }
    };

    $scope.uploadPolicyFile = function (event, encrypted) {
        encrypted = encrypted === false ? false : true;
        if ($scope.model.settings == null) {
            $scope.getSFUser();
            $scope.getArchivingPolicies();
            $scope.getAPISettings();
        }
        Notification.clearAll();
        try {
            var input = event.target;
            var reader = new FileReader();
            reader.onload = function () {
                try {
                    if (encrypted) {
                        DataService.decryptPolicy(reader.result).then(function (result) {
                            try {
                                if (result == null) {
                                    throw new Error('Decryption failed.');
                                }
                                $scope.model.uploadedPolicy = JSON.parse(result);
                                if ($scope.model.uploadedPolicy == null) {
                                    throw new Error('Bad policy structure.');
                                }
                            } catch (error) {
                                Notification.error({"message": "Invalid policy data: " + error.message});
                            }
                        }, function (error) {
                            Notification.error({"message": "Cannot decrypt policy: " + error.message});
                        }).finally(function () {
                            //$scope.processing = null;
                        });
                    } else {
                        $scope.model.uploadedPolicy = JSON.parse(reader.result);
                        if ($scope.model.uploadedPolicy == null) {
                            throw new Error('Bad policy structure.');
                        }
                    }
                } catch (error) {
                    Notification.error({"message": "Cannot import policy: " + error.message});
                }
            };
            reader.readAsText(input.files[0]);
        } catch (error) {
            Notification.error({"message": "Cannot upload policy: " + error.message});
        }
    };


    $scope.importPolicy = function () {
        Notification.clearAll();
        try {
            var dataModel = $scope.model.uploadedPolicy;
            if (dataModel == null) {
                throw new Error('Bad policy structure.');
            }
            switch ($scope.model.importMode) {
                case 'copy':
                    //dataModel.id = null;
                    break;
                case 'clone':
                    dataModel = $scope.cloneDataModel(dataModel);
                    break;
            }
            $scope.chartViewModel = new flowchart.ChartViewModel(dataModel);

        } catch (error) {
            Notification.error({"message": "Cannot import policy: " + error.message});
        }
    };

    $scope.pushToCloneReport = function (item) {
        if ($scope.cloneReport.indexOf(item) == -1) {
            $scope.cloneReport.push(item);
        }
    };

    $scope.cloneDataModel = function (dataModel) {

        $scope.cloneReport = [];

        var clonedPolicy = JSON.stringify(dataModel);
        var uuidList = clonedPolicy.match(new RegExp('[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}', 'gi'));
        var screenHookList = clonedPolicy.match(new RegExp('[0-9a-fA-F]{8}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{12}', 'gi'));
        var macroList = clonedPolicy.match(/\$\(([A-Z][\w_\.\[\]\d\@\{\}]+)\)/gi);
        var soundTagList = clonedPolicy.match(new RegExp('{[A-Z][a-z0-9]+}', 'gi'));

        angular.forEach(uuidList, function (value, key) {
            clonedPolicy = clonedPolicy.replace(new RegExp(value, 'g' ), $scope.newId());
        }, null);

        angular.forEach(screenHookList, function (value, key) {
            clonedPolicy = clonedPolicy.replace(new RegExp(value, 'g' ), $scope.newId().replace(/-/g, ''));
        }, null);

        angular.forEach(macroList, function (value, key) {
            $scope.pushToCloneReport('Policy is using Macro: ' + value);
        }, null);

        angular.forEach(soundTagList, function (value, key) {
            $scope.pushToCloneReport('Policy is using Sound Tag: ' + value);
        }, null);


        //replace connectorId
        var connectorId = $scope.model.settings.ConnectorId__c;
        clonedPolicy = clonedPolicy.replace(new RegExp('connectorId = (\\d+)', 'gi'), 'connectorId = ' + connectorId);
        clonedPolicy = clonedPolicy.replace(new RegExp('connectorId":(\\d+)', 'gi'), 'connectorId":' + connectorId);
        clonedPolicy = clonedPolicy.replace(new RegExp('connectorId\\\\":(\\d+)', 'gi'), 'connectorId\\":' + connectorId);
        //replace devOrgId
        var devOrgId = $scope.model.settings.DevOrgId__c;
        clonedPolicy = clonedPolicy.replace(new RegExp('devOrgId":(\\d+)', 'gi'), 'devOrgId":' + devOrgId);
        //replace archivePolicyId
        var archivePolicyId = $scope.model.defaultArchivingPolicyId;
        if (archivePolicyId == null) {
            archivePolicyId = 'null';
        }
        clonedPolicy = clonedPolicy.replace(new RegExp('archivePolicyId":null', 'gi'), 'archivePolicyId":' + archivePolicyId);
        clonedPolicy = clonedPolicy.replace(new RegExp('archivePolicyId":(\\d+)', 'gi'), 'archivePolicyId":' + archivePolicyId);
        //replace notifyEmailAddress
        var notifyEmailAddress =  $scope.model.settings.NotifyEmailAddress__c;
        clonedPolicy = clonedPolicy.replace(new RegExp('"notifyEmailAddress":"([^"]+)"', 'gi'), '"notifyEmailAddress":"' + notifyEmailAddress + '"');

        if (clonedPolicy.indexOf('"script":"--')!= -1) {
            //replace script User
            if ($scope.model.user == null) {
                $scope.model.user = {'Name': 'Default'};
            }
            var scriptUser = $scope.model.user.Name;
            clonedPolicy = clonedPolicy.replace(new RegExp('-- User: ([^\\\\]+)\\\\r', 'gi'), '-- User: ' + scriptUser + '\\r');
            //replace script Date / Time
            var scriptDate = moment().format('DD/MM/YYYY');
            var scriptTime = moment().format('HH:mm:ss');
            clonedPolicy = clonedPolicy.replace(new RegExp('-- Date: ([^\\\\]+)\\\\r', 'gi'), '-- Date: ' + scriptDate + '\\r');
            clonedPolicy = clonedPolicy.replace(new RegExp('-- Time: ([^\\\\]+)\\\\r', 'gi'), '-- Date: ' + scriptTime + '\\r');
        }

        dataModel = JSON.parse(clonedPolicy);
        //clean dataModel
        angular.forEach(dataModel.nodes, function (node, key) {
            switch (node.templateClass) {
                case 'ModNumber'://remove public numbers
                    if (node.hasOwnProperty('subItems')) {
                        angular.forEach(node.subItems, function (item, key) {
                            $scope.pushToCloneReport('Removed Public Number: ' + item.name + ' / ' + item.variables.publicNumber);
                        }, null);
                        node.subItems = [];
                    }
                    break;
                case 'ModPolicy': //remove linked policies
                case 'ModPolicyNC':
                    angular.forEach(node.outputs, function (item, key) {
                        $scope.pushToCloneReport('Removed Linked Policy: ' + item.name);
                    }, null);
                    node.outputs = [];
                    break;
                default: //dive into subItems
                    angular.forEach(node.outputs, function (element, key) {
                        switch (element.templateClass) {
                            case 'ModConnect':
                                angular.forEach(element.config.connectAction, function (item, key) {
                                    if (item.method == 'USER') {
                                        $scope.pushToCloneReport('Component: ' + node.name + ' -> Element: ' + element.name +  ' has reference to User Id: ' + item.target);
                                    } else if (item.method == 'GROUP') {
                                        $scope.pushToCloneReport('Component: ' + node.name + ' -> Element: ' + element.name +  ' has reference to Group Id: ' + item.target);
                                    }
                                }, null);
                                break;
                            case 'ModConnect_FollowMe':
                                angular.forEach(element.config.followMe, function (item, key) {
                                    if (item.method == 'USER') {
                                        $scope.pushToCloneReport('Component: ' + node.name + ' -> Element: ' + element.name +  ' has reference to User Id: ' + item.target);
                                    } else if (item.method == 'GROUP') {
                                        $scope.pushToCloneReport('Component: ' + node.name + ' -> Element: ' + element.name +  ' has reference to Group Id: ' + item.target);
                                    }
                                }, null);
                                break;
                            case 'ModConnect_Queue':
                                angular.forEach(element.variables.ringTargets, function (item, key) {
                                    $scope.pushToCloneReport('Component: ' + node.name + ' -> Element: ' + element.name +  ' has reference to Group Id: ' + item.groupId);
                                }, null);
                                angular.forEach(element.variables.announcements, function (item, key) {
                                    $scope.pushToCloneReport('Component: ' + node.name + ' -> Element: ' + element.name +  ' has reference to Sound Id: ' + item.soundId);
                                }, null);
                                if (element.hasOwnProperty('configScreen') && element.configScreen.hasOwnProperty('announcement') && element.configScreen.announcement != null && element.configScreen.announcement.indexOf('{') != -1) {
                                    $scope.pushToCloneReport('Component: ' + node.name + ' -> Element: ' + element.name +  ' might have a reference to a Sound Tag: ' + element.configScreen.announcement);
                                }
                        }

                    }, null);
            }
        }, null);

        //reset ids
        dataModel.id = null;
        dataModel.remoteId = null;

        if ($scope.cloneReport.length > 0) {
            var reportMessage = $scope.cloneReport.sort(function (a, b) {
                return a < b ? -1 : 1
            }).join('\n');
            Notification.warning({message: reportMessage, delay: 100000});
            //export log to file
            $scope.exportFile(dataModel.name + ' Policy import log.txt', reportMessage, false);
        }

        return dataModel;
    };


    $scope.newId = function () {

        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    //
    // Delete selected nodes and connections.
    //
    $scope.deleteSelected = function () {

        $scope.chartViewModel.deleteSelected();
        $scope.chartViewModel.updateConnectionsViewModel();
    };



    $scope.model.listOrderBy = null;
    $scope.model.listOrderReverse = false;

    $scope.toggleSortList = function (property) {
        $scope.model.listOrderBy = property;
        $scope.model.listOrderReverse = !$scope.model.listOrderReverse;
    };

    $scope.model.showReturnButton = (VISUALFORCE.hasOwnProperty('userUITheme') && VISUALFORCE.userUITheme.startsWith('Theme3')) ? true : false;

    $scope.model.callFlows = [];

    $scope.model.policyTypeOptions = [
        {"label":"Call", "value": {"advanced": "POLICY_TYPE_CALL", "basic": "CALL"}},
        {"label":"Data Analytics", "value": {"advanced": "POLICY_TYPE_DATA_ANALYTICS", "basic": "NON_CALL"}},
    ];

    //init zoom
    $scope.zoomIn = function () {
        $scope.chartViewModel.data.zoom = Math.min(4, ($scope.chartViewModel.data.zoom || 1 ) + 0.2);
    };


    $scope.zoomOut = function () {
        $scope.chartViewModel.data.zoom = Math.max(0.2, ($scope.chartViewModel.data.zoom || 1 ) - 0.2);
    };


    $scope.zoom = function () {

        $scope.chartViewModel.data.zoom = 1;
    };

    $scope.backTo = function () {
        if ($scope.referrer && $scope.referrer.indexOf('login') == -1) {
            window.location = $scope.referrer;
        } else {
            window.location = '/';
        }
    };

    $scope.getCallFlows = function () {
        DataService.getCallFlows().then(function (result) {
            $scope.model.callFlows = result;
            $scope.checkCreateNewPolicyAccess(null);
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };

    $scope.loadDetail = function (id) {
        $location.path('/detail/').search({id: id});
        // $route.updateParams({id: id});
    };

    $scope.loadList = function () {
        switch ($location.path()) {
            case '/list/': $route.reload(); break;
            default: $location.path('/list/').search({});
        }
    };

    $scope.newCallFlow = function () {
        if (!$scope.checkLicense('global')) {
            Notification.warning({'message':"Cannot create new Policy: " + $filter('translate')('POLICY_NO_GLOBAL_LICENSE'), delay: null});
        } else {
            $location.path('/detail/').search({});
        }
    };

    $scope.cleanSounds = function (item) {
        let prop;
        for(prop in item) {
            if (item.hasOwnProperty(prop)) {
                if (prop === 'sounds') {
                    console.log('found sounds: deleting')
                    delete item[prop];
                }
                else if (typeof item[prop] === 'object')
                    $scope.cleanSounds(item[prop]);
            }
        }
    }

    $scope.loadCallFlow = function (id) {
        DataService.getCallFlow(id).then(function (result) {
            try {
                var chart = JSON.parse(result[0].Body__c);
                $scope.cleanSounds(chart);
                chart.id = result[0].Id;
                //chart.type = result[0].Type__c;
                chart.remoteId = result[0].Id__c;
                chart.lastModifiedDate = result[0].LastModifiedDate;
                $scope.chartViewModel = new flowchart.ChartViewModel(chart);
                $scope.checkRecordAccess(id);
            } catch (error) {
                Notification.error(error);
            }
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };

    $scope.model.confirmDelete = [];
    $scope.model.deleting = [];

    $scope.checkCanDeleteCallFlow = function (item) {
        if ((item.hasOwnProperty('Source__c') && item.Source__c == 'SYSTEM') || (item.hasOwnProperty('source') && item.source == 'SYSTEM')) {
            Notification.warning({'message':'Cannot delete System Policy.'});
        } else {
            if (item.hasOwnProperty('Id')) {
                $scope.model.confirmDelete[item.Id] = true;
            }
            if (item.hasOwnProperty('id')) {
                $scope.model.confirmDelete[item.id] = true;
            }
        }
    };

    $scope.deleteCallFlow = function (id) {
        $scope.model.deleting[id] = true;
        try {
            DataService.deleteCallFlow(id).then(function (result) {
                result.message = 'Your Policy was successfully deleted.';
                Notification.success(result.message);
                $scope.chartViewModel = new flowchart.ChartViewModel(angular.copy(newChartDataModel));
                $scope.loadList();
            }, function (error) {
                Notification.error({"message": "Cannot delete Policy: " + (error.message ? error.message : 'Internal error.')});
            }).finally(function () {
                $scope.model.deleting[id] = false;
            });
        } catch (error) {
            console.log(error);
            Notification.error({"message": "Cannot delete Policy: " + (error.message ? error.message : 'Internal error.')});
            $scope.model.deleting[id] = false;
        }
    };

    $scope.saveCallFlow = function () {
        
        if (!$scope.checkLicense('global')) {
            Notification.warning({'message': "Cannot save Policy: " + $filter('translate')('POLICY_NO_GLOBAL_LICENSE'), delay: null});
            return;
        }

        if ($scope.checkDuration()) {
            Notification.warning({'message': "Cannot save Policy: " + $filter('translate')('POLICY_BAD_CALLBACK_DURATION'), delay: null});
            return;
        }

        $scope.model.saving = true;
        try {
            DataService.saveCallFlow($scope.buildCallFlow()).then(function (result) {
                result.message = 'Your Policy was successfully saved.';
                Notification.success(result.message);
                $route.updateParams({id: result.Id});
                $scope.chartViewModel.data.id = result.Id;
                $scope.chartViewModel.data.remoteId = result.Id__c;
                $scope.chartViewModel.data.lastModifiedDate = result.LastModifiedDate;

            }, function (error) {
                Notification.error(error);
            }).finally(function () {
                //$scope.processing = null;
                $scope.model.saving = false;
            });
        } catch (error) {
            Notification.error({"message": "Cannot save Policy: " + error.message});
            $scope.model.saving = false;
        }
    };

    $scope.buildCallFlow = function () {
        
        var vfRemoteVar = {};
        vfRemoteVar.Id = $scope.chartViewModel.data.id;
        vfRemoteVar.Id__c = $scope.chartViewModel.data.remoteId;
        vfRemoteVar.Type__c = $scope.chartViewModel.data.type.advanced;
        vfRemoteVar.Name = $scope.chartViewModel.data.name ? $scope.chartViewModel.data.name.substring(0,64) : '';
        vfRemoteVar.Description__c = $scope.chartViewModel.data.description ? $scope.chartViewModel.data.description.substring(0,255) : '';
        vfRemoteVar.Body__c = angular.toJson($scope.chartViewModel.data);
        vfRemoteVar.Policy__c = angular.toJson($scope.buildPolicy($scope.chartViewModel.data));
        vfRemoteVar.PhoneNumbers__c = $scope.buildPhoneNumbersList($scope.chartViewModel.data.nodes);
        return vfRemoteVar;

    };

    $scope.buildPhoneNumbersList = function (nodes) {
        var phoneNumbers = [];
        angular.forEach(nodes, function (node, key) {
            if (node.configCustom == 'ModNumber_Public') {//node is ModAction
                angular.forEach(node.subItems, function (phoneNumber, key) {
                    phoneNumbers.push(phoneNumber.variables.publicNumber);
                }, null);
            }
        }, null);
        return phoneNumbers.join(',');
    };

    $scope.buildPolicy = function (data) {
        var policy = {};
        policy.name = data.name;
        if (!policy.name) {
            throw new Error("Policy Name must be set.");
        }
        policy.enabled = true;
        policy.type = data.type.basic;
        policy.items = [];
        //update nodes with id same as parent id.
        angular.forEach($scope.chartViewModel.data.nodes, function (value, key) {
            angular.forEach(value.outputs, function (outputs, key) {
                 var newId = $scope.newId();
                if(value.id == outputs.parentId){
                    if(key>0){
                        value.id = newId;
                    }
                }
               
            });
        });
        //add nodes
        angular.forEach($scope.chartViewModel.data.nodes, function (value, key) {
            $scope.buildPolicyItem(policy.items, value, $scope.chartViewModel.data.finishId);
        });
        //add finish
        policy.items.push($scope.buildPolicyFinish($scope.chartViewModel.data.finishId, $scope.chartViewModel.data.type));

        return policy;
    };

    $scope.getNextId = function (element, finishId) {
        return (element.hasOwnProperty('connectedTo') && element.connectedTo != 'finish') ? element.connectedTo : finishId;
    };

    $scope.buildPolicyItem = function (policyItems, data, finishId) {

        if (data.templateId == 4 || data.templateId == 94) { // ModAction || ModActionNC

            if (data.outputs.length == 0) { // no child element, add just an empty action


                //add main item
                var item = {};
                //override parent id for the first parent
                item.id = data.id;
                item.name = data.name;
                item.templateId = data.templateId;
                item.variables = {};
                item.variables.nextId = $scope.getNextId(data, finishId);
                item.subItems = [];
                policyItems.push(item);


            } else {// has children, process them as such

                for (var i = 0; i < data.outputs.length; i++) {
                    var element = data.outputs[i];

                    switch (element.configCustom) {
                        case 'ModAction_Notify': //complex ModAction_Notify : Email / SMS / Chatter etc
                            //add main item
                            var item = {};
                            //override parent id for the first parent
                            item.id = ((i == 0) ? data.id : element.parentId);
                            item.name = element.title;
                            item.templateId = element.parentTemplateId;
                            //item.variables = {"nextId" : ((i == data.outputs.length - 1) ? $scope.getNextId(data, finishId) :  data.outputs[i+1].parentId)} ;
                            item.variables = {};
                            item.variables.nextId = ((i == data.outputs.length - 1) ? $scope.getNextId(data, finishId) : data.outputs[i + 1].parentId);

                            //add sub items
                            item.subItems = [];
                            //add email
                            item.subItems = item.subItems.concat(element.subItems.email);
                            //add sms
                            item.subItems = item.subItems.concat(element.subItems.sms);

                            //validate variables
                            angular.forEach(item.subItems, function (itm, key) {
                                itm.variables.text = itm.variables.text.replaceAll(/(\\r\\n)|([\r\n])/gmi, '<br/>');
                                itm.variables = $scope.validateVariables(itm);
                            });

                            policyItems.push(item);

                            //check if chatter or notification available and add them
                            // check for old-style data and map to new style
                            if (typeof element.chatterId != 'undefined') {

                                // we won't have any notifications, but we will have chatter
                                element.scriptInfo = {
                                    notification: {},
                                    chatter: { scriptParentId: element.chatterParentId, scriptId: element.chatterId }
                                };

                                // de-pollute the source data
                                delete element.chatterParentId;
                                delete element.chatterId;
                            }

                            var types = ['chatter', 'notification'];
                            for (var typeid = 0; typeid < types.length; ++typeid) {
                                var type = types[typeid];
                                if (typeof element.subItems[type] !== 'undefined' && element.subItems[type].length > 0) {
                                    //link here the previous item
                                    item.variables.nextId = element.scriptInfo[type].scriptParentId;
                                    //Develop Parent
                                    var Item = {};
                                    Item.id = item.variables.nextId;
                                    Item.name = 'Notify';
                                    Item.templateId = element.developTemplateId;
                                    Item.variables = {};
                                    Item.variables.nextId = ((i == data.outputs.length - 1) ? $scope.getNextId(data, finishId) : data.outputs[i + 1].parentId);
                                    Item.subItems = [];
                                    //add Develop Chatter/Notification
                                    var SubItem = {};
                                    SubItem.id = element.scriptInfo[type].scriptId;
                                    SubItem.name = type.charAt(0).toUpperCase() + type.substr(1);
                                    SubItem.templateId = element.developScriptTemplateId;
                                    if (type == 'chatter')
                                        SubItem.variables = $scope.buildNotifyChatterScript(element);
                                    if (type == 'notification')
                                        SubItem.variables = $scope.buildNotifyNotificationScript(element);
                                    SubItem.variables.nextId = ((i == data.outputs.length - 1) ? $scope.getNextId(data, finishId) : data.outputs[i + 1].parentId);
                                    Item.subItems.push(SubItem);
                                    policyItems.push(Item);
                                }
                            }

                            break;
                        case 'ModConnect_ModDevelop_Script': //complex ModConnect_ModDevelop_Script
                        case 'ModConnect_FollowMe_ModDevelop_Script': //complex ModConnect_ModDevelop_Script

                            //Develop Connect
                            var connectItem = {};
                            connectItem.id = ((i == 0) ? data.id : element.parentId);
                            connectItem.name = element.title;
                            connectItem.templateId = element.parentTemplateId;
                            connectItem.variables = {};
                            connectItem.variables.nextId = element.connectParentId;
                            connectItem.subItems = [];

                            var connectSubItem = {};
                            connectSubItem.id = element.id;
                            connectSubItem.name = element.name;
                            connectSubItem.templateId = element.templateId;
                            connectSubItem.variables = $scope.buildModConnectScript(element);

                            connectItem.subItems.push(connectSubItem);
                            policyItems.push(connectItem);

                            //Develop Connect Result
                            var connectResultItem = {};
                            connectResultItem.id = element.connectParentId;
                            connectResultItem.name = element.title;
                            connectResultItem.templateId = element.parentTemplateId;
                            connectResultItem.variables = {};
                            connectResultItem.variables.nextId = ((i == data.outputs.length - 1) ? $scope.getNextId(data, finishId) : data.outputs[i + 1].parentId);
                            connectResultItem.subItems = [];

                            var connectResultSubItem = {};
                            connectResultSubItem.id = element.connectId;
                            connectResultSubItem.name = element.name;
                            connectResultSubItem.templateId = element.templateId;
                            connectResultSubItem.variables = $scope.buildModConnectResultScript(element);
                            connectResultSubItem.variables.nextId = $scope.getNextId(element, finishId);


                            connectResultItem.subItems.push(connectResultSubItem);
                            policyItems.push(connectResultItem);

                            //Screen Caller
                            if (element.config.screen) {
                                var screenItem = {};
                                screenItem.id = element.screenParentId;
                                screenItem.name = 'Screen Caller';
                                screenItem.templateId = 124;
                                screenItem.variables = {};
                                screenItem.subItems = [];

                                var screenSubItem = {};
                                screenSubItem.id = element.screenId;
                                screenSubItem.name = element.config.screenHook;
                                screenSubItem.templateId = 125;
                                screenSubItem.variables = $scope.buildModConnectScreenHook(element);

                                screenItem.subItems.push(screenSubItem);
                                policyItems.push(screenItem);
                            }

                            break;

                        case 'ModConnect_Queue': //complex ModConnect_Queue with Screen
                            //create script component
                            var itemScript = {};
                            itemScript.id = ((i == 0) ? data.id : element.parentId);
                            itemScript.name = element.title + ' Script';
                            itemScript.templateId = 117;
                            itemScript.variables = {};
                            itemScript.variables.nextId = element.queueParentId;
                            //add script element
                            itemScript.subItems = [];
                            var subItemScript = {};
                            subItemScript.id = element.id;
                            subItemScript.name = element.title + ' Script';
                            subItemScript.templateId = 118;
                            subItemScript.variables = $scope.buildModConnectQueueScript(element);
                            subItemScript.variables.nextId = element.queueParentId;

                            itemScript.subItems.push(subItemScript);
                            policyItems.push(itemScript);

                            //create the call queue component
                            var itemCallQueueParent = {};
                            //override parent id for the first parent
                            itemCallQueueParent.id = element.queueParentId;
                            itemCallQueueParent.name = element.title;
                            itemCallQueueParent.templateId = element.parentTemplateId;
                            itemCallQueueParent.variables = {};
                            itemCallQueueParent.variables.nextId = ((i == data.outputs.length - 1) ? $scope.getNextId(data, finishId) : data.outputs[i + 1].parentId);

                            //add sub item
                            itemCallQueueParent.subItems = [];
                            var subItemCallQueue = {};
                            subItemCallQueue.id = element.queueId;
                            subItemCallQueue.name = element.name;
                            subItemCallQueue.templateId = element.templateId;
                            subItemCallQueue.variables = $scope.validateVariables(element);
                            if (subItemCallQueue.variables.hasOwnProperty('nextId')) {
                                subItemCallQueue.variables.nextId = $scope.getNextId(element, finishId);
                            }

                            itemCallQueueParent.subItems.push(subItemCallQueue);
                            policyItems.push(itemCallQueueParent);

                            //Screen Caller
                            if (element.config.screen) {
                                //create screen component
                                var itemScreenHook = {};
                                itemScreenHook.id = element.screenParentId;
                                itemScreenHook.name = element.title + ' Screen Hook';
                                itemScreenHook.templateId = 124;
                                itemScreenHook.variables = {};
                                itemScreenHook.subItems = [];
                                //add script hook
                                var subItemScreenHook = {};
                                subItemScreenHook.id = element.screenId;
                                subItemScreenHook.name = element.config.screenHook;
                                subItemScreenHook.templateId = 125;
                                subItemScreenHook.variables = $scope.buildModConnectQueueScreenHook(element);

                                itemScreenHook.subItems.push(subItemScreenHook);
                                policyItems.push(itemScreenHook);

                            }

                            //skills hook
                            if (element.variables.ringTargets.length > 0) {
                                //init Hook parent
                                var skillHookItem = {};
                                skillHookItem.id = element.skillHookParentId;
                                skillHookItem.name = element.title + ' Skill Hook';
                                skillHookItem.templateId = 124;
                                skillHookItem.variables = {};
                                skillHookItem.subItems = [];

                                angular.forEach(element.variables.ringTargets, function (ringTarget, key) {
                                    if (ringTarget.hasOwnProperty('skills') && ringTarget.skills.enabled && ringTarget.skills.mode == 'HOOK') {
                                        //create script component
                                        var skillHookSubItem = {};
                                        skillHookSubItem.id = ringTarget.skills.hook;
                                        skillHookSubItem.name = ringTarget.skills.hook.replace(/-/g, '');
                                        skillHookSubItem.templateId = 125;
                                        skillHookSubItem.variables = $scope.buildModConnectQueueSkillHook(element, ringTarget.skills);
                                        skillHookItem.subItems.push(skillHookSubItem);
                                    }
                                });
                                if (skillHookItem.subItems.length > 0) {
                                    policyItems.push(skillHookItem);
                                }
                            }
                            break;
                        case "ModAction_ModifyCharacteristic": // complex ModAction_ModifyCharacteristic
                        case "ModActionNC_ModifyCharacteristic": // complex ModActionNC_ModifyCharacteristic

                            var item = {};
                            item.id = ((i == 0) ? data.id : element.parentId);
                            item.name = element.title;
                            item.templateId = element.parentTemplateId;
                            item.variables = {};
                            item.variables.nextId = ((i == data.outputs.length - 1) ? $scope.getNextId(data, finishId) : data.outputs[i + 1].parentId);
                            item.subItems = [];

                            var subItem = {};
                            subItem.id = element.id;
                            subItem.name = element.name;
                            subItem.templateId = element.templateId;
                            subItem.variables = $scope.buildModActionModifyCharacteristicScript(element);
                            subItem.variables.nextId = item.variables.nextId;

                            item.subItems.push(subItem);
                            policyItems.push(item);

                            break;
                        case "ModAction_RequestSkills": // complex ModAction_RequestSkills
                            var item = {};
                            item.id = ((i == 0) ? data.id : element.parentId);
                            item.name = element.title;
                            item.templateId = element.parentTemplateId;
                            item.variables = {};
                            item.variables.nextId = ((i == data.outputs.length - 1) ? $scope.getNextId(data, finishId) : data.outputs[i + 1].parentId);
                            item.subItems = [];

                            var subItem = {};
                            subItem.id = element.id;
                            subItem.name = element.name;
                            subItem.templateId = element.templateId;
                            subItem.variables = $scope.buildModActionRequestSkillsScript(element);
                            subItem.variables.nextId = item.variables.nextId;

                            item.subItems.push(subItem);
                            policyItems.push(item);

                            break;
                        case "ModAction_RecordAnalyse": // complex ModAction_RecordAnalyse
                            var item = {};
                            item.id = ((i == 0) ? data.id : element.parentId);
                            item.name = element.title;
                            item.templateId = element.parentTemplateId;
                            item.variables = {};
                            item.variables.nextId = ((i == data.outputs.length - 1) ? $scope.getNextId(data, finishId) : data.outputs[i + 1].parentId);
                            item.subItems = [];

                            var subItem = {};
                            subItem.id = element.id;
                            subItem.name = element.name;
                            subItem.templateId = element.templateId;
                            subItem.variables = $scope.buildModActionRecordAnalyseScript(element);
                            subItem.variables.nextId = item.variables.nextId;

                            item.subItems.push(subItem);
                            policyItems.push(item);

                            break;
                        default: // all other items

                            //add main item
                            var item = {};
                            //override parent id for the first parent
                            item.id = ((i == 0) ? data.id : element.parentId);
                            item.name = element.title;
                            item.templateId = element.parentTemplateId;
                            //item.variables = {"nextId" : ((i == data.outputs.length - 1) ? $scope.getNextId(data, finishId) :  data.outputs[i+1].parentId)} ;
                            item.variables = {};
                            item.variables.nextId = ((i == data.outputs.length - 1) ? $scope.getNextId(data, finishId) : data.outputs[i + 1].parentId);
                            //ModPolicy_ToNonCall
                            if (element.parentNoOutput) {
                                delete item.variables.nextId;
                            }

                            //add sub item
                            item.subItems = [];
                            var subItem = {};
                            subItem.id = element.id;
                            subItem.name = element.name;
                            subItem.templateId = element.templateId;
                            subItem.variables = $scope.validateVariables(element);
                            if (subItem.variables.hasOwnProperty('nextId')) {
                                subItem.variables.nextId = $scope.getNextId(element, finishId);
                            }

                            //special script items
                            switch (element.configCustom) {
                                case 'ModAction_Rule': //complex ModAction_Rule
                                    subItem.variables.script = $scope.buildModRuleScript(element);
                                    break;
                                case 'ModConnector_SFUpdate': //check if there is a record ID to update
                                    $scope.validateSFUpdate(element);
                                    break;
                            }

                            item.subItems.push(subItem);
                            policyItems.push(item);
                    }


                }
            }


        } else {
            var item = {};
            item.id = data.id;
            item.name = data.name;
            item.templateId = data.parentTemplateId || data.templateId;
            item.variables = $scope.validateVariables(data);

            if (item.variables.hasOwnProperty('nextId')) {
                item.variables.nextId = $scope.getNextId(data,finishId);
            }

            item.subItems = [];

            if (data.hasOwnProperty('subItems')) {
                item.subItems = data.subItems;
                angular.forEach(item.subItems, function (element, key) {
                    if (element.variables.hasOwnProperty('nextId')) {
                        switch (data.templateId) {
                            case 3:
                                element.variables.nextId = $scope.getNextId(data,finishId);
                                break;
                            default:
                                element.variables.nextId = $scope.getNextId(element,finishId);
                        }
                    }
                });

            } else {

                if (data.parentTemplateId) { //add the one subItem from the node definition
                    item.name = data.title;
                    item.id = data.parentId;
                    item.variables = null;
                    var subItem = {};
                    subItem.id = data.id;
                    subItem.name = data.name;
                    subItem.templateId = $scope.buildTemplateId(data.templateId);
                    subItem.variables = $scope.validateVariables(data);
                    if (subItem.variables.hasOwnProperty('nextId')) {
                        subItem.variables.nextId = $scope.getNextId(data,finishId);
                    }
                    item.subItems.push(subItem);
                } else {//add items from the outputs

                    angular.forEach(data.outputs, function (element, key) {
                        var subItem = {};
                        subItem.id = element.id;
                        subItem.name = element.name;
                        subItem.templateId = $scope.buildTemplateId(element.templateId);
                        subItem.variables = $scope.validateVariables(element);
                        if (subItem.variables.hasOwnProperty('nextId')) {
                            subItem.variables.nextId = $scope.getNextId(element,finishId);
                        }
                        item.subItems.push(subItem);
                    });
                }
            }

            policyItems.push(item);
        }
        //return item;
    };

    $scope.buildTemplateId = function (templateId) {
        //override pseudo items
        // Invokable Destination
        if ( templateId > 100000) {
            return (templateId / 100000);
        }
        return templateId;
    };

    $scope.buildPolicyFinish = function (id, type) {
        var finish = {
            "id": id,
            "name": "Finish",
            "templateId": type.basic == 'NON_CALL' ? 58 : 23,
            "variables": null,
            "subItems": []
        };
        return finish;
    };

    $scope.validateVariables = function (element) {

        var variables = angular.copy(element.variables);

        angular.forEach(variables, function (variable, key) {

            switch (key) {
                case 'emailToAddresses':
                    if (variables[key]) variables[key] = variables[key].split(',');
                    break;
                case 'emailCcAddresses':
                    if (variables[key]) variables[key] = variables[key].split(',');
                    break;
                case 'toneStream':
                case 'pattern':
                case 'toAddress':
                case 'ccAddress':
                case 'callerIdName':
                    if (/^\s*$/.test(variable)) { //empty to null
                        variables[key] = null;
                    }
                    break;
                case 'sayPhrase':
                case 'welcomePhraseBegin':
                case 'welcomePhraseEnd':
                case 'badInputPhrase':
                    if (variables[key]) variables[key] = $scope.replaceSoundTags(element, variables[key]);
                    break;
                case 'itemPhrase':
                case 'selectedPhrase':
                    if (variables[key]) variables[key] = $scope.replaceSoundTags(element, variables[key]);
                    if (/^\s*$/.test(variable)) { //empty to null
                        variables[key] = null;
                    }
                    break;
                case 'ringTargets':
                    $scope.validateRingTargetsSkills(variables.ringTargets);
                    break;
                case 'macros':
                    if (element.templateClass == 'ModActionNC_Debug') {
                        if (angular.isArray(variables[key]) &&  variables[key].length == 0) variables[key] = null;
                    }
                    break;
            }
        });
        return variables;
    };

    $scope.validateRingTargetsSkills = function (ringTargets) {
        /*do not require groups if used with Omni-Channel
        if (ringTargets.length == 0) {
            throw new Error("Component [" + element.name + "] validation failed. There must be at least one Call Group.");
        }
        */
        angular.forEach(ringTargets, function (ringTarget, key) {
            if (ringTarget.hasOwnProperty('skills')) {
                delete ringTarget.skills.script;
                if (ringTarget.skills.enabled == false) {
                    delete ringTarget.skills.mode;
                    delete ringTarget.skills.hook;
                    delete ringTarget.skills.parameters;
                } else {
                    if (ringTarget.skills.mode == 'HOOK') {
                        delete ringTarget.skills.parameters;
                        ringTarget.skills.hook = ringTarget.skills.hook.replace(/-/g, '');
                    } else {
                        delete ringTarget.skills.hook;
                    }
                }
            }
        }, null);
    };


    $scope.replaceSoundTags = function (element, variable) {

        let sounds = DataService.getCache('soundsData');
        if (sounds != null && variable != null) {
            angular.forEach(sounds, function (value, key) {
                if (value.hasOwnProperty('Id__c')) variable = variable.split('{' + value.Tag__c + '}').join('{' + value.Id__c + '}');
                if (value.hasOwnProperty('RemoteId')) variable = variable.split('{' + value.Tag + '}').join('{' + value.RemoteId + '}');
            })
        }
        return variable;
    };

    $scope.buildModRuleScript = function (data) {

        var rules = angular.copy(data.config.rules);

        //temp fix for countryCode Array
        if (rules.hasOwnProperty('countryCode')) {

            angular.forEach(rules.countryCode, function (and, key) {
                angular.forEach(and, function (or, key) {
                    if (or.hasOwnProperty('countryCode') && or.countryCode != null) {
                        or.countryCode = [or.countryCode];
                    };
                }, null);
            }, null);
        }

        var config = {"rules": rules};
        config.namespacePrefix = VISUALFORCE.hasOwnProperty('namespacePrefix') ? VISUALFORCE.namespacePrefix.replace('.','') : '';
        config.policyType = data.type;

        var script = "local jsonData = [=[\r";
        script += angular.toJson(config);
        script += "\r]=]\r\r";
        script += "local loaded_chunk = assert(loadfile('local://" + data.config.devOrgId + "/RulesCPBXV1'))\rloaded_chunk()\rres = execute(jsonData)\rreturn res\r\r\r";

        return script;
    };

    $scope.buildModConnectScript = function (data) {
        var variables = angular.copy(data.variables);
        var script = "local jsonData = [[\r";
        var config = angular.copy(data.config);
        //convert all targets to string
        //reset target for DIVERT, DDI_USER and REQUESTED
        if (config.hasOwnProperty('connectAction')) {
            angular.forEach(config.connectAction, function (action, key) {
                if (action.method == 'DIVERT' || action.method == 'DDI_USER' || action.method == 'REQUESTED') {
                    action.target = null;
                }
                //convert targets to string
                if (action.target != null) {
                    action.target = action.target.toString();
                }
            }, null);
        }
        //follow Me
        //check followMe has at least one target
        if (config.hasOwnProperty('followMe')) {
            if (config.dialMethod == 'followMe') {
                if (config.followMe.length == 0) {
                    throw new Error("Component [" + data.name + "] validation failed. There must be at least one Call Target.");
                }
            }
            //convert all targets to string
            angular.forEach(config.followMe, function (itm, key) {
                //convert targets to string
                if (itm.target != null) {
                    itm.target = itm.target.toString();
                }
            }, null);
        }

        config.namespacePrefix = VISUALFORCE.hasOwnProperty('namespacePrefix') ? VISUALFORCE.namespacePrefix.replace('.','') : '';
        config.policyType = data.type;

        script += angular.toJson(config);
        script += "\r]]\r\r";
        script += "local loaded_chunk = assert(loadfile('local://" + data.config.devOrgId + "/ConnectCallCPBXV1'))\rloaded_chunk()\rres = execute(jsonData)\rreturn res\r\r\r";
        variables.script = script;
        variables.nextId = data.connectParentId;
        return variables;
    };

    $scope.buildModConnectResultScript = function (data) {
        var variables = angular.copy(data.variables);
        var script = "local jsonData = [[\r";

        var config = {};
        config.namespacePrefix = VISUALFORCE.hasOwnProperty('namespacePrefix') ? VISUALFORCE.namespacePrefix.replace('.','') : '';
        config.policyType = data.type;

        script += angular.toJson(config);
        script += "\r]]\r\r";
        script += "local loaded_chunk = assert(loadfile('local://" + data.config.devOrgId + "/ConnectTriggerCPBXV1'))\rloaded_chunk()\rres = execute(jsonData)\rreturn res\r\r\r";
        variables.script = script;

        return variables;
    };

    $scope.buildModConnectScreenHook = function (data) {
        var variables = angular.copy(data.variables);
        delete variables.nextId;
        variables.scriptName = data.config.screenHook;
        variables.scopePublic = false;

        var script = "local jsonData = [[\r";
        var configScreen = angular.copy(data.configScreen);
        //replace sound tags
        configScreen.announcement = $scope.replaceSoundTags(data, configScreen.announcement);
        configScreen.namespacePrefix = VISUALFORCE.hasOwnProperty('namespacePrefix') ? VISUALFORCE.namespacePrefix.replace('.','') : '';
        configScreen.policyType = data.type;

        script += angular.toJson(configScreen);
        script += "\r]]\r\r";
        script += "local loaded_chunk = assert(loadfile('local://" + data.config.devOrgId + "/ScreenCallCPBXV1'))\rloaded_chunk()\rres = execute(jsonData)\rreturn res\r\r\r";
        variables.script = script;
        return variables;
    };

    $scope.buildModConnectQueueScreenHook = function (data) {
        var variables = angular.copy(data.variablesScreen);
        delete variables.nextId;
        variables.scriptName = data.config.screenHook;
        variables.scopePublic = false;

        var script = "local jsonData = [[\r";
        var configScreen = angular.copy(data.configScreen);
        //replace sound tags
        configScreen.announcement = $scope.replaceSoundTags(data, configScreen.announcement);
        configScreen.namespacePrefix = VISUALFORCE.hasOwnProperty('namespacePrefix') ? VISUALFORCE.namespacePrefix.replace('.','') : '';
        configScreen.policyType = data.type;

        script += angular.toJson(configScreen);
        script += "\r]]\r\r";
        script += "local loaded_chunk = assert(loadfile('local://" + data.config.devOrgId + "/ScreenCallCPBXV1'))\rloaded_chunk()\rres = execute(jsonData)\rreturn res\r\r\r";
        variables.script = script;
        return variables;
    };


    $scope.buildModConnectQueueSkillHook = function (data, skills) {
        var variables = angular.copy(data.variablesScreen);
        delete variables.nextId;
        variables.scopePublic = false;
        variables.scriptName = skills.hook.replace(/-/g, '');
        variables.script = skills.script;
        return variables;
    };

    $scope.buildModConnectQueueScript = function (data) {
        var configForLuaScript = angular.copy(data.configForLuaScript);
        if (!configForLuaScript) {
            configForLuaScript = {
                "callBack": {
                    "enabled": false,
                    "activationKey": "#",
                    "activationPosition": 10,
                    "activationElapsedTime": 300,
                    "leaveVoiceMail": true,
                    "acl": "ANY",
                    "aclRegex": "",
                    "maximumAttempts": 3,
                    "attemptDelays": [900,900,900],                    
                    "cli": "",
                    "cliPresentation": "SPECIFIED",
                    "customCli": []
                },
                "chime": [],
                "callQueue" : { "algorithm": "priority", "transferAfterConnect": null }
            }
        }
        //postprocess chimes
        angular.forEach(configForLuaScript.chime, function (item, key) {
            switch(item.format) {
                case 'TAG':item.chime = '{'+item.chime+'}'; break;
                case 'SOUND_TONE':
                    item.format = 'SOUND';
                    item.chime = 'tone://' + item.chime;
                    break;
                case 'SOUND_MP3':
                    item.format = 'SOUND';
                    item.chime = item.chime.replace(/^http(s?)/i, 'http_mp3');
                    break;
                case 'SOUND_SHOUTCAST':
                    item.format = 'SOUND';
                    item.chime = item.chime.replace(/^http(s?)/i, 'shout');
                    break;
            }
        }, null);

        //postprocess customCLI
        angular.forEach(configForLuaScript.callBack.customCli, function (item, key) {
            var callingCodeArray = [];
            angular.forEach(item.cliRegex, function (itm, k) {
                if (callingCodeArray.indexOf(itm.trim()) == -1) {
                    callingCodeArray.push(itm.trim());
                }
            }, null);
            if (callingCodeArray.length > 0) {
                item.cliRegex = '^('+ callingCodeArray.join('|') +')';
            }
        }, null);


        var variables = {};
        var script = "";
        if (data.config.screen) {
            script += "-- Optionally set the register hook if screen has been enabled\r";
            script += "session.register_hook('confirmOnAnswer', 'luaScript', '"+data.config.screenHook+"')\r\r";
        }
        script += "local jsonData = [[\r";
        script += angular.toJson(configForLuaScript);
        script += "\r]]\r\r";
        script += "local loaded_chunk = assert(loadfile('local://" + data.config.devOrgId + "/CallQueueCPBXV1'))\rloaded_chunk()\rres = execute(jsonData)\rreturn res\r\r\r";
        variables.script = script;
        return variables;
    };

    $scope.buildNotifyChatterScript = function (data) {
        var variables = angular.copy(data.config.chatterScript);
        var script = "local jsonData = [[\r";
        var config = {};
        config.connectorId = data.config.connectorId;
        config.namespacePrefix = VISUALFORCE.hasOwnProperty('namespacePrefix') ? VISUALFORCE.namespacePrefix.replace('.','') : '';
        config.policyType = data.type;
        config.items = angular.copy(data.subItems.chatter);
        script += angular.toJson(config);
        script += "\r]]\r\r";
        script += "local loaded_chunk = assert(loadfile('local://" + data.config.devOrgId + "/NotifyChatterCPBXV1'))\rloaded_chunk()\rres = execute(jsonData)\rreturn res\r\r\r";
        variables.script = script;
        return variables;
    };

    $scope.buildNotifyNotificationScript = function (data) {
        var variables = {};
        var script = "local jsonData = [[\r";
        var config = {};
        config.connectorId = data.config.connectorId;
        config.namespacePrefix = VISUALFORCE.hasOwnProperty('namespacePrefix') ? VISUALFORCE.namespacePrefix.replace('.','') : '';
        config.policyType = data.type;
        config.items = angular.copy(data.subItems.notification);
        script += angular.toJson(config);
        script += "\r]]\r\r";
        script += "local loaded_chunk = assert(loadfile('local://" + data.config.devOrgId + "/NotifyNotificationCPBXV1'))\rloaded_chunk()\rres = execute(jsonData)\rreturn res\r\r\r";
        variables.script = script;
        console.debug(script);
        return variables;
    };


    $scope.buildModActionModifyCharacteristicScript = function (data) {
        var variables = angular.copy(data.variables);
        var script = "local jsonData = [[\r";
        var config = angular.copy(data.config);
        //add preset properties
        angular.forEach(config.builtInProperties, function (item, key) {
            config[item.name] = item.value;
        }, null);
        //delete builtInProperties source
        delete config.builtInProperties;

        config.namespacePrefix = VISUALFORCE.hasOwnProperty('namespacePrefix') ? VISUALFORCE.namespacePrefix.replace('.','') : '';
        config.policyType = data.type;

        script += angular.toJson(config);
        script += "\r]]\r\r";
        script += "local loaded_chunk = assert(loadfile('local://" + data.config.devOrgId + "/ModifyPropertiesCPBXV1'))\rloaded_chunk()\rres = execute(jsonData)\rreturn res\r\r\r";
        variables.script = script;
        variables.nextId = data.connectParentId;

        return variables;
    };

    $scope.buildModActionRequestSkillsScript = function (data) {
        var variables = angular.copy(data.variables);
        var script = "local jsonData = [[\r";
        var config = angular.copy(data.config);
        //format skills
        var skills = angular.copy(config.skills);
        config.skills = [];
        angular.forEach(skills, function (item, key) {
            config.skills.push({"id":item.Id__c, "min":item.minWeight, "max": item.maxWeight});
        }, null);

        config.namespacePrefix = VISUALFORCE.hasOwnProperty('namespacePrefix') ? VISUALFORCE.namespacePrefix.replace('.','') : '';
        config.policyType = data.type;

        script += angular.toJson(config);
        script += "\r]]\r\r";
        script += "local loaded_chunk = assert(loadfile('local://" + data.config.devOrgId + "/ModifyPropertiesCPBXV1'))\rloaded_chunk()\rres = execute(jsonData)\rreturn res\r\r\r";
        variables.script = script;
        variables.nextId = data.connectParentId;

        return variables;
    };
    $scope.buildModActionRecordAnalyseScript = function (data) {
        var variables = angular.copy(data.variables);
        var script = "local jsonData = [[\r";
       // var config = angular.copy(data.config);
        var record = angular.copy(data.config.record);
        var email = angular.copy(data.config.email);
        var beepAlert = angular.copy(data.config.beepAlert);
        var insight = angular.copy(data.config.insight);
        
        var namespacePrefix = VISUALFORCE.hasOwnProperty('namespacePrefix') ? VISUALFORCE.namespacePrefix.replace('.','') : '';
        var config;
       if(insight.isEnabled === true && data.config.insightConfig != 'Default'){
         config = {
                    "connectorId": angular.copy(data.config.connectorId),
                    "devOrgId": angular.copy(data.config.devOrgId),
                    "enableDebug": false,
                    "namespacePrefix": namespacePrefix,
                    "record" : {
                        "channel": data.config.record.channel,
                        "start": data.config.record.start,
                        "archivePolicyId": data.config.record.archivePolicyId,
                        "pauseAllowed": (data.config.record.start == 'ON_CONNECT' || data.config.record.start == 'IMMEDIATE')?false:data.config.pauseAllowed,
                        "stopAllowed": (data.config.record.start == 'ON_CONNECT' || data.config.record.start == 'IMMEDIATE')?false:data.config.stopAllowed, 
                      "email" : {
                        "toRecipients": (email.toRecipients === undefined || email.toRecipients.length == 0)?email.toRecipients:[email.toRecipients],
                        "ccRecipients": (email.ccRecipients === undefined || email.ccRecipients.length == 0)?email.ccRecipients:[email.ccRecipients],
                        "subject":  email.subject
                      }, 
                      "beepAlert" :{
                        "channel":beepAlert.channel,
                        "tgml":beepAlert.tgml==""? "%(100,15000,800)":beepAlert.tgml
                      }
                    },
                      "insight" : {
                        "disableCallFlow":data.config.insightConfig == 'Disable'?true:false,
                        "transcription": true,
                        "talkTime": false,
                        "language": insight.language,
                        "channel": insight.channel,
                        "region": insight.region,
                        "categoryFilter": insight.categoryFilter,
                        "systemCategoryFilter": insight.categoryFilter,
                        "vocabulary": insight.categoryFilter
                      
                    }
                };
            }
            else{
                config = {
                    "connectorId": angular.copy(data.config.connectorId),
                    "devOrgId": angular.copy(data.config.devOrgId),
                    "enableDebug": false,
                    "namespacePrefix": namespacePrefix,
                    "record" : {
                        "channel": data.config.record.channel,
                        "start": data.config.record.start,
                        "archivePolicyId": data.config.record.archivePolicyId,
                        "pauseAllowed": (data.config.record.start == 'ON_CONNECT' || data.config.record.start == 'IMMEDIATE')?false:data.config.pauseAllowed,
                        "stopAllowed": (data.config.record.start == 'ON_CONNECT' || data.config.record.start == 'IMMEDIATE')?false:data.config.stopAllowed,
                      "email" : {
                        "toRecipients": (email.toRecipients === undefined || email.toRecipients.length == 0)?email.toRecipients:[email.toRecipients],
                        "ccRecipients": (email.ccRecipients === undefined || email.ccRecipients.length == 0)?email.ccRecipients:[email.ccRecipients],
                        "subject":  email.subject
                      },
                      "beepAlert" :{
                        "channel":beepAlert.channel,
                        "tgml":beepAlert.tgml==""? "%(100,15000,800)":beepAlert.tgml
                      }
                    }
                };

            }

        script += angular.toJson(config);
        script += "\r]]\r\r";
        script += "local loaded_chunk = assert(loadfile('local://" + data.config.devOrgId + "/CallRecordV1'))\rloaded_chunk()\rres = execute(jsonData)\rreturn res\r\r\r";
        variables.script = script;
        variables.nextId = data.connectParentId;

        return variables;
    };

    $scope.validateSFUpdate = function (item) {
        //check recordId null or undefined
        if (!item.config.recordId) {
            throw new Error("Component [" + item.name + "] validation failed. Record ID must be set.");
        }
    };


    if ($routeParams.hasOwnProperty('authToken')) {
        localStorage.setItem('authToken', $routeParams.authToken);
    }


    //manage licenses
    $scope.model.license = null;
    $scope.checkLicense = function (module) {
        if (!angular.isObject($scope.model.license)) {
            return false;
        }
        var license = false;
        switch (module) {
            case 'global':
                angular.forEach($scope.model.license, function (value, key) {
                    if (value === true) {
                        license = true;
                    }
                }, null);
                return license;
                break;
            case 'POLICY_TYPE_DATA_ANALYTICS':
                return ($scope.model.license.Manager__c || $scope.model.license.PBX__c);
                break;
            case 'Insight':
                return ($scope.model.license.Insights__c );
                break;
            default: return $scope.model.license[module];
        }
    };

    $scope.checkDuration = function() {
        var errArray = [];
        $scope.chartViewModel.data.nodes.forEach(node => {
            if(node.outputs) {
                //var test = node.outputs.map(cn => cn.minutesErr).filter(el => el || el !== undefined);
                var minutesErr = node.outputs.map(cn => cn.minutesErr).filter(el => el !== undefined);
                var hoursErr = node.outputs.map(cn => cn.hoursErr).filter(el => el !== undefined);
                var secondsErr = node.outputs.map(cn => cn.secondsErr).filter(el => el !== undefined);
                // errArray.push(node.outputs.map(cn => cn.hoursErr).filter(el => el !== undefined));
                // errArray.push(node.outputs.map(cn => cn.secondsErr).filter(el => el || el !== undefined));
                errArray.push(minutesErr,hoursErr,secondsErr);
            }
        })
        return errArray.filter(x => x.length).flat().filter(x => x == true).length > 0;
    }

    $scope.processLicense = function () {
        if (angular.isObject($scope.model.license)) {
            angular.forEach(nodeTemplates, function (node, key) {
                node.enabled = false;
                var id = node.templateClass + '_' + node.configCustom + '_' + node.templateId.toString();
                angular.forEach(requiredLicense[id], function (item, key) {
                    if (key != 'templateClass' && key != 'configCustom') {
                       //SF-388 check record license count before enable record policies in the policy builder
                        if(item === 0 && $scope.model.license[key] === 0){
                            node.enabled = false;
                        }
                        if (item === true && $scope.model.license[key] === true) {
                            node.enabled = true;
                        }
                    }
                }, null);
            }, null);
        }
    };



    $scope.getLicenseOnce = function () {
        DataService.getLicenseCache().then(function (result) {
            $scope.model.license = result;
            $scope.processLicense();
            $scope.model.ALLOW_POLICY_TYPE_DATA_ANALYTICS = $scope.checkLicense('POLICY_TYPE_DATA_ANALYTICS');
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };

    $scope.getSounds = function() {
        DataService.getSounds(null).then(function (result) {
            console.log('got sounds');
            let sounds = [];
            let soundsMap = [];
            angular.forEach(result, function (value, key) {
                sounds.push({"soundId": value.Id__c, "tag": value.Tag__c});
                soundsMap[value.Id__c] = value.Tag__c;
            });
            DataService.setCache('soundsData', result);
            DataService.setCache('sounds', sounds);
            DataService.setCache('soundsMap', soundsMap);
        }, function (error) {
            Notification.error(error);
        });
    };

    $scope.getArchivingPolicies = function () {
        DataService.getArchivingPolicies(null).then(function (result) {
            let archivingPoliciesList = [];
            DataService.setCache('archivingPoliciesList', result);
        }, function (error) {
            Notification.error(error);
        }).finally(function () {
            //$scope.processing = null;
        });
    };
    //execute now
    $scope.getArchivingPolicies();

    

    $scope.getLicenseOnce();
    $scope.getSounds();

    //execute path
    if ($location.path() == '/list/') {
        //TODO move to cache
        $scope.getCallFlows();
    } else {
        if ($routeParams.hasOwnProperty('id')) {
            $scope.loadCallFlow($routeParams.id);
        } else {
            //init new call flow
            $scope.chartViewModel = new flowchart.ChartViewModel(angular.copy(newChartDataModel));
            $scope.chartOptionsDialog = true;
        }
    }

}]);