var assert = require("assert");
var Sequelize = require('sequelize');
var RelationalDBAccess = require("../../models/RelationalDBAccess.js");
var relationalDB = new RelationalDBAccess({username:'ubuntu', password:'', hostname:'54.186.37.75'});

describe("RelationalDBAccess", function() {
	describe('#initialize database', function(){
		it('should throw an error if supplied invalid data', function() {
			assert.throws(function() {new RelationalDBAccess({username: 0, password: 5, hostname:5})}, Error);
		});
	});
	
	describe("#getListOfGames", function(){		
		var dbConnection = new Sequelize('Games_Users', 'ubuntu', '', {
			host: '54.186.20.243',
			port: 3306
		});
		
		it('should get list of games from the database properly', function(){
		dbConnection
			.query("INSERT INTO Games (gameName, gameType, maxPlayers) VALUES ('TestGame', 'TestGame', 5)")
			.success(relationalDB.getListOfGames(function(listOfGames) {
				assert.notEqual(listOfGames, null);
				assert.notEqual(listOfGames, undefined);
				var found = false;
				for(var i = 0; i < listOfGames.length; i++) {
					if (listOfGames[i].gameName === "TestGame") {
						found = true;
					}
				}
				assert.ok(found);
				
				dbConnection
					.query("DELETE FROM Games WHERE gameName = 'TestGame'")
					.success(relationalDB.getListOfGames(function(listOfGames) {
						assert.notEqual(listOfGames, null);
						assert.notEqual(listOfGames, undefined);
	
						for(var i = 0; i < listOfGames.length; i++) {
							if (listOfGames[i].gameName === "TestGame") {
								assert.fail('Found TestGame', 'TestGame shoudl have been deleted.', 'Deletion failed');
							}
						}
					}))
					.error(function(err){
					assert.fail('Deletion Failed', 'Deletion should not fail', 'Deletion of game into Games table failed.');
				});
			}))
			.error(function(err){
				assert.fail('Insertion Failed', 'Insertion should not fail', 'Insertion of game into Games table failed.');
			});
		});
	});
// 	
	// describe('#createNewUser', function() {
		// it('should create a new user properly', function(){
			// relationalDB.getNewUserInfo(function(newUser){
				// assert.notEqual(newUser, undefined);
// 				
				// assert.equal(newUser.userName, '');
				// assert.equal(newUser.isOnline, 1);
				// assert.equal(newUser.avatarURL, '');
			// });
		// });
	// });
// 	
	// describe('#get user information properly', function() {
		// it('handle an invalid user id', function(){
			// //make sure it throws an error when an invalid userID is passed
			// assert.throws(function() { relationalDB.getUserInfo(-1, function(){}); }, Error);
		// });
// 		
		// it('handle an invalid user id', function(){
			// //make sure it throws an error when a non-existent userID is passed
			// relationalDB.getUserInfo(1000000, function(userInfo){
				// assert.equal(userInfo, undefined);			
			// });
		// });
// 		
		// it("handle a valid user id", function(){
			// //try getting the info for the user we just created
			// relationalDB.getUserInfo(5, function(userInfo){
				// assert.notEqual(userInfo, undefined);
// 				
				// assert.equal(userInfo.userID, 5);
				// assert.equal(userInfo.userName, '');
				// assert.equal(userInfo.isOnline, 1);
				// assert.equal(userInfo.avatarURL, '');
			// });
		// });
	// });
});