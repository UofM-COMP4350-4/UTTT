enyo.kind({
	name: "GameController",
	kind: "Component",
	showLauncher: function(inviteMode) {
		this.inviteMode = inviteMode;
		this.gamesList = [];
		for(var x in window.availableGames) {
			this.gamesList.push({gameID:x, gameName:window.availableGames[x]});
		}
		if(this.active) {
			this.active.destroy();
		}
		this.active = this.view.createComponent(this.view.launcher);
		this.active.render();
		this.view.$.grid.setCount(this.gamesList.length);
		this.view.$.grid.render();
	},
	tapitem:function(inSender, inEvent) {
		//inSender.setSrc("./../../assets/connectfourblue.svg");
		//inSender.render();
		//this.render();
	},
	setupBoard:function(inSender, inEvent)
	{
		this.col_index = -1;
		this.row_index = -1;
		this.row = undefined;
		this.col = undefined;
	},
	tapboard:function(inSender, inEvent) {
		if (inSender.kind == "FittableColumns")
		{
			console.log("FittableColumns " + inSender.index);
			this.col = inSender;
			this.row_index = inSender.index;
		}
		else if (inSender.kind == "FittableRows")
		{
			console.log("FittableRows");
			this.row = inSender;
		}
		else if (inSender.kind == "ImageView")
		{
			console.log("ImageView " + inSender.index);
			this.col_index = inSender.index;
		}
		if (typeof this.col !== undefined && typeof this.row !== undefined && this.col && this.row && typeof this.row_index !== undefined && typeof this.col_index !== undefined)
		{
			if (this.row_index >= 0 && this.col_index >= 0)
			{
				console.log("Hey Steve x: " + this.col_index + " y: " + this.row_index);
				var el = this.row.getComponents();
				el = el[this.row_index].getComponents();
				el = el[this.col_index];
				el.setSrc('./../../assets/connectfourblue.svg');
			}
		}
		inSender.render();
	},
	loadGame: function(gameboard) {
		this.instanceID = gameboard.instanceID;
		this.createGame(gameboard.gameID).load(gameboard);
	},
	createGame: function(gameID) {
		if(this.active) {
			this.active.destroy();
		}
		this.active = this.view.createComponent({kind:gameID + "View", classes:"full"});
		this.active.render();
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
