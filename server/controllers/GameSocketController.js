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
			callback(clientSocketIDHashTable);
		});
		
		socket.on('gameCreated', function(user, gameInstanceID, callback) {
			socket.join('game/' + gameInstanceID);
			callback();
		});
	});

	this.socketIO.sockets.on('receiveMove', function(move, callback) {
		this.emit('receiveMove', move);
		callback();
	});
};

util.inherits(exports.GameSocketController, events.EventEmitter);

exports.GameSocketController.prototype.SendDataToUser = function(userID, data) {
	ValidateObjectController.ValidateNumber(userID);
	this.socketIO.sockets.socket(this.clientSocketIDHashTable[userID].id).emit('receivePlayResult', data);
};

exports.GameSocketController.prototype.SendDataToAllUsersInGame = function(gameInstanceID, data) {
	ValidateObjectController.ValidateNumber(gameInstanceID);
	io.sockets.in(room).emit('game/' + gameInstanceID, data);
};