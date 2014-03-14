var Validator = require("../controllers/ValidateObjectController.js");
var DataStore = require('../controllers/DataStoreController.js');
var connect4Controller = require("../controllers/Connect4GameController.js");
var Player = require('./Player.js');

//used to ensure a unique instanceID in conjunction with datetime
var serverInstanceBase = 0;
// All game instances currently loaded in memory.
// Games get saved to database when all users disconnect
// Note: Guest users do not have their data retained
var matches = {};
// All online users
var onlineUsers = [];
// Cache of available games
var availGames;
var gameDefinitions = {};

module.exports = {
	// Gets the static list of game IDs, game names, and max players
	availableGames: function(callback) {
		//Validator.validateArgs(arguments, Function);
		if(!availGames) {
			DataStore.getListOfGames(function(gamesEntries) {
				availGames = gamesEntries;
				callback(availGames);
			});
		} else {
			callback(availGames);
		}
	},
	// Creates a new game for a game ID and then
	setupMatch: function(gameID, instanceID, callback) {
		//Validator.validateArgs(arguments, Number);
		module.exports.gameTypeFromID(gameID, function(gameType) {
			if(!gameDefinitions[gameID]) {
				gameDefinitions[gameID] = require("../controllers/" + gameType + "GameController.js");
				console.log('Testing get game type: ' + "../controllers/" + gameType + "GameController");
			}
			if(instanceID) {
				module.exports.getGameboard(instanceID, function(gb) {
					matches[instanceID] = new gameDefinitions[gameID](gb);
					callback(instanceID);
				});
			} else {
				var id = ((new Date().getTime())*10) + serverInstanceBase;
				var initializeMethodName = gameType + "GameController";
				//Change when you have more games
				var player1 = new Player.Player(1, 'Sam');
				var player2 = new Player.Player(2, 'Cameron');
				var game = new gameDefinitions[gameID].Connect4GameController({instanceID:id, gameID:gameID, player1: player1, player2:player2});
				matches[id] = game;
				serverInstanceBase++;
				console.log('After game definitions. Game instance id is: ' + game);
				callback(id);
			}
		});
	},
	joinMatch: function(userID, instanceID, callback) {
		//Validator.validateArgs(arguments, String, Number, Function);
		console.log('Join match get called');
		callback();
		/*
		No need for this since the setup match requires 2 players to be passed in
		and already adds the 2 players to the game
		if(matches[instanceID]) {
			console.log('Join match gets cascasasda called');
			if(matches[instanceID].gameBoard.players.length < matches[instanceID].gameBoard.maxPlayers) {
				matches[instanceID].gameBoard.AddPlayer(new Player(userID, module.exports.connectedUserName(userID)));
				callback();
			} else {
				callback({errorCode:1, errorText:"Game full"});
			}
		} else {
			DataStore.lookupMatch(instanceID, function(entries) {
				if(entries && entries.length>0) {
					module.exports.setupMatch(entries[0].gameID, instanceID, function(id) {
						module.exports.joinMatch(userID, instanceID, callback);
					});
				} else {
					throw new Error("Instance does not exist: " + instanceID);
				}
			});
		}*/
	},
	leaveMatch: function(userID, instanceID, callback) {
		Validator.validateArgs(arguments, String, Number, Function);
		DataStore.removeFromMatch(instanceID, userID, function(err) {
			if(matches[instanceID]) {
				// TODO: add proper function call to game match to remove user
				for(var i=0; i<matches[instanceID].gameBoard.players.length; i++) {
					if(matches[instanceID].gameBoard.players[i].id == userID) {
						matches[instanceID].gameBoard.players.splice(i, 1);
					}
				}
				if(matches[instanceID].gameBoard.players.length<=1) {
					// TODO handle win/draw/end of game to socket
					DataStore.endMatch(instanceID, callback);
				} else {
					callback();
				}
			} else {
				DataStore.lookupMatch(instanceID, function(entries) {
					if(!entries || entries.length<=1) {
						// Somehow we got to this sitatuation. Possibly magic? Do cleanup!
						DataStore.endMatch(instanceID, callback);
					} else {
						callback();
					}
				});
			}
		});
	},
	userConnected: function(userID, callback) {
		DataStore.getUserInformation(userID, function(userInfo) {
			onlineUsers.push(userInfo);
			module.exports.findByUser(userID, function(state) {
				var inactiveMatches = [];
				var instances = Object.keys(state);
				var setupItem = function() {
					if(instances.length>0) {
						var curr = instances.pop();
						module.exports.setupMatch(state[curr].gameID, curr, function() {
							setupItem();
						});
					} else {
						callback();
					}
				};
			});
		});
	},
	userDisconnected: function(userID, callback) {
		for(var i=0; i<onlineUsers.length; i++) {
			if(onlineUsers[i].userID == userID) {
				onlineUsers.splice(i, 1);
				break;
			}
		}
		module.exports.findByUser(userID, function(state) {
			var inactiveMatches = [];
			for(var x in state) {
				var players = Object.keys(state[x].players);
				var found = false;
				for(var i=0; i<players.length && !found; i++) {
					for(var j=0; j<onlineUsers.length && !found; j++) {
						if(onlineUsers[j].userID==players[i]) {
							inactiveMatches.push(x);
							found = true;
						}
					}
				}
			}
			var saveInactiveMatch = function() {
				if(inactiveMatches.length>0) {
					var curr = inactiveMatches.pop();
					DataStore.storeToMatch(curr.instanceID, userID, curr.gameID, function() {
						DataStore.saveGameBoard(curr.instanceID, curr, function() {
							saveInactiveMatch();
						});
					});
				} else {
					callback();
				}
			};
			saveInactiveMatch();
		});
	},
	connectedUserName: function(userID) {
		for(var i=0; i<onlineUsers.length; i++) {
			if(onlineUsers[i].userID == userID) {
				return onlineUsers[i].userName;
			}
		}
	},
	gameTypeFromID: function(gameID, callback) {
		module.exports.availableGames(function(gameObj) {
			for(var i=0; i<gameObj.length; i++) {
				if(gameObj[i].gameID == gameID) {
					callback(gameObj[i].gameName);
					return;
				}
			}
			callback();
		});
	},
	findByUser: function(userID, callback) {
		Validator.validateArgs(arguments, String, Function);
		var userState = {};
		for(var x in matches) {
			for(var i=0; i<matches[x].gameBoard.players.length; i++) {
				if(matches[x].gameBoard.players[i].id == userID) {
					userState[x] = matches[x].gameBoard.CreateBoardGameJSONObject();
				}
			}
		}
		DataStore.matchesByUser(userID, function(entries) {
			var loadItem = function() {
				if(entries.length>0) {
					var curr = entries.pop();
					if(!userState[curr.instanceID]) {
						DataStore.loadGameBoard(curr.instanceID, function(gb) {
							userState[curr.instanceID] = gb;
							loadItem();
						});
					}
				} else {
					callback(userState);
				}
			};
			loadItem();
		});
	},
	getGameboard: function(instanceID, callback) {
		Validator.validateArgs(arguments, Number, Function);
		if(matches[instanceID]) {
			callback(matches[instanceID].gameBoard.CreateBoardGameJSONObject());
		} else {
			DataStore.loadGameBoard(instanceID, callback);
		}
	}
};