enyo.kind({
	name: "ChatView",
	kind: "View",
	controllerKind: "ChatController",
	components:[
		{name:"chatScroller", kind:"Scroller", classes:"full chat-scroller",  components:[
			{name:"chatLog", content:"&nbsp;", allowHtml:true, style:"padding:4px;"}
		]}
	]
});
