describe("GameController", function() {
	var gameC = new window.GameView().controller;

	describe("#showLauncher()", function() {
		it("should show the launcher", function() {
			gameC.showLauncher();
			expect(!!gameC.active).toBe(true);
		});
	});
	describe("#createGame()", function() {
		it("should show the game's view based on gameType", function() {
			gameC.createGame("Connect4");
			expect(!!gameC.active).toBe(true);
			expect(gameC.active.kind).toBe("Connect4View");
		});
	});
});