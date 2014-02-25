
enyo.kind({
	name: "GameCommController",
	kind: "Component",
	
	create: function() {
		this.inherited(arguments);
		this.initialize( "Bob", enyo.bind(this, "initCallback"));
	},
	
	initCallback: function(userID) {
		//Sets the user id for this Client to 
		//the userID passed back
		this.log(userID);
	},
	
	createNewGame: function() {
		//This method is supposed to send an AJAX call
		// to the Server to create a new game and use the
		// resulting object from the server to create a game view
		var request = new enyo.Ajax({
			url: "/createGame", //URL goes here
			method: "GET", //You can also use POST
			handleAs: "json", //options are "json", "text", or "xml"
		});
		this.view.$.createGameButton.setContent("Game Created 1");
		request.response(enyo.bind(this, "createGameResponse")); //tells Ajax what the callback function is
		request.go({fun: "fun stuff"});		
	},
	
	initialize: function(userid, callback) {
		var request = new enyo.Ajax({
			url: "/initialize", //URL goes here
			method: "GET", //You can also use POST
			handleAs: "json", //options are "json", "text", or "xml"
		});
		request.response(enyo.bind(this, "initializeResponse", callback)); //tells Ajax what the callback function is
		request.go({userID: userid});
	},
	
	initializeResponse: function(request, response, callback) {
		if(!response) return;
		
		//Send back the user id passed
		this.log(response);
		callback(response.userID);
	},
	
	createGameResponse: function(inRequest, inResponse) {
		//if (!inResponse) return; //if there is nothing in the response then return early.
		//code to handle the response goes here.
		this.log(inResponse.data);
	}
});