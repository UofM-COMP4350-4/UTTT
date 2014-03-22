//fake server
//Test all communication with the client
var restify = require('restify');
var ecstatic = require('ecstatic');
var io = require('socket.io');

var server = restify.createServer();
server.pre(ecstatic({ root: __dirname + '/public'}));

server.use(restify.queryParser());

var userSocket;
this.socketIO = io.listen(10089);
	
this.socketIO.sockets.on('connection', function(socket) {
	userSocket = socket;
	userSocket.emit('clientConnectedToServer', "");
	
	socket.on('userSetup', function(){
		console.log('I get a user setup event');
	});
});	
	
server.get("/queueForGame", function(request, response, next){
	//return nothing
	//After this call a sendMatchEvent
	console.log('received queue for game request');
	var gameBoard = {
		"instanceID": 1,
		"gameID": 1,
		"userToPlay": {
			"id": 1,
			"name": "Player1"
		},
		"players": [{\"id\":1,\"name\":\"Player1\"}],
		"currentBoard": [],
		"winner": null
	};
	
	if(userSocket)
	{
		userSocket.emit('matchFound', gameBoard);
		response.writeHead( 200, {'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
		response.end("");
	}
});

server.get("/listOfGames", function(request, response, next)
{
	var text = {};
	
	text = {'games': [{gameID: 1, gameName: "Connect4", gameType: "Connect4", maxPlayers: 2}]};
	
	response.writeHead( 200, {'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
	response.write(JSON.stringify(text));
	response.end();
	next();
});

server.get("/initialize", function(request, response, next) {
	var text = {};
	
	text = {'user': {userID: 1, userName: "Player1", isOnline: 1, avatarURL: ""},
			'availableGames': [{gameID: 1, gameName: "Connect4", gameType: "Connect4", maxPlayers: 2}],
			'active': {}};
	response.writeHead( 200, {'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
	response.write(JSON.stringify(text));
	response.end();
	next();
});

server.get("/createNewGame", function(request, response, next){
});

server.listen(process.env.PORT || 80, process.env.IP);
console.log("Server started & listening on port 80");