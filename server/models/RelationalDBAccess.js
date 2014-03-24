var Validator = require("../controllers/ValidateObjectController.js");
var Sequelize = require('sequelize');
var dbConnection;

var my_host='ec2-54-186-85-227.us-west-2.compute.amazonaws.com';

function RelationalDBAccess(database) {
	console.log("connecting to db");
	if (database === undefined)	{
		InitializeDB();
	} else { 
		Validator.ValidateString(database.username);
		Validator.ValidateString(database.password);
		Validator.ValidateString(database.hostname);
		InitializeOtherDB(database.username, database.password, database.hostname);
	}
	console.log('Relational db contains: ' + dbConnection);
}

//Connects to the default (main) database
var InitializeDB = function() {
	dbConnection = new Sequelize('Games_Users', 'ubuntu', '', {
		host: my_host,
		dialect: 'mysql',
		port: 3306
	});
	dbConnection
		.authenticate()
		.complete(function(err) {
			if (!!err) {
				console.log("unable to connect, error: " + err);
			} else {
				console.log("connection established");
			}
		});	
};

//Connects to a different database
var InitializeOtherDB = function(username, password, hostname) {
	console.log("initializing other");	
	dbConnection = new Sequelize('Games_Users', 'ubuntu', '', {
		host: hostname,
		dialect: 'mysql',
		port: 3306
	});
	dbConnection
		.authenticate()
		.complete(function(err) {
			if (!!err) {
				console.log("error establishing connection to database, error: ", err);
			} else {
				console.log("connection established");
			}
		});
	console.log("finished initializing");
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
			throw new Error('Relational Database Error is ' + error);
		});
};

RelationalDBAccess.prototype.getUserInfo = function(userID, callback) {
	var result = {};
	if(!userID) {
		dbConnection
			.query("INSERT INTO Users (userName, isOnline, avatarURL) values ('', 1, '/assets/avatar_placeholder.jpg')")
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
						throw new Error('Relational Database Error is ' + error);
					});
			})
			.error(function(error){
				console.log('error is ' + error);
				callback();
				throw new Error('Relational Database Error is ' + error);
			});
	} else {
		dbConnection
			.query("SELECT userID, userName, isOnline, avatarURL FROM Users WHERE userID = " + userID)
			.success(function(userInfo){
				console.log('The data gotten back is: ' + userInfo);
				validateObjectLength(userInfo, 1);
				callback(userInfo); //Only one entry should be returned so test for this
			})
			.error(function(error){
				console.log('error is ' + error);
				callback();
				throw new Error('Relational Database Error is ' + error);
			});
	}
};

RelationalDBAccess.prototype.addToMatch = function(instanceID, userID, gameID, callback) {
	var insertToDB = function() {
		dbConnection
			.query("INSERT INTO Matches (instanceID, userID, gameID) values (" + instanceID + ", " + userID + ", " + gameID + ")", null, {raw: true})
			.success(function(){
				callback();
			})
			.error(function(error){
				console.log('error is ' + error);
				callback(error);
				throw new Error('Relational Database Error is ' + error);
			});
	};
	dbConnection
		.query("SELECT * FROM Matches WHERE instanceID = " + instanceID + " and userID = " + userID, null, {raw: true})
		.success(function(entries){
			if(!entries || entries.length===0) {
				insertToDB();
			} else {
				callback();
			}
		})
		.error(function(error){
			throw new Error('Relational Database Error is ' + error);
		});
	
};

RelationalDBAccess.prototype.lookupMatch = function(instanceID,callback) {
	dbConnection
		.query("SELECT * FROM Matches WHERE instanceID = " + instanceID, null, {raw: true})
		.success(function(matchEntries){
			callback(matchEntries);
		})
		.error(function(error){
			console.log('error is ' + error);
			callback();
			throw new Error('Relational Database Error is ' + error);
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
			throw new Error('Relational Database Error is ' + error);
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
			throw new Error('Relational Database Error is ' + error);
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
			throw new Error('Relational Database Error is ' + error);
		});
};

var validateObjectLength = function(obj, length) {
	if(obj !== undefined && obj.length === 0 && obj.length > length) {
		throw new Error('Invalid object length');
	}
};

module.exports = RelationalDBAccess;
