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
});