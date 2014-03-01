var assert = require("assert");
var serverJS = require("../server.js");
var http = require("http");


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
		it('Test: Valid Initialize Data', function() {
			var path = "/initialize";
			var text = "userID=5";
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
					
					assert.equal(response.statusCode, 200);
					
					assert.notEqual(userData, undefined);
					assert.equal(userData.userID, 1);
				});		
			};
			
			setup(path, text, callback);
		});
		
		//Test invalid data sent to the Server's /initialize method
		it('Test: Invalid Initialize Data', function() {
			var path = "/initialize";
			var text = "userID=bob";
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
					assert.equal(userData.userID, undefined);
					//assert.equal(userData.userID, un);
				});		
			};
			
			setup(path, text, callback);
		});
		
		//All we have to do is make sure we have at least one game first
		//after that, we can check to make sure the games match what we expect
		it('Test: ListOfGames request test', function() {
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
					console.log("Data received: gameID1= " + userData.gameID1);
					
					assert.equal(response.statusCode, 200);
					assert.notEqual(userData, undefined);
					
					assert.notEqual(userData.gameID1, undefined);
					assert.notEqual(userData.gameID2, undefined);
					
					assert.equal(userData.gameID1, "game name 1");
					assert.equal(userData.gameID2, "game name 2");
				});		
			};
			
			setupNoData(path, callback);
		});
		
		//Test the Server behaviour when a user tries to Create a New Game
		it('Test: CreateNewGame Invalid Data', function() {
			//console.log("I get here test 3");
		});
	});
});