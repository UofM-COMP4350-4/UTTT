enyo.kind({
	name: "AppController",
	kind: "Component",
	published: {
		menuShowing: true,
		socialShowing: true
	},
	components: [
		{kind:"Signals", onhashchange:"hashChange", onMatchFound:"receivedGameboard", onPlayResult:"updateActive", onkeypress:"checkForChatSubmit", onSocketSetup:"socketIsSetup"}
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
		//window.userID = localStorage.getItem("clientID");
		window.userName = "Player";
		window.availableGames = {};
		window.active = {};
	    window.userID = window.ClientServerComm.initialize(window.userID, enyo.bind(this, function(baseState) {
	    	window.userID = baseState.user.userID;
	    	//localStorage.setItem("clientID", window.userID);
	    	this.log(window.userID + " sent successfully.");
	    	window.userName = baseState.user.userName;
			window.availableGames = baseState.availableGames;
			window.active = baseState.active;
			enyo.stage.menu.controller.loadBaseState();
			if(!window.location.hash ||window.location.hash.length===0 || window.location.hash=="#") {
				this.hideChat();
				enyo.stage.game.controller.showLauncher();
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
		var hash = window.location.hash.slice(1);
		if(hash=="launcher") {
			document.title = "Let's Play - Game Launcher";
			this.hideChat();
			this.showGameArea();
			enyo.stage.game.controller.showLauncher();
		} else if(hash=="invite") {
			document.title = "Let's Play- Invite to Play";
			this.hideChat();
			this.showGameArea();
			enyo.stage.game.controller.showLauncher(true);
		} else if(hash.indexOf("game-")===0) {
			var instanceID = hash.replace("game-", "");
			var gameboard = window.active[instanceID];
			if(gameboard) { // switch to game
				for(var i=0; i<window.availableGames.length; i++) {
					if(window.availableGames[i].gameID==gameboard.gameID) {
						document.title = "Let's Play - " + window.availableGames[i].gameName;
					}
				}
				this.showChat(instanceID);
				this.showGameArea();
				enyo.stage.game.controller.loadGame(gameboard);
			} else { // attempt to join game
				enyo.stage.game.controller.showWaiting("Joining match...");
				var self = this;
				this.joinDeferred = function() {
					window.ClientServerComm.joinGame(window.userID, instanceID, function(response) {
						if(response.gameboard) {
							enyo.Signals.send("onMatchFound", {gameboard:response.gameboard});
							//since hash value is already set, hashChange won't tigger; explicitly load game
							self.showChat(instanceID);
							self.showGameArea();
							enyo.stage.game.controller.loadGame(response.gameboard);
						} else if(response.err) {
							window.location.hash = "launcher";
						}
					});
				};
				if(this.connected) {
					this.joinDeferred();
					this.joinDeferred = undefined;
				}
				
			}
		} else {
			window.location.hash = "launcher";
		}
		return true;
	},
	receivedGameboard: function(inSender, inEvent) {
		if(inEvent && inEvent.gameboard) {
			var gb = inEvent.gameboard;
			if(!window.active[gb.instanceID]) {
				window.active[gb.instanceID] = gb;
				enyo.stage.menu.controller.addGame(gb);
				window.location.hash = "game-" + gb.instanceID;
			} else {
				window.location.hash = "game-" + gb.instanceID;
			}
		}
	},
	updateActive: function(inSender, inEvent) {
		window.active[inEvent.gameboard.instanceID] = inEvent.gameboard;
	},
	showChat: function(instanceID) {
		this.view.$.chatInput.setValue("");
		this.view.$.chatInputDecorator.show();
		enyo.stage.chat.controller.loadChatroom(instanceID);
		enyo.stage.chat.view.show();
	},
	hideChat: function() {
		this.view.$.chatInputDecorator.hide();
		this.view.$.chat.hide();
		enyo.stage.chat.controller.reset();
	},
	chatFocus: function(inSender, inEvent) {
		this.chatFocused = true;
	},
	chatBlur: function(inSender, inEvent) {
		this.chatFocused = false;
	},
	checkForChatSubmit: function(inSender, inEvent) {
		if(inEvent && inEvent.keyCode==13 && this.chatFocused) {
			this.submitMessage();
		}
	},
	submitMessage: function() {
		var msg = this.view.$.chatInput.getValue();
		var instanceID = enyo.stage.chat.controller.instanceID;
		if(msg && msg.length>0 && instanceID) {
			this.view.$.chatInput.setValue("");
			window.ClientServerComm.sendChatEvent({
				message:msg,
				instanceID:instanceID,
				player: {
					id: window.userID,
					name: window.userName
				}
			});
		}
	},
	shareURL: function(url) {
		this.view.$.shareInput.setValue(url);
		this.view.$.shareURL.show();
	},
	showNotification: function(text, callback) {
		this.notificationCallback = callback;
		this.view.$.gameNotificationText.setContent(text);
		this.view.$.gameNotification.show();
	},
	closeNotification: function() {
		this.notificationCallback && this.notificationCallback();
	},
	socketIsSetup: function() {
		this.connected = true;
		if(this.joinDeferred) {
			this.joinDeferred();
			this.joinDeferred = undefined;
		}
	}
});
