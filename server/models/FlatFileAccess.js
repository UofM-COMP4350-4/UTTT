var Validator = require("../controllers/ValidateObjectController.js");
var fs = require('fs');
var noop = function(){};

/*	Flat File Access
 *  Use: Reads, Saves and Updates JSON objects saved in flat files.
 */

var jsonFilePathValidate = function(path) {
	var i=path.indexOf(".json");
	if(i==-1 || i!=(path.length-5)) {
		throw new Error("Path argument must me a *.json filepath.");
	}
};

module.exports = {
	saveJSONObject: function(path, obj, callback) {
		callback = callback || noop;
		Validator.ValidateArgs(arguments, String, Object, Validator.OPTIONAL);
		jsonFilePathValidate(path);
		fs.writeFile(path, JSON.stringify(obj, null, "\t"), callback);
	},
	loadJSONObject: function(path, callback) {
		callback = callback || noop;
		Validator.ValidateArgs(arguments, String, Validator.OPTIONAL);
		jsonFilePathValidate(path);
		fs.readFile(path, 'utf8', function(err, data) {
			if(err) {
				callback(err, {});
			} else {
				var o;
				var parseErr;
				try {
					o = JSON.parse(data || "{}");
				} catch(e) {
					parseErr = e;
				}
				if(parseErr) {
					callback(parseErr, {});
				} else {
					callback(undefined, o);
				}
				
			}
		});
	},
	isPathCreated: function(path, callback) {
		Validator.ValidateArgs(arguments, String, Function);
		fs.exists(path, callback);
	},
	deleteFile: function(path, callback) {
		callback = callback || noop;
		Validator.ValidateArgs(arguments, String, Validator.OPTIONAL);
		fs.unlink(path, callback);
	}
};
