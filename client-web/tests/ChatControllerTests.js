describe("AppController", function() {
	var chatC = new window.ChatView().controller;

	describe("#getUserName()", function() {
		window.userID = 0;
		it("should handle edgecases", function() {
			expect(chatC.getUserName({id:0,name:undefined})).toBe("Player");
			expect(chatC.getUserName({id:0,name:""})).toBe("Player");
			expect(chatC.getUserName({id:1,name:undefined})).toBe("Opponent");
			expect(chatC.getUserName({id:1,name:""})).toBe("Opponent");
		});
		it("should return the player's username", function() {
			expect(chatC.getUserName({id:1,name:"Cam"})).toBe("Cam");
		});
	});
	describe("#reset()", function() {
		it("should empty the chatbox", function() {
			chatC.instanceID = 0;
			chatC.addLog({message:"Test", player:{id:0, name:""}, instanceID:0});
			chatC.reset();
			expect(chatC.view.$.chatLog.getContent()).toBe("");
		});
	});
});