var assert = require('assert');
var io = require('socket.io-client');
var GameSocketControllerJS = require("../../controllers/GameSocketController.js");

var port = 5000;
var socketURL = 'http://0.0.0.0:' + port;

var options = {
  transports: ['websocket'],
  'force new connection': true
};

var gameSocketController = new GameSocketControllerJS.GameSocketController(port);

describe("Game Socket Communication Server Tests",function() {
	it('Initialize Game Socket Valid Data', function(done) {
  		assert.notEqual(gameSocketController.socketIO, null);
  		assert.notEqual(gameSocketController.socketIO, undefined);
  		done();
	});
	
	it('Initialize Game Socket Null/NaN/Undefined Data', function(done) {
  		assert.throws(function() { new GameSocketControllerJS.GameSocketController(null) }, Error);
		assert.throws(function() { new GameSocketControllerJS.GameSocketController(NaN) }, Error);
		assert.throws(function() { new GameSocketControllerJS.GameSocketController(undefined) }, Error);
  		done();
	});
	
	it('Initialize Game Socket Invalid Data', function(done) {
  		assert.throws(function() { new GameSocketControllerJS.GameSocketController('null') }, Error);
		assert.throws(function() { new GameSocketControllerJS.GameSocketController(true) }, Error);
		assert.throws(function() { new GameSocketControllerJS.GameSocketController({a: 1}) }, Error);
  		done();
	});
	
	it('Store userID with socket connection', function(done) {
  		var client1 = io.connect(socketURL, options);
		//var client2 = io.connect(socketURL, options);
		client1.on('connect', function() {
			client1.emit('userSetup',{id:5},function (hashTable) {
				assert.notEqual(hashTable[5], null);
				assert.notEqual(hashTable[5], undefined);
				done();
			});
		});
	});
	
	it('Receive gameCreated event with socket connection', function(done) {
  		var client1 = io.connect(socketURL, options);
		client1.emit('gameCreated',96,function (rooms) {
				assert.notEqual(rooms['/game/96'], null);
				assert.notEqual(rooms['/game/96'], undefined);
		});
		
		var client2 = io.connect(socketURL, options);
		client2.on('connect', function() {
			client2.emit('gameCreated',96,function (rooms) {
				assert.notEqual(rooms['/game/96'], null);
				assert.notEqual(rooms['/game/96'], undefined);
				done();
			});
		});
	});
	
	it('Listener can respond to moveReceived event from socket connection', function(done) {
  		var client1 = io.connect(socketURL, options);
		client1.emit('receiveMove',{x:1,y:1,player:{id:32,name:'Player 1'}});
		
		client1.on('moveReceived', function() {
				done();
		});
	});
	
	it('Send data to Non-Existing User', function(done) {
  		assert.throws(function() { gameSocketController.SendDataToUser(7897,'This is data!') }, Error);
  		assert.throws(function() { gameSocketController.SendDataToUser(5232,'This is data!') }, Error);
  		done();
	});	
	
	it('Send data to Invalid User', function(done) {
  		assert.throws(function() { gameSocketController.SendDataToUser(false,'This is data!') }, Error);
  		assert.throws(function() { gameSocketController.SendDataToUser('Not a Valid User','This is data!') }, Error);
  		done();
	});
	
	it('Send data to Valid User', function(done) {
		var client1 = io.connect(socketURL, options);
		
		client1.on('connect', function() {
			client1.emit('userSetup',{id:5},function (hashTable) {
				assert.notEqual(hashTable[5], null);
				assert.notEqual(hashTable[5], undefined);
			});
		});
		
		client1.emit('receiveMove',{x:1,y:1,player:{id:32,name:'Player 1'}});
		
		client1.on('moveReceived', function(move) {
			assert.deepEqual({x:1,y:1,player:{id:32,name:'Player 1'}},move);
			gameSocketController.SendDataToUser(5,'This is Data!');
		});
		
		client1.on('receivePlayResult', function(data) {
			assert.equal('This is Data!',data);
			done();
		});
	});	
	
	it('Send data to All Users in a Game', function(done) {
		var client1 = io.connect(socketURL, options);
		var client2 = io.connect(socketURL, options);
		var numOfReceivedPlayResults = 0;
		
		client1.emit('gameCreated',96);
		client2.emit('gameCreated',96);
		
		client1.on('receivePlayResult', function(data) {
			assert.equal('This is Data!',data);
			numOfReceivedPlayResults = numOfReceivedPlayResults + 1;

			if (numOfReceivedPlayResults == 2) {
				done();
			}
		});
		
		client2.on('receivePlayResult', function(data) {
			assert.equal('This is Data!',data);
			numOfReceivedPlayResults = numOfReceivedPlayResults + 1;

			if (numOfReceivedPlayResults == 2) {
				done();
			}
		});
		
		client1.emit('receiveMove',{x:1,y:1,player:{id:32,name:'Player 1'}});
		
		client1.on('moveReceived', function(move) {
			assert.deepEqual({x:1,y:1,player:{id:32,name:'Player 1'}},move);
			gameSocketController.SendDataToAllUsersInGame(96,'This is Data!');
		});
	});
	
	it('Send data to Invalid Room', function(done) {
		assert.throws(function() { gameSocketController.SendDataToAllUsersInGame(32132,'This is Data!') }, Error);
		assert.throws(function() { gameSocketController.SendDataToAllUsersInGame(421321,'This is Data!') }, Error);
		done();
	});		
	
});