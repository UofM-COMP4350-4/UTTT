var assert = require('assert');
var io = require('socket.io-client');
var ChatSocketControllerJS = require("../../controllers/ChatSocketController.js");

var port = 5000;
var socketURL = 'http://0.0.0.0:' + port;

var options = {
  transports: ['websocket'],
  'force new connection': true
};

var chatSocketController = new ChatSocketControllerJS.ChatSocketController(port);

describe("Game Socket Communication Server Tests",function() {
	it('Initialize Game Socket Valid Data', function(done) {
  		assert.notEqual(chatSocketController.socketIO, null);
  		assert.notEqual(chatSocketController.socketIO, undefined);
  		done();
	});
	
	it('Initialize Game Socket Null/NaN/Undefined Data', function(done) {
  		assert.throws(function() { new ChatSocketControllerJS.ChatSocketController(null) }, Error);
		assert.throws(function() { new ChatSocketControllerJS.ChatSocketController(NaN) }, Error);
		assert.throws(function() { new ChatSocketControllerJS.ChatSocketController(undefined) }, Error);
  		done();
	});
	
	it('Initialize Game Socket Invalid Data', function(done) {
  		assert.throws(function() { new ChatSocketControllerJS.ChatSocketController('null') }, Error);
		assert.throws(function() { new ChatSocketControllerJS.ChatSocketController(true) }, Error);
		assert.throws(function() { new ChatSocketControllerJS.ChatSocketController({a: 1}) }, Error);
  		done();
	});
	
	it('Store userID with socket connection', function(done) {
  		var client1 = io.connect(socketURL, options);
		client1.on('connect', function() {
			done();
		});
	});
	
	it('Receive gameCreated event with socket connection', function(done) {
  		var client1 = io.connect(socketURL, options);
		client1.emit('joinChatRoom',96,function (rooms) {
			assert.notEqual(rooms['/chat/96'], null);
			assert.notEqual(rooms['/chat/96'], undefined);
		});
		
		var client2 = io.connect(socketURL, options);
		client2.emit('joinChatRoom',96,function (rooms) {
			assert.notEqual(rooms['/chat/96'], null);
			assert.notEqual(rooms['/chat/96'], undefined);
			done();
		});
	});
	
	it('Listener can respond to moveReceived event from socket connection', function(done) {
  		var client1 = io.connect(socketURL, options);
		client1.emit('receiveMessageFromClient','Hello, World!');
		
		client1.on('messageReceivedFromClient', function(message) {
			assert.equal('Hello, World!',message);
			done();
		})
	});
	
	// it('Send data to All Users in Chat', function(done) {
		// var client1 = io.connect(socketURL, options);
		// var client2 = io.connect(socketURL, options);
		// var numOfReceivedMessages = 0;
// 		
		// client1.emit('joinChatRoom',96);
		// client2.emit('joinChatRoom',96);
// 		
		// client1.on('receiveMessageFromServer', function(data) {
			// console.log('test');
			// assert.equal('Hello, World!',data);
			// numOfReceivedMessages = numOfReceivedMessages + 1
// 
			// if (numOfReceivedMessages == 2) {
				// done();
			// }
			// done();
		// });
// 		
		// client2.on('receiveMessageFromServer', function(data) {
			// console.log('test1');
			// assert.equal('Hello, World!',data);
			// numOfReceivedMessages = numOfReceivedMessages + 1
// 
			// if (numOfReceivedMessages == 2) {
				// done();
			// }
		// });
// 		
		// chatSocketController.SendDataToRoom(96,'Hello, World!');
	// });
	
	it('Send data to Invalid Room', function(done) {
		assert.throws(function() { chatSocketController.SendDataToRoom(32132,'This is Data!') }, Error);
		assert.throws(function() { chatSocketController.SendDataToRoom(421321,'This is Data!') }, Error);
		done();
	});		
	
});