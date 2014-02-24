var assert = require("assert");
var FlatFileAccessJS = require("../../models/FlatFileAccess.js");

/*  Flat File Access Tests
 *  Use: Test class to be used with Mocha.  Tests the GridValidationController.js functions.
 */

describe('Controller Test Suite', function(){
	describe('FlatFileAccess Test Class', function() {
		it('Test: Save JSON Object with Existing Path', function() {
			var flatFileAccess = new FlatFileAccessJS.FlatFileAccess();
			var jsonObj = {1,2,3};
			var path = './games/test.txt';
		
			assert.equal(flatFileAccess.SaveJSONObject(jsonObj, path), true);
			assert.equal(flatFileAccess.IsPathCreated(path), true);
			assert.equal(flatFileAccess.IsPathCreated('./games/blah.txt'), false);
			assert.equal(flatFileAccess.LoadJSONObject(path), true);
			assert.equal(flatFileAccess.DeleteFile(path), true);
			assert.equal(flatFileAccess.IsPathCreated(path), false);
		});
		
		it('Test: Save JSON Object a path that doesnt exist', function() {
			var flatFileAccess = new FlatFileAccessJS.FlatFileAccess();
			var jsonObj = {1,2,3};
			var path = './games/test.txt';
		
			assert.equal(flatFileAccess.SaveJSONObject(jsonObj, path), true);
			assert.equal(flatFileAccess.IsPathCreated(path), true);
			assert.equal(flatFileAccess.LoadJSONObject(path), true);
			assert.equal(flatFileAccess.DeleteFile(path), true);
			assert.equal(flatFileAccess.IsPathCreated(path), false);
		});
		
		it('Test: Load JSON Object that doesnt exist', function() {
			var flatFileAccess = new FlatFileAccessJS.FlatFileAccess();
			assert.equal(flatFileAccess.LoadJSONObject('./games/blah.txt'), true);
		});
		
		it('Test: Delete file that doesnt exist', function() {
			var flatFileAccess = new FlatFileAccessJS.FlatFileAccess();
			assert.equal(flatFileAccess.DeleteFile('./games/blah.txt'), true);
		});
		
		it('Test: Load a JSON Object that doesnt exist', function() {
			var flatFileAccess = new FlatFileAccessJS.FlatFileAccess();
			assert.throws(function() { flatFileAccess.DeleteFile('./games/blah.txt') }, Error);
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
			assert.throws(function() { flatFileAccess.SaveJSONObject(4, {a:1}) }, Error);
			
			assert.throws(function() { flatFileAccess.IsPathCreated(1) }, Error);
			assert.throws(function() { flatFileAccess.IsPathCreated(false) }, Error);	
			
			assert.throws(function() { flatFileAccess.LoadJSONObject(1) }, Error);
			assert.throws(function() { flatFileAccess.LoadJSONObject(false) }, Error);
			
			assert.throws(function() { flatFileAccess.DeleteFile(1) }, Error);
			assert.throws(function() { flatFileAccess.DeleteFile(false) }, Error);			
		});
	});
});