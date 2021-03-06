var Config = (function() {

	var conf = {

		listening_ip: {
			value: "",
			set: function(value) {
				this.valid = true;
				this.value = value;
				if (! helpers.isValidIP(value)) {
					this.valid = false;
				}
			},
			valid: true
		},

		listening_port: {
			value: "",
			set: function(value) {
				this.valid = true;
				this.value = value;
				if (! helpers.isValidPort(value)) {
					this.valid = false;
				}
			},
			valid: true
		},

		source_script: {
			value: "",
			set: function(value) {
				this.valid = true;
				this.value = value;
				if (value && ! helpers.isValidUrl(value)) { // empty string is OK
					this.valid = false;
				}
			},
			valid: true
		},

		lines_count: {
			value: "",
			set: function(value) {
				this.valid = true;
				this.value = value;
				if (! helpers.isValidNumber(value)) {
					this.valid = false;
				}
			},
			valid: true
		}

	};


	var helpers = {
		isValidUrl: function(url) {
			return url.match(/^http[s]?:\/\/.+/);
		},

		isValidPort: function(port) {
			return port.match(/^\d{1,5}$/);
		},

		isValidIP: function(ip) {
			return ip.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
		},

		isValidNumber: function(number) {
			return number.match(/^\d+$/);
		}
	}


	chrome.storage.local.get(null, function(values) {
		var formLikeValues = [];

		for (var prop in values) {
			formLikeValues.push({
				"name": prop,
				"value": values[prop]
			});
		}

		publicMethods.saveFromForm(formLikeValues);
	});


	/* PUBLIC */

	var publicMethods = {

		get: function(key) {
			if (! key) {
				var configValues = {};
				for (var prop in conf) {
					configValues[prop] = conf[prop].value;
				}
				return configValues;
			} else {
				return conf[key]["value"];
			}
		},

		isValid: function(key) {
			return conf[key]["valid"];
		},

		set: function(key, value) {
			if (conf.hasOwnProperty(key)) {
				conf[key].set(value);

				var storageValues = {};
				storageValues[key] = conf[key]["value"];
				chrome.storage.local.set(storageValues);
			}
		},

		saveFromForm: function(values) {
			for (var i in values) {
				publicMethods.set(values[i].name, values[i].value);
			}
		},

		errors: function() {
			var invalidProperties = [];
			for (var prop in conf) {
				if (! conf[prop].valid) {
					invalidProperties.push(prop);
				}
			}
			return invalidProperties;
		}

	}

	return publicMethods;

})();


