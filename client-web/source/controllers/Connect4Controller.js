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
	    // default values
	    this.gameboard = {currentBoard:[]};
	    this.moves = this.gameboard.currentBoard;
	},
	load: function(gameboard) {
		if(gameboard) { //update local data if needed
			this.gameboard = gameboard;
			this.moves = gameboard.currentBoard;
			this.maxPlayers = this.getMaxPlayers();
		}
		// create the the connect4 grid empty
		for(var i=0; i<this.ROW_SIZE; i++) {
			// create rows
			var row = enyo.clone(this.view.row);
			row.components = [];
			for(var j=0; j<this.COL_SIZE; j++) {
				// create cells
				var cell = enyo.clone(this.view.cell);
				cell.x = j;
				cell.y = ((this.ROW_SIZE-1)-i);
				// create Connect4Piece in cell, named by x/y gamelogic location
				cell.components = [enyo.clone(this.view.item)];
				cell.components[0].name = "piece-" + cell.x + "-" + cell.y;
				// link column tap event
				cell.ontap = "controller.columnSelected";
				row.components.push(cell);
			}
			// actually create the row object from the build JSON
			var c = this.view.$.c4Grid.createComponent(row);
		}
		// fill in the played moves
		this.update();
		// actually render the board into the browser (1 render = key for speed/browser repaint efficiency)
		this.view.$.c4Grid.render();
		if(gameboard.players.length==1) {
			// user just created a new game, show sharing popover
			enyo.stage.app.controller.shareURL("http://" + window.location.host + "/#game-" + gameboard.instanceID);
			this.view.$.status.setContent("Waiting for opponent...");
		}
	},
	// fill in board according to moves list
	update: function(gameboard, animateLast) {
		if(gameboard) {
			this.gameboard = gameboard;
			this.moves = gameboard.currentBoard;
			this.maxPlayers = this.getMaxPlayers();
		}
		var self = this;
		var asyncStatusUpdate = function() {
			// async status update so status can update after animation ends
			if(self.view.$.status && !self.gameover) {
				self.view.$.status.setContent(self.getUserName(self.gameboard.userToPlay) + "'s turn");
			}
			self.timerID=undefined;
		};
		for(var i=0; i<this.moves.length; i++) {
			var piece = this.view.$.c4Grid.$["piece-" + this.moves[i].x + "-" + this.moves[i].y];
			if(i==this.moves.length-1 && animateLast) {
				// animate latest move if desired
				piece.setPiece();
				piece.animateIn(this.moves[i].player.id);
				// delay updating status to better align with animation
				this.timerID = setTimeout(asyncStatusUpdate, 1100);
			} else {
				piece.setPiece(this.moves[i].player.id);
			}
		}
		if(this.gameboard.userToPlay && !animateLast && !this.timerID && !this.gameover) {
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
		var name = "Player"; //default user name
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
	columnSelected: function(inSender, inEvent) {
		// check if move input is allowed
		if(this.gameboard.userToPlay && this.gameboard.userToPlay.id==window.userID && this.timerID===undefined
					&& this.gameboard.players.length==this.maxPlayers
					&& (this.moves.length===0 || this.moves[this.moves.length-1].player.id!=window.userID)) {
			this.gameboard.userToPlay = undefined;
			var placable = false;
			// look for first-placable cell in column
			for(var i=0; i<this.COL_SIZE && !placable; i++) {
				var piece = this.view.$.c4Grid.$["piece-" + inSender.x + "-" + i];
				if(piece && !piece.isFilled()) {
					// pre-apply move
					this.moves.push({x:inSender.x, y:i, player:{id:window.userID, name:window.userName}});
					this.update(undefined, true);
					// send move off to server
					window.ClientServerComm.sendPlayMoveEvent({x:inSender.x, y:i,
							player:{id:window.userID, name:window.userName}, instanceID:this.gameboard.instanceID});
					placable = true;
				}
			}
		}
	},
	handleUpdateReceived: function(inSender, inEvent) {
		// make sure this gameboard event is for us
		if(this.gameboard.instanceID==inEvent.gameboard.instanceID) {
			if(this.gameboard.players.length<this.maxPlayers
					&& inEvent.gameboard.players.length>this.gameboard.players.length) {
				// new user joined a non-full match
				if(inEvent.gameboard.players.length==this.maxPlayers) {
					this.update(inEvent.gameboard); // game now full
				} else {
					// update with new player(s)
					this.gameboard = inEvent.gameboard;
					this.moves = inEvent.gameboard.currentBoard;
					this.maxPlayers = this.getMaxPlayers();
				}
				// update active games listing with new oppenent info
				enyo.stage.menu.controller.updateGame(inEvent.gameboard);
			} else if(this.moves.length<inEvent.gameboard.currentBoard.length) {
				// new moves
				this.update(inEvent.gameboard, true);
				// check for the end of the game
				if(inEvent.gameboard.status && (typeof inEvent.gameboard.status === "string")) {
					var status = inEvent.gameboard.status.toLowerCase();
					if(status=="winner") {
						if(inEvent.gameboard.winner && inEvent.gameboard.winner.id
								&& inEvent.gameboard.winner.id!=window.userID) {
							this.handleGameOver("You Lost!", inEvent.gameboard.instanceID);
						} else {
							this.handleGameOver("You Won!", inEvent.gameboard.instanceID);
						}
					} else if(status=="draw") {
						this.handleGameOver("It's A Draw!", inEvent.gameboard.instanceID);
					}
				}
			} else if(this.moves.length==inEvent.gameboard.currentBoard.length){
				//move success
				this.update(inEvent.gameboard);
				// check to see if that move resulted in a win
				if(inEvent.gameboard.status && (typeof inEvent.gameboard.status === "string")) {
					if(inEvent.gameboard.status.toLowerCase()=="winner") {
						if(inEvent.gameboard.winner && inEvent.gameboard.winner.id
								&& inEvent.gameboard.winner.id==window.userID) {
							this.handleGameOver("You Won!", inEvent.gameboard.instanceID);
						}
					}
				}
			} else {
				//move failed, reset pre-applied piece to empty, then update grid
				var failed = this.moves[this.moves.length-1];
				this.view.$.c4Grid.$["piece-" + failed.x + "-" + failed.y].setPiece();
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
	// keep gameboard ratio of 7:6 (along with a 32px status footer), fitting window size best
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
	},
	handleGameOver: function(message, instanceID) {
		this.gameover = true;
		this.view.$.status.setContent("Game Over");
		setTimeout(function() {
			// async end game so the last move has time to animate
			enyo.stage.app.controller.showNotification(message, function() {
				// close/cleanup game
				enyo.stage.menu.controller.removeGame(instanceID);
				delete window.active[instanceID];
				window.location.hash = "launcher";
			});
		}, 800);
	}
});
