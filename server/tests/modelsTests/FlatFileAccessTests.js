var assert = require("assert");
var FlatFileAccessJS = require("../../models/FlatFileAccess.js");

/*  Flat File Access Tests
 *  Use: Test class to be used with Mocha.  Tests the GridValidationController.js functions.
 */

var flatFileAccess = new FlatFileAccessJS.FlatFileAccess();
var jsonObj = {a: 1, b: 'test', c: 3};
var path = './../../../server/games/test.txt';

describe('Controller Test Suite', function() {
	describe('FlatFileAccess Test Class', function() {
		it('Test: Save JSON Object with Existing Path', function() {
			assert.equal(flatFileAccess.SaveJSONObject(jsonObj, path), true);
			assert.equal(flatFileAccess.IsPathCreated('./games/doesntexist.txt'), false);
			assert.deepEqual(flatFileAccess.LoadJSONObject(path), jsonObj);
			assert.equal(flatFileAccess.DeleteFile(path), true);
			assert.equal(flatFileAccess.IsPathCreated(path), false);
		});
		
		it('Test: Save/Delete/Load with Path that doesnt exist', function() {		
			assert.throws(function() { flatFileAccess.SaveJSONObject(jsonObj, './games/doesntexist.txt') }, Error);
			assert.throws(function() { flatFileAccess.DeleteFile('./games/doesntexist.txt') }, Error);
			assert.throws(function() { flatFileAccess.LoadJSONObject('./games/doesntexist.txt') }, Error);
		});
		
		it('Test: Arguments Null/NaN/Undefined Data', function() {
			assert.throws(function() { flatFileAccess.SaveJSONObject(null, './') }, Error);
			assert.throws(function() { flatFileAccess.SaveJSONObject({}, null) }, Error);
			assert.throws(function() { flatFileAccess.SaveJSONObject(undefined, './') }, Error);
			assert.throws(function() { flatFileAccess.SaveJSONObject({}, undefined) }, Error);
			
			assert.throws(function() { flatFileAccess.IsPathCreated(null) }, Error);
			assert.throws(function() { flatFileAccess.IsPathCreated(undefined) }, Error);
			
			assert.throws(function() { flatFileAccess.LoadJSONObject(null) }, Error);
			assert.throws(function() { flatFileAccess.LoadJSONObject(undefined) }, Error);
			
			assert.throws(function() { flatFileAccess.DeleteFile(null) }, Error);
			assert.throws(function() { flatFileAccess.DeleteFile(undefined) }, Error);
		});
		
		it('Test: Inivialize Invalid Data', function() {
			assert.throws(function() { flatFileAccess.SaveJSONObject(1, 1) }, Error);
			assert.throws(function() { flatFileAccess.SaveJSONObject(1, {a:1}) }, Error);
			assert.throws(function() { flatFileAccess.SaveJSONObject('./', '{a:1}') }, Error);
			
			assert.throws(function() { flatFileAccess.IsPathCreated(1) }, Error);
			assert.throws(function() { flatFileAccess.IsPathCreated(false) }, Error);	
			
			assert.throws(function() { flatFileAccess.LoadJSONObject(1) }, Error);
			assert.throws(function() { flatFileAccess.LoadJSONObject(false) }, Error);
			
			assert.throws(function() { flatFileAccess.DeleteFile(1) }, Error);
			assert.throws(function() { flatFileAccess.DeleteFile(false) }, Error);			
		});
	});
});