namespace server
{
	/* Interprets and sends raw Socket.IO data for client side chat, managing each individual chatroom instance; directing chat messages to proper chatrooms, and allowing for server intervention.
	*/
	class Chat
	{
	public:
		//TODO: Define Generic methods here.
		//make sure to follow the description of what the interface is supposed to do
		Chat() {}
		virtual ~Chat() = 0;
	};
}
