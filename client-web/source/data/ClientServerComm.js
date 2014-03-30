window.WEB_SOCKET_SWF_LOCATION = "assets/WebSocketMain.swf";

enyo.singleton({
	name: "ClientServerComm",
	kind: "Object",
	host: "http://" + window.location.hostname,
	socketURL: "http://" + window.location.hostname + ":10089",
	initialize: function(userID, callback) {
		var request = new enyo.Ajax({
			url: this.host + "/initialize", //URL goes here
			method: "GET", //You can also use POST
			handleAs: "json" //options are "json", "text", or "xml"
		});
		var self = this;
		request.response(function(request, response) {
			if(response) {
				self.setupSocket(response.user.userID);
				callback(response);
			}
		});
		request.go({userID: userID});
	},
	setupSocket: function(userID) {	
		var s = this.socket = window.io.connect(this.socketURL, {});
		this.socket.on("connect", enyo.bind(this, function() {
			if(userID) {
				s.emit('userSetup', {userID:userID});
			}
		}));
		this.socket.on("userSetupComplete", function() {
			// forward socket event up through top-level Enyo signal events
			enyo.Signals.send("onSocketSetup", {});
		});
		this.socket.on("connect_failed", function() {
			// forward socket event up through top-level Enyo signal events
			enyo.Signals.send("onSocketFailed", {});
		});
		this.socket.on("matchFound", enyo.bind(this, "matchIsFound"));
		this.socket.on("receivePlayResult", enyo.bind(this, "receivedPlayResult"));
		this.socket.on("chat", enyo.bind(this, "receivedChat"));
	},
	matchIsFound: function(inEvent) {
		// forward socket event up through top-level Enyo signal events
		enyo.Signals.send("onMatchFound", {gameboard:inEvent});
	},
	receivedPlayResult: function(inEvent) {
		// forward socket event up through top-level Enyo signal events
		enyo.Signals.send("onPlayResult", {gameboard:inEvent});
	},
	receivedChat: function(inEvent) {
		// forward socket event up through top-level Enyo signal events
		enyo.Signals.send("onChat", inEvent);
	},
	sendPlayMoveEvent: function(move) {
		if(this.socket) {
			this.socket.emit('receiveMove', move);
		}
	},
	sendChatEvent: function(message) {
		if(this.socket) {
			message.timestamp = (new Date().getTime()*1);
			this.socket.emit('chat', message);
		}
	},
	//request a list of games from the Server
	listGames: function(callback) {
		var request = new enyo.Ajax({
			url: this.host + "/listOfGames",
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
		var request = new enyo.Ajax({
			url: this.host + "/queueForGame", //URL goes here
			method: "GET", //You can also use POST
			handleAs: "json" //options are "json", "text", or "xml"
		});
		request.response(function(request, response) {
			callback(response.err);
		}); //tells Ajax what the callback function is
		request.go({userID: userID, gameID: gameID});		
	},
	createNewGame: function(userid, gameID, callback) {
		var request = new enyo.Ajax({
			url: this.host + "/createNewGame", //URL goes here
			method: "GET", //You can also use POST
			handleAs: "json" //options are "json", "text", or "xml"
		});
		request.response(function(request, response) {
			if(response) {
				callback({gameboard:response.gameboard, url:response.url});
			}
		});
		request.go({userID: userid, gameID: gameID});		
	},
	joinGame: function(userid, instanceID, callback) {
		var request = new enyo.Ajax({
			url: this.host + "/joinGame", //URL goes here
			method: "GET", //You can also use POST
			handleAs: "json" //options are "json", "text", or "xml"
		});
		request.response(function(request, response) {
			if(response) {
				callback({gameboard:response.gameboard, err:response.err});
			}
		});
		request.go({userID: userid, instanceID: instanceID});		
	}
});
window.ClientServerComm.host = "http://ec2-54-186-37-75.us-west-2.compute.amazonaws.com";
window.ClientServerComm.socketURL = "http://ec2-54-186-37-75.us-west-2.compute.amazonaws.com:10089";
