var RelationalDB = require('../models/RelationalDBAccess.js');
var flatFile = require('../models/FlatFileAccess.js');
var relationalDB;
//var flatFile;

function DataStoreController(database)
{
	//Initialize all the variables
	//flatFile = new FlatFile.FlatFileAccess();
	relationalDB = new RelationalDB(database);
}

DataStoreController.prototype.getUserInformation = function(userID, callback)
{
	relationalDB.getUserInfo(userID, function(newUser){
		callback(newUser);
	});
};

DataStoreController.prototype.getListOfGames = function(callback)
{
	//Call validate object on the relationalDB object
	relationalDB.getListOfGames(function(gameList){
		console.log('list of games is: ' + JSON.stringify(gameList[0]));
		callback(gameList);
	});
};

DataStoreController.prototype.getNewUserInfo = function(callback)
{	
	//Call validate object on the relationalDB object
	relationalDB.getNewUserInfo(function(newUser){
		callback(newUser);
	});
};

DataStoreController.prototype.IsPathCreated = function(path, callback)
{
	//Call validate object on the flatFile object
	var result = flatFile.IsPathCreated(path);
	
	//maybe validate result
	callback(result);
};

DataStoreController.prototype.SaveJSONObject = function(JSONObject, pathToSave, callback)
{
	//Call validate object on the flatFile object
	var result = flatFile.SaveJSONObject(JSONObject, pathToSave);
	
	//maybe validate result
	callback(result);
};

DataStoreController.prototype.LoadJSONObject = function(pathToFile, callback)
{
	//Call validate object on the flatFile object
	var result = flatFile.LoadJSONObject(pathToFile);
	
	//maybe validate result
	callback(result);
};

DataStoreController.prototype.DeleteFile = function(pathToFile, callback)
{
	//Call validate object on the flatFile object
	var result = flatFile.DeleteFile(pathToFile);
	
	//maybe validate result
	callback(result);
};

module.exports = DataStoreController;
