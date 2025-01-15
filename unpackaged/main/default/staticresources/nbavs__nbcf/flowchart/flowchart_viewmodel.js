//
//
// Global accessor.
//
var flowchart = {};

// Module.
(function () {

    flowchart.connectionType = 'smooth';

    //
    // Width of a node.
    //
    flowchart.defaultNodeWidth = 200;


    //
    // Item dimensions.
    //
    flowchart.itemPadding = 4;
    flowchart.itemWidth = flowchart.defaultNodeWidth - flowchart.itemPadding * 2;
    flowchart.itemHeight = 28;

    //
    // Amount of space reserved for displaying the node's name.
    //
    flowchart.nodeNameHeight = 32;


    //
    // Height of a connector in a node.
    //
    flowchart.connectorHeight = 30;

    flowchart.maxPhoneNumbersShown = 5;

    //
    // output connector Y offset
    //
    //flowchart.outputConnectorOffset = 40;

    //
    // time of last item/node click
    //
    flowchart.lastClickTime = 0;

    // Compute the Y coordinate of a connector, given its index.
    //
    flowchart.computeConnectorY = function (connectorIndex, inputConnector, data) {
        if (data != undefined && data.templateId == 3) {
            return flowchart.computeConnectorY_ModNumber_Public(data);
        } else if (data != undefined && (data.templateId == 31 || data.templateId == 3100000  || data.templateId == 93)) { //custom renderers
            return (1.5 * flowchart.nodeNameHeight) + (1 * (flowchart.connectorHeight));
        } else {
            return (inputConnector ? flowchart.nodeNameHeight/2 : (1.5 * flowchart.nodeNameHeight)) + (connectorIndex * (flowchart.connectorHeight));
        }
    };

    flowchart.computeConnectorY_ModNumber_Public = function (data) {
        return (1.5 * flowchart.nodeNameHeight + (Math.min(flowchart.maxPhoneNumbersShown, data.subItems.length) * flowchart.connectorHeight));
    };


    //
    // Compute the position of a connector in the graph.
    //
    flowchart.computeConnectorPos = function (node, connectorIndex, inputConnector) {
        return {
            x: node.x() + (inputConnector ? 0 : node.width ? node.width() : flowchart.defaultNodeWidth),
            y: node.y() + flowchart.computeConnectorY(connectorIndex, inputConnector, node.data),
        };
    };

    //
    // find if a node/item click is allowed
    //
    flowchart.isClickAllowed = function () {
        var d = new Date();
        var n = d.getTime();
        if (n - this.lastClickTime > 1200) {
            this.lastClickTime = n;
            document.body.style.cursor = 'wait';
            setTimeout(function(){
                    document.body.style.cursor = 'auto';
                },
                1200
            );
            return true;
        }
        return false;
    };

    //
    // View model for a connector.
    //
    flowchart.ConnectorViewModel = function (connectorDataModel, x, y, parentNode) {

        this.data = connectorDataModel;
        //this.id = this.data.id;
        this._parentNode = parentNode;
        this._x = x;
        this._y = y;
        this.connected = false;


        // Set to true when the node is selected.
        this._selected = false;

        //
        // Select the node.
        //
        this.select = function () {
            this._selected = true;
        };

        //
        // Deselect the node.
        //
        this.deselect = function () {
            this._selected = false;
        };

        //
        // Toggle the selection state of the node.
        //
        this.toggleSelected = function () {
            this._selected = !this._selected;
        };

        //
        // Returns true if the node is selected.
        //
        this.selected = function () {
            return this._selected;
        };


        //
        // The name of the connector.
        //
        this.name = function () {
            //return this.data.name;
        }

        //
        // X coordinate of the connector.
        //
        this.x = function () {
            return this._x;
        };

        //
        // Y coordinate of the connector.
        //
        this.y = function () {
            return this._y;
        };

        //
        // The parent node that the connector is attached to.
        //
        this.parentNode = function () {
            return this._parentNode;
        };
    };

    //
    // Create view model for a list of data models.
    //
    var createConnectorsViewModel = function (connectorDataModels, x, parentNode, inputConnector) {
        var viewModels = [];

        if (connectorDataModels) {
            for (var i = 0; i < connectorDataModels.length; ++i) {
                var connectorViewModel =
                    new flowchart.ConnectorViewModel(connectorDataModels[i], x, flowchart.computeConnectorY(i, inputConnector), parentNode);
                viewModels.push(connectorViewModel);
            }
        }

        return viewModels;
    };


    //
    // View model for a node.
    //
    flowchart.NodeViewModel = function (nodeDataModel) {

        this.data = nodeDataModel;

        // set the default width value of the node
        if (!this.data.width || this.data.width < 0) {
            this.data.width = flowchart.defaultNodeWidth;
        }

        this.outputs = createConnectorsViewModel(this.data.outputs, this.data.width, this, false);

        //output
        if (this.data.output) {
            this.data.output.type = 'defaultOutput';
            this.output = [new flowchart.ConnectorViewModel(this.data.output, this.data.width, flowchart.computeConnectorY(this.outputs.length, false, this.data), this)];
        }

        this.adjustOutputY = function () {
            this.output[0]._y = flowchart.computeConnectorY(this.outputs.length, false, this.data);
        }

        //input
        if (this.data.input) {
            this.input = [new flowchart.ConnectorViewModel(this.data.input, 0, flowchart.computeConnectorY(0, true), this)];
        }

        // Set to true when the node is selected.
        this._selected = false;

        //
        // Name of the node.
        //
        this.name = function () {
            return this.data.name || "";
        };

        //
        // X coordinate of the node.
        //
        this.x = function () {
            return this.data.x;
        };

        //
        // Y coordinate of the node.
        //
        this.y = function () {
            return this.data.y;
        };

        //
        // Width of the node.
        //
        this.width = function () {
            return this.data.width;
        }

        //
        // Height of the node.
        //
        this.height = function () {
            var _height;

            switch (this.data.templateId) {
                case 3:
                    _height = this.calculateHeight_ModNumber_Public();
                    break;
                case 31:
                case 3100000:
                case 93:
                    _height = flowchart.computeConnectorY(2, false) - flowchart.nodeNameHeight / 2;//custom renderers
                    break;
                default:
                    _height = flowchart.computeConnectorY(this.outputs.length + 1, false) - flowchart.nodeNameHeight / 2;
            }

            return _height;
        }

        this.calculateHeight_ModNumber_Public = function () {
            var _height = flowchart.nodeNameHeight * 2 - 2;
            _height += Math.min(flowchart.maxPhoneNumbersShown, this.data.subItems.length) * flowchart.connectorHeight;
            return _height;
        };

        //
        // Select the node.
        //
        this.select = function () {
            this._selected = true;
        };

        //
        // Deselect the node.
        //
        this.deselect = function () {
            this._selected = false;
            //TODO optimise
            var items = this.outputs;
            for (var i = 0; i < items.length; ++i) {
                var item = items[i];
                item.deselect();
            }

        };


        //
        // Toggle the selection state of the node.
        //
        this.toggleSelected = function () {
            this._selected = !this._selected;
        };

        //
        // Returns true if the node is selected.
        //
        this.selected = function () {
            return this._selected;
        };

        //
        // Internal function to add a connector.
        this._addConnector = function (connectorDataModel, x, connectorsDataModel, connectorsViewModel, inputConnector) {
            var connectorViewModel =
                new flowchart.ConnectorViewModel(connectorDataModel, x,
                    flowchart.computeConnectorY(connectorsViewModel.length, inputConnector), this);

            connectorsDataModel.push(connectorDataModel);

            // Add to node's view model.
            connectorsViewModel.push(connectorViewModel);
            return connectorViewModel;
        }

        //
        // Add an input connector to the node.
        //
        this.addInputConnector = function (connectorDataModel) {

            if (!this.data.inputConnectors) {
                this.data.inputConnectors = [];
            }
            this._addConnector(connectorDataModel, 0, this.data.inputConnectors, this.inputConnectors, true);
        };

        //
        // Add an ouput connector to the node.
        //
        this.addOutputConnector = function (connectorDataModel) {

            if (!this.data.outputs) {
                this.data.outputs = [];
            }
            var connectorViewModel = this._addConnector(connectorDataModel, this.data.width, this.data.outputs, this.outputs, false);
            this.adjustOutputY();
            return connectorViewModel;
        };


        //shift outputs

        this.moveItemUp = function (item) {
            var index = this.outputs.indexOf(item);
            if (index < 1) return;
            this.data.outputs.splice(index - 1, 0, this.data.outputs.splice(index, 1)[0]);
            //this.outputs.splice(index-1, 0, this.outputs.splice(index,1)[0]);
            this.outputs = createConnectorsViewModel(this.data.outputs, this.data.width, this, false);
            return this.outputs[index - 1];
        };

        this.moveItemDown = function (item) {
            var index = this.outputs.indexOf(item);
            if (index > (this.outputs.length - 2)) return;
            this.data.outputs.splice(index + 1, 0, this.data.outputs.splice(index, 1)[0]);
            //this.outputs.splice(index-1, 0, this.outputs.splice(index,1)[0]);
            this.outputs = createConnectorsViewModel(this.data.outputs, this.data.width, this, false);
            return this.outputs[index + 1];
        };

        //move item from dragging
        this.moveItem = function (item, shift) {
            var index = this.outputs.indexOf(item);
            this.data.outputs.splice(index + shift, 0, this.data.outputs.splice(index, 1)[0]);
            this.outputs = createConnectorsViewModel(this.data.outputs, this.data.width, this, false);
            return this.outputs[index + shift];
        };

        //
        //delete output
        //

        this.deleteOutputByIndex = function (index) {
            this.data.outputs.splice(index, 1);
            this.outputs = createConnectorsViewModel(this.data.outputs, this.data.width, this, false);
            this.adjustOutputY();

        }

        this.deleteOutputById = function (id) {

            for (var i = 0; i < this.data.outputs.length; ++i) {

                if (this.data.outputs[i].id == id) {
                    this.deleteOutputByIndex(i);
                    break;
                }
            }
        };

        this.deleteOutputByValue = function (value) {
            for (var i = 0; i < this.data.outputs.length; ++i) {

                if (this.data.outputs[i].data.value == value) {
                    this.deleteOutputByIndex(i);
                    break;
                }
            }
        };


        this.getNextNodePosition = function () {
            var position = {};
            position.x = this.x() + this.width() + 100;
            position.y = this.y() //  + node.height();

            return position;
        }

    };


    //
    // Wrap the nodes data-model in a view-model.
    //
    var createNodesViewModel = function (nodesDataModel) {
        var nodesViewModel = [];

        if (nodesDataModel) {
            for (var i = 0; i < nodesDataModel.length; ++i) {
                nodesViewModel.push(new flowchart.NodeViewModel(nodesDataModel[i]));
            }
        }

        return nodesViewModel;
    };

    //
    // View model for a connection.
    //
    flowchart.ConnectionViewModel = function (connectionDataModel, sourceConnector, destConnector) {

        this.data = connectionDataModel;
        this.source = sourceConnector;
        this.dest = destConnector;
        this.source.connected = true;
        this.dest.connected = true;

        // Set to true when the connection is selected.
        this._selected = false;

        this.name = function () {
            return this.data.name || "";
        }

        //TODO optimise
        this.dCurveto = function (index) {
            //var ret = 'M ' + this.sourceCoordX() + ', ' + this.sourceCoordY() + ' ' +
            var ret = 'M ' + this.sourceCoordX() + ', ' + this.sourceCoordYTransform() + ' ' +
                'C ' + this.sourceTangentX() + ', ' + this.sourceTangentY() + ' ' + +this.destTangentX() + ', ' + this.destTangentY() + ' ' + +this.destCoordX() + ' ' + this.destCoordY();
            return ret;
        };

        //TODO optimise
        this.dManhattan = function (index) {
            var junctionPoint = (this.destCoordX() - (this.destCoordX() - this.sourceCoordX()) / 2) - ((index - 1) * 10);
            /*
             var ret = 'M ' + this.sourceCoordX() + ', ' + this.sourceCoordY() + ' ' +
             'L ' + junctionPoint + ' ' + this.sourceCoordY() + ' ' +
             'L ' + junctionPoint + ' ' + this.destCoordY() + ' ' +
             'L ' + this.destCoordX() + ' ' + this.destCoordY();
             ;
             */
            var ret = 'M ' + this.sourceCoordX() + ', ' + this.sourceCoordYTransform() + ' ' +
                'L ' + junctionPoint + ' ' + this.sourceCoordYTransform() + ' ' +
                'L ' + junctionPoint + ' ' + this.destCoordY() + ' ' +
                'L ' + this.destCoordX() + ' ' + this.destCoordY();
            ;
            return ret;
        };

        this.dConnection = function (index) {
            switch (flowchart.connectionType) {
                case 'smooth':
                    return this.dCurveto(index);
                    break;
                case 'manhattan' :
                    return this.dManhattan(index);
                    break;
                default:
                    return this.dCurveto(index);
            }
        };


        this.sourceCoordX = function () {
            return this.source.parentNode().x() + this.source.x();
        };

        this.sourceCoordY = function () {
            return this.source.parentNode().y() + this.source.y();
        };

        this.sourceCoordYTransform = function () {
            return this.source.parentNode().y() + this.source.y() + (this.source.translatedY || 0);
        };

        this.sourceCoord = function () {
            return {
                x: this.sourceCoordX(),
                y: this.sourceCoordY()
            };
        }

        this.sourceTangentX = function () {
            return flowchart.computeConnectionSourceTangentX(this.sourceCoord(), this.destCoord());
        };

        this.sourceTangentY = function () {
            return flowchart.computeConnectionSourceTangentY(this.sourceCoord(), this.destCoord());
        };

        this.destCoordX = function () {
            return this.dest.parentNode().x() + this.dest.x();
        };

        this.destCoordY = function () {
            return this.dest.parentNode().y() + this.dest.y();
        };

        this.destCoord = function () {
            return {
                x: this.destCoordX(),
                y: this.destCoordY()
            };
        }

        this.destTangentX = function () {
            return flowchart.computeConnectionDestTangentX(this.sourceCoord(), this.destCoord());
        };

        this.destTangentY = function () {
            return flowchart.computeConnectionDestTangentY(this.sourceCoord(), this.destCoord());
        };

        this.middleX = function (scale) {
            if (typeof(scale) == "undefined")
                scale = 0.5;
            return this.sourceCoordX() * (1 - scale) + this.destCoordX() * scale;
        };

        this.middleY = function (scale) {
            if (typeof(scale) == "undefined")
                scale = 0.5;
            return this.sourceCoordY() * (1 - scale) + this.destCoordY() * scale;
        };


        //
        // Select the connection.
        //
        this.select = function () {
            this._selected = true;
        };

        //
        // Deselect the connection.
        //
        this.deselect = function () {
            this._selected = false;
        };

        //
        // Toggle the selection state of the connection.
        //
        this.toggleSelected = function () {
            this._selected = !this._selected;
        };

        //
        // Returns true if the connection is selected.
        //
        this.selected = function () {
            return this._selected;
        };
    };

    //
    // Helper function.
    //
    var computeConnectionTangentOffset = function (pt1, pt2) {

        return (pt2.x - pt1.x) / 2;
    }

    //
    // Compute the tangent for the bezier curve.
    //
    flowchart.computeConnectionSourceTangentX = function (pt1, pt2) {

        return pt1.x + computeConnectionTangentOffset(pt1, pt2);
    };

    //
    // Compute the tangent for the bezier curve.
    //
    flowchart.computeConnectionSourceTangentY = function (pt1, pt2) {

        return pt1.y;
    };

    //
    // Compute the tangent for the bezier curve.
    //
    flowchart.computeConnectionSourceTangent = function (pt1, pt2) {
        return {
            x: flowchart.computeConnectionSourceTangentX(pt1, pt2),
            y: flowchart.computeConnectionSourceTangentY(pt1, pt2),
        };
    };

    //
    // Compute the tangent for the bezier curve.
    //
    flowchart.computeConnectionDestTangentX = function (pt1, pt2) {

        return pt2.x - computeConnectionTangentOffset(pt1, pt2);
    };

    //
    // Compute the tangent for the bezier curve.
    //
    flowchart.computeConnectionDestTangentY = function (pt1, pt2) {

        return pt2.y;
    };

    //
    // Compute the tangent for the bezier curve.
    //
    flowchart.computeConnectionDestTangent = function (pt1, pt2) {
        return {
            x: flowchart.computeConnectionDestTangentX(pt1, pt2),
            y: flowchart.computeConnectionDestTangentY(pt1, pt2),
        };
    };


    //
    // View model for the chart.
    //
    flowchart.ChartViewModel = function (chartDataModel) {
//root properties
        this.id = chartDataModel.id;
        this.remoteId = chartDataModel.remoteId;
        this.name = chartDataModel.name;
        this.description = chartDataModel.description;
        this.connectionType = chartDataModel.connectionType;
        flowchart.connectionType = this.connectionType;

        if (!chartDataModel.hasOwnProperty('zoom')) {
            chartDataModel.zoom = 1;
        }

        if (chartDataModel.type !== null && !angular.isObject(chartDataModel.type)) {
            chartDataModel.type = {"advanced": "POLICY_TYPE_CALL", "basic": "CALL"};
        }

        //geometry
        this.nodeWidth = flowchart.defaultNodeWidth;
        this.itemWidth = flowchart.itemWidth;
        this.itemHeight = flowchart.itemHeight;
        this.itemPadding = flowchart.itemPadding;
        this.nodeNameHeight = flowchart.nodeNameHeight;
        this.maxPhoneNumbersShown = flowchart.maxPhoneNumbersShown;

        this.selectedNode = null;
        this.selectedItem = null;

        this.updateConnectionType = function () {
            flowchart.connectionType = this.data.connectionType;
            this.updateConnectionsViewModel();
        };


        //
        // Find a specific node within the chart.
        //
        this.findNode = function (nodeID) {

            for (var i = 0; i < this.nodes.length; ++i) {
                var node = this.nodes[i];
                if (node.data.id == nodeID) {
                    return node;
                }
            }

            throw new Error("Failed to find node " + nodeID);
        };

        //
        // Find a connected node within the chart.
        //
        this.findNodeConnectedNode = function (nodeID) {

            for (var i = 0; i < this.connections.length; ++i) {
                var connection = this.connections[i];
                if (connection.data.source.nodeID == nodeID) {
                    return connection.data.dest.nodeID;
                    break;
                }
            }
            return 'finish';
        };

        //
        this.findItemConnectedNode = function (nodeID, itemID) {

            for (var i = 0; i < this.connections.length; ++i) {
                var connection = this.connections[i];
                if (connection.data.source.nodeID == nodeID && connection.data.source.id == itemID) {
                    return connection.data.dest.nodeID;
                    break;
                }
            }
            return 'finish';
        };

        //
        //create or update a connection
        //
        this.createConnection = function (fromNodeID, fromItemID, toNodeID) {

            //delete existing connection if any
            var fromNode = this.findNode(fromNodeID);
            var toNode = this.findNode(toNodeID);
            if (fromNode && toNode) {
                if (fromItemID) {
                    this.deleteItemConnection(fromNode, this.findOutputConnector(fromNodeID, fromItemID));
                } else {
                    this.deleteNodeConnection(fromNode);
                }
            }

            //then create new connection
            this.createNewConnection(this.findOutputConnector(fromNodeID, fromItemID), this.findInputConnector(toNodeID));

        };

        this.deleteNodeConnection = function (node) {
            for (var i = 0; i < this.data.connections.length; ++i) {
                var connection = this.data.connections[i];
                if (connection.source.nodeID == node.data.id && connection.source.id == node.output[0].data.id) {
                    this.data.connections.splice(i, 1);
                    node.output[0].connected = false;
                    node.output[0].data.connectedTo = 'finish';
                    node.data.connectedTo = 'finish';
                    //update destination node
                    var destNode = this.findNode(connection.dest.nodeID);
                    if (destNode) {
                        destNode.data.connectedFromNode = null;
                        destNode.data.connectedFromItem = null;
                    }
                    return this.updateConnectionsViewModel();
                }
            }
        };

        this.deleteItemConnection = function (node, item) {
            for (var i = 0; i < this.data.connections.length; ++i) {
                var connection = this.data.connections[i];
                if (connection.source.nodeID == node.data.id && connection.source.id == item.data.id) {
                    this.data.connections.splice(i, 1);
                    item.connected = false;
                    item.data.connectedTo = 'finish';
                    //update destination node
                    var destNode = this.findNode(connection.dest.nodeID);
                    if (destNode) {
                        destNode.data.connectedFromNode = null;
                        destNode.data.connectedFromItem = null;
                    }
                    return this.updateConnectionsViewModel();
                }
            }
        };

        this.getDestConnections = function (connection) {
            var destConnections = [];
            for (var connectionIndex = 0; connectionIndex < this.connections.length; ++connectionIndex) {
                if (this.connections[connectionIndex].dest == connection)
                    destConnections.push(this.connections[connectionIndex]);
            }
            return destConnections;
        };

        this.deleteConnection = function (connectionToDelete) {

            var newConnectionViewModels = [];
            var newConnectionDataModels = [];

            for (var connectionIndex = 0; connectionIndex < this.connections.length; ++connectionIndex) {
                var connection = this.connections[connectionIndex];
                if (connection != connectionToDelete) {
                    //
                    // The nodes this connection is attached to, where not deleted,
                    // so keep the connection.
                    //
                    newConnectionViewModels.push(connection);
                    newConnectionDataModels.push(connection.data);
                } else {

                    // there's only ever one connection attached to the source
                    connection.source.connected = false;
                    connection.source.data.connectedTo = 'finish';
                    if (connection.source.data.type == 'defaultOutput') {
                        connection.source.parentNode().data.connectedTo = 'finish';
                    }

                    // see if there is more than one connection to the destination
                    // if so, set the dest connection source to one of the other connections
                    // if not, set the dest connection to disconnected
                    var destConnections = this.getDestConnections(connection.dest);
                    if (destConnections.length == 1) {
                        connection.dest.connected = false;
                        var endNode = connection.dest.parentNode();
                        endNode.data.connectedFromNode = null;
                        endNode.data.connectedFromItem = null;
                    } else {
                        for (var i = 0; i < destConnections.length; ++i){
                            if (destConnections[i] != connectionToDelete) {
                                var endNode = connection.dest.parentNode();
                                endNode.data.connectedFromNode = destConnections[i].source.parentNode().data.id;
                                endNode.data.connectedFromItem = destConnections[i].source.data.id;
                                break;
                            }
                        }
                    }
                }
            }

            this.connections = newConnectionViewModels;
            this.data.connections = newConnectionDataModels;
        };


        //
        // Find a specific input connector within the chart.
        //
        this.findInputConnector = function (nodeID, id) {

            var node = this.findNode(nodeID);
            /*
             console.log('node');

             console.log(node);


             if (!node.input || node.input.length <= connectorIndex) {
             throw new Error("Node " + nodeID + " has invalid input connectors.");
             }
             */

            return node.input[0];
        };

        //
        // Find a specific output connector within the chart.
        //
        this.findOutputConnector = function (nodeID, id) {
            try {
                var node = this.findNode(nodeID);

                var connector = null;
                //find output connector native
                //try first the default output
                if (id == undefined) {
                    connector = node.output[0];
                    if (!connector) {
                        throw new Error("Failed to find the default output connector.");
                    }
                    return connector;
                }


                //find the connector in all outputs
                var allConnectors = [].concat(node.outputs, node.output);
                for (var i = 0; i < allConnectors.length; ++i) {


                    if (allConnectors[i].data.id == id) {
                        connector = allConnectors[i];
                        break;
                    }
                }


                if (!connector) {
                    throw new Error("Failed to find output connector Id: " + id);
                }

                return connector;


            } catch (error) {
                console.log(error);
            }
        };

        //
        // Create a view model for connection from the data model.
        //
        this._createConnectionViewModel = function (connectionDataModel) {

            var sourceConnector = this.findOutputConnector(connectionDataModel.source.nodeID, connectionDataModel.source.id);
            var destConnector = this.findInputConnector(connectionDataModel.dest.nodeID, connectionDataModel.dest.id);
            if (sourceConnector && destConnector) {
                return new flowchart.ConnectionViewModel(connectionDataModel, sourceConnector, destConnector);
            }
            return null;
        }

        //
        // Wrap the connections data-model in a view-model.
        //
        this._createConnectionsViewModel = function (connectionsDataModel) {

            var connectionsViewModel = [];


            if (connectionsDataModel) {
                for (var i = 0; i < connectionsDataModel.length; ++i) {
                    try {
                        var connectionViewModel = this._createConnectionViewModel(connectionsDataModel[i]);
                        if (connectionViewModel) {
                            connectionsViewModel.push(connectionViewModel);
                        }

                    } catch (error) {
                        console.log(error);
                    }
                }
            }

            return connectionsViewModel;
        };

        // Reference to the underlying data.
        this.data = chartDataModel;

        // Create a view-model for nodes.
        this.nodes = createNodesViewModel(this.data.nodes);

        this.updateConnectionsViewModel = function () {
            this.connections = this._createConnectionsViewModel(this.data.connections);
        }

        // Create a view-model for connections.
        this.updateConnectionsViewModel();

        //
        // Create a view model for a new connection.
        //
        this.createNewConnection = function (startConnector, endConnector) {


            try {
                var connectionsDataModel = this.data.connections;
                if (!connectionsDataModel) {
                    connectionsDataModel = this.data.connections = [];
                }

                var connectionsViewModel = this.connections;
                if (!connectionsViewModel) {
                    connectionsViewModel = this.connections = [];
                }

                var startNode = startConnector.parentNode();
                var startConnectorIndex = startNode.outputs.indexOf(startConnector);
                var startConnectorType = 'output';


                //TODO check connection from multiple sources
                if (startConnectorIndex == -1) {
                    startConnectorIndex = startNode.output.indexOf(startConnector);
                    startConnectorType = 'output';
                    if (startConnectorIndex == -1) {
                        //throw new Error("Failed to find source connector within either inputConnectors or outputs of source node.");
                    }
                }


                if (startConnectorIndex == -1) {
                    startConnectorIndex = startNode.input.indexOf(startConnector);
                    startConnectorType = 'input';
                    if (startConnectorIndex == -1) {
                        throw new Error("Failed to find source connector within either inputConnectors or outputs of source node.");
                    }
                }

                var endNode = endConnector.parentNode();
                var endConnectorIndex = endNode.input ? endNode.input.indexOf(endConnector) : -1;
                var endConnectorType = 'input';
                if (endConnectorIndex == -1) {
                    endConnectorIndex = endNode.outputs.indexOf(endConnector);
                    endConnectorType = 'output';
                    if (endConnectorIndex == -1) {
                        //throw new Error("Failed to find dest connector within inputConnectors or outputs of dest node.");
                    }
                }

                if (endConnectorIndex == -1) {
                    endConnectorIndex = endNode.output.indexOf(endConnector);
                    endConnectorType = 'output';
                    if (endConnectorIndex == -1) {
                        throw new Error("Failed to find dest connector within inputConnectors or outputs of dest node.");
                    }
                }

                if (startConnectorType == endConnectorType) {
                    throw new Error("Failed to create connection. Only output to input connections are allowed.")
                }

                if (startNode == endNode) {
                    throw new Error("Failed to create connection. Cannot link a node with itself.")
                }

                if (startConnector.connected && endConnector.connected) {
                    throw new Error("Failed to create connection. This connection already exists.")
                }


                if (endConnectorType == 'output' && endConnector.connected) {
                    throw new Error("Failed to create connection. Cannot create multiple connection for outputs.")
                }


                var connectorStartNode = {
                    nodeID: startNode.data.id,
                    id: startConnector.data.id,
                }

                var connectorEndNode = {
                    nodeID: endNode.data.id,
                    //connectorIndex: endConnectorIndex,
                    id: endConnector.data.id
                }

                var connectionDataModel = {
                    source: startConnectorType == 'output' ? connectorStartNode : connectorEndNode,
                    dest: startConnectorType == 'output' ? connectorEndNode : connectorStartNode,
                };
                connectionsDataModel.push(connectionDataModel);

                var outputConnector = startConnectorType == 'output' ? startConnector : endConnector;
                var inputConnector = startConnectorType == 'output' ? endConnector : startConnector;


                var connectionViewModel = new flowchart.ConnectionViewModel(connectionDataModel, outputConnector, inputConnector);
                connectionsViewModel.push(connectionViewModel);

                startConnector.connected = true;
                endConnector.connected = true;

                if (startConnectorType == 'output') {
                    startConnector.data.connectedTo = endNode.data.id;
                    endNode.data.connectedFromNode = startNode.data.id;
                    endNode.data.connectedFromItem = startConnector.data.id;
                    if (startConnector.data.type == 'defaultOutput') {
                        startNode.data.connectedTo = endNode.data.id;
                    }
                } else {
                    endConnector.data.connectedTo = startNode.data.id;
                    startNode.data.connectedFromNode = endNode.data.id;
                    startNode.data.connectedFromItem = endConnector.data.id;
                    if (endConnector.data.type == 'defaultOutput') {
                        endNode.data.connectedTo = startNode.data.id;
                    }
                }

            } catch (error) {
                console.log(error);
            }

        };

        //
        // Add a node to the view model.
        //
        this.addNode = function (nodeDataModel, fixed) {
            if (!this.data.nodes) {
                this.data.nodes = [];
            }
            //TODO optimise this a bit
            //test other nodes for hit position to prevent overlapping
            if (fixed != true) {
                for (var i = 0; i < this.nodes.length; ++i) {
                    var j = 0;
                    /*
                     while (j < 10 && (nodeDataModel.x >= this.nodes[i].data.x && nodeDataModel.x <= (this.nodes[i].data.x + this.nodes[i].data.width) && (nodeDataModel.y >= this.nodes[i].data.y && nodeDataModel.y <= (this.nodes[i].data.y + this.nodes[i].height())))) {
                     nodeDataModel.x = nodeDataModel.x + 10;
                     nodeDataModel.y = nodeDataModel.y + 10;
                     j++;
                     }
                     */

                    while (j < 10 && (nodeDataModel.x >= this.nodes[i].data.x && nodeDataModel.x <= (this.nodes[i].data.x + this.nodes[i].data.width) )) {
                        nodeDataModel.x = nodeDataModel.x + 10;
                        j++;
                    }

                    var k = 0;
                    while (k < 10 && ((nodeDataModel.y >= this.nodes[i].data.y && nodeDataModel.y <= (this.nodes[i].data.y + this.nodes[i].height())))) {
                        nodeDataModel.y = nodeDataModel.y + 10;
                        k++;
                    }
                }
            }

            //
            // Update the data model.
            //
            this.data.nodes.push(nodeDataModel);

            //
            // Update the view model.
            //

            var newNode = new flowchart.NodeViewModel(nodeDataModel)
            this.nodes.push(newNode);

            return newNode;
        }

        //
        // Select all nodes and connections in the chart.
        //
        this.selectAll = function () {

            var nodes = this.nodes;
            for (var i = 0; i < nodes.length; ++i) {
                var node = nodes[i];
                node.select();
            }

            var connections = this.connections;
            for (var i = 0; i < connections.length; ++i) {
                var connection = connections[i];
                connection.select();
            }
        }

        //
        // Deselect all nodes and connections in the chart.
        //
        this.deselectAll = function () {

            var nodes = this.nodes;
            for (var i = 0; i < nodes.length; ++i) {
                var node = nodes[i];
                node.deselect();
            }

            var connections = this.connections;
            for (var i = 0; i < connections.length; ++i) {
                var connection = connections[i];
                connection.deselect();
            }

            this.selectedNode = null;
            this.selectedItem = null;
        };

        //
        // Update the location of the node and its connectors.
        //
        this.updateSelectedNodesLocation = function (deltaX, deltaY) {

            var selectedNodes = this.getSelectedNodes();

            for (var i = 0; i < selectedNodes.length; ++i) {
                var node = selectedNodes[i];
                node.data.x += deltaX;
                node.data.y += deltaY;
            }
        };

        //
        // Update the location of the node and its connectors.
        //
        this.updateItemLocation = function (node, item, index, deltaX, deltaY) {

            item.translatedY = Math.min((node.outputs.length - 1 - index) * 32, Math.max(-(index * 32), (item.translatedY || 0 ) + deltaY));
        };

        //
        // Handle mouse click on a particular node.
        //
        this.handleNodeClicked = function (node, ctrlKey) {

            if (!flowchart.isClickAllowed()) {
                return;
            }

            if (ctrlKey) {
                node.toggleSelected();
            }
            else {
                this.deselectAll();
                node.select();
                this.selectedNode = node;
                this.selectedItem = null;
            }

            // Move node to the end of the list so it is rendered after all the other.
            // This is the way Z-order is done in SVG.

            var nodeIndex = this.nodes.indexOf(node);
            if (nodeIndex == -1) {
                throw new Error("Failed to find node in view model!");
            }
            this.nodes.splice(nodeIndex, 1);
            this.nodes.push(node);
        };

        //
        // Handle mouse click on a particular node.
        //
        this.handleItemClicked = function (node, item, ctrlKey) {

            if (!flowchart.isClickAllowed()) {
                return;
            }

            if (ctrlKey) {
                item.toggleSelected();
            }
            else {
                this.deselectAll();
                node.select();
                item.select();
                //setTimeout(function () {this.selectedNode = node; this.selectedItem = item;}.bind(this), 300);
                this.selectedNode = node;
                this.selectedItem = item;
            }
        };


        //
        // Handle mouse down on a connection.
        //
        this.handleConnectionMouseDown = function (connection, ctrlKey) {

            if (ctrlKey) {
                connection.toggleSelected();
            }
            else {
                this.deselectAll();
                connection.select();
            }
        };


        //
        // Delete all nodes and connections that are selected.
        //
        this.deleteNodeById = function (id) {


            var newNodeViewModels = [];
            var newNodeDataModels = [];

            var deletedNodeIds = [];

            //
            // Sort nodes into:
            //		nodes to keep and
            //		nodes to delete.
            //

            for (var nodeIndex = 0; nodeIndex < this.nodes.length; ++nodeIndex) {

                var node = this.nodes[nodeIndex];
                if (node.data.id != id) {
                    // Only retain non-selected nodes.
                    newNodeViewModels.push(node);
                    newNodeDataModels.push(node.data);
                }
                else {
                    // Keep track of nodes that were deleted, so their connections can also
                    // be deleted.
                    deletedNodeIds.push(node.data.id);
                    //reset selectedNode if the same as deleted one
                    if (node == this.selectedNode) {
                        this.selectedNode = null;
                        this.selectedItem = null;
                    }
                }
            }

            var newConnectionViewModels = [];
            var newConnectionDataModels = [];

            //
            // Remove connections that are selected.
            // Also remove connections for nodes that have been deleted.
            //
            for (var connectionIndex = 0; connectionIndex < this.connections.length; ++connectionIndex) {

                var connection = this.connections[connectionIndex];


                if (!connection.selected() &&
                    deletedNodeIds.indexOf(connection.data.source.nodeID) === -1 &&
                    deletedNodeIds.indexOf(connection.data.dest.nodeID) === -1) {

                    //
                    // The nodes this connection is attached to, where not deleted,
                    // so keep the connection.
                    //
                    newConnectionViewModels.push(connection);
                    newConnectionDataModels.push(connection.data);
                } else {
                    connection.source.connected = false;
                    connection.dest.connected = false;

                    connection.source.data.connectedTo = 'finish';

                    //now handle node connections
                    var startNode = connection.source.parentNode();
                    var endNode = connection.dest.parentNode();

                    if (connection.source.data.type == 'defaultOutput') {
                        startNode.data.connectedTo = 'finish';
                    }

                    endNode.data.connectedFromNode = null;
                    endNode.data.connectedFromItem = null;

                }
            }

            //
            // Update nodes and connections.
            //
            this.nodes = newNodeViewModels;
            this.data.nodes = newNodeDataModels;
            this.connections = newConnectionViewModels;
            this.data.connections = newConnectionDataModels;
        };


        //
        // Delete all nodes and connections that are selected.
        //
        this.deleteSelected = function () {


            var newNodeViewModels = [];
            var newNodeDataModels = [];

            var deletedNodeIds = [];

            //
            // Sort nodes into:
            //		nodes to keep and
            //		nodes to delete.
            //

            for (var nodeIndex = 0; nodeIndex < this.nodes.length; ++nodeIndex) {

                var node = this.nodes[nodeIndex];
                if (!node.selected()) {
                    // Only retain non-selected nodes.
                    newNodeViewModels.push(node);
                    newNodeDataModels.push(node.data);
                }
                else {
                    // Keep track of nodes that were deleted, so their connections can also
                    // be deleted.
                    deletedNodeIds.push(node.data.id);
                    //reset selectedNode if the same as deleted one
                    if (node == this.selectedNode) {
                        this.selectedNode = null;
                        this.selectedItem = null;
                    }
                }
            }

            var newConnectionViewModels = [];
            var newConnectionDataModels = [];

            //
            // Remove connections that are selected.
            // Also remove connections for nodes that have been deleted.
            //
            for (var connectionIndex = 0; connectionIndex < this.connections.length; ++connectionIndex) {

                var connection = this.connections[connectionIndex];


                if (!connection.selected() &&
                    deletedNodeIds.indexOf(connection.data.source.nodeID) === -1 &&
                    deletedNodeIds.indexOf(connection.data.dest.nodeID) === -1) {

                    //
                    // The nodes this connection is attached to, where not deleted,
                    // so keep the connection.
                    //
                    newConnectionViewModels.push(connection);
                    newConnectionDataModels.push(connection.data);
                } else {
                    connection.source.connected = false;
                    connection.dest.connected = false;

                    connection.source.data.connectedTo = 'finish';

                    //now handle node connections
                    var startNode = connection.source.parentNode();
                    var endNode = connection.dest.parentNode();

                    if (connection.source.data.type == 'defaultOutput') {
                        startNode.data.connectedTo = 'finish';
                    }

                    endNode.data.connectedFromNode = null;
                    endNode.data.connectedFromItem = null;

                }
            }

            //
            // Update nodes and connections.
            //
            this.nodes = newNodeViewModels;
            this.data.nodes = newNodeDataModels;
            this.connections = newConnectionViewModels;
            this.data.connections = newConnectionDataModels;
        };

        //
        // Select nodes and connections that fall within the selection rect.
        //
        this.applySelectionRect = function (selectionRect) {

            this.deselectAll();

            for (var i = 0; i < this.nodes.length; ++i) {
                var node = this.nodes[i];
                if (node.x() >= selectionRect.x &&
                    node.y() >= selectionRect.y &&
                    node.x() + node.width() <= selectionRect.x + selectionRect.width &&
                    node.y() + node.height() <= selectionRect.y + selectionRect.height) {
                    // Select nodes that are within the selection rect.
                    node.select();
                }
            }

            for (var i = 0; i < this.connections.length; ++i) {
                var connection = this.connections[i];
                if (connection.source.parentNode().selected() &&
                    connection.dest.parentNode().selected()) {
                    // Select the connection if both its parent nodes are selected.
                    connection.select();
                }
            }

        };

        //
        // Get the array of nodes that are currently selected.
        //
        this.getSelectedNodes = function () {
            var selectedNodes = [];

            for (var i = 0; i < this.nodes.length; ++i) {
                var node = this.nodes[i];
                if (node.selected()) {
                    selectedNodes.push(node);
                }
            }

            return selectedNodes;
        };

        //
        // Get the array of connections that are currently selected.
        //
        this.getSelectedConnections = function () {
            var selectedConnections = [];

            for (var i = 0; i < this.connections.length; ++i) {
                var connection = this.connections[i];
                if (connection.selected()) {
                    selectedConnections.push(connection);
                }
            }

            return selectedConnections;
        };


    };

})();
