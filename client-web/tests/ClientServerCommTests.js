//NOTE: These tests require fakeServer.js to pass

describe("ClientServerComm", function() {
	describe("#initialize()", function() {
		it("should return the initial information needed for a user to play", function(done) {
			window.ClientServerComm.initialize(undefined, function(response) {
				expect(typeof response).toBe("object");
				expect(typeof response.user).toBe("object");
				expect(response.user.userID).toBe(1);
				expect(response.availableGames instanceof Array).toBe(true);
				expect(typeof response.active).toBe("object");
				done();
			});
		});
		it("should also connect the socket", function(done) {
			window.ClientServerComm.initialize(undefined, function(response) {
				expect(typeof window.ClientServerComm.socket).toBe("object");
				done();
			});
		});
	});
	describe("#listGames()", function() {
		it("should list all available games", function(done) {
			window.ClientServerComm.listGames(function(games) {
				expect(games instanceof Array).toBe(true);
				done();
			});
		});
	});
	describe("#queueForGame()", function() {
		it("should be able to queue a user for a match", function(done) {
			window.ClientServerComm.queueForGame(1, 1, function(response) {
				done();
			});
		});
	});
	describe("#createNewGame()", function() {
		it("should return the initial information needed for a user to play", function(done) {
			window.ClientServerComm.createNewGame(1,1, function(response) {
				expect(typeof response).toBe("object");
				expect(typeof response.gameboard).toBe("object");
				expect(typeof response.url).toBe("string");
				expect(response.gameboard.gameID).toBe(1);
				done();
			});
		});
	});
	describe("#joinGame()", function() {
		it("should be prevent a user from joining a full game", function(done) {
			window.ClientServerComm.joinGame(1,1, function(response) {
				expect(typeof response).toBe("object");
				expect(typeof response.err).toBe("object");
				done();
			});
		});
		it("should be able to join an existing game by instanceID", function(done) {
			window.ClientServerComm.createNewGame(1,2, function(response) {
				expect(typeof response).toBe("object");
				expect(typeof response.gameboard).toBe("object");
				expect(response.gameboard.instanceID).toBe(2);
				done();
			});
		});
	});
	describe("[SocketEvent]#userSetupComplete", function() {
		it("should be received when a user is setup on the server", function() {
			window.ClientServerComm.initialize(undefined, function(response) {
				window.ClientServerComm.socket.on("userSetupComplete", function() {
					done();
				});
			})
		});
	});
	describe("[SocketEvent]#matchFound", function() {
		it("should be received when a user is setup into a match", function() {
			window.ClientServerComm.initialize(undefined, function(response) {
				window.ClientServerComm.socket.on("userSetupComplete", function() {
					window.ClientServerComm.queueForGame(1, 1, function(){});
				});
				window.ClientServerComm.socket.on("matchFound", function(response) {
					expect(typeof response).toBe("object");
					done();
				});
			})
		});
	});
	describe("[SocketEvent]#receivePlayResult", function() {
		it("should be received when a user is setup into a match", function() {
			window.ClientServerComm.initialize(undefined, function(response) {
				window.ClientServerComm.socket.on("userSetupComplete", function() {
					window.ClientServerComm.queueForGame(1, 1, function(){});
				});
				window.ClientServerComm.socket.on("matchFound", function(response) {
					window.ClientServerComm.sendPlayMoveEvent({x:2, y:0, instanceID:1, player:{id:1, name:""}});
				});
				window.ClientServerComm.socket.on("receivePlayResult", function(response) {
					expect(typeof response).toBe("object");
					done();
				});
			})
		});
	});
	describe("[SocketEvent]#chat", function() {
		it("should be received when a user sends a chat message or when an opponent does", function() {
			window.ClientServerComm.initialize(undefined, function(response) {
				window.ClientServerComm.socket.on("userSetupComplete", function() {
					window.ClientServerComm.queueForGame(1, 1, function(){});
				});
				window.ClientServerComm.socket.on("matchFound", function(response) {
					window.ClientServerComm.sendChatEvent({message:"Test", instanceID:1, player:{id:1, name:""}});
				});
				window.ClientServerComm.socket.on("chat", function(response) {
					expect(typeof response).toBe("object");
					done();
				});
			})
		});
	});
});