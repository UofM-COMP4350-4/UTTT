enyo.kind({
	name: "MenuController",
	kind: "Component",
	loadBaseState: function() {
		this.state = [];
		// convert into an array of gmeboards for indexed usage
		for(var x in window.active) {
			this.state.push(window.active[x]);
		}
		this.loadGameList();
	},
	// add a new active game to the list
	addGame: function(gameboard) {
		this.state.push(gameboard);
		this.loadGameList();
	},
	// update an active game in the list
	updateGame: function(gameboard) {
		for(var i=0; i<this.state.length; i++) {
			if(gameboard.instanceID==this.state[i].instanceID) {
				this.state[i] = gameboard;
				// re-render updated row
				this.view.$.repeater.renderRow(i);
			}
		}
		this.loadGameList();
	},
	// remove an active game from the list
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
		//open the drawer after rendering for smoother animation
		this.view.$.drawer.setOpen((this.state.length>0));
	},
	setupActiveGames: function(inSender, inEvent) {
		var index = inEvent.index;
		var item = inEvent.item;
		var gameName = this.getGameName(this.state[index].gameID);
		item.$.lbl1.setContent(gameName);
		item.$.matchLink.setHref("#game-" + this.state[index].instanceID);
		if(this.state[index].players.length>2) {
			// for games with more than 2 players, just label # of opponents
			item.$.lbl2.setContent("vs " + (this.state[index].players.length-1)
					+ " others");
		} else if(this.state[index].players.length==2) {
			// games with 2 players in it, label opponent's name
			var opponent = this.state[index].players[0];
			if(opponent.id==window.userID) {
				opponent = this.state[index].players[1];
			}
			item.$.lbl2.setContent("vs " + this.getUserName(opponent));
		}
		return true;
	},
	getUserName: function(player) {
		var name = "Player"; //default name
		if(player && player.id) {
			if(player.id==window.userID) {
				if(player.name && player.name.length>0) {
					name = player.name;
					if(player.name!=window.userName) {
						window.userName = player.name;
					}
				}
			} else {
				name = "Opponent"; //default opponent name
				if(player.name && player.name.length>0 && player.name!="Player") {
					name = player.name;
				}
			}
		}
		return name;
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
		//switch to game panel on narrow screen devices
		enyo.stage.app.controller.showGameArea();
	},
	newMatch: function(inSender, inEvent) {
		window.location.hash = "launcher";
		return true;
	},
	invite: function(inSender, inEvent) {
		window.location.hash = "invite";
		return true;
	}
});
