/**
	Define and instantiate your enyo.Application kind in this file.  Note,
	application rendering should be deferred until DOM is ready by wrapping
	it in a call to enyo.ready().
*/

enyo.kind({
	name: "nbgi.Application",
	kind: "enyo.Application",
	view: "nbgi.MainView"
});

enyo.ready(function () {
	new nbgi.Application({name: "app"});
});