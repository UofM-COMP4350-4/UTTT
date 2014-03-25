var io = require('socket.io');
var events = require("events");
var util = require("util");
var ValidateObjectController = require("./ValidateObjectController.js");

function GameSocketController(port) {
	ValidateObjectController.ValidateNumber(port);
	console.log('Game socket listening on port ' + port);
	this.socketIO = io.listen(port);

	var clientSocketIDHashTable = {};
	var self = this;
	this.socketIO.sockets.on('connection', function(socket) {
		console.log("Socket client connected " + socket.id);
		socket.emit("clientConnectedToServer", {});
		socket.on('userSetup', function(user, callback) {
			if(user && user.userID!==undefined) {
				ValidateObjectController.ValidateNumber(user.userID);
				clientSocketIDHashTable[user.userID] = socket;
				self.emit('userConnect', {userID: user.userID}, function() {
					socket.emit("userSetupComplete", {});
				});
				if (callback) {
					callback(util.inspect(clientSocketIDHashTable));
				}
			} else {
				console.log("Unable to identify; socket id: " + socket.id);
			}
		});
		
		//sending upwards on the server (Gameboard etc...)
		socket.on('receiveMove', function(move) {
			self.emit('moveReceived', move);
		});
		
		//send message to client(s)
		socket.on('chat', function(param) {
			self.socketIO.sockets.in('game/' + param.instanceID).emit('chat', param);
		});
		
		//disconnects user
		socket.on('disconnect', function() {
			for(var x in clientSocketIDHashTable) {
				if(clientSocketIDHashTable[x].id == socket.id) {
					delete clientSocketIDHashTable[x];
					console.log('Disconnect called on socket for userID: ' + x);
					self.emit('userDisconnect', {userID: parseInt(x, 10)});
				}
			}
		});
	});
	
	this.sendMatchEvent = function(userID, gameboard) {
		//console.log("Sending match event to userID: " + userID);
		ValidateObjectController.ValidateNumber(userID);
		ValidateObjectController.ValidateObject(gameboard);
		if(clientSocketIDHashTable[userID]) {
			clientSocketIDHashTable[userID].emit('matchFound', gameboard);
		}
	};

	/****************************************************************************
	 * Room = Chat/Game instance
	 ****************************************************************************/
	this.JoinRoom = function(userID, instanceID) {
		ValidateObjectController.ValidateNumber(userID);
		ValidateObjectController.ValidateNumber(instanceID);
		if(clientSocketIDHashTable[userID]) {
			clientSocketIDHashTable[userID].join('game/' + instanceID);
			console.log(userID + ' joined room game/' + instanceID);
		}
	};

	this.LeaveRoom = function(userID, instanceID) {
		ValidateObjectController.ValidateNumber(userID);
		ValidateObjectController.ValidateNumber(instanceID);
		if(clientSocketIDHashTable[userID]) {
			clientSocketIDHashTable[userID].leave('game/' + instanceID);
		}
	};

	this.CloseRoom = function(instanceID) {
		ValidateObjectController.ValidateNumber(instanceID);
		self.socketIO.sockets.clients('game/' + instanceID).forEach(function(s) {
			s.leave('game/' + instanceID);
		});
	};

	this.SendDataToUser = function(userID, data) {
		ValidateObjectController.ValidateNumber(userID);
		ValidateObjectController.ValidateObject(data);
		if(clientSocketIDHashTable[userID]) {
			clientSocketIDHashTable[userID].emit('receivePlayResult', data);
		}
	};
	
	this.SendDataToAllUsersInGame = function(gameInstanceID, data) {
		ValidateObjectController.ValidateNumber(gameInstanceID);
		ValidateObjectController.ValidateObject(data);
		self.socketIO.sockets.in('game/' + gameInstanceID).emit('receivePlayResult', data);
	};
	
}

util.inherits(GameSocketController, events.EventEmitter);
var gameSocket;
exports.createGameSocket = function(port){
	if(!gameSocket){
		gameSocket = new GameSocketController(port);
	}
	
	return gameSocket;
};
