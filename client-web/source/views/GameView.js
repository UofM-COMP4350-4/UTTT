enyo.kind({
	name: "GameView",
	kind: "View",
	controllerKind: "GameController",
	launcher: {kind:"Scroller", classes:"full", components:[
		{name:"grid", classes:"launcher-wrapper centre", kind:"Repeater", count: 0, onSetupItem:"controller.setupGameGrid", components:[
			{classes:"launcher-item", ontap:"controller.gameLaunch", components:[
				{kind:"Image", classes:"launcher-item-icon"},
				{name:"title", content:"Game", classes:"launcher-item-title"}
			]}
		]}
	]},
	waitingProcess: {waiting:true, classes:"centre full", components:[
		{classes:"splash-spacer"},
		{classes:"waiting-splash-title", content:""},
		{style:"height:15px;"},
		{classes:"waiting-splash-spinner"}
	]},
	connectionFailure: {classes:"centre full", components:[
		{classes:"splash-spacer"},
		{classes:"connection-failure", content:"Connection Failure!"}
	]}
});
