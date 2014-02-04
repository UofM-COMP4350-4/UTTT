namespace client
{
	namespace game
	{
		/*Interprets the generic-form message the Client passes to it into something game-specific that can be used by the game controllers/views.
		*Translates game data back to a generic format for use by the client elsewhere
		*/
		class Game
		{
		public:
			//TODO: Define Generic methods here.
			//make sure to follow the description of what the interface is supposed to do
			Game() {}
			virtual ~Game() = 0;
		};
	}
}
