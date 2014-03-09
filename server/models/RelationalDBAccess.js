var Validator = require("../controllers/ValidateObjectController.js");
var Sequelize = require('sequelize');
var dbConnection;

function RelationalDBAccess(database)
{
	if (database === undefined)
	{
		new InitializeDB();
	}
	else
	{
		new InitializeOtherDB(database.username, database.password, database.hostname);
	}
}

//Connects to the default (main) database
var InitializeDB = function(){
	dbConnection = new Sequelize('test', 'ubuntu', '', {
		host: '54.186.20.243',
		port: 3306
	});	
};

//Connects to a different database
var InitializeOtherDB = function(username, password, hostname){	
	dbConnection = new Sequelize('test', username, password || '', {
		host: hostname,
		port: 3306
	});
};

RelationalDBAccess.prototype.getListOfGames = function(callback)
{
	dbConnection.query('SELECT * FROM Games').success(function(tableRows){
		callback(tableRows);
	}).error(function(error){
		console.log('error is ' + error);
	});
};

/*
RelationalDBAccess.prototype.deleteAllGames = function()
{
	dbConnection.query('DELETE FROM Games').success(function(){
		console.log('All games deleted');
	}).error(function(error){
		console.log('error is ' + error);
	});
};*/

/*
RelationalDBAccess.prototype.populateTestGames = function(callback)
{
	dbConnection.query('INSERT INTO Games (gameName, maxPlayers) VALUES ("Connect4", 2), ("Tic Tac Toe", 2)').error(function(error){
		console.log('error is ' + error);
	});
};*/

RelationalDBAccess.prototype.getUserInfo = function(userID, callback)
{
	Validator.ValidateNumber(userID);
	var result = {};
	if(userID < 0)
	{
		throw new Error('Invalid user id passed');
	}
	else
	{
		dbConnection.query(
			"SELECT userID, userName, isOnline, avatarURL FROM Users WHERE userID =?", null, {raw: true}, [userID]
			).success(function(newUser){
			console.log('The data gotten back is: ' + newUser);
			validateObjectLength(newUser, 1);
			
			callback(newUser); //Only one entry should be returned so test for this
		}).error(function(error){
			console.log('error is ' + error);
		});
	}
};

RelationalDBAccess.prototype.getNewUserInfo = function(callback)
{
	dbConnection.query(
		"INSERT INTO Users (userName, isOnline, avatarURL) values ('', 1, '')").error(function(error){
		console.log('error is ' + error);
	});
	
	dbConnection.query(
		"SELECT * FROM Users ORDER BY userID DESC LIMIT 1"
		).success(function(newUser){
		console.log(newUser);
		validateObjectLength(newUser, 1);
		callback(newUser); //Only one entry should be returned so test for this
	}).error(function(error){
		console.log('error is ' + error);
	});
};

var validateObjectLength = function(obj, length)
{
	if(obj !== undefined && obj.length > length)
	{
		throw new Error('Invalid object length');
	}
};

module.exports = RelationalDBAccess;