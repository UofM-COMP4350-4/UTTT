enyo.kind({
	name: "GameView",
	kind: "View",
	controllerKind: "GameController",
	components:[
		{fit:true, components: [
			{kind: 'FittableRows', components:[
           {name: 'header', kind: 'onyx.Toolbar', components: [
                {kind: "onyx.Button", content: "Load content", ontap:"tapload"} 
           ]},
           {name:'board', kind: 'FittableRows', fit:true, onload:"controller.setupBoard", ontap:"controller.tapboard"}
      ]}
		]}
	],
	launcher: {kind:"Scroller", classes:"full", components:[
		{name:"grid", kind:"Repeater", count: 0, onSetupItem:"controller.setupGameGrid", components:[
			{style:"inline-block", ontap:"controller.gameLaunch", components:[
				{kind:"Image"},
				{name:"title", content:"Game"}
			]}
		]}
	]},
	tapload:function(inSender, inEvent) {
		//enyo.Signals.send("loadgame");
		this.$.board.bubble("onload");
		console.log("Yo");
    /*for (var i = 0; i < 6; i++) {
    	this.$.board.createComponent([{index:i, fit:true,kind:"FittableColumns",ontap:"controller.tapboard"}]);
    	var components = this.$.board.getComponents();
    	for (var j = 0; j < 7; j++)
    	{
    		components[i].createComponent([{index:j, kind: 'ImageView', src:'./../../assets/connectfourwhite.png', style:"width:74px; height:74px", ontap: "controller.tapboard"}]);
    	} 
  	}*/
    this.$.board.render();
    this.render(); 
   }  
});
