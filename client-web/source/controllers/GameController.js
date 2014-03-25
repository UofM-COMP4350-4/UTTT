enyo.kind({
	name: "GameController",
	kind: "Component",
	components:[
		{kind:"Signals", onSocketSetup:"socketIsSetup", onSocketFailed:"socketFailure"}
	],
	// shows game launcher in random-queue (default) mode, or invite-friends mode
	showLauncher: function(inviteMode) {
		this.inviteMode = inviteMode;
		if(this.active) {
			this.active.destroy();
		}
		this.active = this.view.createComponent(this.view.launcher);
		this.active.render();
		this.view.$.grid.setCount(window.availableGames.length);
		this.view.$.grid.render();
	},
	// load desired gameboard into the view in its gametype-specific view
	loadGame: function(gameboard) {
		this.instanceID = gameboard.instanceID;
		var gameType;
		// look for desired gametype from the gameID passed
		for(var i=0; i<window.availableGames.length; i++) {
			if(window.availableGames[i].gameID==gameboard.gameID) {
				gameType = window.availableGames[i].gameType;
				break;
			}
		}
		if(gameType) {
			// create the gametype's view, render it into place, and load the gameboard data
			this.createGame(gameType).controller.load(gameboard);
		}
	},
	createGame: function(gameType) {
		if(this.active) {
			this.active.destroy();
		}
		this.active = this.view.createComponent({name:enyo.uncap(gameType), kind:gameType + "View", classes:"full"});
		this.active.render();
		return this.active;
	},
	// setup the launcher grid item(s)
	setupGameGrid: function(inSender, inEvent) {
		var index = inEvent.index;
		var item = inEvent.item;
		item.$.image.setSrc("assets/" + window.availableGames[index].gameType + ".gif");
		item.$.title.setContent(window.availableGames[index].gameName);
		return true;
	},
	// user has chosen a game from the launcher
	gameLaunch: function(inSender, inEvent) {
		var gameType = window.availableGames[inEvent.index].gameType;
		var gameID = window.availableGames[inEvent.index].gameID;
		if(!this.inviteMode) {
			// queue for random match
			this.showWaiting("Searching for opponent...");
			this.pendingCallback = function() {
				window.ClientServerComm.queueForGame(window.userID, gameID, function() {});
			};
		} else {
			// create new game with just this user in it
			this.showWaiting("Setting up match...");
			this.pendingCallback = function() {
				window.ClientServerComm.createNewGame(window.userID, gameID, function(response) {
					enyo.Signals.send("onMatchFound", {gameboard:response.gameboard, url:response.url});
				});
			};
		}
		// check if socket connect/user-setup is complete
		if(this.socketSetup) {
			this.pendingCallback();
			this.pendingCallback = undefined;
		}
	},
	// Shows a generic spinner screen with a message
	showWaiting: function(message) {
		if(this.active) {
			this.active.destroy();
		}
		this.view.waitingProcess.components[1].content = message;
		this.active = this.view.createComponent(this.view.waitingProcess);
		this.active.render();
	},
	// event back from the socket that the user is connected and setup in the system
	socketIsSetup: function(inSender, inEvent) {
		this.socketSetup = true;
		if(this.pendingCallback) {
			// execute any pending commands for smooth transition
			this.pendingCallback();
			this.pendingCallback = undefined;
		}
	},
	// socket connect failed
	socketFailure: function(inSender, inEvent) {
		this.socketSetup = true;
		if(this.active) {
			this.active.destroy();
		}
		this.active = this.view.createComponent(this.view.connectionFailure);
		this.active.render();
	}
});
