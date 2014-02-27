enyo.kind({
	name: "AppView",
	kind: "View",
	controllerKind: "AppController",
	components:[
		{name:"upperPanels", kind: "Panels", index:0, arrangerKind: "CollapsingArranger", realtimeFit: false, wrap: false, classes:"panels enyo-fit", draggable:false, onTransitionFinish:"controller.upperTransition", components:[
			{name:"menu", kind:"MenuView", classes:"menu-container"},
			{name:"lowerPanels", kind:"Panels", index:1, arrangerKind: "CollapsingRightArranger", wrap: false, realtimeFit: true, classes:"main-container enyo-border-box", draggable:true, onTransitionFinish:"controller.lowerTransition", components:[
				{layoutKind:"FittableRowsLayout", fit:true, components:[
					{name:"game", kind:"GameView", classes:"game-container", fit:true},
					{name:"chat", kind:"ChatView", classes:"chat-container"},
					{kind:"onyx.Toolbar", style:"padding-top:4px; padding-bottom:4px;", components:[
						{kind:"onyx.IconButton", src:"assets/onyx-profile.png", ontap:"controller.toggleSocial", style:"float:right"},
						{kind:"onyx.IconButton", src:"assets/onyx-menu.png", ontap:"controller.toggleMenu"}
						
					]}
				]},
				{name:"social", kind:"SocialView", classes:"social-container"}
			]}
			
		]}
	]
});
