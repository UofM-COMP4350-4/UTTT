var RelationalDB = require('../models/RelationalDBAccess.js');
var FlatFile = require('../models/FlatFileAccess.js');
var relationalDB;
var flatFile;

function DataStoreController(database)
{
	//Initialize all the variables
	flatFile = new FlatFile.FlatFileAccess();
	relationalDB = new RelationalDB(database);
};

DataStoreController.prototype.getListOfGames = function(callback)
{
	//Call validate object on the relationalDB object
	relationalDB.getListOfGames(function(gameList){
		console.log('list of games is: ' + gameList);
		callback(gameList);
	});
};

DataStoreController.prototype.getNewClientID = function(callback)
{
	//Call validate object on the relationalDB object
	relationalDB.getNewClientID(function(newClientID){
		console.log('new client id is: ' + newClientID);
		callback(newClientID);
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
