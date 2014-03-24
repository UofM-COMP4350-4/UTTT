enyo.kind({
	name: "ChatController",
	kind: "Component",
	components:[
		{kind:"Signals", onChat:"updateLog"},
	],
	create: function() {
		this.inherited(arguments);
		this.logs = {};
	},
	loadChatroom: function(instanceID) {
		this.instanceID = instanceID;
		if(!this.logs[this.instanceID]) {
			this.logs[this.instanceID] = [];
		}
		this.loadLogs();
	},
	loadLogs: function() {
		this.reset();
		var history = this.logs[this.instanceID];
		for(var i=0; i<history.length; i++) {
			this.addLog(history[i]);
		}
	},
	addLog: function(chat) {
		var name = this.getUserName(chat.player);
		if(chat.player.id==window.userID) {
			this.view.$.chatLog.addContent('<span class="player">'
					+ name + ':&nbsp;</span>' + chat.message + '<br/>');
		} else {
			this.view.$.chatLog.addContent('<span class="opponent">'
					+ name + ':&nbsp;</span>' + chat.message + '<br/>');
		}
	},
	reset: function() {
		this.view.$.chatLog.setContent("");
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
	updateLog: function(inSender, inEvent) {
		this.logs[inEvent.instanceID].push(inEvent);
		if(this.instanceID==inEvent.instanceID) {
			this.addLog(inEvent);
		}
		return true;
	}
});
