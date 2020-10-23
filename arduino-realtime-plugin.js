function ArduinoRealtimeTelemetryPlugin() {
    return function (openmct) {
        var socket = new WebSocket('ws://localhost:9090');
        var listener = {}
    
        socket.onmessage = function (event) {
            point = JSON.parse(decodeURIComponent(escape(event)).data);
            if (listener[point.id]) {
                listener[point.id](point);
            }
        };
        
        var provider = {
            supportsSubscribe: function (domainObject) {
                return domainObject.type === 'example.telemetry';
            },
            subscribe: function (domainObject, callback) {
                listener[domainObject.identifier.key] = callback;
                socket.send('subscribe ' + domainObject.identifier.key);
                return function unsubscribe() {
                    delete listener[domainObject.identifier.key];
                    socket.send('unsubscribe ' + domainObject.identifier.key);
                };
            }
        };
        
        openmct.telemetry.addProvider(provider);
    }
}