var assert = require("assert");
var matchmaker = require("../../controllers/MatchmakingController.js");

var players = [
	{id:0,name:'Carl'},
	{id:1,name:'yRay'},
	{id:2,name:'Jepsen'}
];
var games=[
	{gameName:'Connect4',maxPlayers:2,id:0},
	{gameName:'Chess',maxPlayers:2,id:1}
];


describe('Matchmaking Controller Test Suite', function(){
	describe('Testing MatchmakingController.js', function(){
		it('should respond with "" when only one user is in the queue', function(done){
			matchmaker.MatchmakingController.joinMatchmaking(players[0],games[0], function(res){
				if(res !== ""){
					throw res;
				}
				done();
			});		
		}); // end it
		it('should deal with invalid input accordingly', function(done){
			assert.throws(matchmaker.MatchmakingController.joinMatchmaking(null,null, function(){}), Error);
			assert.throws(matchmaker.MatchmakingController.joinMatchmaking({},{}, function(){}),Error);
			assert.throws(matchmaker.MatchmakingController.joinMatchmaking({hurr:'durr',invalid:'data'},{notA:'game'},function(){}),Error);
		
			//assert.throws(matchmaker.MatchmakingController.Match(null, null, function(){}),Error);
			assert.throws(matchmaker.MatchmakingController.Match({},{}, function(){}),Error);
			assert.throws(matchmaker.MatchmakingController.Match({fake:'name',no:'sense'},{non:'estistant game'},function(){}),Error);

			assert.throws(matchmaker.MatchmakingController.gameValidate(null, null), Error);
			assert.throws(matchmaker.MatchmakingController.gameValidate({},{}),Error);
			assert.throws(matchmaker.MatchmakingController.gameValidate([],{}),Error);
			assert.throws(matchmaker.MatchmakingController.gameValidate([{one:1},{two:2}],{fake:'game'}), Error);
		});
	}); // end describe
});
