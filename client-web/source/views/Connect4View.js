enyo.kind({
	name: "Connect4View",
	kind: "View",
	controllerKind: "Connect4Controller",
	COL_SIZE: 7,
	components:[
			{name:"c4Grid", style:"width:100%; height:100%;",}
	],
	row: {style:"width:100%; height:16.6666666667%;"},
	cell: {style:"width:14.2857142857%; height:100%;display:inline-block;"},
	item: {kind:"Image", style:"width:100%; height:100%;", src:""}
});

