var RelationalDB = require('../models/RelationalDBAccess.js');
var flatFile = require('../models/FlatFileAccess.js');
var ValidateObjectController = require("./ValidateObjectController.js");
var connect4GameBoard = require("../models/connect4/Connect4GameBoard.js");
var relationalDB;
var absPath = "/Users/cam/NBGI/server/";

exports.setup = function(database) {
	relationalDB = new RelationalDB(database);
};

exports.getUserInformation = function(userID, callback) {
	if(exports.mock) {
		var userInfo, i;
		if ((typeof userID) === "undefined") {
			var newUserID = 1;
			for(i=0; i < exports.mockUsers.length; i++) {
				newUserID++;
			}
			userInfo = {userID:newUserID, userName:"", isOnline:true, avatarURL:"avatar.jpg"};
			exports.mockUsers.push(userInfo);	
		}
		
		for(i=0; i<exports.mockUsers.length; i++) {
			if(exports.mockUsers[i].userID == userID) {
				userInfo = exports.mockUsers[i];
			}
		}
		callback(userInfo);
		
	} else {
		relationalDB.getUserInfo(userID, callback);
	}
};

exports.getListOfGames = function(callback) {
	if(exports.mock) {
		callback(exports.mockGames);
	} else {
		//Call validate object on the relationalDB object
		relationalDB.getListOfGames(function(gameList){
			console.log('list of games is: ' + JSON.stringify(gameList));
			callback(gameList);
		});
	}
};

exports.saveGameBoard = function(instanceID, gameboard, callback) {
	ValidateObjectController.ValidateObject(gameboard);
	ValidateObjectController.ValidateNumber(instanceID);
	flatFile.saveJSONObject(absPath + "gameboard/" + instanceID + ".json", gameboard, callback);
};

exports.loadGameBoard = function(instanceID, callback) {
	ValidateObjectController.ValidateNumber(instanceID);
	flatFile.loadJSONObject(absPath + "gameboard/" + instanceID + ".json", function(err, gb) {
		if(err) {
			callback(undefined);
		} else {
			callback(gb);
		}
	});
};

exports.storeToMatch = function(instanceID, userID, gameID, callback) {
	ValidateObjectController.ValidateNumber(instanceID);
	ValidateObjectController.ValidateNumber(userID);
	ValidateObjectController.ValidateNumber(gameID);
	if(exports.mock) {
		var found = false;
		for(var i=0; i<exports.mockMatches.length && !found; i++) {
			if(exports.mockMatches[i].userID==userID
					&& exports.mockMatches[i].instanceID==instanceID) {
				found = true;
			}
		}
		if(!found) {
			exports.mockMatches.push({
				userID:userID,
				instanceID:instanceID,
				gameID:gameID
			});
		}
		callback(!found);
	} else {
		ValidateObjectController.ValidateObject(relationalDB);
		relationalDB.addToMatch(instanceID, userID, gameID, callback);
	}
};

exports.lookupMatch = function(instanceID, callback) {
	ValidateObjectController.ValidateNumber(instanceID);
	if(exports.mock) {
		var matchEntries = [];
		
		for(var i=0; i<exports.mockMatches.length; i++) {
			if(exports.mockMatches[i].instanceID == instanceID) {
				matchEntries.push(exports.mockMatches[i]);
			}
		}
		callback(matchEntries);
	} else {
		ValidateObjectController.ValidateObject(relationalDB);
		relationalDB.lookupMatch(instanceID, callback);
	}
};

exports.removeFromMatch = function(instanceID, userID, callback) {
	ValidateObjectController.ValidateNumber(instanceID);
	ValidateObjectController.ValidateNumber(userID);
	if(exports.mock) {
		for(var i=0; i<exports.mockMatches.length; i++) {
			if(exports.mockMatches[i].instanceID == instanceID
					&& exports.mockMatches[i].userID == userID) {
				exports.mockMatches.splice(i, 1);
				break;
			}
		}
		callback();
	} else {
		ValidateObjectController.ValidateObject(relationalDB);
		relationalDB.removeFromMatch(instanceID, userID, callback);
	}
};

exports.endMatch = function(instanceID, callback) {
	ValidateObjectController.ValidateNumber(instanceID);
	if(exports.mock) {
		for(var i=0; i<exports.mockMatches.length; i++) {
			if(exports.mockMatches[i].instanceID == instanceID) {
				exports.mockMatches.splice(i, 1);
				i--;
			}
		}
		flatFile.deleteFile(absPath + "gameboard/" + instanceID + ".json", function () {
			callback();	
		});
	} else {
		ValidateObjectController.ValidateObject(relationalDB);
		relationalDB.endMatch(instanceID, function(err) {
			flatFile.isPathCreated(absPath + "gameboard/" + instanceID + ".json", function(exists) {
				if(exists) {
					flatFile.deleteFile(absPath + "gameboard/" + instanceID + ".json", function() {
						callback();
					});
				} else {
					callback();
				}
			});
		});
	}
};

exports.matchesByUser = function(userID, callback) {
	ValidateObjectController.ValidateNumber(userID);
	if(exports.mock) {
		var matches = [];
		for(var i=0; i<exports.mockMatches.length; i++) {
			if(exports.mockMatches[i].userID == userID) {
				matches.push(exports.mockMatches[i]);
			}
		}
		callback(matches);
	} else {
		ValidateObjectController.ValidateObject(relationalDB);
		relationalDB.matchesByUser(userID, callback);
	}
};

exports.mock = false;
exports.mockUsers = [];
exports.mockGames = [];
exports.mockMatches = [];
