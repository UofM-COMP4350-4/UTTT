enyo.kind({
	name: "DebugConnect4View",
	kind: "View",
	controllerKind,: "MainController",
	layoutKind:"FittableRowsLayout",
	fit:true;
	components:[
		{kind: "onyx.Toolbar", content: "Hello World"},
		{kind: "enyo.Scroller", fit: true, components: [
			{name: "results", classes: "nice-padding", allowHtml: true}
		]},
		{kind: "onyx.Toolbar", components: [
			{kind: "onyx.Button", content: "Run Connect4 Tests", ontap: "controller.helloWorldTap"}
		]}
	]
});
