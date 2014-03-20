var assert = require('assert');
var io = require('socket.io-client');
var GameSocketControllerJS = require("../../controllers/GameSocketController.js");

var port = 5004;
var socketURL = 'http://0.0.0.0:' + port;

var options = {
  transports: ['websocket'],
  'force new connection': true
};

var gameSocketController = GameSocketControllerJS.createGameSocket(port);

describe("Game Socket Communication Server Tests",function() {
	it('Join/Leave/Close Room', function(done) {
  		var client1 = io.connect(socketURL, options);
		var client2 = io.connect(socketURL, options);
		var numConnectedClient = 0;
		var isRoomClosed = 0;
		
		client1.on('connect', function() {
			client1.emit('userSetup',5,function (hashTable) {
				gameSocketController.JoinRoom(5, 96);
				
				numConnectedClient = numConnectedClient + 1;
				if (numConnectedClient == 2) {
					gameSocketController.SendDataToAllUsersInGame(96,{data:"Blah"});
				}
			});
		});
		
		client2.on('connect', function() {
			client2.emit('userSetup',7,function (hashTable) {
				gameSocketController.JoinRoom(7, 96);
				gameSocketController.LeaveRoom(7, 96);
				
				numConnectedClient = numConnectedClient + 1;
				if (numConnectedClient == 2) {
					gameSocketController.SendDataToAllUsersInGame(96,{data:"Blah"});
				}
			});
		});
		
		client1.on('receivePlayResult', function(data) {
			client1.removeAllListeners('receivePlayResult');
			if (isRoomClosed == 1) {
				assert.fail();
			}
			else {
				assert.deepEqual({data:"Blah"},data);
				done();
			}
		});
		
		client2.on('receivePlayResult', function() {
			assert.fail("LeaveRoom Function","Event should not have been caught.","Client 2 should not receive data from GameInstanceID 96.");
		});
	});	
	
	it('Listen for User Disconnect', function(done) {
  		var client1 = io.connect(socketURL, options);

		gameSocketController.on('userConnect', function(user) {
			assert.equal(5, user.userID);
			gameSocketController.removeAllListeners('userConnect');
		});
		
		gameSocketController.on('userDisconnect', function(user) {
			assert.equal("booted", user.userID);
			gameSocketController.removeAllListeners('userDisconnect');
			done();
		});

		client1.on('connect', function() {
			client1.removeAllListeners('connect');
			client1.emit('userSetup',5,function (hashTable) {
				assert.notEqual(hashTable[5], null);
				assert.notEqual(hashTable[5], undefined);
				client1.disconnect();
			});
		});
	});
	
	it('Send / Receive a Match found event', function(done) {
  		var client1 = io.connect(socketURL, options);

		gameSocketController.on('userConnect', function(user) {
			assert.equal(5, user.userID);
			gameSocketController.removeAllListeners('userConnect');
		});

		client1.on('matchFound', function(gameInstanceID) {
			client1.removeAllListeners('matchFound');
			assert.equal(gameInstanceID, 96);
			done();
		});	

		client1.on('connect', function() {
			client1.removeAllListeners('connect');
			client1.emit('userSetup',5,function (hashTable) {
				assert.notEqual(hashTable[5], null);
				assert.notEqual(hashTable[5], undefined);
				gameSocketController.sendMatchEvent(5,96);
			});
		});
	});			
	
	it('Listen for UserConnected Node Event', function(done) {
  		var client1 = io.connect(socketURL, options);

		gameSocketController.on('userConnect', function(user) {
			console.log('UserConnect reached.');
			assert.equal(5, user.userID);
			gameSocketController.removeAllListeners('userConnect');
			done();
		});

		client1.on('connect', function() {
			client1.removeAllListeners('connect');
			client1.emit('userSetup',5,function (hashTable) {
				assert.notEqual(hashTable[5], null);
				assert.notEqual(hashTable[5], undefined);
			});
		});
	});	
	
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

		client1.on('connect', function() {
			client1.removeAllListeners('connect');
			client1.emit('userSetup',5,function (hashTable) {
				assert.notEqual(hashTable[5], null);
				assert.notEqual(hashTable[5], undefined);
				done();
			});
		});
	});
	
	it('Listener can respond to moveReceived event from socket connection', function(done) {
  		var client1 = io.connect(socketURL, options);
		client1.emit('receiveMove',{x:1,y:1,player:{id:32,name:'Player 1'}});
		
		gameSocketController.on('moveReceived', function() {
			gameSocketController.removeAllListeners('moveReceived');
			done();
		});
	});
	
	it('Send data to Non-Existing User', function(done) {
  		assert.throws(function() { gameSocketController.SendDataToUser(7897,'This is data!') }, Error);
  		assert.throws(function() { gameSocketController.SendDataToUser(5232,'This is data!') }, Error);
  		assert.throws(function() { gameSocketController.sendMatchEvent(5232,'This is data!') }, Error);
  		assert.throws(function() { gameSocketController.sendMatchEvent('This is data',1232) }, Error);
  		assert.throws(function() { gameSocketController.JoinRoom(5232,'This is data!') }, Error);
  		assert.throws(function() { gameSocketController.JoinRoom('This is data',1232) }, Error);
  		assert.throws(function() { gameSocketController.LeaveRoom(5232,'This is data!') }, Error);
  		assert.throws(function() { gameSocketController.LeaveRoom('This is data',1232) }, Error);
  		assert.throws(function() { gameSocketController.CloseRoom('This is data!') }, Error);
  		done();
	});	
	
	it('Send data to Invalid User', function(done) {
  		assert.throws(function() { gameSocketController.SendDataToUser(false,'This is data!') }, Error);
  		assert.throws(function() { gameSocketController.SendDataToUser('Not a Valid User','This is data!') }, Error);
  		assert.throws(function() { gameSocketController.sendMatchEvent(5232,'This is data!') }, Error);
  		assert.throws(function() { gameSocketController.sendMatchEvent('This is data',1232) }, Error);
  		assert.throws(function() { gameSocketController.JoinRoom(5232,'This is data!') }, Error);
  		assert.throws(function() { gameSocketController.JoinRoom('This is data',1232) }, Error);
  		assert.throws(function() { gameSocketController.LeaveRoom(5232,'This is data!') }, Error);
  		assert.throws(function() { gameSocketController.LeaveRoom('This is data',1232) }, Error);
  		assert.throws(function() { gameSocketController.CloseRoom('This is data!') }, Error);
  		done();
	});
	
	it('Send data to Valid User', function(done) {
		var client1 = io.connect(socketURL, options);
		var finished = 0;
		
		client1.on('connect', function() {
			client1.removeAllListeners('connect');
			client1.emit('userSetup',5,function (hashTable) {
				assert.notEqual(hashTable[5], null);
				assert.notEqual(hashTable[5], undefined);
				finished = 1;
				console.log('Fnished inside callback: ' + finished);
				client1.emit('receiveMove',{x:1,y:1,player:{id:5,name:'Player 1'}});
			});
		});
		
		gameSocketController.on('moveReceived', function(move) {
			assert.deepEqual({x:1,y:1,player:{id:5,name:'Player 1'}},move);
			gameSocketController.SendDataToUser(5,{data:'This is Data!'});
			gameSocketController.removeAllListeners('moveReceived');
		});
			
		client1.on('receivePlayResult', function(data) {
			client1.removeAllListeners('receivePlayResult');
			assert.deepEqual({data:'This is Data!'},data);
			done();
		});
	});	
	
	it('Send data to All Users in a Game', function(done) {
		var client1 = io.connect(socketURL, options);
		var numOfReceivedPlayResults = 0;
		var numOfConnectionsReceived = 0;
		
		gameSocketController.on('moveReceived', function(move) {
			console.log("Received move from GameSocketController.");
			assert.deepEqual({x:1,y:1,player:{id:5,name:'Player 1'}},move);
			gameSocketController.SendDataToAllUsersInGame(96,{x:1,y:1,player:{id:5,name:'Player 1'}});
			gameSocketController.removeAllListeners('moveReceived');
		});
		
		client1.on('connect', function() {
			client1.removeAllListeners('connect');
			console.log('Client 1 connected');
			client1.emit('userSetup',5,function (hashTable) {
				assert.notEqual(hashTable[5], null);
				assert.notEqual(hashTable[5], undefined);
				gameSocketController.JoinRoom(5,96);
				numOfConnectionsReceived = numOfConnectionsReceived + 1;
				console.log('Client 1 NumOfConnectionsReceived ' + numOfConnectionsReceived);
				if (numOfConnectionsReceived == 2) {
					client1.emit('receiveMove',{x:1,y:1,player:{id:5,name:'Player 1'}});
				}			
			});
		});
		
		var client2 = io.connect(socketURL, options);
		client2.on('connect', function() {
			client2.removeAllListeners('connect');
			console.log('Client 2 connected');
			client2.emit('userSetup',7,function (hashTable) {
				assert.notEqual(hashTable[7], null);
				assert.notEqual(hashTable[7], undefined);
				gameSocketController.JoinRoom(7,96);
				numOfConnectionsReceived = numOfConnectionsReceived + 1;
				console.log('Client 2 NumOfConnectionsReceived ' + numOfConnectionsReceived);
				if (numOfConnectionsReceived == 2) {
					client1.emit('receiveMove',{x:1,y:1,player:{id:5,name:'Player 1'}});
				}
			});
		});
		
		client1.on('receivePlayResult', function(data) {
			assert.deepEqual({x:1,y:1,player:{id:5,name:'Player 1'}},data);
			numOfReceivedPlayResults = numOfReceivedPlayResults + 1;

			if (numOfReceivedPlayResults == 2) {
				done();
			}
		});
		
		client2.on('receivePlayResult', function(data) {
			assert.deepEqual({x:1,y:1,player:{id:5,name:'Player 1'}},data);
			numOfReceivedPlayResults = numOfReceivedPlayResults + 1;
	
			if (numOfReceivedPlayResults == 2) {
				done();
			}
		});
	});
	
	it('Send data to Invalid Room', function(done) {
		assert.throws(function() { gameSocketController.SendDataToAllUsersInGame(32132,'This is Data!') }, Error);
		assert.throws(function() { gameSocketController.SendDataToAllUsersInGame(421321,'This is Data!') }, Error);
		done();
	});		
	
});