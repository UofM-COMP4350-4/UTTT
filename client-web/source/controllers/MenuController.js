enyo.kind({
	name: "MenuController",
	kind: "Component",
	events: {
		onLoadGame: "",
		onShowLauncher: ""
	},
	loadBaseState: function(baseState) {
		this.state = [];
		for(var x in baseState) {
			this.state.push(baseState[x]);
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
		this.view.$.drawer.setOpen((this.state.length>0));
		this.view.$.repeater.setCount(this.state.length);
		this.view.$.repeater.render();
	},
	setupActiveGames: function(inSender, inEvent) {
		var index = inEvent.index;
		var item = inEvent.item;
		var gameName = window.availableGames[this.state[index].gameID];
		item.$.lbl1.setContent(gameName);
		if(this.state[index].players.length>2) {
			item.$.lbl2.setContent("vs " + (this.state[index].players.length-1)
					+ " others");
		} else if(this.state[index].players.length==2) {
			var opponent = this.state[index].players[0];
			if(opponent.userID==window.userID) {
				opponent = this.state[index].players[1];
			}
			item.$.lbl2.setContent("vs " + opponent.userName);
		}
		return true;
	},
	openMatch: function(inSender, inEvent) {
		this.doLoadGame({gameboard:this.state[inEvent.index]});
		return true;
	},
	newMatch: function(inSender, inEvent) {
		this.doShowLauncher({mode:"newMatch"});
		return true;
	},
	invite: function(inSender, inEvent) {
		this.doShowLauncher({mode:"invite"});
		return true;
	}
});
