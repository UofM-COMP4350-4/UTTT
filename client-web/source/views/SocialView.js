enyo.kind({
	name: "SocialView",
	kind: "View",
	controllerKind: "SocialController",
	layoutKind:"FittableRowsLayout",
	components:[
		{fit:true, components:[
			{style:"position:relative; top: 50%; margin-top: -0.5em; color:silver; text-align:center;", content:"Login Coming Soon"}
		]},
		{kind:"onyx.Toolbar", style:"padding-top:4px; padding-bottom:4px; height:46px;", allowHtml:true, content:"&nbsp;"}
	]
});
