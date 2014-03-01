var ValidateObjectController = require("../controllers/ValidateObjectController.js");
var FileSystem = require('fs');

/*	Flat File Access
 *  Use: Reads, Saves and Updates JSON objects saved in flat files.
 */

// need to install https://github.com/substack/node-mkdirp

exports.FlatFileAccess = function()
{
	
};

exports.FlatFileAccess.prototype.SaveJSONObject = function(JSONObject, pathToSave) {
	ValidateObjectController.ValidateString(pathToSave);
	ValidateObjectController.ValidateObject(JSONObject);
	
	if (typeof JSONObject == 'object') {
		FileSystem.writeFileSync(pathToSave, JSON.stringify(JSONObject, null));
	}
	else {
		throw new Error('Argument is not an object.');
	}

	return true;
};

exports.FlatFileAccess.prototype.IsPathCreated = function(path) {
	var isPathCreated = false;
	
	ValidateObjectController.ValidateString(path);
	FileSystem.exists(path, function (exists) {
  		if (exists) {
  			isPathCreated = true;
  		}
	});

	return isPathCreated;
};

exports.FlatFileAccess.prototype.LoadJSONObject = function(pathToFile) {
	ValidateObjectController.ValidateString(pathToFile);
	var readData = FileSystem.readFileSync(pathToFile);
	return JSON.parse(readData);
};

exports.FlatFileAccess.prototype.DeleteFile = function(pathToFile) {
	ValidateObjectController.ValidateString(pathToFile);
	FileSystem.unlinkSync(pathToFile);
	return true;
};