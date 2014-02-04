namespace server
{
	namespace game
	{
		/* Interprets raw Socket.IO message data, managing connected client sockets, and passing along data to the Server in a standard generic game format (which can then be processed by the game logic block/GameLogicInterface).
		*APIs to communicate with the connected clients, by passing generic game data
		*/
		class Comm //game communication
		{
		public:
			//TODO: Define Generic methods here.
			//make sure to follow the description of what the interface is supposed to do
			Comm() {}
			virtual ~Comm() = 0;
		};
	}
}
