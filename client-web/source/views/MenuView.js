enyo.kind({
	name: "MenuView",
	kind: "View",
	controllerKind: "MenuController",
	layoutKind:"FittableRowsLayout",
	components:[
		{fit:true},
		{kind:"onyx.Toolbar", style:"padding-top:4px; padding-bottom:4px; height:46px;", allowHtml:true, content:"&nbsp;"}
	]
});
