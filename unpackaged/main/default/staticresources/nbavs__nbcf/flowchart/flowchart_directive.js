//
// Flowchart module.
//
angular.module('flowChart', ['dragging'])


    .filter('notInArray', ['$filter', function ($filter) {
        return function (list, arrayFilter, element) {
            if (arrayFilter) {
                return $filter("filter")(list, function (listItem) {
                    for (var i = 0; i < arrayFilter.length; i++) {
                        if (arrayFilter[i][element] == listItem[element]) {
                            return false;
                        }
                    }
                    return true;
                });
            }
        }
    }])




    //
    // Directive that generates the rendered chart from the data model.
    //
    .directive('flowChart', [function () {
        return {
            restrict: 'E',
            templateUrl: '/flowchart/flowchart_template.html',
            replace: true,
            scope: {
                chart: "=",
            },

            //
            // Controller for the flowchart directive.
            // Having a separate controller is better for unit testing, otherwise
            // it is painful to unit test a directive without instantiating the DOM
            // (which is possible, just not ideal).
            //
            controller: 'FlowChartController',
        };
    }])


    //
    // directive for inspector / editor
    //
    .directive('nodeEdit', [function () {
        return {
            restrict: 'E',
            templateUrl: '/flowchart/node_template.html',
            replace: true,
            scope: {
                node: "=",
                item: "=",
                viewModel: "="
            },
            transclude: false,
            controller: 'NodeController',
            link: function (scope, elem, attr, ctrl) {
            }

        }

    }])

    .directive('itemEdit', [function () {
        return {
            restrict: 'E',
            templateUrl: '/flowchart/item_template.html',
            replace: true,
            scope: {
                node: "=",
                item: "=",
                viewModel: "="
            },
            transclude: false,
            controller: 'NodeController',
            link: function (scope, elem, attr, ctrl) {
            }

        }

    }])


    .controller('NodeController', ['$scope', '$sce', '$filter', 'DataService', 'Notification', function ($scope, $sce, $filter, DataService, Notification) {

        //var controller = this;

        $scope.data = {}
        $scope.data.sounds = null;

        $scope.model = {};

        $scope.model.mode = 'config';

        $scope.inspect = function () {
            console.log($scope.node);
        };

        $scope.model.showSounds = {};
        $scope.model.showMacros = false;
        $scope.model.predefinedMacros = null;
        $scope.model.predefinedMacrosCategories = null;
        $scope.model.userDefinedMacros = null;
        $scope.model.macroTarget = null;
        $scope.model.filterMacros = '';
        $scope.model.filterCategory = '';
        $scope.model.macrosSelectedTab = 'predefined';

        $scope.model.ModNumberInternalNumberTypeOptions =  [
            {"value": "NUMBER", "label": "Hook a specific extension number"},
            {"value": "REGEX", "label" : "Hook a range of extension numbers"}
        ];




        $scope.checkCanDeleteNode = function (item) {
            if (item.type == 'SYSTEM' ) {
                Notification.warning({'message':'Cannot delete System Component.'});
            } else {
                $scope.model.confirmDelete = true;
            }
        };

        $scope.showSounds = function (id, data) {
            $scope.data.sounds = DataService.getCache('soundsData');
            $scope.model.showSounds[id] = true;
            $scope.model.macroTarget = document.getElementById(id);
        };

        $scope.hideSounds = function (id, data) {
            $scope.data.sounds = null;
            $scope.model.showSounds[id] = false;
        };

        $scope.showMacros = function (id) {
            //get predefined macros
            DataService.getPredefinedMacros().then(function (result) {
                $scope.model.predefinedMacros = result;
                $scope.buildPredefinedMacrosCategories();
            }, function (error) {
                Notification.error(error);
            }).finally(function () {
                //$scope.processing = null;
            });

            //get user defined macros
            $scope.buildUserDefinedMacros();

            $scope.model.showMacros = true;
            if (angular.isObject(id)) {
                $scope.model.macroTarget = id;
            } else {
                $scope.model.macroTarget = document.getElementById(id);
            }
        };

        $scope.buildPredefinedMacrosCategories = function () {
            $scope.model.predefinedMacrosCategories = [{"label": "All", "value": ''}];
            angular.forEach($scope.model.predefinedMacros, function (macro, key) {
                if (macro.hasOwnProperty('category') && ($scope.model.predefinedMacrosCategories.filter(function (e) {
                        return e.value == macro.category;
                    }).length == 0)) {
                    $scope.model.predefinedMacrosCategories.push({"label": macro.category, "value": macro.category});
                }
            }, this);
        };


        $scope.buildUserDefinedMacros = function () {
            $scope.model.userDefinedMacros = [];
            angular.forEach($scope.viewModel.data.nodes, function (node, key) {
                if (['ModAction','ModActionNC'].indexOf(node.templateClass) != -1) {//node is ModAction or ModActionNC
                    angular.forEach(node.outputs, function (item, key) {
                        if (['ModConnector_SFQuery','ModConnector_SFCreate','ModConnector_SFUpdate'].indexOf(item.configCustom) != -1) {
                            if ($scope.item != null && $scope.item.data.id == item.id) { //same item, do not add macros
                                //do nothing
                            } else {
                                $scope.model.userDefinedMacros.push($scope.buildMacroObject(angular.copy(item)));
                            }

                        }
                    }, null);
                }
            }, null);

        };

        $scope.buildMacroObject = function (item) {
            try {
                var macroObject = {
                    "name": item.name,
                    "resultSet": item.config.resultSet,
                    "sObject": item.config.sObject,
                    "type": null,
                    "field": null,
                    "fields": [],
                    "resultSize": null,
                    "selectedRow": null,
                    "duplicate": false
                };

                //try to find the duplicates
                angular.forEach($scope.model.userDefinedMacros, function (otherMacro, key) {
                    if (macroObject.resultSet == otherMacro.resultSet) {
                        macroObject.duplicate = true;
                        otherMacro.duplicate = true;
                    }
                }, null);



                switch (item.configCustom) {
                    case "ModConnector_SFQuery":
                        macroObject.type = 'Query';
                        //extract fields and resultSize from soql
                        var soql = item.config.soql;
                        var fieldsString = soql.substring(soql.indexOf('SELECT') + 6, soql.indexOf('FROM')).replace(/ /g, "");
                        var fields = fieldsString.split(',');
                        angular.forEach(fields, function (field, key) {
                            macroObject.fields.push({"label": field, "name": field});
                        }, null);
                        macroObject.field = macroObject.fields[0].name;
                        var limitString = soql.substring(soql.indexOf('LIMIT') + 5).replace(/ /g, "");
                        macroObject.resultSize = [{"label": "All", "value": -1}];
                        for (i = 1; i <= parseInt(limitString); i++) {
                            macroObject.resultSize.push({"label": i, "value": i});
                        }
                        macroObject.selectedRow = -1;
                        break;
                    case "ModConnector_SFCreate":
                        macroObject.type = 'Create';
                        macroObject.fields.push({"label": 'Id', "name": "Id"});
                        macroObject.field = 'Id';
                        break;
                    case "ModConnector_SFUpdate":
                        macroObject.type = 'Update';
                        macroObject.fields.push({"label": 'Id', "name": "Id"});
                        macroObject.field = 'Id';
                        break;
                }
                return macroObject;
            } catch (error) {
                console.log(error);
            }
        };

        $scope.insertUserDefinedMacro = function (item) {
            var macro = '$(SForce_';
            macro += item.resultSet;
            macro += '.';
            macro += item.field;
            if (item.selectedRow && item.selectedRow >= 0) {
                macro += '[' + item.selectedRow + ']';
            }
            macro += ')';
            $scope.insertMacro({"macro": macro});
        };

        $scope.showDuplicateMacrosWarning = function (resultSetName) {
            Notification.warning({'message':'Duplicate Result Set: <strong>' +resultSetName + '</strong> <br>This can have unpredictable results.'});
        };

        $scope.insertSound = function (id, sound) {
            try {
                $scope.hideSounds(id, null);
                var text = '{' + sound.Tag__c + '}';
                var input = $scope.model.macroTarget;
                if (input == undefined) {
                    return;
                }
                var scrollPos = input.scrollTop;
                var pos = 0;
                var browser = ((input.selectionStart || input.selectionStart == "0") ?
                    "ff" : (document.selection ? "ie" : false ) );
                if (browser == "ie") {
                    input.focus();
                    var range = document.selection.createRange();
                    range.moveStart("character", -input.value.length);
                    pos = range.text.length;
                }
                else if (browser == "ff") {
                    pos = input.selectionStart
                }


                var front = (input.value).substring(0, pos);
                var back = (input.value).substring(pos, input.value.length);
                input.value = front + text + back;
                pos = pos + text.length;
                if (browser == "ie") {
                    input.focus();
                    var range = document.selection.createRange();
                    range.moveStart("character", -input.value.length);
                    range.moveStart("character", pos);
                    range.moveEnd("character", 0);
                    range.select();
                }
                else if (browser == "ff") {
                    input.selectionStart = pos;
                    input.selectionEnd = pos;
                    input.focus();
                }
                input.scrollTop = scrollPos;
                angular.element(input).trigger('input');
            } catch (error) {
                console.log(error);
            }
        };

        $scope.showMacroDescription = function (macro) {
            var shortDescriptionLength = 90;
            var description = macro.description.replace(/\n/g, '<br>');
            return (macro.showFullDescription == true ? $sce.trustAsHtml(description) : $sce.trustAsHtml(description.substr(0, shortDescriptionLength) + ( description.length > shortDescriptionLength ? '... more ... ' : '' )));
        };

        $scope.insertMacro = function (macro) {
            try {
                $scope.model.showMacros = false;
                var text = macro.macro;
                var input = $scope.model.macroTarget;
                if (!angular.isObject(input)) {
                    return;
                }
                //special macro push
                if (input.hasOwnProperty('macroTargetObject')) { //push to target arrays
                    if (input.macroTargetObject.hasOwnProperty(input.macroTargetArray)) {
                        if (angular.isArray(input.macroTargetObject[input.macroTargetArray])) {
                            if (input.macroTargetObject[input.macroTargetArray].indexOf(text) == -1) {
                                input.macroTargetObject[input.macroTargetArray].push(text);
                            } else {
                                Notification.warning({'message':'Macro: <strong>' + text + '</strong> is already in the list.'});
                            }
                        } else {
                            input.macroTargetObject[input.macroTargetArray] = [text];
                        }
                    }
                    return;
                }

                //push to input fields
                var scrollPos = input.scrollTop;
                var pos = 0;
                var browser = ((input.selectionStart || input.selectionStart == "0") ?
                    "ff" : (document.selection ? "ie" : false ) );
                if (browser == "ie") {
                    input.focus();
                    var range = document.selection.createRange();
                    range.moveStart("character", -input.value.length);
                    pos = range.text.length;
                }
                else if (browser == "ff") {
                    pos = input.selectionStart
                }


                var front = (input.value).substring(0, pos);
                var back = (input.value).substring(pos, input.value.length);
                input.value = front + text + back;
                pos = pos + text.length;
                if (browser == "ie") {
                    input.focus();
                    var range = document.selection.createRange();
                    range.moveStart("character", -input.value.length);
                    range.moveStart("character", pos);
                    range.moveEnd("character", 0);
                    range.select();
                }
                else if (browser == "ff") {
                    input.selectionStart = pos;
                    input.selectionEnd = pos;
                    input.focus();
                }
                input.scrollTop = scrollPos;
                angular.element(input).trigger('input');
            } catch (error) {
                console.log(error);
            }
        };


        $scope.moveItemUp = function () {
            var selectedTab = $scope.item.selectedTab;
            var item = $scope.node.moveItemUp($scope.item);
            if (item) {
                $scope.viewModel.handleItemClicked($scope.node, item, false);
                item.selectedTab = selectedTab || 'config';
                $scope.viewModel.updateConnectionsViewModel();
            }
        };

        $scope.moveItemDown = function () {
            var selectedTab = $scope.item.selectedTab;
            var item = $scope.node.moveItemDown($scope.item);
            if (item) {
                $scope.viewModel.handleItemClicked($scope.node, item, false);
                item.selectedTab = selectedTab || 'config';
                $scope.viewModel.updateConnectionsViewModel();
            }
        };

        $scope.addOutputConnector = function () {
            $scope.node.addOutputConnector({
                "name": "new output",
                "id": Date.now(),
                "hasConnector": true,
                "data": {
                    "name": "aaa",
                    "hasConnector": true
                }
            });
        };

        $scope.deleteConnector = function (index) {

            $scope.node.deleteOutputByIndex(index);
            //TODO maybe resolve this in the model
            $scope.viewModel.updateConnectionsViewModel();

        };

        //find the connected node if any
        //$scope.model.connectedNode = $scope.viewModel.findConnectedNode($scope.node.data.id);
        //watch for changes of selected node
        $scope.$watch('node', function (newValue, oldValue) {
            if (newValue) {
                $scope.buildOtherNodes();
                //$scope.model.nodeConnectedNode = $scope.viewModel.findNodeConnectedNode($scope.node.data.id);
                $scope.rebuildModel();
            }
        });

        $scope.$watch('item', function (newValue, oldValue) {
            if (newValue) {
                $scope.buildOtherNodes();
                //$scope.model.itemConnectedNode = $scope.viewModel.findItemConnectedNode($scope.node.data.id, $scope.item.data.id);
                $scope.rebuildModel();
            }
        });


       $scope.inputTemplates = $filter('filter')(nodeTemplates, {inputConnectorsAllowed: true, type: $scope.viewModel.data.type.basic}, true);



        $scope.buildOtherNodes = function () {

            //build other nodes options
            $scope.otherNodes = [];
            $scope.otherNodes.push({id: 'finish', name: 'Hung Up'});
            angular.forEach($scope.viewModel.nodes, function (value, key) {
                if (value != $scope.node && value.data.inputConnectorsAllowed) {
                    $scope.otherNodes.push({id: value.data.id, name: value.data.name + ' (' + value.data.title + ')'});
                }
            }, null);
        };

        $scope.nodeConnectedToChange = function () {
            switch ($scope.node.data.connectedTo) {
                case 'finish':
                    $scope.viewModel.deleteNodeConnection($scope.node);
                    break;
                default:
                    //create / update connection
                    $scope.viewModel.createConnection($scope.node.data.id, null, $scope.node.data.connectedTo);
            }
        };


        $scope.itemConnectedToChange = function () {
            switch ($scope.item.data.connectedTo) {
                case 'finish':
                    $scope.viewModel.deleteItemConnection($scope.node, $scope.item);
                    break;
                default:
                    //create / update connection
                    $scope.viewModel.createConnection($scope.node.data.id, $scope.item.data.id, $scope.item.data.connectedTo);
            }
        };


        $scope.addNewNode = function (templateId) {
            var nodeTemplate = $filter('filter')($scope.inputTemplates, {templateId: templateId}, true)[0];
            var newNode = $scope.viewModel.addNode($scope.createNodeFromTemplate($scope.node, nodeTemplate));
            newNode.selectedTab = 'config';
            $scope.viewModel.handleNodeClicked(newNode, false);
            $scope.viewModel.createConnection($scope.node.data.id, $scope.item ? $scope.item.data.id : null, newNode.data.id);
        };


        $scope.createNodeFromTemplate = function (node, template) {

            var newNodeDataModel = angular.copy(template);
            newNodeDataModel.id = $scope.newId();
            newNodeDataModel.name = template.title;
            newNodeDataModel.connectedTo = 'finish';

            var position = node.getNextNodePosition();
            newNodeDataModel.x = position.x;
            newNodeDataModel.y = position.y;

            if (template.inputConnectorsAllowed) {
                newNodeDataModel.input = {id: $scope.newId(), name: 'Default Input'};
            }

            //if (template.outputConnectorsAllowed) {
                newNodeDataModel.output = {id: $scope.newId(), name: '', outputConnectorsAllowed: template.outputConnectorsAllowed};
            //}

            return newNodeDataModel;

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


        //TODO this might not be required
        $scope.rebuildModel = function () {
            //select the correspondent dialplanTemplate
            $scope.dialplanTemplate = $filter('filter')(dialplanTemplates, {templateClass: $scope.item ? $scope.item.data.configTemplate : $scope.node.data.configTemplate}, true)[0];

            //build sub items options
            $scope.itemsTemplates = $filter('filter')(nodeTemplates, {parentId: $scope.node.data.templateId, type: $scope.viewModel.data.type.basic}, true);
        };


        $scope.addItem = function (item) {
            //check if ModFinish has one app
            if ($scope.node.data.templateClass == 'ModFinish' && $scope.node.data.outputs.length > 0) {
                Notification.warning({'message': $scope.node.data.title + ' Container can have only one App.'});
                return;
            }
            var newItem = angular.copy(item);
            newItem.id = $scope.newId();
            newItem.parentId = $scope.newId();
            newItem.name = item.title;
            newItem.connectedTo = 'finish';

            var newOutput = $scope.node.addOutputConnector(newItem);
            newOutput.selectedTab = 'config';
            $scope.viewModel.handleItemClicked($scope.node, newOutput, false);
        };

        $scope.deleteOutputById = function (id) {
            $scope.node.deleteOutputById(id);
            //TODO maybe resolve this in the model
            $scope.viewModel.updateConnectionsViewModel();
            $scope.viewModel.selectedItem = null;
            $scope.viewModel.selectedNode.selectedTab = 'config';
            $scope.viewModel.handleNodeClicked($scope.viewModel.selectedNode, false);
        };


        $scope.deleteNodeById = function (id) {
            $scope.viewModel.deleteNodeById(id);
            //TODO maybe resolve this in the model
            $scope.viewModel.updateConnectionsViewModel();
            $scope.viewModel.selectedItem = null;
            $scope.viewModel.selectedNode = null;

        };


        // START Connect a call procedures
        $scope.handleScenario = function (scenario) {
            if (scenario.active) {//if scenario was active, then delete correspondent connector and make it inactive
                $scope.node.deleteOutputByValue(scenario.value);
                //TODO maybe resolve this in the model
                $scope.viewModel.updateConnectionsViewModel();
            } else {//if scenario was inactive, then add correspondent connector and make it active
                $scope.node.addOutputConnector({
                    "name": scenario.name,
                    "id": $scope.newId(),
                    "hasConnector": true,
                    data: scenario
                });
            }
            //toggle active
            scenario.active = !scenario.active;
        };
        // END Connect a call procedures


    }])
    //
    // Directive that allows the chart to be edited as json in a textarea.
    //
    .directive('chartJsonEdit', function () {
        return {
            restrict: 'C',
            scope: {
                viewModel: "="
            },
            link: function (scope, elem, attr) {

                //
                // Serialize the data model as json and update the textarea.
                //
                var updateJson = function () {
                    if (scope.viewModel) {
                        var json = JSON.stringify(scope.viewModel.data, null, 4);
                        $(elem).val(json);
                    }
                };

                //
                // First up, set the initial value of the textarea.
                //
                updateJson();

                //
                // Watch for changes in the data model and update the textarea whenever necessary.
                //
                scope.$watch("viewModel.data", updateJson, true);

                //
                // Handle the change event from the textarea and update the data model
                // from the modified json.
                //
                $(elem).bind("input propertychange", function () {
                    try {
                        var json = $(elem).val();
                        var dataModel = JSON.parse(json);
                        scope.viewModel = new flowchart.ChartViewModel(dataModel);

                        scope.$digest();
                    } catch (error) {
                        console.log(error);
                    }
                });
            }
        }

    })

    //
    // Controller for the flowchart directive.
    // Having a separate controller is better for unit testing, otherwise
    // it is painful to unit test a directive without instantiating the DOM
    // (which is possible, just not ideal).
    //
    .controller('FlowChartController', ['$scope', 'dragging', '$element', '$filter', 'Notification', function FlowChartController($scope, dragging, $element, $filter, Notification) {

        var controller = this;

        //
        // Reference to the document and jQuery, can be overridden for testting.
        //
        this.document = document;

        //
        // Wrap jQuery so it can easily be  mocked for testing.
        //
        this.jQuery = function (element) {
            return $(element);
        };

        $scope.$watch('chart.data.type', function (newValue, oldValue) {
            //TODO REMOVE
            /*if (oldValue !== undefined && angular.isObject(newValue)) {
                if (newValue.basic == 'NON_CALL') {
                    $scope.addDefaultNode(2);
                } else {
                    //delete all nodes
                    angular.forEach($scope.chart.data.nodes, function (node, key) {
                        $scope.chart.deleteNodeById(node.id);
                    }, this);
                }
            }
            */
            //add init nodes
            if ($scope.chart && $scope.chart.data.nodes && $scope.chart.data.nodes.length == 0) {
                $scope.addDefaultNode(2);
            }
        });


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


        if ($scope.chart && !$scope.chart.data.hasOwnProperty('finishId')) {
            $scope.chart.data.finishId = $scope.newId();
        }

        $scope.showChartOptionsDialog = function () {
          $scope.$parent.showChartOptionsDialog();
        };

        $scope.addDefaultNode = function (id) {

            $scope.showInputs = false;

            var nodeTemplate = $filter('filter')(nodeTemplates, {inputConnectorsAllowed: false, templateId: id}, true)[0];

            var newNode = $scope.chart.addNode($scope.createStartNodeFromTemplate($scope.node, nodeTemplate), true);
            newNode.selectedTab = 'config';

        };

        $scope.addStartNode = function (id) {
            try {
                //check special items
                if (id == 81) { //ModNumber_FromSIPTrunk
                    angular.forEach($scope.chart.data.nodes, function (node, key) {
                        if (node.templateId == 81) {
                            throw new Error('Only one item of this type: "' + node.title + '" can be used across all Routing Policies.');
                        }
                    }, this);
                }
            }  catch (error) {
                Notification.error(error);
                return;
            }

            $scope.showInputs = false;

            var nodeTemplate = $filter('filter')(nodeTemplates, {inputConnectorsAllowed: false, templateId: id}, true)[0];

            var newNode = $scope.chart.addNode($scope.createStartNodeFromTemplate($scope.node, nodeTemplate), true);
            newNode.selectedTab = 'config';

            $scope.chart.handleNodeClicked(newNode, false);
        };

        $scope.createStartNodeFromTemplate = function (node, template) {

            var newNodeDataModel = angular.copy(template);
            newNodeDataModel.id = $scope.newId();
            newNodeDataModel.parentId = $scope.newId();
            newNodeDataModel.name = template.title;
            newNodeDataModel.connectedTo = 'finish';


            var position = $scope.getStartNodePosition();
            newNodeDataModel.x = position.x;
            newNodeDataModel.y = position.y;


            //if (template.outputConnectorsAllowed) {
                newNodeDataModel.output = {
                    id: $scope.newId(),
                    name: template.hasOwnProperty('defaultOutputLabel') ? template.defaultOutputLabel : '',
                    outputConnectorsAllowed: template.outputConnectorsAllowed
                };
            //}

            return newNodeDataModel;

        };

        $scope.getStartNodePosition = function () {

            var position = {};
            var startNodes = $filter('filter')($scope.chart.nodes, function (o) {
                return o.data.inputConnectorsAllowed == false;
            });
            if (startNodes.length > 0) {
                var lastInputNode = startNodes[startNodes.length - 1];
                position.x = lastInputNode.x();
                position.y = lastInputNode.y() + lastInputNode.height() + 50;
            } else {
                position.x = 28;
                position.y = 96;
            }

            return position;
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
        // Init data-model variables.
        //
        $scope.draggingConnection = false;
        $scope.connectorSize = 10;
        $scope.dragSelecting = false;
        /* Can use this to test the drag selection rect.
         $scope.dragSelectionRect = {
         x: 0,
         y: 0,
         width: 0,
         height: 0,
         };
         */

        //
        // Reference to the connection, connector or node that the mouse is currently over.
        //
        $scope.mouseOverConnector = null;
        $scope.mouseOverConnection = null;
        $scope.mouseOverNode = null;

        //
        // The class for connections and connectors.
        //
        this.connectionClass = 'connection';
        this.connectorClass = 'connector';
        this.nodeClass = 'node';

        //
        // Search up the HTML element tree for an element the requested class.
        //
        this.searchUp = function (element, parentClass) {

            //
            // Reached the root.
            //
            if (element == null || element.length == 0) {
                return null;
            }

            //
            // Check if the element has the class that identifies it as a connector.
            //
            if (hasClassSVG(element, parentClass)) {
                //
                // Found the connector element.
                //
                return element;
            }

            //
            // Recursively search parent elements.
            //
            return this.searchUp(element.parent(), parentClass);
        };

        //
        // Hit test and retreive node and connector that was hit at the specified coordinates.
        //
        this.hitTest = function (clientX, clientY) {

            //
            // Retreive the element the mouse is currently over.
            //
            return this.document.elementFromPoint(clientX, clientY);
        };

        //
        // Hit test and retreive node and connector that was hit at the specified coordinates.
        //
        this.checkForHit = function (mouseOverElement, whichClass) {

            //
            // Find the parent element, if any, that is a connector.
            //
            var hoverElement = this.searchUp(this.jQuery(mouseOverElement), whichClass);


            if (!hoverElement) {
                return null;
            }

            return hoverElement.scope();
        };

        //
        // Translate the coordinates so they are relative to the svg element.
        //
        this.translateCoordinates = function (x, y, evt) {
            var svg_elem = $element.get(0);
            var matrix = svg_elem.getScreenCTM().translate($scope.chart.data.translateX || 0, $scope.chart.data.translateY || 0).scale($scope.chart.data.zoom || 1);
            //apply canvas zoom on the matrix
            //matrix = matrix.scale($scope.chart.data.zoom);
            var point = svg_elem.createSVGPoint();
            point.x = x;
            point.y = y;
            return point.matrixTransform(matrix.inverse());
        };


        //
        // Called on mouse down in the chart.
        //
        $scope.mouseDown = function (evt) {

            if ($scope.chart && $scope.chart.data.type != null && $scope.chart.data.name != null) $scope.$parent.hideChartOptionsDialog();

            if ($scope.chart) {
                $scope.chart.deselectAll();
            }

            dragging.startDrag(evt, {

                //
                // Commence dragging... setup variables to display the drag selection rect.
                //

                dragStarted: function (x, y) {
                    var startPoint = controller.translateCoordinates(x, y, evt);
                    $scope.dragSelectionStartPoint = startPoint;
                    $scope.initTranslateX = $scope.chart.data.translateX || 0;
                    $scope.initTranslateY = $scope.chart.data.translateY || 0;
                    if (evt.ctrlKey) {
                        $scope.dragSelecting = true;
                        $scope.dragSelectionRect = {
                            x: startPoint.x,
                            y: startPoint.y,
                            width: 0,
                            height: 0,
                        };
                    } else {
                        $scope.dragTranslate = true;
                    }
                },

                //
                // Update the drag selection rect while dragging continues.
                //
                dragging: function (x, y) {
                    var startPoint = $scope.dragSelectionStartPoint;
                    var curPoint = controller.translateCoordinates(x, y, evt);
                    if (evt.ctrlKey) {
                        $scope.dragSelectionRect = {
                            x: curPoint.x > startPoint.x ? startPoint.x : curPoint.x,
                            y: curPoint.y > startPoint.y ? startPoint.y : curPoint.y,
                            width: curPoint.x > startPoint.x ? curPoint.x - startPoint.x : startPoint.x - curPoint.x,
                            height: curPoint.y > startPoint.y ? curPoint.y - startPoint.y : startPoint.y - curPoint.y,
                        };
                    } else if ($scope.dragTranslate) {
                        var canvas = document.getElementById('canvas');
                        var canvasInfo = canvas.getBoundingClientRect();
                        var viewport = document.getElementById('viewport');
                        var viewportInfo = viewport.getBoundingClientRect();

                        $scope.translateX = canvasInfo.width > viewportInfo.width ? 0 : Math.max(Math.min(0,canvasInfo.width - viewportInfo.width - 50), Math.min(0, $scope.initTranslateX  + (curPoint.x - startPoint.x) * $scope.chart.data.zoom));
                        $scope.translateY = canvasInfo.height > viewportInfo.height ? 0 : Math.max(Math.min(0,canvasInfo.height - viewportInfo.height - 50), Math.min(0, $scope.initTranslateY  + (curPoint.y - startPoint.y) * $scope.chart.data.zoom));

                        viewport.setAttribute('transform',' translate('+$scope.translateX+','+$scope.translateY+') scale('+$scope.chart.data.zoom+')');
                    }
                },

                //
                // Dragging has ended... select all that are within the drag selection rect.
                //
                dragEnded: function () {
                    if (evt.ctrlKey) {
                        $scope.dragSelecting = false;
                        $scope.chart.applySelectionRect($scope.dragSelectionRect);
                        delete $scope.dragSelectionStartPoint;
                        delete $scope.dragSelectionRect;
                    } else {
                        $scope.chart.data.translateX = $scope.translateX;
                        $scope.chart.data.translateY = $scope.translateY;
                        $scope.dragTranslate = false;
                    }
                },
            });
        };

        //
        // Called for each mouse move on the svg element.
        //
        $scope.mouseMove = function (evt) {

            //
            // Clear out all cached mouse over elements.
            //
            $scope.mouseOverConnection = null;
            $scope.mouseOverConnector = null;
            $scope.mouseOverNode = null;

            var mouseOverElement = controller.hitTest(evt.clientX, evt.clientY);
            if (mouseOverElement == null) {
                // Mouse isn't over anything, just clear all.
                return;
            }

            if (!$scope.draggingConnection) { // Only allow 'connection mouse over' when not dragging out a connection.

                // Figure out if the mouse is over a connection.
                var scope = controller.checkForHit(mouseOverElement, controller.connectionClass);
                $scope.mouseOverConnection = (scope && scope.connection) ? scope.connection : null;
                if ($scope.mouseOverConnection) {
                    // Don't attempt to mouse over anything else.
                    return;
                }
            }

            // Figure out if the mouse is over a connector.
            var scope = controller.checkForHit(mouseOverElement, controller.connectorClass);
            $scope.mouseOverConnector = (scope && scope.connector) ? scope.connector : null;
            if ($scope.mouseOverConnector) {
                // Don't attempt to mouse over anything else.
                return;
            }

            // Figure out if the mouse is over a node.
            var scope = controller.checkForHit(mouseOverElement, controller.nodeClass);
            $scope.mouseOverNode = (scope && scope.node) ? scope.node : null;
        };


        $scope.nodeHeaderMouseDown = function (evt, node) {
            node.selectedTab = 'config';
        };

        $scope.nodeFooterMouseDown = function (evt, node) {
            node.data.activeChildren ? node.selectedTab = 'apps' : node.selectedTab = 'connect';
        };


        //
        // Handle mousedown on a node.
        //

        $scope.nodeMouseDown = function (evt, node) {

            if (!$scope.chart.data.type) {
                return;
            }

            node.selectedTab = node.selectedTab || 'config';

            var chart = $scope.chart;
            var lastMouseCoords;

            dragging.startDrag(evt, {

                //
                // Node dragging has commenced.
                //
                dragStarted: function (x, y) {

                    lastMouseCoords = controller.translateCoordinates(x, y, evt);

                    //
                    // If nothing is selected when dragging starts,
                    // at least select the node we are dragging.
                    //
                    if (!node.selected()) {
                        chart.deselectAll();
                        node.select();
                    }
                },

                //
                // Dragging selected nodes... update their x,y coordinates.
                //
                dragging: function (x, y) {

                    var curCoords = controller.translateCoordinates(x, y, evt);
                    var deltaX = curCoords.x - lastMouseCoords.x;
                    var deltaY = curCoords.y - lastMouseCoords.y;

                    chart.updateSelectedNodesLocation(deltaX, deltaY);

                    lastMouseCoords = curCoords;
                },

                //
                // The node wasn't dragged... it was clicked.
                //
                clicked: function () {

                    chart.handleNodeClicked(node, evt.ctrlKey);
                },

            });
        };


        //
        // Handle mousedown on a item.
        //
        $scope.itemMouseDown = function (evt, node, item, elementIndex) {

            item.selectedTab = 'config';

            if (!node.data.activeChildren) {
                return $scope.nodeMouseDown(evt, node);
            };

            var chart = $scope.chart;
            var lastMouseCoords;

            var itemWasSelected = item.selected();


            dragging.startDrag(evt, {


                //
                // Node dragging has commenced.
                //
                dragStarted: function (x, y) {

                    lastMouseCoords = controller.translateCoordinates(x, y, evt);

                    //
                    // If nothing is selected when dragging starts,
                    // at least select the node we are dragging.
                    //
                    if (!item.selected()) {
                        chart.deselectAll();
                        item.select();
                    }
                },

                dragEnded: function (x, y) {

                    var shift = Math.round(item.translatedY / 32);

                    var newItem = node.moveItem(item, shift);
                    if (newItem) {
                        newItem.selectedTab = newItem.selectedTab || 'config';
                        if (item.selected()) {
                            newItem.select();
                        }
                        chart.updateConnectionsViewModel();
                    }

                    //reset transform
                    item.translatedY = 0;
                },

                //
                // Dragging selected item... update their x,y coordinates.
                //
                dragging: function (x, y) {

                    var curCoords = controller.translateCoordinates(x, y, evt);
                    var deltaX = curCoords.x - lastMouseCoords.x;
                    var deltaY = curCoords.y - lastMouseCoords.y;

                    chart.updateItemLocation(node, item, elementIndex, deltaX, deltaY);

                    lastMouseCoords = curCoords;
                },

                //
                // The node wasn't dragged... it was clicked.
                //
                clicked: function () {
                    chart.handleItemClicked(node, item, evt.ctrlKey);
                },

            });
        };

        //
        // Handle mousedown on a connection.
        //
        $scope.connectionMouseDown = function (evt, connection) {
            var chart = $scope.chart;
            chart.deleteConnection(connection);

            //chart.handleConnectionMouseDown(connection, evt.ctrlKey);

            // Don't let the chart handle the mouse down.
            evt.stopPropagation();
            evt.preventDefault();
        };

        //dragging directives
        //TODO optimise
        $scope.dDraggingCurveto = function () {
            var ret = 'M ' + $scope.dragPoint1.x + ', ' + $scope.dragPoint1.y + ' ' +
                'C ' + $scope.dragTangent1.x + ', ' + $scope.dragTangent1.y + ' ' + +$scope.dragTangent2.x + ', ' + $scope.dragTangent2.y + ' ' + +$scope.dragPoint2.x + ' ' + $scope.dragPoint2.y;
            return ret;
        };

        //TODO optimise
        $scope.dDraggingManhattan = function () {
            var junctionPoint = ($scope.dragPoint2.x - ($scope.dragPoint2.x - $scope.dragPoint1.x) / 2);
            var ret = 'M ' + $scope.dragPoint1.x + ', ' + $scope.dragPoint1.y + ' ' +
                'L ' + junctionPoint + ' ' + $scope.dragPoint1.y + ' ' +
                'L ' + junctionPoint + ' ' + $scope.dragPoint2.y + ' ' +
                'L ' + $scope.dragPoint2.x + ' ' + $scope.dragPoint2.y;
            return ret;
        };

        $scope.dDraggingConnection = function () {
            switch ($scope.chart.connectionType) {
                case 'smooth':
                    return $scope.dDraggingCurveto();
                    break;
                case 'manhattan' :
                    return $scope.dDraggingManhattan();
                    break;
                default:
                    return this.dCurveto();
            }
        };

        $scope.inputConnectorMouseDown = function (evt, node, connector, connectorIndex, isInputConnector) {
            //node.selectedTab = 'connect';
            //$scope.chart.handleNodeClicked(node, evt.ctrlKey);
            $scope.connectorMouseDown(evt, node, connector, connectorIndex, isInputConnector);

        };

        /*
         $scope.outputConnectorMouseDown = function (evt, node, connector, connectorIndex, isInputConnector) {
         console.log('\\\\\\\\\\\\\\\ outputConnectorMouseDown');
         //$scope.chart.handleNodeClicked(node, evt.ctrlKey);
         $scope.connectorMouseDown(evt, node, connector, connectorIndex, isInputConnector);
         node.selectedTab = 'connect';
         console.log('node.selectedTab = connect;')
         };
         */


        //
        // Handle mousedown on an connector.
        //
        $scope.connectorMouseDown = function (evt, node, connector, connectorIndex, isInputConnector) {

            node.selectedTab = 'connect';
            connector.selectedTab = 'connect';

            //prevent multiple connections to output
            if (connector.connected && !isInputConnector) return false;


            //
            // Initiate dragging out of a connection.
            //
            dragging.startDrag(evt, {

                //
                // Called when the mouse has moved greater than the threshold distance
                // and dragging has commenced.
                //


                dragStarted: function (x, y) {

                    var curCoords = controller.translateCoordinates(x, y, evt);

                    $scope.draggingConnection = true;
                    $scope.isInputConnector = isInputConnector;
                    $scope.dragPoint1 = flowchart.computeConnectorPos(node, connectorIndex, isInputConnector);
                    $scope.dragPoint2 = {
                        x: curCoords.x,
                        y: curCoords.y
                    };
                    $scope.dragTangent1 = flowchart.computeConnectionSourceTangent($scope.dragPoint1, $scope.dragPoint2);
                    $scope.dragTangent2 = flowchart.computeConnectionDestTangent($scope.dragPoint1, $scope.dragPoint2);
                },

                //
                // Called on mousemove while dragging out a connection.
                //
                dragging: function (x, y, evt) {
                    var startCoords = controller.translateCoordinates(x, y, evt);
                    $scope.dragPoint1 = flowchart.computeConnectorPos(node, connectorIndex, isInputConnector);
                    $scope.dragPoint2 = {
                        x: startCoords.x,
                        y: startCoords.y
                    };
                    $scope.dragTangent1 = flowchart.computeConnectionSourceTangent($scope.dragPoint1, $scope.dragPoint2);
                    $scope.dragTangent2 = flowchart.computeConnectionDestTangent($scope.dragPoint1, $scope.dragPoint2);
                },

                //
                // Clean up when dragging has finished.
                //
                dragEnded: function () {

                    if ($scope.mouseOverConnector &&
                        $scope.mouseOverConnector !== connector) {

                        //
                        // Dragging has ended...
                        // The mouse is over a valid connector...
                        // Create a new connection.
                        //


                        $scope.chart.createNewConnection(connector, $scope.mouseOverConnector);
                    }

                    $scope.draggingConnection = false;
                    $scope.isInputConnector = null;
                    delete $scope.dragPoint1;
                    delete $scope.dragTangent1;
                    delete $scope.dragPoint2;
                    delete $scope.dragTangent2;
                },

            });
        };


        //mobile touch support
        $scope.onHammer = function (e, node) {
            try {
                if (event.type.match(/^touch/) && (event.target.tagName == 'rect' || event.target.tagName == 'text')) {
                    switch (e.type) {
                        case 'panstart':
                            event.stopImmediatePropagation();
                            $scope.touchInitX = (node.data.x || 0);
                            $scope.touchInitY = (node.data.y || 0);
                            break;
                        case 'panmove':
                            event.stopImmediatePropagation();
                            //fix delayed panstart
                            if ($scope.touchInitX === undefined) {
                                $scope.touchInitX = (node.data.x || 0);
                            }
                            if ($scope.touchInitY === undefined) {
                                $scope.touchInitY = (node.data.y || 0);
                            }
                            node.data.x = $scope.touchInitX + e.deltaX;
                            node.data.y = $scope.touchInitY + e.deltaY;
                            break;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
    }])
;