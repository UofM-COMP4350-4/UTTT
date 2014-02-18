/**
	For simple applications, you might define all of your views in this file.  
	For more complex applications, you might choose to separate these kind definitions 
	into multiple files under this folder.
*/

enyo.kind({
	name: "MainView",
	kind: "View",
	controllerKind: "MainController",
	layoutKind:"FittableRowsLayout",
	fit: true,
	components:[
		{kind: "onyx.Toolbar", content: "Hello World"},
		{kind: "enyo.Scroller", fit: true, components: [
			{name: "results", classes: "nice-padding", allowHtml: true}
		]},
		{kind: "onyx.Toolbar", components: [
			{kind: "onyx.Button", content: "Test Connect4"},
			{kind: "onyx.Button", content: "Tap me", ontap: "controller.helloWorldTap"}
		]}
	]
});
