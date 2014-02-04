namespace server
{
	namespace game
	{
		/* Interprets the generic-form message the Server passes to it into something game-specific that can be used by the particular game logic.
		*Translates game data back to a generic format for use by the server elsewhere.
		*/
		class Logic
		{
		public:
			//TODO: Define Generic methods here.
			//make sure to follow the description of what the interface is supposed to do
			GameLogic() {}
			virtual ~GameLogic() = 0;
		};
	}
}
