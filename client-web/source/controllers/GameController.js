enyo.kind({
	name: "GameController",
	kind: "Component",
	components:[
		{kind:"Signals", onSocketSetup:"socketIsSetup", onSocketFailed:"socketFailure"}
	],
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
	loadGame: function(gameboard) {
		this.instanceID = gameboard.instanceID;
		var gameType;
		for(var i=0; i<window.availableGames.length; i++) {
			if(window.availableGames[i].gameID==gameboard.gameID) {
				gameType = window.availableGames[i].gameType;
				break;
			}
		}
		if(gameType) {
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
	setupGameGrid: function(inSender, inEvent) {
		var index = inEvent.index;
		var item = inEvent.item;
		item.$.image.setSrc("assets/" + window.availableGames[index].gameType + ".gif");
		item.$.title.setContent(window.availableGames[index].gameName);
		return true;
	},
	gameLaunch: function(inSender, inEvent) {
		var gameType = window.availableGames[inEvent.index].gameType;
		var gameID = window.availableGames[inEvent.index].gameID;
		if(this.active) {
			this.active.destroy();
		}
		if(!this.inviteMode) {
			this.view.waitingProcess.components[1].content="Searching for opponent...";
			this.pendingCallback = function() {
				window.ClientServerComm.queueForGame(window.userID, gameID, function() {});
			};
		} else {
			this.view.waitingProcess.components[1].content="Setting up match...";
			this.pendingCallback = function() {
				window.ClientServerComm.createNewGame(window.userID, gameID, function(response) {
					enyo.Signals.send("onMatchFound", {gameboard:response.gameboard, url:response.url});
				});
			};
		}
		this.active = this.view.createComponent(this.view.waitingProcess);
		this.active.render();
		if(this.socketSetup) {
			this.pendingCallback();
			this.pendingCallback = undefined;
		}
	},
	socketIsSetup: function(inSender, inEvent) {
		this.socketSetup = true;
		if(this.pendingCallback) {
			this.pendingCallback();
			this.pendingCallback = undefined;
		}
	},
	socketFailure: function(inSender, inEvent) {
		this.socketSetup = true;
		if(this.active) {
			this.active.destroy();
		}
		this.active = this.view.createComponent(this.view.connectionFailure);
		this.active.render();
	}
});
