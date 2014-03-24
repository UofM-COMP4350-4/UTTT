enyo.kind({
	name: "GameView",
	kind: "View",
	controllerKind: "GameController",
	launcher: {kind:"Scroller", classes:"full", components:[
		{name:"grid", kind:"Repeater", count: 0, onSetupItem:"controller.setupGameGrid", components:[
			{style:"inline-block", ontap:"controller.gameLaunch", components:[
				{kind:"Image"},
				{name:"title", content:"Game"}
			]}
		]}
	]},
	waitingForOpponent: {waiting:true, classes:"waiting-splash full", components:[
		{classes:"waiting-splash-title", content:""},
		{style:"height:15px;"},
		{classes:"waiting-splash-spinner"}
	]},
	connectionFailure: {classes:"full", components:[
		{classes:"connection-failure", content:"Connection Failed!"},
	]}
});
