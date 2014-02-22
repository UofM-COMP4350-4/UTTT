
enyo.kind({
	name: "GameCommController",
	kind: "Component",
	createNewGame: function() {
		//This method is supposed to send an AJAX call
		// to the Server to create a new game and use the
		// resulting object from the server to create a game view
		var request = new enyo.Ajax({
			url: "/createGame", //URL goes here
			method: "GET", //You can also use POST
			handleAs: "text", //options are "json", "text", or "xml"
		});
		this.view.$.createGameButton.setContent("Game Created 1");
		request.response(enyo.bind(this, "createGameResponse")); //tells Ajax what the callback function is
		request.go({});		
	},
  
	createGameResponse: function(inRequest, inResponse) {
		if (!inResponse) return; //if there is nothing in the response then return early.
		//code to handle the response goes here.
	}
});