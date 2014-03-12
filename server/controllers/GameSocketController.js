var io = require('socket.io');
var events = require("events");
var util = require("util");
var ValidateObjectController = require("./ValidateObjectController.js");

exports.GameSocketController = function(port) {
	ValidateObjectController.ValidateNumber(port);
	this.socketIO = io.listen(port);
	
	var clientSocketIDHashTable = {};
	
	this.socketIO.sockets.on('connection', function(socket) {
		socket.on('userSetup', function(user, callback) {
			ValidateObjectController.ValidateObject(user);
			clientSocketIDHashTable[user.id] = socket.id;
			
			if (callback !== undefined) {
				callback(clientSocketIDHashTable);	
			}
		});
		
		socket.on('gameCreated', function(gameInstanceID, callback) {
			socket.join('game/' + gameInstanceID);
			
			if (callback !== undefined) {
				callback(socket.manager.rooms);	
			}
		});

		socket.on('receiveMove', function(move) {
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