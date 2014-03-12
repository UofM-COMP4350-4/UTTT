var io = require('socket.io');
var events = require("events");
var util = require("util");
var ValidateObjectController = require("./ValidateObjectController.js");

exports.ChatSocketController = function(port) {
	ValidateObjectController.ValidateNumber(port);
	this.socketIO = io.listen(port);
	
	this.socketIO.sockets.on('connection', function(socket) {
		socket.on('joinChatRoom', function(gameInstanceID, callback) {
			socket.join('chat/' + gameInstanceID);
			
			if (callback !== undefined) {
				callback(socket.manager.rooms);
			}
		});
		
		socket.on('receiveMessageFromClient', function(message) {
			this.emit('messageReceivedFromClient', message);
		});
	});
	
	this.SendDataToRoom = function(gameInstanceID, data) {
		ValidateObjectController.ValidateNumber(gameInstanceID);
		ValidateObjectController.ValidateObject(this.socketIO.sockets.manager.rooms[('/chat/' + gameInstanceID)]);
		this.socketIO.sockets.in('chat/' + gameInstanceID).emit('receiveMessageFromServer', data);
	};	
};

util.inherits(exports.ChatSocketController, events.EventEmitter);