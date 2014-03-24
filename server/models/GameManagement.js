var Validator = require("../controllers/ValidateObjectController.js");
var DataStore = require('../controllers/DataStoreController.js');
var GameSocket = require('../controllers/GameSocketController.js').createGameSocket(10089);
var Player = require('./Player.js').Player;

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
var GameDefinitions = {};
var noop = function() {};

GameSocket.on("userConnect", function(inEvent, optCallback) {
	module.exports.userConnected(inEvent.userID, (optCallback || noop));
});
GameSocket.on("moveReceived", function(inEvent) {
	console.log('Move Received: ' + JSON.stringify(inEvent));
	if(matches[inEvent.instanceID]) {
		matches[inEvent.instanceID].RequestMove({x:inEvent.x, y:inEvent.y, player:inEvent.player});
	}
});
GameSocket.on("userDisconnect", function(inEvent, optCallback) {
	module.exports.userDisconnected(inEvent.userID, (optCallback || noop));
});

var moveFailureHandler = function(inEvent) {
	GameSocket.SendDataToUser(inEvent.userToPlay, inEvent);
};
var boardChangedHandler = function(inEvent) {
	GameSocket.SendDataToAllUsersInGame(inEvent.instanceID, inEvent);
};
var playResultHandler = function(inEvent) {
	GameSocket.SendDataToAllUsersInGame(inEvent.instanceID, inEvent);
	delete matches[inEvent.instanceID];
	GameSocket.CloseRoom(inEvent.instanceID);
	DataStore.endMatch(inEvent.instanceID, noop);
};

module.exports = {
	// Gets the static list of game IDs, game names, and max players
	availableGames: function(callback) {
		Validator.ValidateArgs(arguments, Function);
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
		Validator.ValidateArgs(arguments, Number, Validator.OPTIONAL, Function);
		module.exports.gameTypeFromID(gameID, function(gameType) {
			if(!GameDefinitions[gameID]) {
				GameDefinitions[gameID] = require("../controllers/" + gameType + "GameController.js")[gameType + "GameController"];
			}
			if(instanceID!==undefined) {
				instanceID = parseInt(instanceID, 10);
				if(matches[instanceID]) {
					callback(instanceID);
				} else {
					DataStore.loadGameData(instanceID, function(gd) {
						if(gd) {
							matches[instanceID] = new GameDefinitions[gameID](gd);
							matches[instanceID].on("moveFailure", moveFailureHandler);
							matches[instanceID].on("boardChanged", boardChangedHandler);
							matches[instanceID].on("playResult", playResultHandler);
						} else {
							matches[instanceID] = new GameDefinitions[gameID]({instanceID:instanceID, gameID:gameID});
							matches[instanceID].on("moveFailure", moveFailureHandler);
							matches[instanceID].on("boardChanged", boardChangedHandler);
							matches[instanceID].on("playResult", playResultHandler);
							DataStore.lookupMatch(instanceID, function(entries) {
								var loadPlayers = function() {
									// load other players into game
									if(entries.length>0) {
										var curr = entries.pop();
										module.exports.joinMatch(curr.userID, instanceID, loadPlayers);
									} else {
										callback(instanceID);
									}
								};
								loadPlayers();
							});
						}
						
					});
				}
			} else {
				var id = ((new Date().getTime())*100) + (serverInstanceBase%100);
				matches[id] = new GameDefinitions[gameID]({instanceID:id, gameID:gameID});
				matches[id].on("moveFailure", moveFailureHandler);
				matches[id].on("boardChanged", boardChangedHandler);
				matches[id].on("playResult", playResultHandler);
				serverInstanceBase++;
				callback(id);
			}
		});
	},
	joinMatch: function(userID, instanceID, callback) {
		console.log("JOIN MATCH: " + userID +", " + instanceID);
		Validator.ValidateArgs(arguments, Number, Number, Function);
		if(matches[instanceID]) {
			console.log("MATCH OBJECT EXISTS " + userID +", " + instanceID);
			if(matches[instanceID].gameBoard.players.length < matches[instanceID].gameBoard.maxPlayers) {
				var found = false;
				for(var i=0; i<matches[instanceID].gameBoard.players.length && !found; i++) {
					found = (matches[instanceID].gameBoard.players[i].id==userID);
				}
				if(!found) {
					module.exports.userNameFromID(userID, function(userName) {
						matches[instanceID].gameBoard.AddPlayer(new Player(userID, userName));
						GameSocket.JoinRoom(userID, instanceID);
						callback();
					});
				} else {
					GameSocket.JoinRoom(userID, instanceID);
					callback();
				}
			} else {
				callback({errorCode:1, errorText:"Game full"});
			}
		} else {
			try {
				DataStore.lookupMatch(instanceID, function(entries) {
					if(entries && entries.length>0) {
						module.exports.setupMatch(entries[0].gameID, instanceID, function(id) {
							module.exports.joinMatch(userID, instanceID, callback);
						});
					} else {
						throw new Error("Instance does not exist: " + instanceID);
					}
				});
			} catch(e) {
				callback({errorCode:2, errorText:"Unable to join match"});
			}
		}
	},
	leaveMatch: function(userID, instanceID, callback) {
		Validator.ValidateArgs(arguments, Number, Number, Function);
		DataStore.removeFromMatch(instanceID, userID, function(err) {
			if(matches[instanceID]) {
				// TODO: add proper function call to game match to remove user
				for(var i=0; i<matches[instanceID].gameBoard.players.length; i++) {
					if(matches[instanceID].gameBoard.players[i].id == userID) {
						matches[instanceID].gameBoard.players.splice(i, 1);
					}
				}
				GameSocket.LeaveRoom(userID, instanceID);
				if(matches[instanceID].gameBoard.players.length<=1) {
					// TODO handle win/draw/end of game to socket
					delete matches[instanceID];
					GameSocket.CloseRoom(instanceID);
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
		Validator.ValidateArgs(arguments, Number, Function);
		var found = false;
		for(var i=0; i<onlineUsers.length && !found; i++) {
			found = (onlineUsers[i].userID==userID);
		}
		if(!found) {
			DataStore.getUserInformation(userID, function(userInfo) {
				onlineUsers.push(userInfo);
				module.exports.findByUser(userID, function(entries) {
					var setupItem = function() {
						if(entries.length>0) {
							var curr = entries.pop();
							if(matches[curr.instanceID]) {
								setupItem();
							} else {
								module.exports.setupMatch(curr.gameID, curr.instanceID, function() {
									setupItem();
								});
							}
						} else {
							callback();
						}
					};
					setupItem();
				});
			});
		}
	},
	userDisconnected: function(userID, callback) {
		Validator.ValidateArgs(arguments, Number, Function);
		for(var i=0; i<onlineUsers.length; i++) {
			if(onlineUsers[i].userID == userID) {
				onlineUsers.splice(i, 1);
				break;
			}
		}
		module.exports.findByUser(userID, function(entries) {
			var saveMatches = function() {
				if(entries.length>0) {
					var curr = entries.pop();
					if(matches[curr.instanceID]) {
						var players = matches[curr.instanceID].gameBoard.players;
						var found = false;
						for(var j=0; j<players.length && !found; j++) {
							for(var k=0; k<onlineUsers.length && !found; k++) {
								if(onlineUsers[k].userID==players[j].id) {
									found = true;
								}
							}
						}
						if(!found) {
							DataStore.storeToMatch(curr.instanceID, userID, curr.gameID, function() {
								var data = matches[curr.instanceID].gameBoard.CreateBoardGameJSONObject();
								DataStore.saveGameData(curr.instanceID, data, function() {
									delete matches[curr.instanceID];
									saveMatches();
								});
							});
						} else {
							saveMatches();
						}
					}
				} else {
					callback();
				}
			};
			saveMatches();
		});
	},
	userNameFromID: function(userID, callback) {
		Validator.ValidateArgs(arguments, Number);
		for(var i=0; i<onlineUsers.length; i++) {
			if(onlineUsers[i].userID == userID) {
				callback(onlineUsers[i].userName);
				return;
			}
		}
		DataStore.getUserInformation(userID, function(userInfo) {
			callback(userInfo.userName);
		});
	},
	gameTypeFromID: function(gameID, callback) {
		Validator.ValidateArgs(arguments, Number, Function);
		module.exports.availableGames(function(gameObj) {
			for(var i=0; i<gameObj.length; i++) {
				if(gameObj[i].gameID == gameID) {
					callback(gameObj[i].gameType);
					return;
				}
			}
			callback();
		});
	},
	findByUser: function(userID, callback) {
		Validator.ValidateArgs(arguments, Number, Function);
		var userEntries = [];
		for(var x in matches) {
			for(var i=0; i<matches[x].gameBoard.players.length; i++) {
				if(matches[x].gameBoard.players[i].id == userID) {
					userEntries.push({instanceID:parseInt(x, 10), gameID:matches[x].gameBoard.gameID});
				}
			}
		}
		DataStore.matchesByUser(userID, function(entries) {
			for(var i=0; i<entries.length; i++) {
				var found = false;
				for(var j=0; j<userEntries.length && !found; j++) {
					if(userEntries[j].instanceID==entries[i].instanceID) {
						found = true;
					}
				}
				if(!found) {
					userEntries.push({instanceID:entries[i].instanceID, gameID:entries[i].gameID});
				}
			}
			callback(userEntries);
		});
	},
	getMatches: function() {
		return matches;
	},
	getGameboard: function(instanceID, gameID, callback) {
		Validator.ValidateArgs(arguments, Number, Number, Function);
		if(!matches[instanceID]) {
			DataStore.loadGameData(instanceID, function(gd) {
				gd = gd || {instanceID:instanceID, gameID:gameID};
				if(!GameDefinitions[gameID]) {
					module.exports.gameTypeFromID(gameID, function(type) {
						GameDefinitions[gameID] = require("../controllers/" + type + "GameController.js")[type + "GameController"];
						var game = new GameDefinitions[gameID](gd);
						callback(game.gameBoard.CreateBoardGameJSONObject());
					});
				} else {
					var game = new GameDefinitions[gameID](gd);
					callback(game.gameBoard.CreateBoardGameJSONObject());
				}
			});
		} else {
			callback(matches[instanceID].gameBoard.CreateBoardGameJSONObject());
		}
	},
	reset: function() {
		serverInstanceBase = 0;
		matches = {};
		onlineUsers = [];
		availGames = undefined;
		GameDefinitions = {};
	}
};