enyo.kind({
	name: "Connect4Controller",
	kind: "Component",
	COL_SIZE: 7,
	ROW_SIZE: 6,
	components:[
		{kind:"Signals", onPlayResult:"handleUpdateReceived"}
	],
	create:function() {
	    this.inherited(arguments);
	    this.gameboard = {currentBoard:[]};
	    this.moves = this.gameboard.currentBoard;
	},
	load: function(gameboard) {
		if(gameboard) {
			this.gameboard = gameboard;
			this.moves = gameboard.currentBoard;
			this.maxPlayers = this.getMaxPlayers();
		}
		for(var i=0; i<this.ROW_SIZE; i++) {
			var row = enyo.clone(this.view.row);
			row.components = [];
			for(var j=0; j<this.COL_SIZE; j++) {
				var cell = enyo.clone(this.view.cell);
				cell.x = j;
				cell.y = ((this.ROW_SIZE-1)-i);
				cell.components = [enyo.clone(this.view.item)];
				cell.components[0].name = "piece-" + cell.x + "-" + cell.y;
				cell.ontap = "controller.columnSelected";
				row.components.push(cell);
			}
			var c = this.view.$.c4Grid.createComponent(row);
		}
		this.update();
		this.view.$.c4Grid.render();
		if(gameboard.players.length==1) {
			// user just created a new game
			//TODO: show popup with copyable URL in it
			this.view.$.status.setContent("Waiting for opponent...");
		} else if(gameboard.players.length<this.maxPlayers) {
			
		}
	},
	update: function(gameboard, animateLast) {
		if(gameboard) {
			this.gameboard = gameboard;
			this.moves = gameboard.currentBoard;
			this.maxPlayers = this.getMaxPlayers();
		}
		var self = this;
		var asyncStatusUpdate = function() {
			if(self.view.$.status) {
				self.view.$.status.setContent(self.getUserName(self.gameboard.userToPlay) + "'s turn");
			}
			self.timerID=undefined;
		};
		for(var i=0; i<this.moves.length; i++) {
			var piece = this.view.$.c4Grid.$["piece-" + this.moves[i].x + "-" + this.moves[i].y];
			if(i==this.moves.length-1 && animateLast) {
				piece.setPiece();
				piece.animateIn(this.moves[i].player.id);
				// delay updating status to better align with animation
				this.timerID = setTimeout(asyncStatusUpdate, 1100);
			} else {
				piece.setPiece(this.moves[i].player.id);
			}
		}
		if(this.gameboard.userToPlay && !animateLast && !this.timerID) {
			this.view.$.status.setContent(this.getUserName(this.gameboard.userToPlay) + "'s turn");
		}
	},
	getMaxPlayers:function() {
		for(var i=0; i<window.availableGames.length; i++) {
			if(window.availableGames[i].gameID==this.gameboard.gameID) {
				return window.availableGames[i].maxPlayers;
			}
		}
		return 2;
	},
	getUserName: function(player) {
		var name = "Player";
		if(player && player.id) {
			if(player.id==window.userID) {
				if(player.name && player.name.length>0) {
					name = player.name;
					if(player.name!=window.userName) {
						window.userName = player.name;
					}
				}
			} else {
				name = "Opponent";
				if(player.name && player.name.length>0 && player.name!="Player") {
					name = player.name;
				}
			}
		}
		return name;
	},
	columnSelected: function(inSender, inEvent) {
		if(this.gameboard.userToPlay && this.gameboard.userToPlay.id==window.userID && this.timerID===undefined
					&& this.gameboard.players.length==this.maxPlayers
					&& (this.moves.length===0 || this.moves[this.moves.length-1].player.id!=window.userID)) {
			this.gameboard.userToPlay = undefined;
			var placable = false;
			for(var i=0; i<this.COL_SIZE && !placable; i++) {
				var piece = this.view.$.c4Grid.$["piece-" + inSender.x + "-" + i];
				if(piece && !piece.isFilled()) {
					this.moves.push({x:inSender.x, y:i, player:{id:window.userID, name:window.userName}});
					this.update(undefined, true);
					window.ClientServerComm.sendPlayMoveEvent({x:inSender.x, y:i,
							player:{id:window.userID, name:window.userName}, instanceID:this.gameboard.instanceID});
					placable = true;
				}
			}
		}
	},
	handleUpdateReceived: function(inSender, inEvent) {
		if(this.gameboard.instanceID==inEvent.gameboard.instanceID) {
			if(this.gameboard.players.length<this.maxPlayers
					&& inEvent.gameboard.players.length>this.gameboard.players.length) {
				//new user joined a non-full match
				if(inEvent.gameboard.players.length==this.maxPlayers) {
					this.update(inEvent.gameboard);
				} else {
					this.gameboard = inEvent.gameboard;
					this.moves = inEvent.gameboard.currentBoard;
					this.maxPlayers = this.getMaxPlayers();
				}
				enyo.stage.menu.controller.updateGame(inEvent.gameboard);
			} else if(this.moves.length<inEvent.gameboard.currentBoard.length) {
				//new moves
				this.update(inEvent.gameboard, true);
				if(inEvent.gameboard.status && (typeof inEvent.gameboard.status === "string")) {
					var status = inEvent.gameboard.status.toLowerCase();
					if(status=="winner") {
						//TODO: Show winner popup
						//afterwards, close this game
					} else if(status=="draw") {
						//TODO: Show draw popup
						//afterwards, close this game
					}
				}
			} else if(this.moves.length==inEvent.gameboard.currentBoard.length){
				//move success
				this.update(inEvent.gameboard);
			} else {
				//move failed
				this.update(inEvent.gameboard);
			}
		}
	},
	rendered: function() {
		this.updateRatio();
	},
	reflow: function() {
		this.updateRatio();
	},
	updateRatio: function() {
		var bounds = this.view.getBounds();
		var wrapper = this.view.$.wrapper;
		if(bounds && bounds.height!==undefined && bounds.width!==undefined) {
			if((bounds.height-64)<(bounds.width*(6/7))) {
				wrapper.setBounds({
					width: ((bounds.height-64)*(7/6)),
					height: (bounds.height-64)
				});
			} else {
				wrapper.setBounds({
					width: bounds.width,
					height: (bounds.width*(6/7))
				});
			}
		}
	}
});
