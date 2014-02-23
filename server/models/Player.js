var ValidateObjectController = require("../controllers/ValidateObjectController.js")

exports.Player = function Player(id, name)
{
	ValidateObjectController.ValidateObject(id);
	ValidateObjectController.ValidateObject(name);
	this.id = id;
	this.name = name;
}
