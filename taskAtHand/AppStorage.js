function AppStorage(appName){ /*  AppStorage object will help us avoid key collisions and provide an easy way to store nonstring values. */
	var prefix = (appName ? appName + "." : "");  /* prefix what will be used to prefix all of our keys with the application name to avoid collisions. */

	this.localStorageSupported = (('localStorage' in window) && window['localStorage']);

	this.setValue = function(key, val){
		if (this.localStorageSupported)
			localStorage.setItem(prefix + key, JSON.stringify(val)); /* JSON.stringify() method to convert the value to a string, and then call localStorage.setItem() to store it. */
		return this;
	};

	this.getValue = function(key){ /* the getValue() method takes a key, prepends the prefix to it */
		if (this.localStorageSupported)
			return JSON.parse(localStorage.getItem(prefix + key)); /* return the string value associated with it in localStorage, JSON.parse() to parse the string retrieved from localStorage into a value */
		else return null; /* if the key does't exist or local storage is not supported, these methods return null */
	};

	this.removeValue = function(key){
		if (this.localStorageSupported)
			localStorage.removeItem(prefix + key);
		return this;
	};

	this.removeAll = function(){
		var keys = this.getKeys();
		for (var i in keys){
			this.remove(keys[i]);
		}
		return this;
	};

	this.getKeys = function(filter){
		var keys = [];
		if (this.localStorageSupported){
			for (var key in localStorage){
				if (isAppKey(key)){
					//remove the prefix from the key
					if (prefix) key = key.slice(prefix.length);
					//check the filter
					if (!filter || filter(key)){
						keys.push(key);
					}
				}
			}
		}
		return keys;
	};
	function isAppKey(key){ /* the private isAppKey() method takes a key name as the parameter and return true if the key belongs to our application */
		if (prefix){
			return key.indexOf(prefix) === 0;
		}
		return true;
	};

	this.contains = function(key){
		return this.get(key) !== null;
	};
}