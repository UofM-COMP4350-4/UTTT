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
	exports.ValidateObject(bool);
	
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

exports.ValidateArray = function(array) {
	exports.ValidateObject(array);

	if (array instanceof Array) {
			return true;
	}
	else {
		throw new Error('Argument is not an array.');
	}
};

exports.ValidateObjectIsOneDimensionalArray = function(array) {
	exports.ValidateObject(array);

	if (exports.ValidateArray(array)) {
		if (typeof array[0] == 'string') {
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

exports.ValidateFunction = function(fn) {
	exports.ValidateObject(array);

	if (array instanceof Function) {
			return true;
	}
	else {
		throw new Error('Argument is not a function.');
	}
};


/*
 * Validates an array of arguments, according to declared type defintions
 * for example:
 *		function fooBar(arg1, arg2, arg3) {
 *			Validator.ValidateArgs(arguments, Boolean, String, Number);
 *			...
 *		}
 * This will validate the function's 3 arguments, validating arg1 is a Boolean,
 * that arg2 is a String, and that arg3 is a Number.
 */
exports.ValidateArgs = function() {
	if(argument.length>0 && (arguments[0] instanceof Array)
			&& arguments[0].length==arguments.length-1) {
		for(var i=1; i<arguments.length; i++) {
			if(arguments[i] == Number) {
				exports.ValidateNumber(arguments[0][i-1]);
			} else if(arguments[i] == Boolean) {
				exports.ValidateBoolean(arguments[0][i-1]);
			} else if(arguments[i] == Array) {
				exports.ValidateArray(arguments[0][i-1]);
			} else if(arguments[i] == String) {
				exports.ValidateString(arguments[0][i-1]);
			} else if(arguments[i] == Object) {
				exports.ValidateObject(arguments[0][i-1]);
			} else if(arguments[i] == Function) {
				exports.ValidateObject(arguments[0][i-1]);
			}
		}
	}
};
