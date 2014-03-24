window.WEB_SOCKET_SWF_LOCATION = "assets/WebSocketMain.swf";

enyo.singleton({
	name: "ClientServerComm",
	kind: "Object",
	socketURL: "http://localhost:10089",
	initialize: function(userID, callback) {
		var request = new enyo.Ajax({
			url: "initialize", //URL goes here
			method: "GET", //You can also use POST
			handleAs: "json" //options are "json", "text", or "xml"
		});
		var self = this;
		request.response(function(request, response) {
			if(response) {
				self.setupSocket(response.user.userID);
				callback(response);
			}
		}); //tells Ajax what the callback function is
		request.go({userID: userID});
	},
	setupSocket: function(userID) {	
		var s = this.socket = window.io.connect(this.socketURL, {});
		this.socket.on("connect", enyo.bind(this, function() {
			if(userID) {
				s.emit('userSetup', userID);
			}
		}));
		this.socket.on("userSetupComplete", function() {
			enyo.Signals.send("onSocketSetup", {});
		});
		this.socket.on("connect_failed", function() {
			enyo.Signals.send("onSocketFailed", {});
		});
		this.socket.on("matchFound", enyo.bind(this, "matchIsFound"));
		this.socket.on("receivePlayResult", enyo.bind(this, "receivedPlayResult"));
	},
	matchIsFound: function(inEvent) {
		enyo.Signals.send("onMatchFound", {gameboard:inEvent});
	},
	receivedPlayResult: function(inEvent) {
		enyo.Signals.send("onPlayResult", {gameboard:inEvent});
	},
	sendPlayMoveEvent: function(move) {
		if(this.socket) {
			this.socket.emit('receiveMove', move);
		}
	},
	sendChatEvent: function(message) {
		if(this.socket) {
			this.socket.emit('chat', message);
		}
	},
	//request a list of games from the Server
	listGames: function(callback) {
		var request = new enyo.Ajax({
			url: "listOfGames",
			method: "GET",
			handleAs: "json"
		});
		request.response(function(request, response) {
			if(response) {		
				callback(response.games || []);
			}
		});
		request.go();
	},
	queueForGame: function(userID, gameID, callback) {
		//This method is supposed to send an AJAX call
		// to the Server to create a new game (userID, gameID) and use the
		// resulting object from the server to create a game view
		var request = new enyo.Ajax({
			url: "queueForGame", //URL goes here
			method: "GET", //You can also use POST
			handleAs: "json" //options are "json", "text", or "xml"
		});
		request.response(function(request, response) {
			callback(response.err);
		}); //tells Ajax what the callback function is
		request.go({userID: userID, gameID: gameID});		
	},
	createNewGame: function(userid, gameID, callback) {
		//This method is supposed to send an AJAX call
		// to the Server to create a new game (userID, gameID) and use the
		// resulting object from the server to create a game view
		var request = new enyo.Ajax({
			url: "createNewGame", //URL goes here
			method: "GET", //You can also use POST
			handleAs: "json" //options are "json", "text", or "xml"
		});
		request.response(function(request, response) {
			if(response) {
				callback({gameboard:response.gameboard, url:response.url});
			}
		}); //tells Ajax what the callback function is
		request.go({userID: userid, gameID: gameID});		
	},
	joinGame: function(userid, instanceID, callback) {
		//This method is supposed to send an AJAX call
		// to the Server to create a new game (userID, gameID) and use the
		// resulting object from the server to create a game view
		var request = new enyo.Ajax({
			url: "joinGame", //URL goes here
			method: "GET", //You can also use POST
			handleAs: "json" //options are "json", "text", or "xml"
		});
		request.response(function(request, response) {
			if(response) {
				callback({gameboard:response.gameboard, err:response.err});
			}
		}); //tells Ajax what the callback function is
		request.go({userID: userid, instanceID: instanceID});		
	}
});