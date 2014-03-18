enyo.kind({
	name: "Connect4Controller",
	kind: "Component",
	COL_SIZE: 7,
	ROW_SIZE: 6,
	PIECES: [
		"assets/connectfourwhite.png",
		"assets/connectfourblue.png",
		"assets/connectfourred.png"
	],
	components:[
		{kind:"Signals", onplayResult:"handleUpdateReceived"}
	],
	create:function() {
	    this.inherited(arguments);
	    this.gameboard = {currentBoard:[]};
	    this.moves = this.gameboard.currentBoard;
	},
	load: function(gameboard) {
		this.log("load");
		if(gameboard) {
			this.gameboard = gameboard;
			this.moves = gameboard.currentBoard;
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
				cell.components[0].src = this.PIECES[0];
				for(var k=0; k<this.moves.length; k++) {
					if(cell.x===this.moves[k].x && cell.y===this.moves[k].y) {
						if(window.userID==this.moves[k].player.id) {
							cell.components[0].src = this.PIECES[1];
						} else {
							cell.components[0].src = this.PIECES[2];
						}
						break;
					}
				}
				cell.ontap = "controller.columnSelected";
				row.components.push(cell);
			}
			var c = this.view.$.c4Grid.createComponent(row);
		}
		this.view.$.c4Grid.render();
	},
	update: function(gameboard) {
		if(gameboard) {
			this.gameboard = gameboard;
			this.moves = gameboard.currentBoard;
		}
		for(var i=0; i<this.moves.length; i++) {
			var piece = this.view.$.c4Grid.$["piece-" + this.moves[i].x + "-" + this.moves[i].y];
			if(window.userID==this.moves[i].player.id) {
				piece.setSrc(this.PIECES[1]);
			} else {
				piece.setSrc(this.PIECES[2]);
			}
		}
	},
	columnSelected: function(inSender, inEvent) {
		if(this.gameboard.userToPlay && this.gameboard.userToPlay.id==window.userID) {
			this.moves.push({x:inSender.x, y:inSender.y, player:{id:window.userID, name:window.userName}});
			this.update();
			window.ClientServerComm.sendPlayMoveEvent({x:inSender.index, y:inSender.y, player:{id:window.userID, name:window.userName}});
		}
	},
	handleUpdateReceived: function(inSender, inEvent) {
		this.update(inEvent.gameboard);
		//TODO
	}
});
