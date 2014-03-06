enyo.kind({
	name: "GameView",
	kind: "View",
	controllerKind: "GameController",
	components:[],
	launcher: {kind:"Scroller", classes:"fill", components:[
		{kind:"Repeater", count: 0, onSetupItem:"controller.setupGameGrid", components:[
			{style:"inline-block", ontap:"controller.gameLaunch" components:[
				{kind:"Image"},
				{name:"title", content:"Game"}
			]}
		]}
	]}
});
