var assert = require("assert");
var Sequelize = require('sequelize');
var RelationalDBAccess = require("../../models/RelationalDBAccess.js");
var relationalDB = new RelationalDBAccess({username:'ubuntu', password:'', hostname:'ec2-54-186-85-227.us-west-2.compute.amazonaws.com'});

describe("RelationalDBAccess", function() {
	describe('#initialize database', function(){
		it('should throw an error if supplied invalid data', function() {
			assert.throws(function() {new RelationalDBAccess({username: 0, password: 5, hostname:5})}, Error);
		});
	});
	
	describe("Testing queries (I don't know why. I thought we were going to abstract this?)", function(){		
		var dbConnection = new Sequelize('Games_Users', 'ubuntu', '', {
			host:'ec2-54-186-85-227.us-west-2.compute.amazonaws.com',
			dialect: 'mysql',
			port: 3306
		});
		dbConnection
			.authenticate()
			.complete(function(err) {
				if (!!err) {
					console.log("unable to connect to DB:" +  err);
				}
				else {
					console.log("connection has been established :)");
				}
			});
		
		it('should get list of all games from the database properly', function(){
			dbConnection
				.query("SELECT * FROM Games;")
				.complete(function(data) {
					if (data)
					{
						console.log("data: ");
					}
					else {
						console.log("No data was found: ");
					}
				})
				.error(function(err){
					assert.fail('Selection Failed', 'Selection should not fail', 'Selecting * in Games failed.');
				});
		});
		it('should get a list of all users from the database properly', function(){
		});
		it('should get a list of all friends from the database properly', function(){
		});
		it('should get a list of all matches from the database properly', function(){
		});
	});
// 	
	describe('#createNewUser', function() {
		it('should create a new user properly', function(){
			relationalDB.getUserInfo(0, function(newUser){
				// assert.notEqual(newUser, undefined);
// 				
				// assert.equal(newUser.userName, '');
				// assert.equal(newUser.isOnline, 1);
				// assert.equal(newUser.avatarURL, '');
			});
		});
	});
// 	
	describe('#get user information properly', function() {
		it('handle an invalid user id', function(){
			// //make sure it throws an error when an invalid userID is passed
			// assert.throws(function() { relationalDB.getUserInfo(-1, function(){}); }, Error);
		});
// 		
		it('handle an invalid user id', function(){
			// //make sure it throws an error when a non-existent userID is passed
			// relationalDB.getUserInfo(1000000, function(userInfo){
				// assert.equal(userInfo, undefined);			
			// });
		});
// 		
		it("handle a valid user id", function(){
			// //try getting the info for the user we just created
			relationalDB.getUserInfo(5, function(userInfo){
				// assert.notEqual(userInfo, undefined);
// 				
				// assert.equal(userInfo.userID, 5);
				// assert.equal(userInfo.userName, '');
				// assert.equal(userInfo.isOnline, 1);
				// assert.equal(userInfo.avatarURL, '');
			});
		});
	});
});
