function PlatformEvents (sessionid) {
    var _cometd = new org.cometd.CometD();
    var _self = this;
    var _connected = false;
    var _disconnecting;
    var _subscriptions;
    var _channels;
    var _sessionid = sessionid;

    this.subscribe = function(channels) {
        _channels = channels;
        _disconnecting = false;
        _cometd.configure({
            url: window.location.protocol + "//" + window.location.hostname + "/cometd/44.0/",
            logLevel: 'info',
            requestHeaders: { Authorization: 'OAuth ' + _sessionid },
            appendMessageTypeToURL: false
        });
        _cometd.websocketEnabled = false;
        _cometd.handshake();
    };

    this.unsubscribe = function() {
        _cometd.batch(function() {
            _unsubscribe();
        });
        _cometd.disconnect();
        _disconnecting = true;
    };

    this.send = function(channel, message) {
        _cometd.publish(channel, message);
    };

    function _unsubscribe() {
        for (var i = 0; i < _subscriptions.length; ++i) {
            _cometd.unsubscribe(_subscriptions[i]);
        }
        _subscriptions = null;
    }

    function _subscribe() {
        _subscriptions = [];
        for (var i = 0; i < _channels.length; ++i) {
            var channel = _channels[i];
            _subscriptions[channel.channel] = _cometd.subscribe(channel.channel, channel.callback);
        }
    }

    function _connectionInitialized() {
        // first time connection for this client, so subscribe tell everybody.
        //console.log ("cometd: _connectionInitialized");
        _cometd.batch(function() {
            _subscribe();
        });
    }

    function _connectionEstablished() {
        // connection establish (maybe not for first time)
        //console.log ("cometd: _connectionEstablished");
    }

    function _connectionBroken() {
        console.log ("cometd: _connectionBroken");
    }

    function _connectionClosed() {
        console.log ("cometd: _connectionClosed");
    }

    function _metaConnect(message) {
        if (_disconnecting) {
            _connected = false;
            _connectionClosed();
        } else {
            var wasConnected = _connected;
            _connected = message.successful === true;
            if (!wasConnected && _connected) {
                _connectionEstablished();
            } else if (wasConnected && !_connected) {
                _connectionBroken();
            }
        }
    }

    function _metaHandshake(message) {
        if (message.successful) {
            _connectionInitialized();
        }
    }

    _cometd.addListener('/meta/handshake', _metaHandshake);
    _cometd.addListener('/meta/connect', _metaConnect);

    window.onunload = function() {
        // Save the application state only if the user was chatting
        if (_subscriptions.length) {
            _cometd.getTransport().abort();
        } else {
            _cometd.disconnect();
        }
    };
}
