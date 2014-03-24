enyo.kind({
	name: "AppView",
	kind: "View",
	controllerKind: "AppController",
	classes: "app",
	components:[
		{name:"upperPanels", kind: "Panels", index:0, arrangerKind: "CollapsingArranger", realtimeFit: true, wrap: false, classes:"panels enyo-fit app", draggable:true, onTransitionFinish:"controller.upperTransition", components:[
			{name:"menu", kind:"MenuView", classes:"menu-container"},
			{name:"lowerPanels", kind:"Panels", index:1, arrangerKind: "CollapsingRightArranger", wrap: false, realtimeFit: true, classes:"main-container enyo-border-box app", draggable:true, onTransitionFinish:"controller.lowerTransition", components:[
				{layoutKind:"FittableRowsLayout", fit:true, ondragstart:"controller.draggingHandler", components:[
					{name:"game", kind:"GameView", classes:"game-container", fit:true},
					{name:"chat", kind:"ChatView", classes:"chat-container"},
					{kind:"onyx.Toolbar", style:"padding-top:4px; padding-bottom:4px;", layoutKind:"FittableColumnsLayout", components:[
						{kind:"onyx.IconButton", src:"assets/onyx-menu.png", style:"height:32px", ontap:"controller.toggleMenu"},
						{style:"padding:1px 5px 2px 5px;text-align:center;", fit:true, components:[
							{name:"chatInputDecorator", kind: "onyx.InputDecorator", alwaysLooksFocused:true, style:"max-width:1000px;width:90%;", layoutKind:"FittableColumnsLayout", components: [
								{name:"chatInput", kind: "onyx.Input", fit:true},
								{kind:"onyx.IconButton", style:"height:32px; width:32px; padding:0; margin-top:-6px !important; margin-bottom:-8px !important;", src:"assets/onyx-chat.png", ontap:"controller.submitMessage"}
							]}
						]},
						{kind:"onyx.IconButton", src:"assets/onyx-profile.png", style:"height:32px", ontap:"controller.toggleSocial"}
					]}
				]},
				{name:"social", kind:"SocialView", classes:"social-container social-shadow"}
			]}
			
		]}
	]
});
