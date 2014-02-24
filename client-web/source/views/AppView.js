enyo.kind({
	name: "AppView",
	kind: "View",
	controllerKind: "AppController",
	components:[
		{name:"upperPanels", kind: "Panels", index:0, arrangerKind: "CollapsingArranger", draggable:true, realtimeFit: true, wrap: false, classes:"panels enyo-fit", draggable:false, onTransitionFinish:"controller.upperTransition", components:[
			{classes:"menu-container"},
			{name:"lowerPanels", kind:"Panels", index:1, arrangerKind: "CollapsingRightArranger", wrap: false, realtimeFit: true, classes:"main-container enyo-border-box", draggable:false, onTransitionFinish:"controller.lowerTransition", components:[
				{layoutKind:"FittableRowsLayout", components:[
					{classes:"game-container"},
					{classes:"chat-container"}
				]},
				{classes:"social-container"}
			]}
			
		]}
	]
});
