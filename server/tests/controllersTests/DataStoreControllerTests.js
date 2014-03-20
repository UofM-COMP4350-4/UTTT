var assert = require("assert");
var DataStore = require("../../controllers/DataStoreController.js");

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
		it('Test: Request information for a new (undefined) user', function(done) {
			DataStore.getUserInformation(undefined, function(user) {
				assert.notEqual(user, null);
				assert.notEqual(user, undefined);
				assert.notEqual(user, NaN);
				done();	
			});
			
		});
	});
});