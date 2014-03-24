//fake server
//Test all communication with the client
var restify = require('restify');
var ecstatic = require('ecstatic');
var io = require('socket.io');
var path = require('path');

var server = restify.createServer();
server.pre(ecstatic({ root: path.join(__dirname, '../../../client-web')}));

server.use(restify.queryParser());

var userSocket;
this.socketIO = io.listen(10089);
	
this.socketIO.sockets.on('connection', function(socket) {
	userSocket = socket;
	socket.emit("clientConnectedToServer", {});
	socket.on('userSetup', function(param){
		console.log('SETUP EVENT, USERID ' + param);
		socket.emit("userSetupComplete", {});
	});
	socket.on('chat', function(param){
		socket.emit("chat", param);
		setTimeout(function() {
			socket.emit("chat", {
				instanceID: param.instanceID,
				player: {"id":2,"name":"Player2"},
				message: "This is a sample chat message",
				timestamp: (new Date().getTime()*1)
			});
		}, 1000);
	});
	var gameBoard = {
		"instanceID": 1,
		"gameID": 1,
		"userToPlay": {
			"id": 2,
			"name": "Player2"
		},
		"players": [{"id":1,"name":"Player1"}, {"id":2,"name":"Player2"}],
		"currentBoard": [],
		"winner": null
	};
	var moves= {};
	socket.on('receiveMove', function(param){
		console.log('SETUP EVENT, RECEIVEMOVE ' + JSON.stringify(param));
		gameBoard.instanceID = param.instanceID;
		if(!moves[gameBoard.instanceID]) {
			moves[gameBoard.instanceID] = [];
		}
		moves[gameBoard.instanceID].push({x:param.x, y:param.y, player:param.player});
		gameBoard.currentBoard = moves[gameBoard.instanceID];
		gameBoard.userToPlay = {id:1, name:"Player2"};
		socket.emit("receivePlayResult", gameBoard);
		setTimeout(function() {
			gameBoard.userToPlay = {id:1, name:"Player1"};
			moves[gameBoard.instanceID].push({x:2, y:2, player:{id:2, name:"Player2"}});
			gameBoard.currentBoard = moves[gameBoard.instanceID];
			socket.emit("receivePlayResult", gameBoard);

		}, 2000);
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
		"players": [{"id":1,"name":"Player1"}, {"id":2,"name":"Player2"}],
		"currentBoard": [],
		"winner": null
	};
	
	if(userSocket)
	{
		console.log("SENDING MATCH FOUND");
		userSocket.emit('matchFound', gameBoard);
		response.writeHead( 200, {'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
		response.end("");
	}
	return next();
});

server.get("/listOfGames", function(request, response, next)
{
	var text = {};
	
	text = {'games': [{gameID: 1, gameName: "Connect4", gameType: "Connect4", maxPlayers: 2}]};
	
	response.writeHead( 200, {'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
	response.write(JSON.stringify(text));
	response.end();
	return next();
});

server.get("/initialize", function(request, response, next) {
	var text = {};
	
	text = {'user': {userID: 1, userName: "Player1", isOnline: 1, avatarURL: ""},
			'availableGames': [{gameID: 1, gameName: "Connect4", gameType: "Connect4", maxPlayers: 2}],
			'active': {}};
	response.writeHead( 200, {'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
	response.write(JSON.stringify(text));
	response.end();
	return next();
});

server.get("/createNewGame", function(request, response, next) {
	var gb = {
		"instanceID": 2,
		"gameID": 1,
		"userToPlay": {
			"id": 1,
			"name": "Player1"
		},
		"players": [{"id":1,"name":"Player1"}],
		"currentBoard": [],
		"winner": null
	};
	response.writeHead( 200, {'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
	response.write(JSON.stringify({gameboard:gb, url:"http://" + request.header('Host') + "/#game-2"}));
	response.end();
	return next();
});
server.get("/joinGame", function(request, response, next) {
	var gb = {
		"instanceID": 2,
		"gameID": 1,
		"userToPlay": {
			"id": 1,
			"name": "Player1"
		},
		"players": [{"id":1,"name":"Player1"}, {"id":2,"name":"Player2"}],
		"currentBoard": [],
		"winner": null
	};
	response.writeHead( 200, {'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
	if(request.params.instanceID==2) { // Success-reponse for joined game
		console.log("joining " + request.params.instanceID);
		response.write(JSON.stringify({gameboard:gb}));
	} else { // Error-response for full game
		response.write(JSON.stringify({err:{errorCode:0, errorText:""}}));
	}
	response.end();
	return next();
});

server.listen(process.env.PORT || 80, process.env.IP);
console.log("Server started & listening on port 80");