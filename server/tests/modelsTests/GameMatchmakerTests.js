var assert = require("assert");
var matchmaker = require("../../models/GameMatchmaker.js");
var players = [
	0,
	1,
	2,
	3
];
var games = [
	0,
	1,
	2
];

describe('Matchmaker Model Test Suite', function(){
	describe('Queue test suite',function(){
		it('should have 1 players in the queue', function(){
			matchmaker.GameMatchmaker.clearQueue();
			matchmaker.GameMatchmaker.joinQueue(players[1],games[0]);
			var tot = matchmaker.GameMatchmaker.totalPlayers();
			assert.equal(tot, 1);
		});
		it('should have 2 players in the queue', function(){
			matchmaker.GameMatchmaker.clearQueue();
			matchmaker.GameMatchmaker.joinQueue(players[0],games[0]);
			matchmaker.GameMatchmaker.joinQueue(players[1],games[0]);
			var tot = matchmaker.GameMatchmaker.totalPlayers();
			assert.equal(tot, 2);
		});
		it('should have 3 players in the queue', function(){
			matchmaker.GameMatchmaker.clearQueue();
			matchmaker.GameMatchmaker.joinQueue(players[0],games[0]);
			matchmaker.GameMatchmaker.joinQueue(players[1],games[0]);
			matchmaker.GameMatchmaker.joinQueue(players[2],games[0]);
			var tot = matchmaker.GameMatchmaker.totalPlayers();
			assert.equal(tot, 3);
		});

		it('should have one player after removing the second', function(){
			matchmaker.GameMatchmaker.clearQueue();
			matchmaker.GameMatchmaker.joinQueue(players[0],games[0]);
			matchmaker.GameMatchmaker.joinQueue(players[1],games[0]);
			matchmaker.GameMatchmaker.removeFromQueue(players[1]);
			var tot = matchmaker.GameMatchmaker.totalPlayers();
			assert.equal(tot, 1);
		});
		
		it('should have one player after removing the second and third', function(){
			matchmaker.GameMatchmaker.clearQueue();
			matchmaker.GameMatchmaker.joinQueue(players[0],games[0]);
			matchmaker.GameMatchmaker.joinQueue(players[1],games[0]);
			matchmaker.GameMatchmaker.joinQueue(players[2],games[0]);
			matchmaker.GameMatchmaker.removeFromQueue(players[1]);
			matchmaker.GameMatchmaker.removeFromQueue(players[2]);
			var tot = matchmaker.GameMatchmaker.totalPlayers();
			assert.equal(tot, 1);
		});
		
		it('should have one player after removing the first and third', function(){
			matchmaker.GameMatchmaker.clearQueue();
			matchmaker.GameMatchmaker.joinQueue(players[0],games[0]);
			matchmaker.GameMatchmaker.joinQueue(players[1],games[0]);
			matchmaker.GameMatchmaker.joinQueue(players[2],games[0]);
			matchmaker.GameMatchmaker.removeFromQueue(players[0]);
			matchmaker.GameMatchmaker.removeFromQueue(players[2]);
			var tot = matchmaker.GameMatchmaker.totalPlayers();
			assert.equal(tot, 1);
		});

		it('should return a queue of only one item', function(){
			matchmaker.GameMatchmaker.clearQueue();
			matchmaker.GameMatchmaker.joinQueue(players[0],games[0]);
			var res = matchmaker.GameMatchmaker.getGameQueue(games[0]);
			assert.equal(res.length, 1);
		});
		
		it('should return a queue with two items', function(){
			matchmaker.GameMatchmaker.clearQueue();
			matchmaker.GameMatchmaker.joinQueue(players[0],games[0],function(){});
			matchmaker.GameMatchmaker.joinQueue(players[1],games[0],function(){});
			var res = matchmaker.GameMatchmaker.getGameQueue(games[0]);
			assert.equal(res.length, 2);
		});
		
		it('should return a queue with one item', function(){
			matchmaker.GameMatchmaker.clearQueue();
			matchmaker.GameMatchmaker.joinQueue(players[0],games[0],function(){});
			matchmaker.GameMatchmaker.joinQueue(players[1],games[0],function(){});
			matchmaker.GameMatchmaker.removeFromQueue(players[0]);
			var res = matchmaker.GameMatchmaker.getGameQueue(games[0]);
			assert.equal(res.length, 1);
		});
		
		it('should respond appropriately when invalid arguments are given', function(){
			assert.throws(function() { matchmaker.GameMatchmaker.joinQueue(null,null) },Error);
			assert.throws(function() { matchmaker.GameMatchmaker.getGameQueue(null) },Error);
			assert.throws(function() { matchmaker.GameMatchmaker.queueTotal(null) },Error);
			assert.throws(function() { matchmaker.GameMatchmaker.removeFromQueue(null) },Error);
		});
	});
});
