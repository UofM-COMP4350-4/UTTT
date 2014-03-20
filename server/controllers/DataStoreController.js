var RelationalDB = require('../models/RelationalDBAccess.js');
var flatFile = require('../models/FlatFileAccess.js');
var relationalDB;

exports.setup = function(database) {
	relationalDB = new RelationalDB(database);
};

exports.getUserInformation = function(userID, callback) {
	if(exports.mock) {
		if (!userID) {
			var newUserID = 1;
			for (var i=0; i < exports.mockUsers.length; i++) {
				newUserID++;
			}
			mockUsers.push({userID:newUserID, userName:"", isOnline:true, avatarURL:"avatar.jpg"};	
		}
		for(var i=0; i<exports.mockUsers.length; i++) {
			if(exports.mockUsers[i].userID == userID) {
				callback(exports.mockUsers[i]);
				break;
			}
		}
		
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
	//Call validate object on the flatFile object
	flatFile.saveJSONObject("/gameboard/" + instanceID + ".json", gameboard, callback);
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

exports.storeToMatch = function(instanceID, userID, gameID, callback) {
	if(exports.mock) {
		var found = false;
		for(var i=0; i<exports.mockMatches.length && !found; i++) {
			if(exports.mockMatches[i].userID==userID
					&& exports.mockMatches[i]==instanceID) {
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
		callback();
	} else {
		//Call validate object on the relationalDB object
		relationalDB.addToMatch(instanceID, userID, gameID, callback);
	}
};

exports.lookupMatch = function(instanceID, callback) {
	if(exports.mock) {
		var matchEntries = [];
		for(var i=0; i<exports.mockMatches.length; i++) {
			if(exports.mockMatches[i].instanceID == instanceID) {
				matchEntries.push(exports.mockMatches[i]);
			}
		}
		callback(matchEntries);
	} else {
		//Call validate object on the relationalDB object
		relationalDB.lookupMatch(instanceID, callback);
	}
};

exports.removeFromMatch = function(instanceID, userID, callback) {
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
		//Call validate object on the relationalDB object
		relationalDB.removeFromMatch(instanceID, userID, callback);
	}
};

exports.endMatch = function(instanceID, callback) {
	if(exports.mock) {
		for(var i=0; i<exports.mockMatches.length; i++) {
			if(exports.mockMatches[i].instanceID == instanceID) {
				exports.mockMatches.splice(i, 1);
				i--;
			}
		}
		callback();
	} else {
		//Call validate object on the relationalDB object
		relationalDB.endMatch(instanceID, function(err) {
			flatFile.isPathCreated("/gameboard/" + instanceID + ".json", function(exists) {
				if(exists) {
					flatFile.deleteFile("/gameboard/" + instanceID + ".json", callback);
				} else {
					callback();
				}
			});
		});
	}
};

exports.matchesByUser = function(userID, callback) {
	if(exports.mock) {
		var matches = [];
		for(var i=0; i<exports.mockMatches.length; i++) {
			if(exports.mockMatches[i].userID == userID) {
				matches.push(exports.mockMatches[i]);
			}
		}
		callback(matches);
	} else {
		//Call validate object on the relationalDB object
		relationalDB.matchesByUser(userID, callback);
	}
};

exports.mock = false;
exports.mockUsers = [];
exports.mockGames = [];
exports.mockMatches = [];
