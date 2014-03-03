var Validator = require("../controllers/ValidateObjectController.js");
var fs = require('fs');

/*	Flat File Access
 *  Use: Reads, Saves and Updates JSON objects saved in flat files.
 */

module.exports = {
	saveJSONObject: function(obj, path, callback) {
		Validator.ValidateArgs(arguments, Object, String, Function);
		fs.writeFile(path, JSON.stringify(obj, null, "\t"), callback);
	},
	loadJSONObject: function(path, callback) {
		Validator.ValidateArgs(arguments, String, Function);
		fs.readFile(path, function(err, data) {
			if(err) {
				callback(err, {});
			} else {
				try {
					var o = JSON.parse(data || "{}");
					callback(undefined, o);
				} catch(e) {
					callback(e, {});
				}
			}
		});
	},
	isPathCreated: function(path, callback) {
		Validator.ValidateArgs(arguments, String, Function);
		fs.exists(path, callback);
	},
	deleteFile: function(path, callback) {
		Validator.ValidateArgs(arguments, String, Function);
		fs.unlink(path, callback);
	}
};
