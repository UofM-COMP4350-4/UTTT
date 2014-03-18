enyo.kind({
	name: "GameController",
	kind: "Component",
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
		item.$.image.setSrc("assets/" + window.availableGames[index].gameID + "-icon.png");
		item.$.title.setContent(window.availableGames[index].gameName);
		return true;
	},
	gameLaunch: function(inSender, inEvent) {
		var gameType = window.availableGames[inEvent.index].gameType;
		this.createGame(gameType);
		if(!this.inviteMode) {
			window.ClientServerComm.queueForGame(window.userID, gameID, enyo.bind(this, function(response) {
				// TODO
			}));
		} else {
			window.ClientServerComm.createNewGame(window.userID, gameID, enyo.bind(this, function(response) {
				// TODO: popup dialog giving url to share
			}));
		}
	}
});
