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
		]},
	],
	row: {classes:"connect4-row"},
	cell: {classes:"connect4-cell"},
	item: {kind:"Connect4Piece"}
});
