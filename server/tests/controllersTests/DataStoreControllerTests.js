var assert = require("assert");
var DataStore = require("../../controllers/DataStoreController.js");
var connect4GameBoardJS = require("../../models/connect4/Connect4GameBoard.js");
var playerJS = require("../../models/Player.js");

/*  Data Store Controller Tests
 *  Use: Test class to be used with Mocha.  Tests the DataStoreController.js functions.
 */

DataStore.mock = true;
DataStore.mockGames = [
	{gameID:0, gameType:"Connect4", gameName:"Connect4", maxPlayers:2},
	{gameID:1, gameType:"Scrabble", gameName:"Scrabble", maxPlayers:2},
	{gameID:2, gameType:"BattleShip", gameName:"BattleShip", maxPlayers:2},
	{gameID:3, gameType:"UltimateTicTacToe", gameName:" Ultimate TicTacToe", maxPlayers:2}
];
DataStore.mockUsers = [
	{userID:0, userName:"Jason", isOnline:true, avatarURL:"avatar.jpg"},
	{userID:1, userName:"Cam", isOnline:true, avatarURL:"avatar.jpg"},
	{userID:2, userName:"Sam", isOnline:true, avatarURL:"avatar.jpg"},
	{userID:3, userName:"Chris", isOnline:true, avatarURL:"avatar.jpg"}
];
DataStore.mockMatches = [
	{instanceID:0, userID:0, gameID:0}, // Jason vs Cam Connect4
	{instanceID:0, userID:1, gameID:0},
	{instanceID:1, userID:0, gameID:0} // Jason waiting for opponent, Scrabble
];

describe('Controller Test Suite', function(){
	describe('DataStoreController Test Class', function() {
		it('Test: Invalid Data', function(done) {
			assert.throws(function() { DataStore.saveGameData([], true) }, Error);
			assert.throws(function() { DataStore.saveGameData([], 0) }, Error);
			assert.throws(function() { DataStore.loadGameData([]) }, Error);
			assert.throws(function() { DataStore.loadGameData(true) }, Error);
			assert.throws(function() { DataStore.storeToMatch(true, 1, 1) }, Error);
			assert.throws(function() { DataStore.storeToMatch(1, true, 1) }, Error);
			assert.throws(function() { DataStore.storeToMatch(1, 1, true) }, Error);
			assert.throws(function() { DataStore.lookupMatch(true) }, Error);
			assert.throws(function() { DataStore.removeFromMatch(1, true) }, Error);
			assert.throws(function() { DataStore.removeFromMatch(1, true) }, Error);
			assert.throws(function() { DataStore.endMatch(true) }, Error);
			assert.throws(function() { DataStore.matchesByUser(true) }, Error);
			
			DataStore.getUserInformation(NaN, function(user) {
				assert.equal(typeof user === "undefined",true);
				done();
			});
		});
		
		it('Test: Request information for a new (undefined) user', function(done) {
			DataStore.getUserInformation(undefined, function(user) {
				assert.notEqual(user, null);
				assert.notEqual(user, undefined);
				assert.notEqual(user, NaN);
				done();	
			});		
		});
		
		it('Test: Request existing users information', function(done) {
			DataStore.getUserInformation(1, function(user) {
				assert.notEqual(user, null);
				assert.notEqual(user, undefined);
				assert.notEqual(user, NaN);
				assert.equal(1,user.userID);
				done();
			});
		});
		
		it('Test: Request not existing users information', function(done) {
			DataStore.getUserInformation(10000, function(user) {
				assert.equal(typeof user === "undefined",true);
				done();
			});
		});
		
		it('Test: Get the list of games a user can play', function(done) {
			DataStore.getListOfGames(function(games) {
				assert.notEqual(games, null);
				assert.notEqual(games, undefined);
				assert.notEqual(games.length, undefined);
				done();
			});
		});
		
		it('Test: Store a new match and retrieve it', function(done) {
			var instanceID = 96;
			var userID = 5;
			var gameID = 1;
			DataStore.storeToMatch(instanceID, userID, gameID, function(success) {
				assert.equal(success, true);
				
				DataStore.lookupMatch(instanceID, function(playersInMatch) {
					assert.equal(playersInMatch.length, 1);
					assert.deepEqual(playersInMatch, [{userID: userID, instanceID: instanceID, gameID: gameID}]);
					
					DataStore.removeFromMatch(instanceID, userID, function() {
						done();	
					});
				});
			});
		});		
		
		it('Test: Store an existing match', function(done) {
			var instanceID = 96;
			var userID = 5;
			var gameID = 1;
			DataStore.storeToMatch(instanceID, userID, gameID, function(success) {
				assert.equal(success, true);
				
				DataStore.storeToMatch(instanceID, userID, gameID, function(success) {
					assert.equal(success, false);
					
					DataStore.removeFromMatch(instanceID, userID, function() {
						done();
					});
				});
			});
		});			
		
		it('Test: Look up a not existing match', function(done) {
			var instanceID = 96;
			DataStore.lookupMatch(instanceID, function(playersInMatch) {
				assert.equal(playersInMatch.length, 0);
				assert.notEqual(playersInMatch, "undefined");
				assert.notEqual(playersInMatch, null);
				done();
			});
		});			
		
		it('Test: Remove a player from a match they are playing', function(done) {
			var instanceID = 96;
			var userID = 5;
			var gameID = 1;
			DataStore.storeToMatch(instanceID, userID, gameID, function(success) {
				assert.equal(success, true);
				
				DataStore.removeFromMatch(instanceID, userID, function() {
					DataStore.lookupMatch(instanceID, function(playersInMatch) {
						assert.equal(playersInMatch.length, 0);
						assert.notEqual(playersInMatch, null);
						assert.notEqual(playersInMatch, "undefined");
						done();
					});
				});
			});
		});
		
		it('Test: Remove a player from a match they are not playing', function(done) {
			var instanceID = 96;
			var userID = 5;
			DataStore.removeFromMatch(instanceID, userID, function() {
				DataStore.lookupMatch(instanceID, function(playersInMatch) {
					assert.equal(playersInMatch.length, 0);
					assert.notEqual(playersInMatch, null);
					assert.notEqual(playersInMatch, "undefined");
					done();
				});
			});
		});		
		
		it('Test: Get matches for a user playing at least two games', function(done) {
			var instanceID = 96;
			var userID = 5;
			var gameID = 1;
			DataStore.storeToMatch(instanceID, userID, gameID, function(success) {
				DataStore.storeToMatch(instanceID + 1, userID, gameID, function(success) {
					DataStore.matchesByUser(userID, function(matches) {
						assert.equal(matches.length, 2);
						assert.notEqual(matches, null);
						assert.notEqual(matches, "undefined");
						
						DataStore.removeFromMatch(instanceID, userID, function() {
							DataStore.removeFromMatch(instanceID + 1, userID, function() {
								done();
							});
						});
					});
				});
			});			
		});
		
		it('Test: Get matches for a user playing 0 games', function(done) {
			var userID = 5;
			DataStore.matchesByUser(userID, function(matches) {
				assert.equal(matches.length, 0);
				assert.notEqual(matches, null);
				assert.notEqual(matches, "undefined");
				done();
			});			
		});
		
		it('Test: Save a gameboard and end a match', function(done) {
			var instanceID = 96;
			var Player1 = new playerJS.Player(12, 'Player 1');
			var Player2 = new playerJS.Player(401, 'Player 2');
			var gameboard = new connect4GameBoardJS.Connect4GameBoard({
				gameID: 7,
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
			});
						
			DataStore.saveGameData(532744, gameboard, function() {
				DataStore.endMatch(532744, function() {
					done();
				});
			});
		});		
	});
});