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
		this.lcol_index = -1;
		this.lrow_index = -1;
		this.COL_SIZE = 6;
		this.ROW_SIZE = 7;
		this.row = undefined;
		this.col = undefined;
		
		if (!this.isGBSetup)
		{
			console.log("Hey David GB Setup=true");
			this.isGBSetup = false;
			this.player = 0;
		}

		if (typeof this.isGBSetup !== undefined && this.isGBSetup == false)
		{
			this.board = inSender;
			for (var i = 0; i < 6; i++) {
				inSender.createComponent([{index:i, fit:true,kind:"FittableColumns",ontap:"controller.tapboard"}]);
				var components = inSender.getComponents();
				for (var j = 0; j < 7; j++)
				{
					components[i].createComponent([{index:j, kind: 'ImageView', src:'./../../assets/connectfourwhite.png', style:"width:74px; height:74px", ontap: "controller.tapboard"}]);
				} 
			}
			console.log("printed board");
			this.isGBSetup = true;
		}
		//console.log("Hey David");
		//return true;
	},
	tapboard:function(inSender, inEvent) {
		if (inSender.kind == "FittableColumns")
		{
			console.log("FittableColumns " + inSender.index);
			this.col = inSender;
			this.row_index = inSender.index;
			this.lrow_index = (this.COL_SIZE-1)-this.row_index;
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
			this.lcol_index = this.col_index;
		}
		if (typeof this.col !== undefined && typeof this.row !== undefined && this.col && this.row && typeof this.row_index !== undefined && typeof this.col_index !== undefined)
		{
			if (this.row_index >= 0 && this.col_index >= 0)
			{
				console.log("Hey Steve x: " + this.col_index + " y: " + this.row_index);
				console.log("Hey Steve [logical] x: " + this.lcol_index + " y: " + this.lrow_index);
				var el = this.board.getComponents();
				el = el[this.row_index].getComponents();
				el = el[this.col_index];
				
				this.player = (this.player+1) % 2; //remove this				
				this.playMove(this.lcol_index, this.lrow_index, this.player); //remove this
			}
		}
		inSender.render();
	},
	playMove: function(col_index, row_index, player) 
	{
		var arow_index = (this.COL_SIZE-1)-row_index;
		var acol_index = col_index;
		
		var row_components = this.board.getComponents();
		var row = row_components[arow_index];
		var col_components = row.getComponents();
		var piece = col_components[acol_index];
		console.log(" x: " + acol_index + " y: " + arow_index + " " + player);
		if (player == 0)
		{
			piece.setSrc('./../../assets/connectfourblue.svg');
		}
		else
		{
			piece.setSrc('./../../assets/connectfourred.svg');
		}
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
