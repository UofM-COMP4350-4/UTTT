var restify = require('restify');
var ecstatic = require('ecstatic');
var dbController = require('./controllers/DataStoreController.js');
dbController.setup({username:'ubuntu', password:'', hostname:'54.186.20.243'});
var gameMGMT = require('./models/GameManagement.js');
var gameSocketController = require('./controllers/GameSocketController.js').createGameSocket(10089);
var queueForGameRequests = 0;
var queueForGamesList = {};

var server = restify.createServer();
server.pre(ecstatic({ root: __dirname + '/public'}));

server.use(restify.queryParser());

server.get("/queueForGame", function(request, response, next){
	//We need to Setup a new game in the database between two players
	//Create a flat file for the board data
	//Then send back the board object
	
	//Have to set up a mock queueForGame thing
	//****MOCK MATCHMAKING CONTROLLER*******
	var params = request.params;
	
	//***CALL VALIDATE ON THE clientID && gameID*******
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
		
		var queueInfo = JSON.stringify(queueForGamesList);
		console.log("Two users gotten successfully " + queueInfo);

		//we have enough players for a game SO 
				
		//send both players to the gameMGMT to start a new game
		gameMGMT.setupMatch(parseInt(params.gameID, 10), undefined, function(gameInstanceID){
			//use this to call joinMatch for both players
			//works console.log("Users matched up successfully " + queueForGamesList["Player1"]);
			//works console.log("Users matched up successfully " + queueForGamesList.Player2);
			console.log("Game instance ID returned to Server is " + gameInstanceID);
			
			gameMGMT.joinMatch(parseInt(queueForGamesList.Player1.clientID, 10), parseInt(gameInstanceID, 10), function(error){
				if(error)
				{
					throw new Error('Join match failed for player 1');
				}
				
				gameMGMT.joinMatch(parseInt(queueForGamesList.Player2.clientID, 10), parseInt(gameInstanceID, 10), function(error){
					if(error)
					{
						throw new Error('Join match failed for player 2');
					}					
					
					console.log('Event sent successfully');
					gameSocketController.sendMatchEvent(parseInt(queueForGamesList.Player1.clientID, 10), parseInt(gameInstanceID, 10));
					gameSocketController.sendMatchEvent(parseInt(queueForGamesList.Player1.clientID, 10), parseInt(gameInstanceID, 10));
					response.end({});
				});
			});
			//call gameSocketController.sendMatchEvent to both users
			//gameSocket.sendMatchEvent(params.clientID, gameInstanceID);
		});
	}

	console.log("queueForGameRequests is: " + queueForGameRequests);

	if(queueForGameRequests < 2)
	{
		response.writeHead(200, {"content-type": "application/json"});
		response.end(JSON.stringify("User queue request received. Please wait"));
	}
	else if (queueForGameRequests > 2)
	{
		response.writeHead(500, {"content-type": "application/json"});
		response.end(JSON.stringify("Game room Full. Please wait until Server restarts"));
	}

	//response.end(JSON.stringify({}));
	next();
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
		var userInfo = newUserInfo[0];
		
		console.log('User info received is ' + userInfo);
		//Get a list of games on the server
		
		gameMGMT.availableGames(function(gameList){
			var games = gameList;
			
			console.log('Finished gettign game list ' + userInfo.userID);
			//get a list of active games for the user
			gameMGMT.findByUser(parseInt(userInfo.userID, 10), function(activeEntries){
				var activeGames = {};
				var getActiveGameboards = function() {
					if(activeEntries.length>0) {
						var curr = activeEntries.pop();
						gameMGMT.getGameboard(curr.instanceID, curr.gameID, function(gb) {
							activeGames[curr.instanceID] = gb;
							getActiveGameboards();
						});
					} else {
						//for now, send back the user and game list
						text = {'user': userInfo, 'availableGames': games, 'active': activeGames};		
						response.writeHead( 200, {'content-type': 'application/json'});
						response.write(JSON.stringify(text));
						response.end();
						next();
					}
				};
				getActiveGameboards();
			});
		});
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
