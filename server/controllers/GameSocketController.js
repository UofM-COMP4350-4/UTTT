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
		socket.on('userSetup', function(userID, callback) {
			console.log('User Setup called for ' + userID);
			ValidateObjectController.ValidateNumber(userID);
			clientSocketIDHashTable[userID] = socket;
			self.emit('userConnect', {userID: userID});
		
			if (typeof callback !== undefined) {
				callback(util.inspect(clientSocketIDHashTable));
			}
		});
		
		socket.on('receiveMove', function(move) {
			console.log('Received Move from Player.  X:' + move.x + ' Y:' + move.y);
			self.emit('moveReceived', move);
		});
		
		socket.on('disconnect', function(userID) {
			console.log('Disconnect called on socket for userID: ' + userID);
			delete clientSocketIDHashTable[userID];
			self.emit('userDisconnect', {userID: userID});
		});
	});
	
	this.sendMatchEvent = function(userID, gameInstanceID) {
		console.log("Sending match event to userID: " + userID + ", gameInstanceID: " + gameInstanceID);
		ValidateObjectController.ValidateNumber(userID);
		ValidateObjectController.ValidateNumber(gameInstanceID);
		ValidateObjectController.ValidateObject(clientSocketIDHashTable[userID]);
		clientSocketIDHashTable[userID].emit('matchFound', gameInstanceID);
	};

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
		this.socketIO.sockets.clients('game/' + instanceID).forEach(function(s) {
			s.leave('game/' + instanceID);
		});
	};

	this.SendDataToUser = function(userID, data) {
		ValidateObjectController.ValidateNumber(userID);
		ValidateObjectController.ValidateObject(data);
		clientSocketIDHashTable[userID].emit('receivePlayResult', data);
	};
	
	this.SendDataToAllUsersInGame = function(gameInstanceID, data) {
		ValidateObjectController.ValidateNumber(gameInstanceID);
		ValidateObjectController.ValidateObject(data);
		console.log('Sending Data to all users in gameInstanceID ' + gameInstanceID);
		this.socketIO.sockets.in('game/' + gameInstanceID).emit('receivePlayResult', data);
	};
	
}

util.inherits(GameSocketController, events.EventEmitter);
var gameSocket;
exports.createGameSocket = function(port){
	if(!gameSocket){
		gameSocket = new GameSocketController(port);
		console.log('Game Socket gets created properly');
	}
	
	return gameSocket;
};
