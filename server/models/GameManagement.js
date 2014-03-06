var Validator = require("../controllers/ValidateObjectController.js");

//used to ensure a unique instanceID in conjunction with datetime
var serverInstanceBase = 0;
// All game instances currently loaded in memory.
// Games get saved to database when all users disconnect
// Note: Guest users do not have their data retained
var matches = {};
// All online userIDs
var onlineUsers = [];
// Cache of available games
var availGames;
var gameDefinitions = {};

module.exports = {
	// Gets the static list of game IDs, game names, and max players
	availableGames: function(callback) {
		Validator.validateArgs(arguments, Function);
		if(!availGames) {
			// TODO: implement once DB access is defined
			(function(gamesEntries) {
				availGames = gamesEntries;
				callback(availGames);
			})({
				"connect4": {gameName:"Connect4", maxPlayers:2},
				"chess": {gameName:"Chess", maxPlayers:2},
				"scrabble": {gameName:"Scrabble", maxPlayers:2},
				"battleship": {gameName:"BattleShip", maxPlayers:2},
				"ultimateTicTacToe": {gameName:"Ultimate TicTacToe", maxPlayers:2}
			});
		} else {
			callback(availGames);
		}
	},
	// Creates a new game for a game ID and then 
	createMatch: function(gameID) {
		Validator.validateArgs(arguments, Number);
		if(!gameDefinitions[gameID]) {
			gameDefinitions[gameID] = require("../controllers/" + gameID + "GameController");
		}
		var id = ((new Date().getTime())*10) + serverInstanceBase;
		var game = new gameDefinitions[gameID](id);
		matches[id] = game;
		serverInstanceBase++;
		return id;
	},
	joinMatch: function(userID, instanceID, callback) {
		Validator.validateArgs(arguments, String, Number, Function);
		if(matches[instanceID]) {
			if(matches[instanceID].players.length < matches[instanceID].maxPlayers) {
				// TODO: add function call to game match to remove user
				matches[instanceID].players.push(userID);
				callback();
			} else {
				callback({errorCode:1, errorText:"Game full"});
			}
		} else {
			// TODO: search db for match with instance id
			(function(entry) {
				if(!gameDefinitions[entry.gameID]) {
					gameDefinitions[entry.gameID] = require("../controllers/" + entry.gameID + "GameController");
				}
				matches[entry.instanceID] = new gameDefinitions[entry.gameID](entry.instanceID);
				module.exports.joinMatch(userID, instanceID, callback);
			})();
		}
	},
	leaveMatch: function(userID, instanceID, callback) {
		Validator.validateArgs(arguments, String, Number, Function);
		// TODO: remove user from match in the db if present
		(function() {
			if(matches[instanceID]) {
				// TODO: add function call to game match to remove user
				(function() {
					// temporary
					matches[instanceID].players.splice(
							matches[instanceID].players.indexOf(userID), 1);
					callback();
				})();
			} else {
				callback();
			}
		})();
	},
	useConnected: function(userID, callback) {
		onlineUsers.push(userID);
		module.exports.findByUser(userID, function(state) {
			var inactiveMatches = [];
			for(var x in state) {
				if(!matches[x]) {
					if(!gameDefinitions[state[x].gameID]) {
						gameDefinitions[state[x].gameID] = require("../controllers/" + state[x].gameID + "GameController");
					}
					matches[x] = new gameDefinitions[state[x].gameID](x);
				}
			}
			callback();
		});
	},
	userDisconnected: function(userID, callback) {
		onlineUsers.splice(onlineUsers.indexOf(userID), 1);
		module.exports.findByUser(userID, function(state) {
			var inactiveMatches = [];
			for(var x in state) {
				for(var i=0; i<state[x].players.length; i++) {
					if(onlineUsers.indexOf(state[x].players[i])>-1) {
						inactiveMatches.push(x);
						break;
					}
				}
			}
			var saveInactiveMatch = function() {
				if(inactiveMatches.length>0) {
					var curr = inactiveMatches.pop();
					(function() {
						saveInactiveMatch();
					})();
				} else {
					callback();
				}
			};
			saveInactiveMatch();
		});
	},
	findByUser: function(userID, callback) {
		Validator.validateArgs(arguments, String, Function);
		var userState = {};
		for(var x in matches) {
			if(matches[x].players.indexOf(userID)) {
				userState[x] = matches[x];
			}
		}
		// TODO query database for all games with user as a player
		(function(dbMatches) {
			for(var x in dbMatches) {
				userState[x] = userState[x] || dbMatches[x];
			}
			callback(userState);
		})({});
	},
	getGameboard: function(instanceID, callback) {
		Validator.validateArgs(arguments, Number, Function);
		if(matches[instanceID]) {
			// TODO: replace with actual gameboard api from game
			callback(matches[instanceID].gameboard);
		} else {
			// TODO: attempt to grab an instance id gameboard flat file
			(function(err, data) {
				if(err) {
					callback({});
				} else {
					callback(data);
				}
			})();
		}
	}
};