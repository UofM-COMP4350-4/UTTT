var assert = require("assert");
var serverJS = require("../server.js");
var http = require("http");


/*  Server Tests
 *  Use: Test class to be used with Mocha.  Tests the Server.js functions.
 */

function setup(path, text, callback){
	var options = {
		host: "localhost",
		path: path + "?" + text
		//data: text
	};
	
	var req = http.request(options, callback);
	req.end();
};
			
describe('Server Test Suite', function(){
	describe('Server Test Class', function() {
		it('Test: Valid Initialize Data', function() {
			var path = "/initialize";
			var text = "userID=5";
			var userData = "";
						
			callback = function(response)
			{
				response.on('error', function(err){
					console.log("Error received" + err);
				});
				
				response.on('data', function(chunk){					
					userData += chunk;
				});
				
				response.on('end', function(){
					userData = JSON.parse(userData);//parse out the JSON object
					console.log("Data received " + userData.userID);
					assert.notEqual(userData, undefined);
					assert.equal(userData.userID, 1);
				});		
			};
			
			setup(path, text, callback);
		});
		
		it('Test: CreateNewGame Invalid data', function() {
			//console.log("I get here test 2");
		});
		
		it('Test: Inivialize Invalid Data', function() {
			//console.log("I get here test 3");
		});
	});
});