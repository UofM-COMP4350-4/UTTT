var io = require('socket.io');
var events = require("events");
var util = require("util");
var ValidateObjectController = require("./ValidateObjectController.js");

util.inherits(exports.ChatSocketController, events.EventEmitter);

exports.ChatSocketController = function(port) {
	this.socketIO = io.listen(port);
	this.SetupConnectionEvents();
	
	function SetupConnectionEvents() {
	this.socketIO.sockets.on('connection', function(socket) {
		this.socketIO.sockets.on('chatCreated', function(user, gameInstanceID) {
			socket.join('chat/' + gameInstanceID);
		});
	});

	this.socketIO.sockets.on('receiveMessage', function(move) {
		this.emit('receiveMessage', move);
	});
}
}

exports.ChatSocketController.prototype.SendDataToUser = function(userID, data) {
	ValidateObjectController.ValidateNumber(userID);
	this.socketIO.sockets.socket(clientSocketIDHashTable[userID].id).emit('receivePlayResult', data);
}

exports.ChatSocketController.prototype.SendDataToAllUsersInGame = function(gameInstanceID, data) {
	ValidateObjectController.ValidateNumber(gameInstanceID);
	this.io.sockets.in(room).emit('chat/' + gameInstanceID, data);
}
