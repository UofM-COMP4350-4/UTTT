var ValidateObjectController = require("../controllers/ValidateObjectController.js")

exports.Player = function Player(id, name)
{
	ValidateObjectController.ValidateNumber(id);
	ValidateObjectController.ValidateString(name);
	this.id = id;
	this.name = name;
}
