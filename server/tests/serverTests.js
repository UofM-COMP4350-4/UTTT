var assert = require("assert");
var serverJS = require("../server.js");
var http = require("http");
var GameMgmt = require("../models/GameManagement.js");
var DataStore = require("../controllers/DataStoreController.js");

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

/*  Server Tests
 *  Use: Test class to be used with Mocha.  Tests the Server.js functions.
 */

 //setup function for calls that require data
function setup(path, text, callback){
	var options = {
		host: "localhost",
		path: path + "?" + text
	};
	
	var req = http.request(options, callback);
	req.end();
}

//setup function for calls that don't require data
function setupNoData(path, callback){
	var options = {
		host: "localhost",
		path: path
	};
	
	var req = http.request(options, callback);
	req.end();
}
			
describe('Server Test Suite', function(){
	describe('Server Test Class', function() {
	
		//Test valid data sent to the Server's /initialize method
		it('Test: Valid Initialize Data', function(done) {
			resetForTesting();
			var path = "/initialize";
			var text = "userID=0";
			var userData = "";
						
			var callback = function(response)
			{
				response.on('error', function(err){
					console.log("Error received " + err);
				});
				
				response.on('data', function(chunk){					
					userData += chunk;
				});
				
				response.on('end', function(){
					console.log(userData);
					userData = JSON.parse(userData);//parse out the JSON object
					assert.notEqual(response.statusCode, 200);
					
					assert.notEqual(userData, undefined);
					assert.equal((typeof userData.user), "object");
					assert.ok((userData.availableGames instanceof Array));
					assert.equal((typeof userData.active), "object");
					done();
				});		
			};
			
			setup(path, text, callback);
		});
		
		//Test undefined user sent to the Server's /initialize method
		it('Test: undefined user', function(done) {
			resetForTesting();
			var path = "/initialize";
			var text = "userID=";
			var userData = "";
						
			var callback = function(response)
			{
				response.on('error', function(err){
					console.log("Error received " + err);
				});
				
				response.on('data', function(chunk){					
					userData += chunk;
				});
				
				response.on('end', function(){
					userData = JSON.parse(userData);//parse out the JSON object
					console.log("Data received " + userData.userID);
					
					assert.notEqual(response.statusCode, 200);
					
					assert.notEqual(userData, undefined);
					assert.equal((typeof userData.user), "object");
					assert.equal((typeof userData.user.userID), "number");
					assert.ok((userData.availableGames instanceof Array));
					assert.equal((typeof userData.active), "object");
					done();
				});		
			};
			
			setup(path, text, callback);
		});
		
		//All we have to do is make sure we have at least one game first
		//after that, we can check to make sure the games match what we expect
		it('Test: ListOfGames request test', function(done) {
			resetForTesting();
			var path = "/listOfGames";
			var userData = "";
			
			var callback = function(response)
			{
				response.on('error', function(err){
					console.log("Error received " + err);
				});
				
				response.on('data', function(chunk){					
					userData += chunk;
				});
				
				response.on('end', function(){					
					userData = JSON.parse(userData);//parse out the JSON object
					assert.equal(response.statusCode, 200);
					assert.notEqual(userData, undefined);
					assert.ok((userData instanceof Array));
					assert.equal(userData.length, 4);
					done();
				});		
			};
			
			setupNoData(path, callback);
		});
	});
});