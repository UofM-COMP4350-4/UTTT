describe("MenuController", function() {
	var menuC = new window.MenuView().controller;
	describe("#loadBaseState()", function() {
		it("should handle edgecases", function() {
			window.active = {};
			menuC.loadBaseState();
			expect(menuC.state.length).toBe(0);
		});
		it("should take the active games cache and index them", function() {
			window.active = {0:{gameID:0, instanceID:0, players:[{id:0,name:""},{id:1,name:""}]}};
			menuC.loadBaseState();
			expect(menuC.state.length).toBe(1);
			expect(menuC.state[0].instanceID).toBe(0);
		});
	});
	describe("#addGame()", function() {
		it("should add a game to the active state array", function() {
			window.active = {};
			menuC.loadBaseState();
			menuC.addGame({gameID:0, instanceID:0, players:[{id:0,name:""},{id:1,name:""}]});
			expect(menuC.state.length).toBe(1);
			expect(menuC.state[0].instanceID).toBe(0);
		});
	});
	describe("#updateGame()", function() {
		it("should handle edgecases", function() {
			window.active = {};
			menuC.loadBaseState();
			menuC.updateGame({gameID:0, instanceID:0, players:[{id:0,name:""},{id:1,name:""}]});
			expect(menuC.state.length).toBe(0);
		});
		it("should update an entry in the active state array", function() {
			window.active = {0:{gameID:0, instanceID:0, players:[{id:0,name:""},{id:1,name:""}]}};
			menuC.loadBaseState();
			menuC.updateGame({gameID:1, instanceID:0, players:[{id:0,name:""},{id:1,name:""}]});
			expect(menuC.state[0].gameID).toBe(1);
		});
	});
	describe("#removeGame()", function() {
		it("should handle edgecases", function() {
			window.active = {};
			menuC.loadBaseState();
			menuC.removeGame(0);
			expect(menuC.state.length).toBe(0);

			window.active = {0:{gameID:0, instanceID:0, players:[{id:0,name:""},{id:1,name:""}]}};
			menuC.loadBaseState();
			menuC.removeGame(1);
			expect(menuC.state.length).toBe(1);
		});
		it("should remove an entry from the active state array", function() {
			window.active = {0:{gameID:0, instanceID:0, players:[{id:0,name:""},{id:1,name:""}]}};
			menuC.loadBaseState();
			menuC.removeGame(0);
			expect(menuC.state.length).toBe(0);
		});
	});
	describe("#getUserName()", function() {
		window.userID = 0;
		it("should handle edgecases", function() {
			expect(menuC.getUserName({id:0,name:undefined})).toBe("Player");
			expect(menuC.getUserName({id:0,name:""})).toBe("Player");
		});
		it("should return the player's username", function() {
			expect(menuC.getUserName({id:1,name:"Cam"})).toBe("Cam");
		});
	});
	describe("#getGameName()", function() {
		it("should handle edgecases", function() {
			window.availableGames = [];
			expect(menuC.getGameName(0)).toBe("");
			window.availableGames = [{gameID:0, gameName:"Connect4", gameType:"Connect4", maxPlayers:2}];
			expect(menuC.getGameName(1)).toBe("");
		});
		it("should return the player's username", function() {
			window.availableGames = [{gameID:0, gameName:"Connect4", gameType:"Connect4", maxPlayers:2}];
			expect(menuC.getGameName(0)).toBe("Connect4");
		});
	});
});