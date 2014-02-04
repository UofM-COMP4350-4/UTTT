namespace server
{
	/* Interface to easily store user/game/friend/chat data formats into a database, with support for the relational database and the flat file data format.
	*/
	class Database
	{
	public:
		//TODO: Define Generic methods here.
		//make sure to follow the description of what the interface is supposed to do
		Database() {}
		virtual ~Database() = 0;
	};
}
