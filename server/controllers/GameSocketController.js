var io = require('socket.io');
var events = require("events");
var util = require("util");
var ValidateObjectController = require("./ValidateObjectController.js");

exports.GameSocketController = function(port) {
	ValidateObjectController.ValidateNumber(port);
	console.log('Socket connection opened on port ' + port);
	this.socketIO = io.listen(port);
	
	//var userID;	
	var clientSocketIDHashTable = {};
	
	this.socketIO.sockets.on('connection', function(socket) {
		console.log('Connection received from client.');
		socket.on('userSetup', function(userID, callback) {
			userID = userID;
			ValidateObjectController.ValidateNumber(userID);
			clientSocketIDHashTable[userID] = socket.id;
			console.log('UserSetup Event Received from ' + userID);
			if (callback !== undefined) {
				callback(clientSocketIDHashTable);	
			}
		});
		
		socket.on('gameCreated', function(gameInstanceID, callback) {
			socket.join('game/' + gameInstanceID);
			console.log('gameCreated event received for gameInstanceID ' + gameInstanceID);
			
			if (callback !== undefined) {
				callback(socket.manager.rooms);	
			}
		});

		socket.on('receiveMove', function(move) {
			console.log('Received move event from client.  Move: ' + move);
			this.emit('moveReceived', move);
		});
	});
	
	this.SendDataToUser = function(userID, data) {
		ValidateObjectController.ValidateNumber(userID);
		ValidateObjectController.ValidateString(clientSocketIDHashTable[userID]);
		this.socketIO.sockets.socket(clientSocketIDHashTable[userID]).emit('receivePlayResult', data);
	};
	
	this.SendDataToAllUsersInGame = function(gameInstanceID, data) {
		ValidateObjectController.ValidateNumber(gameInstanceID);
		ValidateObjectController.ValidateObject(this.socketIO.sockets.manager.rooms[('/game/' + gameInstanceID)]);
		this.socketIO.sockets.in('game/' + gameInstanceID).emit('receivePlayResult', data);
	};
};

util.inherits(exports.GameSocketController, events.EventEmitter);
