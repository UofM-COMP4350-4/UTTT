/**
	For simple applications, you might define all of your views in this file.  
	For more complex applications, you might choose to separate these kind definitions 
	into multiple files under this folder.
*/

enyo.kind({
	name: "MainController",
	kind: "Component",
	helloWorldTap: function(inSender, inEvent) {
		var player1 = new Player(1,"Player1");
		var player2 = new Player(2,"Player2");
		var GameBoard = new Connect4();
		
		//this.view.$.results.addContent("The button was tapped.<br/>");
	}
});
