/**
	For simple applications, you might define all of your views in this file.  
	For more complex applications, you might choose to separate these kind definitions 
	into multiple files under this folder.
*/

enyo.kind({
	name: "SamMainView",
	kind: "View",
	controllerKind: "GameCommController",
	layoutKind:"FittableRowsLayout",
	fit: true,
	components:[
		{kind: "onyx.Toolbar", content: "Hello world"},
		{kind: "onyx.Toolbar", components: 
		[
			{name: "createGameButton", kind: "onyx.Button", 
			content: "Create New Game", ontap: "controller.createNewGame"}
		]}
	]
});