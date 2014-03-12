var RelationalDB = require('../models/RelationalDBAccess.js');
var flatFile = require('../models/FlatFileAccess.js');
var relationalDB;

exports.setup = function(database) {
	relationalDB = new RelationalDB(database);
};

exports.getUserInformation = function(userID, callback) {
	if(exports.mock) {
		exports.mockDBFetch("getUserInformation", callback);
	} else {
		relationalDB.getUserInfo(userID, callback);
	}
};

exports.getListOfGames = function(callback) {
	if(exports.mock) {
		exports.mockDBFetch("getListOfGames", callback);
	} else {
		//Call validate object on the relationalDB object
		relationalDB.getListOfGames(function(gameList){
			console.log('list of games is: ' + JSON.stringify(gameList[0]));
			callback(gameList);
		});
	}
};

exports.saveGameBoard = function(instanceID, gameboard, callback) {
	//Call validate object on the flatFile object
	flatFile.saveJSONObject("/gameboard/" + instanceID + "json", gameboard, callback);
};

exports.loadGameBoard = function(instanceID, callback) {
	//Call validate object on the flatFile object
	flatFile.loadJSONObject("/gameboard/" + instanceID + ".json", function(err, gb) {
		if(err) {
			callback(undefined);
		} else {
			callback(gb);
		}
	});
};

exports.addToMatch = function(instanceID, userID, gameID, callback) {
};

exports.removeFromMatch = function(instanceID, userID,  callback) {
};

exports.mock = false;

exports.mockDBFetch = function(code, callback) {
	flatFile.loadJSONObject("/mock/" + code + ".json", function(err, obj) {
		if(err) {
			throw new Error("Mock DB response json file not found: " + code);
		} else {
			callback(obj);
		}
	});
};

