exports.ValidateObject = function(obj) {
	if(obj == null || obj === undefined) {
		throw new Error('Argument cannot be null or undefined.');
	} else if(typeof obj == 'object') {
		return true;
	} else {
		throw new Error('Argument is not an object.');
	}
};

exports.ValidateBoolean = function(bool) {
	if(typeof bool == "boolean") {
		return true;
	} else {
		throw new Error('Argument is not a boolean.');
	}	
};

exports.ValidateString = function(string) {
	if (typeof string == "string") {
		return true;
	} else {
		throw new Error('Argument is not a string.');
	}	
};

exports.ValidateNumber = function(number) {
	if(typeof number == 'number') {
		if(isNaN(number)) {
			throw new Error('Argument cannot be NaN');
		} else {
			return true;
		}
	} else {
		throw new Error('Argument is not a number.');
	}
};

exports.ValidateArray = function(array) {
	exports.ValidateObject(array);
	if(array instanceof Array) {
		return true;
	} else {
		throw new Error('Argument is not an array.');
	}
};

exports.ValidateObjectIsOneDimensionalArray = function(array) {
	if(exports.ValidateArray(array)) {
		if(array.length===0) {
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
	} else {
		throw new Error('Argument is not an array.');
	}
};

exports.ValidateFunction = function(fn) {
	if(fn == null || fn === undefined) {
		throw new Error('Argument cannot be null or undefined.');
	} else if(typeof fn == 'function') {
		return true;
	} else {
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
 * that arg2 is a String, and that arg3 is a Number. Optional parameters can be declared
 * with the type definition of Validator.OPTIONAL
 */
exports.ValidateArgs = function() {
	if(arguments.length>0) {
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
				exports.ValidateFunction(arguments[0][i-1]);
			}
		}
	}
	return true;
};
exports.OPTIONAL = undefined;
