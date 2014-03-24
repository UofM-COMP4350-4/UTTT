var restify = require('restify');
var ecstatic = require('ecstatic');
var serverSettings = require('./server_settings.js');
var dbController = require('./controllers/DataStoreController.js');
var matchmaking = require('./controllers/MatchmakingController.js');
dbController.setup({username:'ubuntu', password:'', hostname:serverSettings.hostname});
var gameMGMT = require('./models/GameManagement.js');
var gameSocketController = require('./controllers/GameSocketController.js').createGameSocket(10089);
var queueForGameRequests = 0;
var queueForGamesList = {};
var path = require('path');

var server = restify.createServer();
server.pre(ecstatic({ root: path.join(__dirname, '../client-web')}));
//server.pre(ecstatic({ root: __dirname + '/public'}));

server.use(restify.queryParser());

server.get("/queueForGame", function(request, response, next){
	//We need to Setup a new game in the database between two players
	//Create a flat file for the board data
	//Then send back the board object
	
	//Have to set up a mock queueForGame thing
	//****MOCK MATCHMAKING CONTROLLER*******
	var userID = parseInt(request.params.userID, 10);
	var gameID = parseInt(request.params.gameID, 10);
	matchmaking.joinMatchmaking(userID, gameID, function(gb) {
		if(gb) {
			console.log(gb.instanceID +" MATCHMAKING SETUP");
		}
	});
	response.writeHead(200, {'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
	response.end("{}");
	return next();
});

server.get("/createNewGame", function(request, response, next) {
	//We need to Setup a new game in the database between two players
	//Create a flat file for the board data
	//Then send back the board object
	console.log("New game request received from Client");
	var gameID = parseInt(request.params.gameID, 10);
	var userID = parseInt(request.params.userID, 10);
	gameMGMT.setupMatch(gameID, undefined, function(instanceID) {
		gameMGMT.joinMatch(userID, instanceID, function() {
			gameMGMT.getGameboard(instanceID, gameID, function(gb) {
				response.writeHead(200, {"content-type": "application/json"});
				response.end(JSON.stringify({gameboard:gb,
						url:"http://" + request.header('Host') + "/#game-" + instanceID}));
				next();
			});
		});
	});
});
server.get("/joinGame", function(request, response, next) {
	var userID = parseInt(request.params.userID, 10);
	var instanceID = parseInt(request.params.instanceID, 10);
	gameMGMT.joinMatch(userID, instanceID, function(err) {
		response.writeHead(200, {"content-type": "application/json"});
		if(err) {
			// unable to join match; game full
			response.end(JSON.stringify({err:err}));
			next();
		} else {
			var gameID = gameMGMT.getMatches()[instanceID].gameBoard.gameID;
			gameMGMT.getGameboard(instanceID, gameID, function(gb) {
				// Send gameboard updated with added player to other players in the match
				for(var i=0; i<gb.players.length; i++) {
					if(gb.players[i].id!=userID) {
						gameSocketController.SendDataToUser(gb.players[i].id, gb);
					}
				}
				response.end(JSON.stringify({gameboard:gb}));
				next();
			});
		}
	});
});

server.get("/initialize", function(request, response, next) {
	console.log("Received initialize request from Client " + request.params.userid); 
	//Setup a Client Id if the id passed was not found in the database
	var text = {};
	//call DataStoreController and get a the user's information
	dbController.getUserInformation(request.params.userID, function(newUserInfo){
		var userInfo = newUserInfo;
		
		console.log('User info received is ' + userInfo);
		//Get a list of games on the server
		
		gameMGMT.availableGames(function(gameList){
			var games = gameList;
			
			console.log('Finished getting game list ' + userInfo.userID);
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
						response.writeHead( 200, {"content-type": "application/json", 'Access-Control-Allow-Origin' : '*'});
						response.write(JSON.stringify(text));
						response.end();
						next();
					}
				};
				getActiveGameboards();
			});
		});
	});
	next();
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
console.log("URL: " + server.url);
server.listen(process.env.PORT || 80, process.env.IP);

console.log("Server started & listening on port 80");
