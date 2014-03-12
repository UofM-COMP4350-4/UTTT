var restify = require('restify');
var ecstatic = require('ecstatic');
var dataStoreController = require('./controllers/DataStoreController.js');
var dbController = new dataStoreController({username:'ubuntu', password:'', hostname:'54.186.20.243'});
var gameMGMT = require('./models/GameManagement.js');
var gameSocketController = require('./controllers/GameSocketController.js');

var server = restify.createServer();
server.pre(ecstatic({ root: __dirname + '/public'}));

server.listen(process.env.PORT || 80, process.env.IP);
console.log("Server started & listening on port 80");

var gameSocket = new gameSocketController.GameSocketController(10089);

server.use(restify.queryParser());

server.get("/queueForGame", function(request, response, next){
	//We need to Setup a new game in the database between two players
	//Create a flat file for the board data
	//Then send back the board object
	console.log("Queue request received from Client " + request.params.fun);
	response.writeHead(200, {"content-type": "application/json"});
	response.end(JSON.stringify({}));
	return next();
});

server.get("/createNewGame", function(request, response, next){
	//We need to Setup a new game in the database between two players
	//Create a flat file for the board data
	//Then send back the board object
	console.log("New game request received from Client " + request.params.fun);
	response.writeHead(200, {"content-type": "application/json"});
	response.end("Game created Successfully");
	return next();
});

server.get("/initialize", function(request, response, next) {
	console.log("Received initialize request from Client " + request.params.userid); 
	//Setup a Client Id if the id passed was not found in the database
	//We have to verify that the user id passed is valid (i.e. > 0 or undefined)
	//**Account for the fact that a user id might be a string** - Right now only numbers are allowed
	//Validate the dbController Object
	var text = {};
	var id = request.params.userid;
	if (id === undefined || id === 'undefined' || id > 0) {
		//valid values: either the user doesn't have an id or the user does
		if (id !== undefined && id !== 'undefined')
		{
			console.log('Server gets here 1: ' + id);
			//call DataStoreController and get a the user's information
			dbController.getUserInformation( parseInt(id, 10), function(newUserInfo){
				var userInfo = newUserInfo[0];
				console.log('Server gets here 2: ' + userInfo.userID);
				
				//Get a list of games on the server
				dbController.getListOfGames(function(gameList){
					var games = gameList;
					console.log("List of games returns " + games);
					/*
					//get a list of active games for the user
					//use Jason's method
					gameMGMT.findByUser(userInfo.userID, function(activeGames){					
						//for now, send back the user and game list
						console.log("Game MGMT returns " + activeGames);
						debugger
						text = {'user': userInfo, 'availableGames': games, 'active': activeGames};
										
						response.writeHead( 200, {'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
						response.write(JSON.stringify(text));
						response.end();
						return next();
					});*/
					text = {'user': userInfo, 'availableGames': games, 'active': {}};
										
					response.writeHead( 200, {'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
					response.write(JSON.stringify(text));
					response.end();
					return next();
				});
			});
		}
		else
		{
			console.log('Server gets here 3: ' + id);
			//call DatabaseController and get a new userID for the user
			dbController.getNewUserInfo( function(newUserInfo){
				var userInfo = newUserInfo[0];
				console.log('Server gets here 4: ' + userInfo.userID);
				
				//Get a list of games on the server
				dbController.getListOfGames(function(gameList){
					var games = gameList;
					console.log("List of games returns " + games);
					/*
					//get a list of active games for the user
					//use Jason's method
					gameMGMT.findByUser(userInfo.userID, function(activeGames){					
						//for now, send back the user and game list
						console.log("Game MGMT returns " + activeGames);
						debugger
						text = {'user': userInfo, 'availableGames': games, 'active': activeGames};
										
						response.writeHead( 200, {'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
						response.write(JSON.stringify(text));
						response.end();
						return next();
					});*/
					text = {'user': userInfo, 'availableGames': games, 'active': {}};
										
					response.writeHead( 200, {'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
					response.write(JSON.stringify(text));
					response.end();
					return next();
				});
			});
		}
	}
	else
	{
		//response not found (404) but I guess any error code would work
		response.writeHead( 404, {'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
		response.write(JSON.stringify(text));
		response.end();
		return next();
	}
	//return next();
});

server.get("/listOfGames", function(request, response, next)
{
	console.log("List of games request received from the Client");
	
	//Validate the dbController Object
	dbController.getListOfGames(function(games){
		response.writeHead(200, {"content-type": "application/json", 'Access-Control-Allow-Origin' : '*'});
		response.write(JSON.stringify(games));
		response.end();
	});
	return next();
});


