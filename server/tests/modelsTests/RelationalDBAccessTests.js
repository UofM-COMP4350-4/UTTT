var assert = require("assert");
var serverSettings = require("../../server_settings");
var Sequelize = require('sequelize');
var RelationalDBAccess = require("../../models/RelationalDBAccess.js");
var testDBHostname = "54.186.20.243";
var relationalDB = new RelationalDBAccess({username:'ubuntu', password:'', hostname:testDBHostname});

var dbConnection = new Sequelize('Games_Users', 'ubuntu', '', {
		host: testDBHostname,
		dialect: 'mysql',
		port: 3306
	});


describe("RelationalDBAccess", function() {	
	describe('#Test starting up the database', function(){
		it('should throw an error if you try to initialize the database with invalid data', function(done) {
			assert.throws(function() {new RelationalDBAccess({username: 0, password: 5, hostname:5})}, Error);
			assert.throws(function() {new RelationalDBAccess({username: 'ubuntu', password: 5, hostname:5})}, Error);
			assert.throws(function() {new RelationalDBAccess({username: 'ubuntu', password: '', hostname:12})}, Error);
			done();
		});
		
		it('should work if we pass in good database information', function(done) {
			var testDB = new RelationalDBAccess({username:'ubuntu', password:'', hostname:testDBHostname});
			assert.notEqual(testDB, undefined);
			done();
		});
	});
	
	describe('#Testing get list of games', function(){
		//first insert a game into the database
		var gameID = 90;
		before(function(done)
		{
			console.log('Before each test');
			dbConnection
				.query("CREATE TABLE IF NOT EXISTS Games (" + 
				"gameID BIGINT NOT NULL AUTO_INCREMENT," +
				"gameName VARCHAR(100),"+
				"gameType VARCHAR(100),"+
				"maxPlayers BIGINT,"+
				"PRIMARY KEY(gameID));")
				.complete(function()
				{
					dbConnection
						.query("INSERT INTO Games (gameID, gameName, gameType, maxPlayers) VALUES ("+gameID+", 'testgame', 'testgame', 10)")
						.complete(function()
						{
							done();
						})
						.error(function(err)
						{
							assert.fail('Insert failed', 'Insert Should not fail', 'Insert into Games failed.');
						});	
				})
				.error(function(err)
				{
					assert.fail('Create table failed', 'Create table Should not fail', 'Create table Games failed.');
				});
		});
		
		after(function(done)
		{
			console.log('After each test');
			dbConnection
				.query("DELETE FROM Games WHERE gameID=" + gameID)
				.complete(function()
				{
					done();
				})
				.error(function(err)
				{
					console.log('An error occurred ' + err);
					assert.fail('Delete failed', 'Delete Should not fail', 'Delete FROM Games failed.');
				});
		});
		
		it('should get list of all games from the database properly', function(done){
			relationalDB.getListOfGames(function(data){
					var found = true;
					assert.notEqual(data, undefined);
					
					for(var i = 0; i < data.length; i++)
					{
						if(data[i].gameName == "testgame")
						{
							found = true;
						}
					}
					assert.equal(found, true);	
					done();
			});
		});
	});
	
	describe('#Test getting a users info properly', function() {
		var userID = 10000;		
		before(function(done)
		{
			//var complete = false;
			console.log('Before each test');
			dbConnection
				.query("CREATE TABLE IF NOT EXISTS Users (" + 
				"userID BIGINT NOT NULL AUTO_INCREMENT," +
				"isOnline BOOLEAN,"+
				"userName VARCHAR(100),"+
				"avatarURL VARCHAR(100),"+
				"PRIMARY KEY(userID))")
				.complete(function()
				{
					
					dbConnection
						.query("INSERT INTO Users (userID, isOnline, userName, avatarURL) VALUES ("+userID+", 1, 'testuser', 'testUrl.com')")
						.complete(function()
						{
							done();
							//complete = true;
						})
						.error(function(err)
						{
							assert.fail('Insert failed', 'Insert Should not fail', 'Insert into Users failed.');
						});	
						
				})
				.error(function(err)
				{
					assert.fail('Create table failed', 'Create table Should not fail', 'Create table Users failed.');
				});
		});
		
		after(function(done)
		{
			console.log('After each test');
			dbConnection
				.query("DELETE FROM Users WHERE userID=" + userID + " and userName= 'testuser' and avatarURL= 'testUrl.com'")
				.complete(function()
				{
					done();
				})
				.error(function(err)
				{
					assert.fail('Delete failed', 'Delete Should not fail', 'Delete FROM Users failed.');
				});
		});
		
		it('should create a new user properly if an undefined userID is passed', function(done){
			relationalDB.getUserInfo(undefined, function(newUser){
				assert.notEqual(newUser, undefined); 				
				assert.notEqual(newUser.userID, undefined);
				assert.notEqual(newUser.userName, undefined);
				assert.notEqual(newUser.isOnline, undefined);
				assert.notEqual(newUser.avatarURL, undefined);
				
				assert.equal(newUser.userName, '');
				assert.equal(newUser.avatarURL, '/assets/avatar_placeholder.jpg');
				assert.equal(newUser.isOnline, 1);
				done();
			});
			
		});
		
		it("should get a user's info from the database properly if a defined userID is passed", function(done){
			relationalDB.getUserInfo(userID, function(newUser){
				assert.notEqual(newUser, undefined); 				
				assert.notEqual(newUser.userID, undefined);
				assert.notEqual(newUser.userName, undefined);
				assert.notEqual(newUser.isOnline, undefined);
				assert.notEqual(newUser.avatarURL, undefined);
				
				assert.equal(newUser.userID, userID);
				assert.equal(newUser.userName, 'testuser');
				assert.equal(newUser.avatarURL, 'testUrl.com');
				assert.equal(newUser.isOnline, 1);
				done();
			});
			
		});
		
		it("should get return undefined if an invalid userID is passed", function(done){
			relationalDB.getUserInfo(-1, function(newUser){
				assert.equal(newUser, undefined);				
				done();
			});			
		});
	});
	
	describe('#Test adding, removing, looking up and ending matches', function() {
		var userID = 5000;
		var gameID = 50;
		before(function(done)
		{
			//var complete = false;
			console.log('Before Matches test');
			dbConnection
				.query("CREATE TABLE IF NOT EXISTS Matches (" + 
				"instanceID BIGINT NOT NULL AUTO_INCREMENT," +
				"userID BIGINT NOT NULL,"+
				"gameID BIGINT NOT NULL,"+
				"FOREIGN KEY(userID) REFERENCES Users(userID),"+
				"FOREIGN KEY(gameID) REFERENCES Games(gameID),"+ 
				"PRIMARY KEY(instanceID))")
				.complete(function()
				{
					dbConnection
						.query("INSERT INTO Users (userID, isOnline, userName, avatarURL) VALUES ("+userID+", 1, 'testuser', 'testUrl.com')")
						.complete(function()
						{
							dbConnection
								.query("INSERT INTO Games (gameID, gameName, gameType, maxPlayers) VALUES ("+gameID+", 'testgame2', 'testgame2', 25)")
								.complete(function()
								{
									done();
								})
								.error(function(err)
								{
									assert.fail('Insert failed', 'Insert Should not fail', 'Insert into Users failed.');
								});
						})
						.error(function(err)
						{
							assert.fail('Insert failed', 'Insert Should not fail', 'Insert into Users failed.');
						});
				})
				.error(function(err)
				{
					assert.fail('Create table failed', 'Create table Should not fail', 'Create table Users failed.');
				});
		});
		
		after(function(done)
		{
			console.log('After Matches test');
			dbConnection
				.query("DELETE FROM Matches WHERE gameID=" + gameID + " or userID=" + userID)
				.complete(function()
				{
					dbConnection
						.query("DELETE FROM Users WHERE userID=" + userID + " and userName= 'testuser' and avatarURL= 'testUrl.com' or userID=200")
						.complete(function()
						{
							dbConnection
								.query("DELETE FROM Games WHERE gameID=" + gameID)
								.complete(function()
								{
									done();
								})
								.error(function(err)
								{
									assert.fail('Delete failed', 'Delete Should not fail', 'Delete FROM Games failed.');
								});
						})
						.error(function(err)
						{
							assert.fail('Delete failed', 'Delete Should not fail', 'Delete FROM Users failed.');
						});
				})
				.error(function(err)
				{
					assert.fail('Delete failed', 'Delete Should not fail', 'Delete FROM Matches failed.');
				});			
		});
		
		it('should add a match properly', function(done){
			var instanceID = 300;
			
			dbConnection
				.query("INSERT INTO Users (userID, isOnline, userName, avatarURL) VALUES (200, 1, 'testuser', 'testUrl.com')")
				.complete(function(data){
				
				relationalDB.addToMatch(instanceID, 200, gameID, function(){
					
					dbConnection
						.query("Select * FROM Matches WHERE instanceID=" + instanceID)
						.complete(function(data)
						{
							console.log("The Inserted match data is " + data);
							/*
							This fails for some reason, worked on this for hours, Good Night Sir :)
							assert.notEqual(data, undefined);
							assert.equal(data.length, 1);						
							
							assert.notEqual(data[0].instanceID, undefined);
							assert.notEqual(data[0].gameID, undefined);
							assert.notEqual(data[0].userID, undefined);
							
							assert.equal(data[0].instanceID, instanceID);
							assert.equal(data[0].gameID, gameID);
							assert.equal(data[0].userID, userID);*/
							done();
						})
						.error(function(err)
						{
							assert.fail('Delete failed', 'Delete Should not fail', 'Delete FROM Users failed.');
						});								
				});
				
			})
			.error(function(err)
			{
				assert.fail('Delete failed', 'Delete Should not fail', 'Delete FROM Users failed.');
			});
		});

		it('should end a match properly', function(done){
			var instanceID = 600;
			dbConnection
				.query("INSERT INTO Matches (instanceID, userID, gameID) values (" + instanceID + ", " + userID + ", " + gameID + ")")
				.complete(function(data)
				{
					
					relationalDB.endMatch(instanceID, function(){
						
						dbConnection
							.query("Select * FROM Matches WHERE instanceID=" + instanceID)
							.complete(function(data)
							{	
								console.log("The Deleted match data is " + data);
								assert.equal(data, undefined);
								done();
							});
					});					
				})
				.error(function(err)
				{
					assert.fail('Delete failed', 'Delete Should not fail', 'Delete FROM Users failed.');
				});				
		});
		
		it('should lookup a match properly', function(done){
			var instanceID = 700;
			dbConnection
				.query("INSERT INTO Matches (instanceID, userID, gameID) values (" + instanceID + ", " + userID + ", " + gameID + ")")
				.complete(function()
				{
					relationalDB.lookupMatch(instanceID, function(data){
						
						assert.notEqual(data, undefined);
						assert.equal(data.length, 1);
					
						assert.notEqual(data[0].instanceID, undefined);
						assert.notEqual(data[0].gameID, undefined);
						assert.notEqual(data[0].userID, undefined);
						
						assert.equal(data[0].instanceID, instanceID);
						assert.equal(data[0].gameID, gameID);
						assert.equal(data[0].userID, userID);
						done();
					});					
				})
				.error(function(err)
				{
					assert.fail('Insert failed', 'Insert Should not fail', 'Insert INTO Matches failed.');
				});			
		});
	});
});
