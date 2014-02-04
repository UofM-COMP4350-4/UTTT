namespace client
{
	namespace game
	{
		/*Interprets raw Socket.IO message data, sending the data to the Client in a standard generic game format (which can then be processed by the game block/GameInterface).
		*APIs to communicate with the server, by passing generic game data
		*/
		class Comm
		{
		public:
			//TODO: Define Generic methods here.
			//make sure to follow the description of what the interface is supposed to do
			Comm() {}
			virtual ~Comm() = 0;
		};
	}
}
