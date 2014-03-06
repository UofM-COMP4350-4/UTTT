describe("AppController", function() {
	var appC = new AppView().controller;

	describe("#setMenuShowing()", function() {
		it("should set the upper panels' index to the menu view when set true", function() {
			appC.setMenuShowing(false); // reset false
			appC.setMenuShowing(true);
			expect(appC.view.$.upperPanels.index).toBe(0);
		});
		it("should also set the lower panels' index to the game/chat view when set true on a narrow screen device", function() {
			appC.setMenuShowing(false); // reset false
			appC.narrowFit = true;
			appC.setMenuShowing(true);
			expect(appC.view.$.lowerPanels.index).toBe(0);
			appC.narrowFit = false;
		});
		it("should set the upper panels' index to the lower panels' container when set false", function() {
			appC.setMenuShowing(true); // reset true
			appC.setMenuShowing(false);
			expect(appC.view.$.upperPanels.index).toBe(1);
		});
	});
	describe("#setSocialShowing()", function() {
		it("should set the lower panels' index to the social view when set true", function() {
			appC.setSocialShowing(false); // reset false
			appC.setSocialShowing(true);
			expect(appC.view.$.lowerPanels.index).toBe(1);
		});
		it("should also set the upper panels' index to the lower panels' container when set true on a narrow screen device", function() {
			appC.setSocialShowing(false); // reset false
			appC.narrowFit = true;
			appC.setSocialShowing(true);
			expect(appC.view.$.upperPanels.index).toBe(1);
			appC.narrowFit = false;
		});
		it("should set the lower panels' index to the game/chat view  when set false", function() {
			appC.setSocialShowing(true); // reset true
			appC.setSocialShowing(false);
			expect(appC.view.$.lowerPanels.index).toBe(0);
		});
	});
	describe("#toggleMenu()", function() {
		it("should toggle the menuShowing published property", function() {
			appC.setMenuShowing(true); // reset
			appC.toggleMenu();
			expect(appC.menuShowing).toBe(false);
			appC.toggleMenu();
			expect(appC.menuShowing).toBe(true);
		});
	});
	describe("#toggleSocial()", function() {
		it("should toggle the socialShowing published property", function() {
			appC.setSocialShowing(true); // reset
			appC.toggleSocial();
			expect(appC.socialShowing).toBe(false);
			appC.toggleSocial();
			expect(appC.socialShowing).toBe(true);
		});
	});
	describe("#showGameArea()", function() {
		it("should set the upper panels' index to the lower panels' container on a narrow screen", function() {
			appC.narrowFit = true;
			appC.showGameArea();
			expect(appC.view.$.upperPanels.index).toBe(1);
			appC.narrowFit = false;
		});
		it("should set the lower panels' index to the game/chat view on a narrow screen", function() {
			appC.narrowFit = true;
			appC.showGameArea();
			expect(appC.view.$.lowerPanels.index).toBe(0);
			appC.narrowFit = false;
		});
	});
});