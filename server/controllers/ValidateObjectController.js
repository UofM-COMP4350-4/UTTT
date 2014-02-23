exports.ValidateObject = function(object) {
	if (object != null && object != undefined && object != NaN) {
		return true;
	}
	else {
		throw new Error('Argument cannot be null or undefined.');
	}
}

exports.ValidateObjectIsOneDimensionalArray = function(array) {
	exports.ValidateObject(array);
	
	if (array[0].length == undefined) {
		return true;
	}
	else {
		throw new Error('Array is not one dimensional.');
	}
}
