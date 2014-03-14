var restify = require('restify');
var ecstatic = require('ecstatic');
var dbController = require('./controllers/DataStoreController.js');
dbController.setup({username:'ubuntu', password:'', hostname:'54.186.20.243'});
var gameMGMT = require('./models/GameManagement.js');
var gameSocketController = require('./controllers/GameSocketController.js');
var queueForGameRequests = 0;
var queueForGamesList = {};

var server = restify.createServer();
server.pre(ecstatic({ root: __dirname + '/public'}));

var gameSocket = new gameSocketController.GameSocketController(10089);

server.use(restify.queryParser());

server.get("/queueForGame", function(request, response, next){
	//We need to Setup a new game in the database between two players
	//Create a flat file for the board data
	//Then send back the board object
	//Ideally we want to this request sent to the MatchMakingController
	//and that takes care of matching players who want to play the same
	//game together
	//For now, just assume every request is for the same game
	var params = request.params;
	//matchMaking.joinMatchmaking(params.clientID, params.gameID);
	
	queueForGameRequests++;
	//parameters gotten back are gameID & clientID
	if(queueForGameRequests == 1)
	{
		queueForGamesList["Player1"] = 
		{ 
			"clientID": params.clientID,
			"gameID": params.gameID
		};
	}
	
	
	if(queueForGameRequests == 2)//1 should be replaced with max_players for the game specified
	{			
		queueForGamesList["Player2"] =
		{
			"clientID": params.clientID,
			"gameID": params.gameID
		};
		//console.log();
		var queueInfo = JSON.stringify(queueForGamesList);
		console.log(queueInfo);
		
		//we have enough players for a game
		//send both players to the gameMGMT to start a new game
		gameMGMT.setupMatch(params.gameID, undefined, function(gameInstanceID){
			//use this to call joinMatch for both players
			console.log("Users matched up successfully");
			//console.log(queueInfo["Player1"]);
			/*
			No need for this since the setup match requires 2 players to be passed in
			and already adds the 2 players to the game
			gameMGMT.joinMatch(1, gameInstanceID, function(error){
				console.log("Join Match 1 called");
				if(error !== undefined)
				{
					console.log("Game full");
					throw new Error('could not join match ' + error);
				}
				else
				{
					gameMGMT.joinMatch(2, gameInstanceID, function(error2){
						console.log("Join Match 2 called");
						if(error2)
						{
							throw new Error('could not join match ' + error2);
						}
					});
				}
			});*/
			//queueForGameRequests = 0;
			//queueForGamesList = {};
			
		});
	}
	
	console.log("queueForGameRequests is: " + queueForGameRequests);
	
	if(queueForGameRequests <= 2)
	{		
		response.writeHead(200, {"content-type": "application/json"});
		response.end(JSON.stringify("User queue request received. Please wait"));
	}
	else
	{
		response.writeHead(500, {"content-type": "application/json"});
		response.end(JSON.stringify("Game room Full. Please wait until Server restarts"));
	}
	
	//response.end(JSON.stringify({}));
	next();
>>>>>>> master
});

server.get("/createNewGame", function(request, response, next){
	//We need to Setup a new game in the database between two players
	//Create a flat file for the board data
	//Then send back the board object
	console.log("New game request received from Client");
	gameMGMT.setupMatch(request.params.gameID, undefined, function(id) {
		gameMGMT.joinMatch(request.params.userID, id, function() {
			response.writeHead(200, {"content-type": "application/json"});
			response.end(JSON.stringify({gameID:request.params.gameID,
					userID:request.params.userID, instanceID:id}));
			next();
		});
	});
});

server.get("/initialize", function(request, response, next) {
	console.log("Received initialize request from Client " + request.params.userid); 
	//Setup a Client Id if the id passed was not found in the database
	var text = {};
	//call DataStoreController and get a the user's information
	dbController.getUserInformation(request.params.userid, function(newUserInfo){
		var userInfo = newUserInfo;
		//Get a list of games on the server
		/*gameMGMT.availableGames(function(gameList){
			var games = gameList;
			//get a list of active games for the user
			
			//get a list of active games for the user
			gameMGMT.findByUser(userInfo.userID, function(activeGames){					
				//for now, send back the user and game list
				text = {'user': userInfo, 'availableGames': games, 'active': activeGames};		
				response.writeHead( 200, {'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
				response.write(JSON.stringify(text));
				response.end();
				next();
			});
			
		});*/
		text = {'user': userInfo, 'availableGames': {}, 'active': {}};		
			response.writeHead( 200, {'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
			response.write(JSON.stringify(text));
			response.end();
			next();
	});
});

server.get("/listOfGames", function(request, response, next)
{
	//Validate the dbController Object
	gameMGMT.availableGames(function(games){
		response.writeHead(200, {"content-type": "application/json", 'Access-Control-Allow-Origin' : '*'});
		response.write(JSON.stringify(games));
		response.end();
	});
	return next();
});

server.listen(process.env.PORT || 80, process.env.IP);
console.log("Server started & listening on port 80");
