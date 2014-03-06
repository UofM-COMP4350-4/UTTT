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
	});
};

RelationalDBAccess.prototype.getNewClientID = function(callback)
{
	dbConnection.query(
		"INSERT INTO Users (userName, isOnline, avatarURL) values ('', 1, '')");
	
	dbConnection.query(
		"SELECT userID FROM Users ORDER BY userID desc LIMIT 1"
		).success(function(newID){
		callback(newID[0].userID);
	});
};

module.exports = RelationalDBAccess;