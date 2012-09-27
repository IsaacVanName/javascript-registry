var Registry = (function () {
	var self = this; // reference for storing the private properties in memory

	/*
	 * Private properties
	 */

	self._properties = {};
	self._subscriptions = {};

	/*
	 * Private methods
	 */

	self._error = function _error(error_message, error_data) {
		// self should probably be more or less "loud" depending on the level
		console.log('[ERROR - Registry] ' + error_message, error_data);
	};

	self._publish = function _publish(event_name, event_data) {
		var event_subscriptions = (self._subscriptions)[event_name],
		    s;

		if (event_subscriptions && event_subscriptions.length > 0) {
			for (s in event_subscriptions) {
				if (typeof event_subscriptions[s] !== 'function') {
					continue;
				}

				(event_subscriptions[s]).call(self.api, event_data);		
			}
		}
	};

	self._export_properties = function _export_properties() {
		// may need processing logic here

		return self._properties;
	};

	self._export_subscriptions = function _export_subscriptions() {
		// may need processing logic here

		return self._subscriptions;
	};

	/*
	 * Public methods
	 */

	self.api = {
		'get' : function (key) {
			return self._properties[key];
		},

		'set' : function (key, value) {
			var event_data = {
				'key' 		 : key,
				'value' 	 : value,
				'previous_value' : self._properties[key]
			};

			self._properties[key] = value;

			self._publish('Registry.set', event_data);
		},

		'subscribe' : function (event_name, callback) {
			if (typeof callback !== 'function') {
				self._error({
					'message' : 'Event subscription must supply a valid function.',
					'type' 	  : 'high',

					'data'	  : {
						'callback' : callback				
					}
				});

				return false;
			}

			self._subscriptions[event_name] = callback;

			return true;
		},

		'export' : function (export_type) {
			var export_data = {};
			    
			var event_data = {
				'type' : export_type,
				'data' : null
			};

			switch (export_type) {
				case 'properties':
					export_data.properties = self._export_properties();

					break;

				case 'subscriptions':
					export_data.properties = self._export_properties();

					break;

				default:
					export_data.properties = self._export_properties();
					export_data.subscriptions = self._export_subscriptions();

					break;
			}

			event_data.data = export_data;

			self._publish('Registry.export', event_data);

			return export_data;
		},

		'import' : function (values) {
			var event_data = {
				'data' : values
			};

			if (!values) {
				return false;
			}

			if (values.properties) {
				self._properties = values.properties;
			}

			if (values.subscriptions) {
				self._subscriptions = values.subscriptions;
			}

			self._publish('Registry.import', event_data);

			return true;
		},

		'empty' : function (empty_type) {
			var event_data = {
				'type' : null
			};

			if (!empty_type) {
				empty_type = 'all';
			}

			event_data.type = empty_type;

			switch (empty_type) {
				case 'properties':
					self._properties = {};

					break;

				case 'subscriptions':
					self._subscriptions = {};

					break;

				default:
					self._properties = {};
					self._subscriptions = {};

					break;
			}
	
			self._publish('Registry.empty', event_data);
		}
	};

	return self.api;
})();

exports.Registry = Registry;
