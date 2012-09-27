var Registry = (function () {
	/*
	 * Private properties
	 */

	this._properties = {};
	this._subscriptions = {};

	/*
	 * Private methods
	 */

	this._error = function _error(error_message, error_data) {
		// this should probably be more or less "loud" depending on the level
		console.log('[ERROR - Registry] ' + error_message, error_data);
	};

	this._publish = function _publish(event_name, event_data) {
		var event_subscriptions = (this._subscriptions)[event_name],
		    s;

		if (event_subscriptions && event_subscriptions.length > 0) {
			for (s in event_subscriptions) {
				if (typeof event_subscriptions[s] !== 'function') {
					continue;
				}

				(event_subscriptions[s]).call(this.api, event_data);		
			}
		}
	};

	this._export_properties = function _export_properties() {
		// may need processing logic here

		return this._properties;
	};

	this._export_subscriptions = function _export_subscriptions() {
		// may need processing logic here

		return this._subscriptions;
	};

	/*
	 * Public methods
	 */

	this.api = {
		'get' : function (key) {
			return this._properties[key];
		},

		'set' : function (key, value) {
			var event_data = {
				'key' 		 : key,
				'value' 	 : value,
				'previous_value' : this._properties[key]
			};

			this._properties[key] = value;

			this._publish('Registry.set', event_data);
		},

		'subscribe' : function (event_name, callback) {
			if (typeof callback !== 'function') {
				this._error({
					'message' : 'Event subscription must supply a valid function.',
					'type' 	  : 'high',

					'data'	  : {
						'callback' : callback				
					}
				});

				return false;
			}

			this._subscriptions[event_name] = callback;

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
					export_data.properties = this._export_properties();

					break;

				case 'subscriptions':
					export_data.properties = this._export_properties();

					break;

				default:
					export_data.properties = this._export_properties();
					export_data.subscriptions = this._export_subscriptions();

					break;
			}

			event_data.data = export_data;

			this._publish('Registry.export', event_data);

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
				this._properties = values.properties;
			}

			if (values.subscriptions) {
				this._subscriptions = values.subscriptions;
			}

			this._publish('Registry.import', event_data);

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
					this._properties = {};

					break;

				case 'subscriptions':
					this._subscriptions = {};

					break;

				default:
					this._properties = {};
					this._subscriptions = {};

					break;
			}
	
			this._publish('Registry.empty', event_data);
		}
	};

	return this.api;
})();
