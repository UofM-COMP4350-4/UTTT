var Validator = require("../controllers/ValidateObjectController.js");

//used to ensure a unique instanceID in conjunction with datetime
var serverInstanceBase = 0;
// All game instances currently loaded in memory.
// Games get saved to database when all users disconnect
// Note: Guest users do not have their data retained
var matches = {};

module.exports = {
	// Gets the static list of game IDs, game names, and max players
	availableGames: function(callback) {
		Validator.ValidateArgs(arguments, Function);
		// TODO: implement once DB access is defined
		// Temporary static return
		var games = {
			"0": {gameName:"Connect4", maxPlayers:2},
			"1": {gameName:"Chess", maxPlayers:2},
			"2": {gameName:"Scrabble", maxPlayers:2},
			"3": {gameName:"BattleShip", maxPlayers:2},
			"4": {gameName:"Ultimate TicTacToe", maxPlayers:2}
		};
		callback(games);
	},
	// Creates a new game for a game ID and then 
	createMatch: function(gameID) {
		Validator.ValidateArgs(arguments, Number);
		// TODO: Create game instance
		// Temporary object until then
		var game = {gameID:0, players:[], maxPlayers:2,gameboard:'001101010101010101'};
		var id = ((new Date().getTime())*10) + serverInstanceBase;
		matches[id] = game;
		serverInstanceBase++;
		return id;
	},
	joinMatch: function(userID, instanceID, callback) {
		Validator.ValidateArgs(arguments, String, Number, Function);
		if(matches[instanceID]) {
			if(matches[instanceID].players.length <
					matches[instanceID].maxPlayers) {
				// TODO: add function call to game match to remove user
				matches[instanceID].players.push(userID);
				callback();
			} else {
				callback({errorCode:1, errorText:"Game full"});
			}
		} else {
			// TODO: search db for active, but not in-memory games
			callback();
		}
	},
	leaveMatch: function(userID, instanceID, callback) {
		Validator.ValidateArgs(arguments, String, Number, Function);
		if(matches[instanceID]) {
			// TODO: add function call to game match to remove user
			matches[instanceID].players.splice(
					matches[instanceID].players.indexOf(userID), 1);
			callback();
		} else {
			// TODO: search db for active, but not in-memory games
			callback();
		}
	},
	findByUser: function(userID, callback) {
		Validator.ValidateArgs(arguments, String, Function);
		var userState = {};
		for(var x in matches) {
			if(matches[x].players.indexOf(userID)) {
				userState[x] = matches[x];
			}
		}
		// TODO query database for all games with user as a player
		callback(userState);
	},
	getGameboard: function(instanceID, callback) {
		Validator.ValidateArgs(arguments, Number, Function);
		if(matches[instanceID]) {
			// TODO: replace with actual gameboard api from game
			callback(matches[instanceID]['gameboard']);
		} else {
			// TODO: search db for active, but not in-memory games
			callback({});
		}
	}
};
