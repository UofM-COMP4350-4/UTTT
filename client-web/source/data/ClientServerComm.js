enyo.singleton({
	name: "ClientServerComm",
	kind: "Object",
	
	create: function() {
		this.inherited(arguments);
		this.initialize( "Bob", enyo.bind(this, "initCallback"));
	},
	
	initCallback: function(userID) {
		//Sets the user id for this Client to 
		//the userID passed back
		this.log(userID);
	},
	
	//create a list games method
	listGames: function(callback)
	{
		var request = new enyo.Ajax({
			url: "/listOfGames",
			method: "GET",
			handleAs: "json"
		});
		this.log("list of games request sent");
		request.response(enyo.bind(this, "listOfGamesResponse", callback));
		request.go();
	},
	
	listOfGamesResponse: function(request, response, callback)
	{
		if(response == undefined)
			return;
		
		callback(response.games);
	},
	
	queueForGame: function(userID, gameID, callback) {
		//This method is supposed to send an AJAX call
		// to the Server to create a new game (userID, gameID) and use the
		// resulting object from the server to create a game view
		var request = new enyo.Ajax({
			url: "/queueForGame", //URL goes here
			method: "GET", //You can also use POST
			handleAs: "json" //options are "json", "text", or "xml"
		});
		this.view.$.createGameButton.setContent("Game Created 1");
		request.response(enyo.bind(this, "queueResponse", callback)); //tells Ajax what the callback function is
		request.go({userid: userID, gameid: gameID});		
	},
	
	queueResponse: function(request, response, callback){
		callback(response.err);
	},
	
	createNewGame: function(userID, gameID, callback) {
		//This method is supposed to send an AJAX call
		// to the Server to create a new game (userID, gameID) and use the
		// resulting object from the server to create a game view
		var request = new enyo.Ajax({
			url: "/createNewGame", //URL goes here
			method: "GET", //You can also use POST
			handleAs: "json", //options are "json", "text", or "xml"
		});
		this.view.$.createGameButton.setContent("Game Created 1");
		request.response(enyo.bind(this, "createGameResponse", callback)); //tells Ajax what the callback function is
		request.go({userid: userID, gameid: gameID});		
	},
	
	initialize: function(userID, callback) {
		var request = new enyo.Ajax({
			url: "/initialize", //URL goes here
			method: "GET", //You can also use POST
			handleAs: "json", //options are "json", "text", or "xml"
		});
		request.response(enyo.bind(this, "initializeResponse", callback)); //tells Ajax what the callback function is
		request.go({userid: userID});
	},
	
	initializeResponse: function(request, response, callback) {
		if(!response) return;
		
		//Send back the user id passed
		this.log(response);
		callback(response.userID);
	},
	
	createGameResponse: function(request, response, callback) {
		if (!response) return; //if there is nothing in the response then return early.
		//code to handle the response goes here.
		this.log(response);
		callback(response.instanceID, response.url);
	}
});