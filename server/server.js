var restify = require('restify');
var ecstatic = require('ecstatic');
var dbController = require('./controllers/DataStoreController.js');
dbController.setup({username:'ubuntu', password:'', hostname:'54.186.20.243'});
var gameMGMT = require('./models/GameManagement.js');
var gameSocketController = require('./controllers/GameSocketController.js');

var server = restify.createServer();
server.pre(ecstatic({ root: __dirname + '/public'}));

var gameSocket = new gameSocketController.GameSocketController(10089);

server.use(restify.queryParser());

server.get("/queueForGame", function(request, response, next){
	//We need to Setup a new game in the database between two players
	//Create a flat file for the board data
	//Then send back the board object
	response.writeHead(200, {"content-type": "application/json"});
	response.end(JSON.stringify({}));
	return next();
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
	console.log("Received initialize request from Client " + request.params.userID); 
	//Setup a Client Id if the id passed was not found in the database
	var text = {};
	//call DataStoreController and get a the user's information
	dbController.getUserInformation(request.params.userid, function(newUserInfo){
		var userInfo = newUserInfo[0];
		//Get a list of games on the server
		gameMGMT.availableGames(function(gameList){
			var games = gameList;
			//get a list of active games for the user
			gameMGMT.findByUser(userInfo.userID, function(activeGames){					
				//for now, send back the user and game list
				text = {'user': userInfo, 'availableGames': games, 'active': activeGames};		
				response.writeHead( 200, {'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
				response.write(JSON.stringify(text));
				response.end();
				next();
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
