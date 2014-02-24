var ValidateObjectController = require("../controllers/ValidateObjectController.js")
var FileSystem = require('fs');
var MkDirP = require('mkdirp');
/*	Flat File Access
 *  Use: Reads, Saves and Updates JSON objects saved in flat files.
 */

// need to install https://github.com/substack/node-mkdirp

exports.FlatFileAccess = function()
{
	
}

exports.FlatFileAccess.SaveJSONObject(JSONObject, pathToSave) {
	ValidateObjectController.ValidateString(pathToSave);
	ValidateObjectController.ValidateObject(JSONObject);
	
	if(!this.IsPathCreated(pathToSave)) {
		this.CreateDirectory(pathToSave);
	}
	
	FileSystem.writeFile(pathToSave, JSON.stringify(myData, null), function(err) {
	    if(err) {
	        throw err;
	    } 
	    else {
	        console.log("The file was saved!");
	    }
	});
	
	return true;
}

exports.FlatFileAccess.IsPathCreated(path) {
	ValidateObjectController.ValidateString(path);
	fs.exists(path, function (exists) {
  		if (exist) {
  			return true;
  		}
  		else {
  			return false;
  		}
	});
}

exports.FlatFileAccess.CreateDirectory(path) {
	ValidateObjectController.ValidateString(path);
	MkDirP(path, function (err) {
    	if (err) {
    		throw err;
    	} 
    	else {
    		console.log('The directory was created!');
    	} 
});
}

exports.FlatFileAccess.LoadJSONObject(pathToFile) {
	ValidateObjectController.ValidateString(pathToFile);
	var gameJSONObj = null;
	
	FileSystem.readFile(pathToFile, function(err, data) {
	    if(err) {
	        throw err;
	    } 
	    else {
	        console.log("The file was loaded!");
	    	gameJSONObj = JSON.parse(data);
	    }
	});
	
	return gameJSONObj;	
}

exports.FlatFileAccess.DeleteFile(pathToFile) {
	ValidateObjectController.ValidateString(pathToFile);
	fs.unlink('/tmp/hello', function (err) {
		if (err) {
			throw err; 
		}
		console.log('The file was deleted!');
	});
	
	return true;
}