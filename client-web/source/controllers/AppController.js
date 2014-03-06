//var ValidateObjectController = require("../../../server/controllers/ValidateObjectController.js");
enyo.kind({
	name: "AppController",
	kind: "Component",
	published: {
		menuShowing: true,
		socialShowing: true
	},
	create:function() {
		this.inherited(arguments);
		this.narrowFit = enyo.Panels.isScreenNarrow();
		if(this.narrowFit) {
			this.socialShowing = false;
			this.view.$.lowerPanels.setIndexDirect(0);
			this.view.$.upperPanels.realtimeFit = false;
			this.view.$.lowerPanels.realtimeFit = false;
		}
		this.log("Client started");
		this.initializeClient();
	},		
	initializeClient: function() {
		//if the client has a userID, do nothing
		//else send an initialize request to the database
		var clientID = localStorage.getItem('clientID');
		
		if(!clientID || typeof clientID == 'undefined' || clientID == 'undefined'){
			this.log("The client does not have a user id");
			window.ClientServerComm.initialize(undefined, function(newClientID){
				localStorage.setItem('clientID', newClientID);
			});
		}
		else
		{
			this.log("The client has a user id " + clientID);
		}
	},	
	toggleMenu: function() {
		this.setMenuShowing(!this.menuShowing);
		return true;
	},
	toggleSocial: function() {
		this.setSocialShowing(!this.socialShowing);
		return true;
	},
	menuShowingChanged: function() {
		if(this.menuShowing) {
			this.view.$.upperPanels.setIndex(0);
			if(this.narrowFit) {
				this.view.$.lowerPanels.setIndexDirect(0);
			}
		} else {
			if(this.narrowFit) {
				this.view.$.lowerPanels.setIndexDirect(0);
			}
			this.view.$.upperPanels.setIndex(1);
		}
	},
	socialShowingChanged: function() {
		if(this.socialShowing) {
			this.view.$.lowerPanels.setIndex(1);
		} else {
			this.view.$.lowerPanels.setIndex(0);
		}
	},
	upperTransition: function(inSender, inEvent) {
		this.menuShowing = (inEvent.toIndex===0);
		return true;
	},
	lowerTransition: function(inSender, inEvent) {
		this.socialShowing = (inEvent.toIndex===1);
		if(this.narrowFit && !this.menuShowing) {
			this.view.$.upperPanels.setIndexDirect(1);
		}
		return true;
	},
	draggingHandler: function(inSender, inEvent) {
		this.view.$.lowerPanels.draggable = (inEvent.clientX > (enyo.dom.getWindowWidth()/2));
	}
});
