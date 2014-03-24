enyo.kind({
	name: "Connect4View",
	kind: "View",
	controllerKind: "Connect4Controller",
	classes: "connect4-wrapper-outer",
	components:[
		{name:"wrapper", classes:"connect4-wrapper-inner", components:[
			{name:"c4Grid", classes:"full"},
			{classes:"connect4-status-wrapper", components:[
				{name:"status", classes:"connect4-status", content:"&nbsp;", allowHtml:true}
			]}
		]}
	],
	row: {style:"width:100%; height:16.6666666667%;"},
	cell: {style:"width:14.2857142857%; height:100%;display:inline-block;"},
	item: {kind:"Connect4Piece"}
});
