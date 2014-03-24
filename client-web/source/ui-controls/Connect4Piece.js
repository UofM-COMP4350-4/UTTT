enyo.kind({
	name: "Connect4Piece",
	classes: "connect4-piece full",
	components: [
		{name:"static", kind:"Image", classes:"connect4-static-piece full", src:"assets/connect4-empty.png"},
		{name:"sliding", kind:"Image", classes:"connect4-sliding-piece full", src:"assets/connect4-blue.png"}
	],
	create: function() {
		this.inherited(arguments);
		this.$.sliding.applyStyle("top", (enyo.dom.getWindowHeight()*-1) + "px");
	},
	setPiece: function(userID) {
		if(userID===undefined) {
			this.$.static.setSrc("assets/connect4-empty.png");
		} else if(userID==window.userID && this.userID!=userID) {
			this.$.static.setSrc("assets/connect4-filledblue.png");
		} else if(this.userID!=userID){
			this.$.static.setSrc("assets/connect4-filledred.png");
		}
		this.userID=userID;
	},
	animateIn: function(userID) {
		if(this.userID!=userID) {
			this.$.sliding.addClass("connect4-sliding-trigger");
			if(userID==window.userID) {
				this.$.sliding.setSrc("assets/connect4-blue.png");
			} else {
				this.$.sliding.setSrc("assets/connect4-red.png");
			}
			this.$.sliding.applyStyle("top", "0px;");
			this.userID=userID;
		}
		
	},
	resetAnimation: function() {
		this.$.sliding.removeClass("connect4-sliding-trigger");
        this.$.sliding.applyStyle("top", (enyo.dom.getWindowHeight()*-1) + "px");
	},
	isFilled: function() {
		return (this.userID!==undefined);
	},
	reflow: function() {
		this.inherited(arguments);
		if(this.userID===undefined) {
			this.$.sliding.applyStyle("top", (enyo.dom.getWindowHeight()*-1) + "px");
		}
	}
});
