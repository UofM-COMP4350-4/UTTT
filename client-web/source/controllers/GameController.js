enyo.kind({
	name: "GameController",
	kind: "Component",
	showLauncher: function(mode) {
		this.gamesList = [];
		for(var x in window.availableGames) {
			this.gamesList.push({gameID:x, gameName:window.availableGames[x]});
		}
		if(this.active) {
			this.active.destroy();
		}
		this.active = this.view.createComponent(this.view.launcher);
		this.active.render();
		this.active.$.repeater.setCount(this.gamesList.length);
		this.active.$.repeater.render();
	},
	loadGame: function(gameboard) {
		this.instanceID = gameboard.instanceID;
		this.createGame(gameboard.gameID).load(gameboard);
	},
	createGame: function(gameID) {
		if(this.active) {
			this.active.destroy();
		}
		this.active = this.view.createComponent({kind:gameboard.gameID + "View", classes:"fill"});
		this.active.render();
		this.createGame(gameboard.gameID);
		return this.active;
	},
	setupGameGrid: function(inSender, inEvent) {
		var index = inEvent.index;
		var item = inEvent.item;
		item.$.image.setSrc("assets/" + this.gamesList[index].gameID + "-icon.png");
		item.$.title.setContent(this.gamesList[index].gameName);
		return true;
	},
	gameLaunch: function(inSender, inEvent) {
		var gameID = this.gamesList[inEvent.index].gameID;
		this.createGame(gameID);
		if(mode==="newMatch") {
			ClientServerComm.queueForGame(window.userID, gameID, enyo.bind(this, function(response) {
				// TODO
			}));
		} else if (mode==="invite") {
			ClientServerComm.createNewGame(window.userID, gameID, enyo.bind(this, function(response) {
				// TODO: popup dialog giving url to share
			}));
		}
	}
});
