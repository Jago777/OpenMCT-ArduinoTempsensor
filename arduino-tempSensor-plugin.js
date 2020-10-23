function getArduino(){
	return http.get('/arduinoTS.json')
		.then(function (result){
			return result.data;
		});
};

var objectProvider = {
	get: function (identifier) {
		return getArduino().then(function (arduinoTS){
			if (identifier.key === 'temperatureSensor') {
				return {
					identifier: identifier,
					name: arduinoTS.name,
					type: 'folder',
					location: 'ROOT'
				};
			} else {
                var measurement = arduinoTS.measurements.filter(function (m) {
                    return m.key === identifier.key;
                })[0];
                return {
                    identifier: identifier,
                    name: measurement.name,
                    type: 'example.telemetry',
                    telemetry: {
                        values: measurement.values
                    },
                    location: 'example.taxonomy:temperatureSensor'
                };
            }
		});
	}
};

var compositionProvider = {
    appliesTo: function (domainObject) {
        return domainObject.identifier.namespace === 'example.taxonomy' &&
               domainObject.type === 'folder';
    },
    load: function (domainObject) {
        return getArduino()
            .then(function (arduinoTS) {
                return arduinoTS.measurements.map(function (m) {
                    return {
                        namespace: 'example.taxonomy',
                        key: m.key
                    };
                });
            });
    }
};


function ArduinoPlugin() {
    return function install(openmct) {
        openmct.objects.addRoot({
        	namespace: 'example.taxonomy',
        	key: 'temperatureSensor'
        });

        openmct.objects.addProvider('example.taxonomy', objectProvider);

        openmct.composition.addProvider(compositionProvider);

        openmct.types.addType('example.telemetry', {
        	name: 'Example Telemetry Point',
        	description: 'Example telemetry point.',
        	cssClass: 'icon-telemetry'
        });
    }
};