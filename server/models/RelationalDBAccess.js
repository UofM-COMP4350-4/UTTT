var Validator = require("../controllers/ValidateObjectController.js");
var Sequelize = require('sequelize');
var dbConnection;

function RelationalDBAccess(database) {
	if (database === undefined)	{
		new InitializeDB();
	} else {
		new InitializeOtherDB(database.username, database.password, database.hostname);
	}
}

//Connects to the default (main) database
var InitializeDB = function() {
	dbConnection = new Sequelize('test', 'ubuntu', '', {
		host: '54.186.20.243',
		port: 3306
	});	
};

//Connects to a different database
var InitializeOtherDB = function(username, password, hostname) {	
	dbConnection = new Sequelize('test', username, password || '', {
		host: hostname,
		port: 3306
	});
};

RelationalDBAccess.prototype.getListOfGames = function(callback) {
	dbConnection
		.query("SELECT * FROM Games", null, {raw: true})
		.success(function(tableRows){
			callback(tableRows);
		})
		.error(function(error){
			console.log('error is ' + error);
			callback();
		});
};

RelationalDBAccess.prototype.getUserInfo = function(userID, callback) {
	var result = {};
	if(!userID) {
		dbConnection
			.query("INSERT INTO Users (userName, isOnline, avatarURL) values (NULL, 1, '/assets/avatar_placeholder.jpg')", null, {raw: true})
			.success(function(){
				dbConnection
					.query("SELECT * FROM Users ORDER BY userID DESC LIMIT 1")
					.success(function(userInfo){
						console.log(userInfo);
						validateObjectLength(userInfo, 1);
						callback(userInfo); //Only one entry should be returned so test for this
					})
					.error(function(error){
						console.log('error is ' + error);
						callback();
					});
			})
			.error(function(error){
				console.log('error is ' + error);
				callback();
			});
	} else {
		dbConnection
			.query("SELECT userID, userName, isOnline, avatarURL FROM Users WHERE userID = " + userID, null, {raw: true})
			.success(function(userInfo){
				console.log('The data gotten back is: ' + userInfo);
				validateObjectLength(userInfo, 1);
				callback(userInfo[0]); //Only one entry should be returned so test for this
			})
			.error(function(error){
				console.log('error is ' + error);
				callback();
			});
	}
};

RelationalDBAccess.prototype.addToMatch = function(instanceID, userID, gameID, callback) {
	dbConnection
		.query("INSERT INTO Matches (instanceID, userID, gameID) values (" + instanceID + ", " + userID + ", " + gameID + ")", null, {raw: true})
		.success(function(){
			callback();
		})
		.error(function(error){
			console.log('error is ' + error);
			callback(error);
		});
};

RelationalDBAccess.prototype.removeFromMatch = function(instanceID, userID, callback) {
	dbConnection
		.query("DELETE FROM Matches WHERE instanceID = " + instanceID + " and userID = " + userID, null, {raw: true})
		.success(function(){
			callback();
		})
		.error(function(error){
			console.log('error is ' + error);
			callback(error);
		});
};

RelationalDBAccess.prototype.endMatch = function(instanceID, callback) {
	dbConnection
		.query("DELETE FROM Matches WHERE instanceID = " + instanceID, null, {raw: true})
		.success(function(){
			callback();
		})
		.error(function(error){
			console.log('error is ' + error);
			callback(error);
		});
};

RelationalDBAccess.prototype.matchesByUser = function(userID, callback) {
	dbConnection
		.query("SELECT * FROM Matches WHERE userID = " + userID, null, {raw: true})
		.success(function(tableRows){
			callback(tableRows);
		})
		.error(function(error){
			console.log('error is ' + error);
			callback();
		});
};

var validateObjectLength = function(obj, length) {
	if(obj !== undefined && obj.length > length) {
		throw new Error('Invalid object length');
	}
};

module.exports = RelationalDBAccess;