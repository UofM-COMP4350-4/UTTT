var assert = require("assert");
var matchmaker = require("../../models/GameMatchmaker.js");
var players = [
	{id:0,name:"Joey",ip:"127.0.0.1"},
	{id:1,name:"Joe",ip:"0.0.0.0"},
	{id:2,name:"Jr",ip:"10.0.0.1"},
	{id:3,name:"Shabadou",ip:"172.16.0.21"}
];
var games = [
	{gameName:"connect4",maxPlayers:2,id:0},
	{gameName:"TictacToe",maxPlayer:2,id:1},
	{gameName:"Go",maxPlayers:2,id:2}
];

describe('Machmaker Model Test Suite', function(){
	describe('Queue test suite',function(){
		matchmaker.GameMatchmaker.joinQueue(players[0],games[0],function(){});
		matchmaker.GameMatchmaker.joinQueue(players[1],games[0],function(){});
		it('should have 2 players in the queue', function(done){
			matchmaker.GameMatchmaker.totalPlayers(function(tot){
				if(tot != 2){
					throw tot;
				}
				done();
			});

		});

		it('should have one player after removing the second', function(done){
			matchmaker.GameMatchmaker.removeFromQueue(players[1], function(){});
			matchmaker.GameMatchmaker.totalPlayers(function(tot){
				if(tot != 1){
					throw tot;
				}
				done();
			});
		});

		it('should return a queue of only one item', function(done){
			matchmaker.GameMatchmaker.getGameQueue(games[0],function(res){
				if(res.length !=1){
					throw res.length;	
				}
				done();
			});
		});
		it('should respond appropriately when invalid arguments are given', function(done){
			assert.throws(matchmaker.GameMatchmaker.joinQueue(null,null,function(){}),Error);
			assert.throws(matchmaker.GameMatchmaker.joinQueue({},{},function(){}),Error);
			
			assert.throws(matchmaker.GameMatchmaker.getGameQueue(null,function(){}),Error);
			assert.throws(matchmaker.GameMatchmaker.getGameQueue({},function(){}),Error);
			assert.throws(matchmaker.GameMatchmaker.getGameQueue({gmaName:"hello"},function(){}),Error);

			assert.throws(matchmaker.GameMatchmaker.queueTotal(null, function(){}),Error);
			assert.throws(matchmaker.GameMatchmaker.queueTotal({},function(){}),Error);
			assert.throws(matchmaker.GameMatchmaker.queueTotal({gamId:"haxz0rs"},function(){}),Error);

			assert.throws(matchmaker.GameMatchmaker.removeFromQueue(null, function(){}),Error);
			assert.throws(matchmaker.GameMatchmaker.removeFromQueue({}, function(){}),Error);
			assert.throws(matchmaker.GameMatchmaker.removeFromQueue({id:'nobody'}, function(){}), Error);


			done();
		});
	});
});
