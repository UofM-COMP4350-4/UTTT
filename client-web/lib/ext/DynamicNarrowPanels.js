/*
 * Hack for enyo.Panels so that narrow fit will apply dynamically
 * whenever the window resizes/reflows as needed.
 */

enyo.rendered(function() {
	var origReflow = enyo.Panels.prototype.reflow;
	enyo.Panels.prototype.reflow = function() {
		this.transitionPoints = [];
		this.arrangerKindChanged();
		this.narrowFitChanged();
		this.indexChanged();
		return origReflow.apply(this, arguments);
	};
});
