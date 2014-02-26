exports.ValidateObject = function(object) {
	if (object == null || object === undefined) {
		throw new Error('Argument cannot be null or undefined.');
	}
	else if (typeof object == 'number' && isNaN(object)) {
		throw new Error('Argument cannot be null or undefined.');
	}
	else if (typeof object == 'object') {
		var keys = Object.keys(object);

		for (var index = 0; index < keys.length; index++) {
			exports.ValidateObject(object[keys[index]]);	
		}
	}
	
	return true;
};

exports.ValidateBoolean = function(bool) {
	exports.ValidateObject(boolean);
	
	if (typeof bool == "boolean") {
		return true;
	}
	else {
		throw new Error('Argument is not a boolean.');
	}	
};

exports.ValidateString = function(string) {
	exports.ValidateObject(string);
	
	
	if (typeof string == "string") {
		return true;
	}
	else {
		throw new Error('Argument is not a string.');
	}	
};

exports.ValidateNumber = function(number) {
	exports.ValidateObject(number);

	if (typeof number == 'number') {
		return true;
	}
	else {
		throw new Error('Argument is not a number.');
	}
};

exports.ValidateObjectIsOneDimensionalArray = function(array) {
	exports.ValidateObject(array);

	if (array instanceof Array) {
		if (array.length === 0) {
			return true;
		}
		else if (typeof array[0] == 'string') {
			return true;
		}
		else if (!(array[0] instanceof Array)) {
			return true;
		}
		else {
			throw new Error('Array is not one dimensional.');
		}	
	}
	else {
		throw new Error('Argument is not an array.');
	}
};
