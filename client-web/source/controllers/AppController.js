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
		window.userName = "Player";
		window.availableGames = {};
		window.active = {};
	    window.userID = window.ClientServerComm.initialize(window.userID, enyo.bind(this, function(baseState) {
	    	window.userID = baseState.user.userID;
	    	localStorage.setItem("clientID", window.userID);
	    	window.ClientServerComm.sendUserSetupEvent(window.userID);
	    	this.log(userID + " sent successfully.");
	    	window.userName = baseState.user.userName;
			window.availableGames = baseState.availableGames;
			window.active = baseState.active;
			//enyo.stage.menu.controller.loadActiveGames();
			if(!window.location.hash ||window.location.hash.length===0 || window.location.hash=="#") {
				// set initial hash location in url
				window.location.hash = "launcher";
			} else {
				this.hashChange();
			}
	    }));
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
	hashChange: function(inSender, inEvent) {
		this.showGameArea();
		var hash = window.location.hash.slice(1);
		if(hash=="launcher") {
			document.title = "NBGI - Game Launcher";
			enyo.stage.game.controller.showLauncher();
		} else if(hash=="invite") {
			document.title = "NBGI - Invite to Play";
			enyo.stage.game.controller.showLauncher(true);
		} else if(hash.indexOf("game-")===0) {
			var instanceID = hash.replace("game-", "");
			var gameboard = window.active[instanceID];
			if(gameboard) { // switch to game
				document.title = "NBGI - " + window.availableGames[inEvent.gameboard.gameID];
				enyo.stage.game.controller.loadGame(gameboard);
			} else { // attempt to join game
				// TODO: attempt to join game and show if joined successfully
			}
		} else {
			window.location.hash = "launcher";
		}
	}
});
