var assert = require("assert");
var matchmaker = require("../../controllers/MatchmakingController.js");
var mmModel = require("../../models/GameMatchmaker.js").GameMatchmaker;
var GameMgmt = require("../../models/GameManagement.js");
var DataStore = require('../../controllers/DataStoreController.js');

var players = [
	0,
	1,
	2
];
var games=[
	0,
	1
];
DataStore.mock = true;
function resetForTesting() {
	matchmaker.reset();
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


describe('Matchmaking Controller Test Suite', function(){
	describe('Testing MatchmakingController.js', function(){
		it('should add a user to a game queue', function(){
			resetForTesting();
			matchmaker.joinMatchmaking(players[0], games[0]);
			assert.equal(mmModel.queueTotal(games[0]), 1);
		}); // end it
		it('should create a game when a queue reaches a max # of users', function(done){
			resetForTesting();
			GameMgmt.userConnected(players[0], function() {
				matchmaker.joinMatchmaking(players[0], games[0]);
				GameMgmt.userConnected(players[1], function() {
					matchmaker.joinMatchmaking(players[1], games[0], function(response) {
						assert.ok(response);
						assert.equal((typeof response), "object");
						done();
					});
				});
			});
		}); // end it
		it('should deal with invalid input accordingly', function(){
			resetForTesting();
			assert.throws(matchmaker.joinMatchmaking(null,null, function(){}), Error);
			assert.throws(matchmaker.joinMatchmaking({},{}, function(){}),Error);
			assert.throws(matchmaker.joinMatchmaking({hurr:'durr',invalid:'data'},{notA:'game'},function(){}),Error);
		
			//assert.throws(matchmaker.MatchmakingController.Match(null, null, function(){}),Error);
			assert.throws(matchmaker.Match({},{}, function(){}),Error);
			assert.throws(matchmaker.Match({fake:'name',no:'sense'},{non:'estistant game'},function(){}),Error);

			assert.throws(matchmaker.gameValidate(null, null), Error);
			assert.throws(matchmaker.gameValidate({},{}),Error);
			assert.throws(matchmaker.gameValidate([],{}),Error);
			assert.throws(matchmaker.gameValidate([{one:1},{two:2}],{fake:'game'}), Error);
		});
	}); // end describe
});
