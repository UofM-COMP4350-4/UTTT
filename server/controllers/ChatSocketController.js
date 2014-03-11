var io = require('socket.io');
var events = require("events");
var util = require("util");
var ValidateObjectController = require("./ValidateObjectController.js");

exports.ChatSocketController = function(port) {
	ValidateObjectController.ValidateNumber(port);
	this.socketIO = io.listen(port);
	
	this.socketIO.sockets.on('connection', function(socket) {
		socket.on('createChatRoom', function(gameInstanceID) {
			socket.join('chat/' + gameInstanceID);
		});
		
		socket.on('receiveMessage', function(message) {
			this.emit('receiveMessage', message);
		});
	});
	
	this.SendDataToAllUsersInRoom = function(gameInstanceID, data) {
		ValidateObjectController.ValidateNumber(gameInstanceID);
		ValidateObjectController.ValidateObject(this.socketIO.sockets.manager.rooms[('/chat/' + gameInstanceID)]);
		this.socketIO.sockets.in('chat/' + gameInstanceID).emit('receivePlayResult', data);
	};	
}

util.inherits(exports.ChatSocketController, events.EventEmitter);