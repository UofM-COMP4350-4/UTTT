var assert = require("assert");
var GameMgmt = require("../../models/GameManagement.js");
var DataStore = require("../../controllers/DataStoreController.js");
var noop = function() {};

// setup mock database data for testing
DataStore.mock = true;
function resetForTesting() {
	GameMgmt.reset();
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
}
resetForTesting();

/*  Game Management Tests
 *  Use: Test class to be used with Mocha.
 */

describe("GameManagement", function(){
	// describe("#availableGames()", function() {
		// it('should handle undefined/null input', function() {
			// assert.throws(function() { GameMgmt.availableGames(undefined); }, Error);
			// assert.throws(function() { GameMgmt.availableGames(null); }, Error);
		// });
		// it('should handle invalid input', function() {
			// assert.throws(function() { GameMgmt.availableGames(1); }, Error);
			// assert.throws(function() { GameMgmt.availableGames(false); }, Error);
			// assert.throws(function() { GameMgmt.availableGames("blah"); }, Error);
			// assert.throws(function() { GameMgmt.availableGames({a:1}); }, Error);
		// });
		// it("should list available games from the database (or cached record)", function(done) {
			// resetForTesting();
			// GameMgmt.availableGames(function(avail) {
				// assert.deepEqual(avail, DataStore.mockGames);
				// done();
			// });
		// });
	// });
	// describe("#setupMatch()", function() {
		// it('should handle undefined/null input', function() {
			// assert.throws(function() { GameMgmt.setupMatch(undefined, undefined, undefined); }, Error);
			// assert.throws(function() { GameMgmt.setupMatch(null, null, null); }, Error);
		// });
		// it('should handle invalid input', function() {
			// assert.throws(function() { GameMgmt.setupMatch(false, 12, {a:1}); }, Error);
			// assert.throws(function() { GameMgmt.setupMatch("test", undefined, 12); }, Error);
			// assert.throws(function() { GameMgmt.setupMatch(0, "blah", noop); }, Error);
		// });
		// it("should create a new instanceID and correspending gameobject when passed an undefined instanceID", function(done) {
			// resetForTesting();
			// var prevIDs = Object.keys(GameMgmt.getMatches());
			// GameMgmt.userConnected(0, function() {
				// GameMgmt.setupMatch(0, undefined, function(instanceID) {
					// // new connect 4 game
					// assert.equal((typeof instanceID), "number");
					// assert.notEqual(instanceID, NaN);
					// assert.equal(prevIDs.indexOf(instanceID), -1);
					// done();
				// });
			// });
		// });
		// it("should load up an existing game when passed a valid instanceID", function(done) {
			// resetForTesting();
			// GameMgmt.userConnected(2, function() {
				// GameMgmt.setupMatch(0, 0, function(instanceID) {
					// // new connect 4 game
					// assert.equal((typeof instanceID), "number");
					// assert.notEqual(instanceID, NaN);
					// assert.equal(instanceID, 0);
					// done();
				// });
			// });
		// });
	// });
	// describe("#joinMatch()", function() {
		// it('should handle undefined/null input', function() {
			// assert.throws(function() { GameMgmt.joinMatch(undefined, undefined, undefined); }, Error);
			// assert.throws(function() { GameMgmt.joinMatch(null, null, null); }, Error);
		// });
		// it('should handle invalid input', function() {
			// assert.throws(function() { GameMgmt.joinMatch(false, 12, {a:1}); }, Error);
			// assert.throws(function() { GameMgmt.joinMatch("test", true, 12); }, Error);
			// assert.throws(function() { GameMgmt.joinMatch(0, "blah", noop); }, Error);
		// });
		// it('should add a user to a setup match', function(done) {
			// resetForTesting();
			// GameMgmt.userConnected(3, function() {
				// GameMgmt.joinMatch(3, 1, function(err) {
					// var match = GameMgmt.getMatches()[1];
					// assert.ok(!err);
					// var found = false;
					// for(var i=0; i<match.gameBoard.players.length; i++) {
						// if(match.gameBoard.players[i].id===3) {
							// found = true;
							// break;
						// }
					// }
					// assert.ok(found);
					// done();
				// });
			// });
		// });
		// it('should prevent users from joining if a match is full', function(done) {
			// resetForTesting();
			// GameMgmt.userConnected(2, function() {
				// GameMgmt.joinMatch(2, 0, function(err) {
					// var numPlayers = GameMgmt.getMatches()[0].gameBoard.players.length;
					// var maxPlayers = GameMgmt.getMatches()[0].gameBoard.maxPlayers;
					// assert.ok(err);
					// assert.equal(numPlayers, maxPlayers);
					// done();
				// });
			// });
		// });
	// });
	// describe("#leaveMatch()", function() {
		// it('should handle undefined/null input', function() {
			// assert.throws(function() { GameMgmt.leaveMatch(undefined, undefined, undefined); }, Error);
			// assert.throws(function() { GameMgmt.leaveMatch(null, null, null); }, Error);
		// });
		// it('should handle invalid input', function() {
			// assert.throws(function() { GameMgmt.leaveMatch(false, 12, {a:1}); }, Error);
			// assert.throws(function() { GameMgmt.leaveMatch("test", undefined, 12); }, Error);
			// assert.throws(function() { GameMgmt.leaveMatch(0, "blah", noop); }, Error);
		// });
		// it('should remove a user from a match', function(done) {
			// resetForTesting();
			// GameMgmt.userConnected(0, function() {
				// GameMgmt.leaveMatch(0, 0, function() {
					// // leaving results in a default winner and ending of game
					// assert.equal(GameMgmt.getMatches()[0], undefined);
					// done();
				// });
			// });
		// });
	// });
	// describe("#userConnected()", function() {
		// it('should handle undefined/null input', function() {
			// assert.throws(function() { GameMgmt.userConnected(undefined, undefined); }, Error);
			// assert.throws(function() { GameMgmt.userConnected(null, null); }, Error);
		// });
		// it('should handle invalid input', function() {
			// assert.throws(function() { GameMgmt.userConnected(false, 12); }, Error);
			// assert.throws(function() { GameMgmt.userConnected("test", undefined); }, Error);
			// assert.throws(function() { GameMgmt.userConnected(0, "blah"); }, Error);
			// assert.throws(function() { GameMgmt.userConnected({a:1}, true); }, Error);
			// assert.throws(function() { GameMgmt.userConnected(noop, noop); }, Error);
		// });
		// it('should load matches the user is a member of, if not already loaded', function(done) {
			// resetForTesting();
			// assert.equal(GameMgmt.getMatches()[0], undefined);
			// GameMgmt.userConnected(0, function() {
				// assert.notEqual(GameMgmt.getMatches()[0], undefined);
				// done();
			// });
		// });
	// });
	describe("#userDisconnected()", function() {
		it('should handle undefined/null input', function() {
			assert.throws(function() { GameMgmt.userDisconnected(undefined, undefined); }, Error);
			assert.throws(function() { GameMgmt.userDisconnected(null, null); }, Error);
		});
		it('should handle invalid input', function() {
			assert.throws(function() { GameMgmt.userDisconnected(false, 12); }, Error);
			assert.throws(function() { GameMgmt.userDisconnected("test", undefined); }, Error);
			assert.throws(function() { GameMgmt.userDisconnected(0, "blah"); }, Error);
			assert.throws(function() { GameMgmt.userDisconnected({a:1}, true); }, Error);
			assert.throws(function() { GameMgmt.userDisconnected(noop, noop); }, Error);
		});
		it('should archive match data to the database when all users have disconnected from a match', function(done) {
			resetForTesting();
			GameMgmt.userConnected(0, function() {
				console.log('test');
				GameMgmt.userConnected(1, function() {
					console.log('test2');
					// all users in instance 0 connected
					assert.notEqual(GameMgmt.getMatches()[0], undefined);
					GameMgmt.userDisconnected(1, function() {
						console.log('test3');
						GameMgmt.userDisconnected(0, function() {
							console.log('test4');
							assert.equal(GameMgmt.getMatches()[0], undefined);
							done();
						});
					});
				});
			});
		});
	});
	// describe("#userNameFromID()", function() {
		// it('should handle undefined/null input', function() {
			// assert.throws(function() { GameMgmt.userNameFromID(undefined); }, Error);
			// assert.throws(function() { GameMgmt.userNameFromID(null); }, Error);
		// });
		// it('should handle invalid input', function() {
			// assert.throws(function() { GameMgmt.userNameFromID(false, 12); }, Error);
			// assert.throws(function() { GameMgmt.userNameFromID("test", undefined); }, Error);
			// assert.throws(function() { GameMgmt.userNameFromID(0, "blah"); }, Error);
			// assert.throws(function() { GameMgmt.userNameFromID({a:1}, true); }, Error);
			// assert.throws(function() { GameMgmt.userNameFromID(noop, noop); }, Error);
		// });
		// it('should get the user name of an online user from its ID', function(done) {
			// resetForTesting();
			// GameMgmt.userConnected(0, function() {
				// GameMgmt.userNameFromID(0, function(name) {
					// assert.equal(name, "Jason");
					// done();
				// });
			// });
		// });
		// it('should get the user name of an offline user from its ID', function(done) {
			// resetForTesting();
			// GameMgmt.userNameFromID(0, function(name) {
				// assert.equal(name, "Jason");
				// done();
			// });
		// });
	// });
	// describe("#gameTypeFromID()", function() {
		// it('should handle undefined/null input', function() {
			// assert.throws(function() { GameMgmt.gameTypeFromID(undefined, null); }, Error);
			// assert.throws(function() { GameMgmt.gameTypeFromID(null, undefined); }, Error);
		// });
		// it('should handle invalid input', function() {
			// assert.throws(function() { GameMgmt.gameTypeFromID(false, 12); }, Error);
			// assert.throws(function() { GameMgmt.gameTypeFromID("test", undefined); }, Error);
			// assert.throws(function() { GameMgmt.gameTypeFromID(0, "blah"); }, Error);
			// assert.throws(function() { GameMgmt.gameTypeFromID({a:1}, true); }, Error);
			// assert.throws(function() { GameMgmt.gameTypeFromID(noop, noop); }, Error);
		// });
		// it('should get the game type value from a game ID', function(done) {
			// resetForTesting();
			// GameMgmt.gameTypeFromID(0, function(type) {
				// assert.equal(type, "Connect4");
				// done();
			// });
		// });
	// });
	// describe("#findByUser()", function() {
		// it('should handle undefined/null input', function() {
			// assert.throws(function() { GameMgmt.findByUser(undefined, null); }, Error);
			// assert.throws(function() { GameMgmt.findByUser(null, undefined); }, Error);
		// });
		// it('should handle invalid input', function() {
			// assert.throws(function() { GameMgmt.findByUser(false, 12); }, Error);
			// assert.throws(function() { GameMgmt.findByUser("test", undefined); }, Error);
			// assert.throws(function() { GameMgmt.findByUser(0, "blah"); }, Error);
			// assert.throws(function() { GameMgmt.findByUser({a:1}, true); }, Error);
			// assert.throws(function() { GameMgmt.findByUser(noop, noop); }, Error);
		// });
		// it('should return gameboard objects for each match the user is in', function(done) {
			// resetForTesting();
			// GameMgmt.userConnected(0, function() {
				// GameMgmt.findByUser(0, function(state) {
					// assert.ok(state[0]);
					// assert.equal((typeof state[0]), "object");
					// assert.ok(state[1]);
					// assert.equal((typeof state[0]), "object");
					// done();
				// });
			// });
		// });
	// });
	// describe("#getMatches()", function() {
		// it('should return a JSON object of all active game objects', function() {
			// assert.equal((typeof GameMgmt.getMatches()), "object");
		// });
	// });
	// describe("#getGameboard()", function() {
		// it('should handle undefined/null input', function() {
			// assert.throws(function() { GameMgmt.getGameboard(undefined, null); }, Error);
			// assert.throws(function() { GameMgmt.getGameboard(null, undefined); }, Error);
		// });
		// it('should handle invalid input', function() {
			// assert.throws(function() { GameMgmt.getGameboard(false, 12); }, Error);
			// assert.throws(function() { GameMgmt.getGameboard("test", undefined); }, Error);
			// assert.throws(function() { GameMgmt.getGameboard(0, "blah"); }, Error);
			// assert.throws(function() { GameMgmt.getGameboard({a:1}, true); }, Error);
			// assert.throws(function() { GameMgmt.getGameboard(noop, noop); }, Error);
		// });
		// it('should return match data for a given instanceID', function(done) {
			// GameMgmt.userConnected(0, function() {
				// GameMgmt.getGameboard(0, function(gb) {
					// assert.equal((typeof gb), "object");
					// done();
				// });
			// });
		// });
	// });
});
