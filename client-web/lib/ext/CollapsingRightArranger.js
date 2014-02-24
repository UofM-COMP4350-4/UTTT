/**
	_enyo.CollapsingArranger_ is an [enyo.Arranger](#enyo.Arranger) that
	displays the active controls, with every control after the first set to specific
	widths, and the first control taking up the remaining space. All controls other
	than the first one will be collapsable into the right side.

	For best results with CollapsingRightArranger, you should set a minimum width
	for each control via a CSS style, e.g., _min-width: 25%_ or
	_min-width: 250px_.

	Transitions between arrangements are handled by sliding the new control	in
	from the right and collapsing the old control to the left.

	For more information, see the documentation on
	[Arrangers](building-apps/layout/arrangers.html) in the Enyo Developer Guide.
*/
enyo.kind({
	name: "enyo.CollapsingRightArranger",
	kind: "CarouselArranger",
	/**
		The distance (in pixels) that each panel should be offset from the left
		when it is selected. This allows controls on the underlying panel to the
		left of the selected one to be partially revealed.
	*/
	peekWidth: 0,
	//* @protected
	size: enyo.inherit(function(sup) {
		return function() {
			this.clearSizes();
			sup.apply(this, arguments);
		};
	}),
	// clear sizes
	// (required for adding another control)
	clearSizes: function() {
		var c$=this.container.getPanels();
		for (var i=c$.length-1, c; (c=c$[i]); i--) {
			if (c._fit && i != 0) {
				c.applyStyle("width", null);
				c._fit = null;
			}
		}
	},
	constructor: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			this.peekWidth = this.container.peekWidth != null ? this.container.peekWidth : this.peekWidth;
		};
	}),
	arrange: function(inC, inIndex) {
		var c$ = this.container.getPanels();
		for (var i=c$.length-1, e=this.containerBounds.width-this.containerPadding.right, c, n=0; (c=c$[i]); i--) {
			if (i == 0) {
				this.arrangeControl(c, {left: 0, width:e});
			} else if(c.getShowing()){
				if (i <= inIndex) {
					e -= (c.width + c.marginWidth - this.peekWidth);
				}
				this.arrangeControl(c, {left: e - (n * this.peekWidth), width:(c.width + c.marginWidth - this.peekWidth)});
				n++;
			} else {
				if (i <= inIndex) {
					e -= (c.width + c.marginWidth);
				}
				this.arrangeControl(c, {left: e, width:(c.width + c.marginWidth)});
			}
		}
	},
	calcArrangementDifference: function(inI0, inA0, inI1, inA1) {
		var i = this.container.getPanels().length-1;
		return Math.abs(inA1[0].width - inA0[0].width);
	},
	flowControl: enyo.inherit(function(sup) {
		return function(inControl, inA) {
			sup.apply(this, arguments);
			if (this.container.realtimeFit) {
				var c$ = this.container.getPanels();
				var first = c$[0];
				if (inControl == first) {
					this.fitControl(inControl, inA.width);
				}
			}

		};
	}),
	finish: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			if (!this.container.realtimeFit && this.containerBounds) {
				var c$ = this.container.getPanels();
				var a$ = this.container.arrangement;
				var first = c$[0];
				this.fitControl(first, a$[0].width);
			}
		};
	}),
	fitControl: function(inControl, w) {
		inControl._fit = true;
		inControl.applyStyle("width", w + "px");
		inControl.resized();
	}
});
