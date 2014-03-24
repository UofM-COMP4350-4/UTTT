enyo.kind({
	name: "ChatView",
	kind: "View",
	controllerKind: "ChatController",
	style:"padding:4px;",
	components:[
		{kind:"Scroller", classes:"full chat-scroller",  components:[
			{name:"chatLog", content:"&nbsp;", allowHtml:true, style:"margin:4px;"}
		]}
	]
});
