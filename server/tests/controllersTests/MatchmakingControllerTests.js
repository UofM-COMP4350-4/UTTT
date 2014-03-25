var assert = require("assert");
var matchmaker = require("../../controllers/MatchmakingController.js");
var mmModel = require("../../models/GameMatchmaker.js").GameMatchmaker;
var GameMgmt = require("../../models/GameManagement.js");
var DataStore = require('../../controllers/DataStoreController.js');
var GameSocket = require('../../controllers/GameSocketController.js').createGameSocket(10089);

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
	DataStore.mockMatches = [];
}
resetForTesting();


describe('MatchmakingController', function() {
	describe('#joinMatchmaking()', function() {
		it('should deal with invalid input accordingly', function(){
			resetForTesting();
			assert.throws(function() { matchmaker.joinMatchmaking(null,null) }, Error);
			assert.throws(function() { matchmaker.joinMatchmaking({},{}) },Error);
			assert.throws(function() { matchmaker.joinMatchmaking({hurr:'durr',invalid:'data'},{notA:'game'}) },Error);
		});
		it('should add a user to a game queue', function(){
			resetForTesting();
			matchmaker.joinMatchmaking(players[0], games[0]);
			assert.equal(mmModel.queueTotal(games[0]), 1);
		});
		it('should create a game when a queue reaches a max # of users', function(done){
			resetForTesting();
			// fake users connecting and joining the matchmaker
			GameSocket.emit("userConnect", {userID: players[0]}, function() {
				matchmaker.joinMatchmaking(players[0], games[0], function() {
					GameSocket.emit("userConnect", {userID: players[1]}, function() {
						matchmaker.joinMatchmaking(players[1], games[0], function(response) {
							assert.ok(response);
							assert.equal((typeof response), "object");
							assert.equal((typeof response.instanceID), "number");
							assert.equal(mmModel.queueTotal(games[0]), 0);
							done();
						});
					});
				});
			});
		});
	});
	describe('#checkForMatchFound()', function() {
		it('should deal with invalid input accordingly', function(){
			resetForTesting();
			assert.throws(function() { matchmaker.checkForMatchFound(null,null) }, Error);
			assert.throws(function() { matchmaker.checkForMatchFound({},{}) },Error);
			assert.throws(function() { matchmaker.checkForMatchFound("durr","game") },Error);
		});
		it('should check to see if a match can be setup and setup one if needed', function(done){
			resetForTesting();
			mmModel.joinQueue(players[0], games[0]);
			mmModel.joinQueue(players[1], games[0]);
			assert.equal(mmModel.queueTotal(games[0]), DataStore.mockGames[games[0]].maxPlayers);
			matchmaker.checkForMatchFound(games[0], function(response) {
				assert.ok(response);
				assert.equal((typeof response), "object");
				assert.equal((typeof response.instanceID), "number");
				assert.equal(mmModel.queueTotal(games[0]), 0);
				assert.equal(response.players.length, DataStore.mockGames[games[0]].maxPlayers);
				done();
			});
		});
	});
	describe('#leaveAllMatchmaking()', function() {
		it('should deal with invalid input accordingly', function(){
			resetForTesting();
			assert.throws(function() { matchmaker.leaveAllMatchmaking(null) }, Error);
			assert.throws(function() { matchmaker.leaveAllMatchmaking({}) },Error);
			assert.throws(function() { matchmaker.leaveAllMatchmaking(false) },Error);
		});
		it('should remove a user from all game queues', function(){
			resetForTesting();
			mmModel.joinQueue(players[0], games[0]);
			mmModel.joinQueue(players[0], games[1]);
			assert.equal(mmModel.queueTotal(games[0]), 1);
			assert.equal(mmModel.queueTotal(games[1]), 1);
			matchmaker.leaveAllMatchmaking(players[0]);
			assert.equal(mmModel.queueTotal(games[0]), 0);
			assert.equal(mmModel.queueTotal(games[1]), 0);
		});
	});
});
