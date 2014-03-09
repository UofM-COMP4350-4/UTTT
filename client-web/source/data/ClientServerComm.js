enyo.singleton({
	name: "ClientServerComm",
	kind: "Object",
	
	create: function() {
		this.inherited(arguments);
		//this.initialize( "1", enyo.bind(this, "initCallback"));
	},
	
	//request a list of games from the Server
	listGames: function(callback)
	{
		var request = new enyo.Ajax({
			url: "listOfGames",
			method: "GET",
			handleAs: "json"
		});
		//this.log("list of games request sent");
		request.response(enyo.bind(this, "listOfGamesResponse", callback));
		request.go();
	},
	
	listOfGamesResponse: function(callback, request, response)
	{
		this.log("response received");
		if(response)
		{		
			this.log(response);
			callback(response.games);
		}
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
		this.view.$.createGameButton.setContent("Game Created 1");
		request.response(enyo.bind(this, "queueResponse", callback)); //tells Ajax what the callback function is
		request.go({userid: userID, gameid: gameID});		
	},
	
	queueResponse: function(callback, request, response){
		callback(response.err);
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
		this.view.$.createGameButton.setContent("Game Created 1");
		request.response(enyo.bind(this, "createGameResponse", callback)); //tells Ajax what the callback function is
		request.go({userID: userid, gameid: gameID});		
	},
	
	initialize: function(userID, callback) {
		var request = new enyo.Ajax({
			url: "initialize", //URL goes here
			method: "GET", //You can also use POST
			handleAs: "json" //options are "json", "text", or "xml"
		});
		request.response(enyo.bind(this, "initializeResponse", callback)); //tells Ajax what the callback function is
		request.go({userid: userID});
	},
	
	initializeResponse: function(callback, request, response) {
		if(response)
		{
			this.log('Server responded with userID: ' + response.user.userID);
			callback(response);
		}		
	},
	
	createGameResponse: function(callback, request, response) {
		if (response) 
		{
			this.log(response);
			callback(response.instanceID, response.url);
		}		
	}
});