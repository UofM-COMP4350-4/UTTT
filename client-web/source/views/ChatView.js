enyo.kind({
	name: "ChatView",
	kind: "View",
	controllerKind: "ChatController",
	components:[
		{kind:"Scroller", classes:"full chat-scroller",  components:[
			{name:"chatLog", content:"&nbsp;", allowHtml:true, style:"margin:4px;"}
		]}
	]
});
