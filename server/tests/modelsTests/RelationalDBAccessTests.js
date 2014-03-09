var assert = require("assert");
var RelationalDBAccess = require("../../models/RelationalDBAccess.js");
var relationalDB = new RelationalDBAccess({username:'ubuntu', password:'', hostname:'54.186.20.243'});

describe("RelationalDBAccess", function() {
	describe("#getListOfGames", function(){		
		it('should get list of games from the database properly', function(){
			//This assumes we have 2 games in the database
			//maybe refactor this later
			relationalDB.getListOfGames(function(games){
				assert.equal(games.length, 2);
				assert.equal(games[0].gameName, 'Connect4');
				assert.equal(games[1].gameName, 'Tic Tac Toe');
				
				assert.equal(games[0].maxPlayers, 2);
				assert.equal(games[1].maxPlayers, 2);
			});			
		});
	});
	
	describe('#createNewUser', function() {
		it('should create a new user properly', function(){
			relationalDB.getNewUserInfo(function(newUser){
				assert.notEqual(newUser, undefined);
				
				assert.equal(newUser.userName, '');
				assert.equal(newUser.isOnline, 1);
				assert.equal(newUser.avatarURL, '');
			});
		});
	});
	
	describe('#get user information properly', function() {
		it('handle an invalid user id', function(){
			//make sure it throws an error when an invalid userID is passed
			assert.throws(function() { relationalDB.getUserInfo(-1, function(){}); }, Error);
		});
		
		it('handle an invalid user id', function(){
			//make sure it throws an error when a non-existent userID is passed
			relationalDB.getUserInfo(1000000, function(userInfo){
				assert.equal(userInfo, undefined);			
			});
		});
		
		it("handle a valid user id", function(){
			//try getting the info for the user we just created
			relationalDB.getUserInfo(5, function(userInfo){
				assert.notEqual(userInfo, undefined);
				
				assert.equal(userInfo.userID, 5);
				assert.equal(userInfo.userName, '');
				assert.equal(userInfo.isOnline, 1);
				assert.equal(userInfo.avatarURL, '');
			});
		});
	});
});