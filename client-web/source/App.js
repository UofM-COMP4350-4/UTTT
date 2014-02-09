/**
	Define and instantiate your application kind in this file. Note,
	application rendering should be deferred until DOM is ready by wrapping
	it in a call to enyo.ready().
*/

enyo.kind({
	name: "Application",
	kind: "MainView",
	classes:"enyo-fit enyo-unselectable"
});

enyo.ready(function () {
	new Application().renderInto(document.body);
});
