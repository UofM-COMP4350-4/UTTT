/**
	For simple applications, you might define all of your views in this file.  
	For more complex applications, you might choose to separate these kind definitions 
	into multiple files under this folder.
*/

enyo.kind({
	name: "MainController",
	kind: "Component",
	helloWorldTap: function(inSender, inEvent) {
		this.view.$.results.addContent("The button was tapped.<br/>");
	}
});
