exports.ValidateObject = function(object) {
	if (object != null && object != undefined) {
		return true;
	}
	else {
		throw 'Argument cannot be null or undefined.';
	}
}
