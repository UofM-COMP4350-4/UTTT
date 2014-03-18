var io = require('socket.io');
var events = require("events");
var util = require("util");
var ValidateObjectController = require("./ValidateObjectController.js");

exports.GameSocketController = function(port) {
	ValidateObjectController.ValidateNumber(port);
	this.socketIO = io.listen(port);
	
	//var userID;	
	var clientSocketIDHashTable = {};
	var self = this;
	this.socketIO.sockets.on('connection', function(socket) {
		socket.on('userSetup', function(userData) {
			ValidateObjectController.ValidateObject(userData);
			clientSocketIDHashTable[userData.userID] = socket;
			self.emit('userConnect', {userID: userData.userID});
			socket.on('disconnect', function() {
				delete clientSocketIDHashTable[userData.userID];
				self.emit('userDisconnect', {userID: userData.userID});
			});
		});
		socket.on('receiveMove', function(move) {
			self.emit('moveReceived', move);
		});
	});
	
	this.sendMatchEvent = function(userID, gameInstanceID) {
		console.log("Sending match event to IOS " + gameInstanceID);
		ValidateObjectController.ValidateNumber(userID);
		ValidateObjectController.ValidateString(clientSocketIDHashTable[userID]);
		this.socketIO.sockets.socket(clientSocketIDHashTable[userID]).emit('matchFound', {'gameInstanceID':gameInstanceID});
		return;
	};

	this.JoinRoom = function(userID, instanceID) {
		ValidateObjectController.ValidateNumber(userID);
		ValidateObjectController.ValidateNumber(instanceID);
		if(clientSocketIDHashTable[userID]) {
			clientSocketIDHashTable[userID].join('game/' + instanceID);
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
		io.sockets.clients('game/' + instanceID).forEach(function(s) {
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
		this.socketIO.sockets.in('game/' + gameInstanceID).emit('receivePlayResult', data);
	};
};

util.inherits(exports.GameSocketController, events.EventEmitter);
