enyo.kind({
	name: "AppController",
	kind: "Component",
	published: {
		menuShowing: true,
		socialShowing: true
	},
	components: [
		{kind:"Signals", onhashchange:"hashChange"}
	],
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
		//if the client has a userID, do nothing
		//else send an initialize request to the database
		window.userID = localStorage.getItem("clientID");
	    window.userID = window.ClientServerComm.initialize(window.userID, function(baseState) {
	    	window.userID = baseState.user.userID;
	    	localStorage.setItem("clientID", window.userID);
	    	window.userName = baseState.user.userName;
			delete baseState.user;
			window.availableGames = baseState.availableGames;
			delete baseState.availableGames;
			enyo.stage.menu.controller.loadActiveGames(baseState);
	    });
	},		
	toggleMenu: function() {
		this.setMenuShowing(!this.menuShowing);
		return true;
	},
	toggleSocial: function() {
		this.setSocialShowing(!this.socialShowing);
		return true;
	},
	showGameArea: function() {
		if(this.narrowFit) {
			this.setMenuShowing(false);
			this.setSocialShowing(false);
		}
	},
	menuShowingChanged: function() {
		if(this.menuShowing) {
			if(this.narrowFit) {
				this.view.$.lowerPanels.setIndexDirect(0);
			}
			this.view.$.upperPanels.setIndex(0);
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
			if(this.narrowFit) {
				this.view.$.upperPanels.setIndexDirect(1);
			}
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
	},
	loadGame: function(inSender, inEvent) {
		this.showGameArea();
		document.title = "NBGI - " + window.availableGames[inEvent.gameboard.gameID];
		// TODO hash code update/handling
		enyo.stage.game.controller.loadGame(inEvent.gameboard);
		return true;
	},
	showLauncher: function(inSender, inEvent) {
		this.showGameArea();
		document.title = "NBGI - Game Launcher";
		// TODO hash code update/handling
		enyo.stage.game.controller.showLauncher(inEvent.mode);
	},
	hashChange: function(inSender, inEvent) {
		// TODO
	}
});
