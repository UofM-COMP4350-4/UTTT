enyo.kind({
	name: "MenuController",
	kind: "Component",
	loadBaseState: function() {
		this.state = [];
		for(var x in window.active) {
			this.state.push(window.active[x]);
		}
		this.loadGameList();
	},
	addGame: function(gameboard) {
		this.state.push(gameboard);
		this.loadGameList();
	},
	removeGame: function(instanceID) {
		for(var i=0; i<this.state.length; i++) {
			if(instanceID==this.state[i].instanceID) {
				this.state.splice(i, 1);
			}
		}
		this.loadGameList();
	},
	loadGameList: function() {
		this.view.$.repeater.setCount(this.state.length);
		this.view.$.repeater.render();
		this.view.$.drawer.setOpen((this.state.length>0));
	},
	setupActiveGames: function(inSender, inEvent) {
		var index = inEvent.index;
		var item = inEvent.item;
		var gameName = this.getGameName(this.state[index].gameID);
		item.$.lbl1.setContent(gameName);
		item.$.matchLink.setHref("#game-" + this.state[index].instanceID);
		if(this.state[index].players.length>2) {
			item.$.lbl2.setContent("vs " + (this.state[index].players.length-1)
					+ " others");
		} else if(this.state[index].players.length==2) {
			var opponent = this.state[index].players[0];
			if(opponent.id==window.userID) {
				opponent = this.state[index].players[1];
			}
			item.$.lbl2.setContent("vs " + opponent.name);
		}
		return true;
	},
	getGameName: function(gameID) {
		for(var i=0; i<window.availableGames.length; i++) {
			if(window.availableGames[i].gameID==gameID) {
				return window.availableGames[i].gameName;
			}
		}
		return "";
	},
	switchToGame: function(inSender, inEvent) {
		enyo.stage.app.controller.showGameArea();
	},
	newMatch: function(inSender, inEvent) {
		window.location.hash = "launcher";
		//this.waterfall("onNewMatch");
		return true;
	},
	invite: function(inSender, inEvent) {
		window.location.hash = "invite";
		return true;
	}
});
