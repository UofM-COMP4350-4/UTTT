describe("Connect4Controller", function() {
	var c4C = new window.Connect4View().controller;
	
	describe("#getUserName()", function() {
		window.userID = 0;
		it("should handle edgecases", function() {
			expect(c4C.getUserName({id:0,name:undefined})).toBe("Player");
			expect(c4C.getUserName({id:0,name:""})).toBe("Player");
			expect(c4C.getUserName({id:1,name:undefined})).toBe("Opponent");
			expect(c4C.getUserName({id:1,name:""})).toBe("Opponent");
		});
		it("should return the player's username", function() {
			expect(c4C.getUserName({id:1,name:"Cam"})).toBe("Cam");
		});
	});
	describe("#getMaxPlayers()", function() {
		it("should handle edgecases", function() {
			window.availableGames = [];
			expect(c4C.getMaxPlayers(0)).toBe(2);
			window.availableGames = [{gameID:0, gameName:"Connect4", gameType:"Connect4", maxPlayers:2}];
			expect(c4C.getMaxPlayers(0)).toBe(2);
		});
		it("should get the max number of the players for an available game", function() {
			window.availableGames = [{gameID:0, gameName:"Connect4", gameType:"Connect4", maxPlayers:2}];
			expect(c4C.getMaxPlayers(0)).toBe(2);
		});
	});
});