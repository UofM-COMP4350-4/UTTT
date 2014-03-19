var assert = require("assert");
var FlatFileAccess = require("../../models/FlatFileAccess.js");

/*  Flat File Access Tests
 *  Use: Test class to be used with Mocha.
 */

var obj1 = {a: 1, b: 'test', c: 3};
var obj2 = {a: 2, b: 'test2', c: 4};
var path = 'test.json';

describe("FlatFileAccess", function() {
	describe("saveJSONObject()", function() {
		it('should handle undefined/null input', function() {
			assert.throws(function() { FlatFileAccess.saveJSONObject(path, null) }, Error);
			assert.throws(function() { FlatFileAccess.saveJSONObject(null, obj1) }, Error);
			assert.throws(function() { FlatFileAccess.saveJSONObject(path, undefined) }, Error);
			assert.throws(function() { FlatFileAccess.saveJSONObject(undefined, obj1) }, Error);
		});
		it('should handle invalid input', function() {
			assert.throws(function() { FlatFileAccess.saveJSONObject(1, 1) }, Error);
			assert.throws(function() { FlatFileAccess.saveJSONObject({a:1}, 1) }, Error);
			assert.throws(function() { FlatFileAccess.saveJSONObject("foo", "bar") }, Error);
			assert.throws(function() { FlatFileAccess.saveJSONObject("test.txt", obj1) }, Error);
			assert.throws(function() { FlatFileAccess.saveJSONObject([], true) }, Error);
		});
		it('should save a JSON Object to a new filepath', function(done) {
			FlatFileAccess.saveJSONObject(path, obj1, function(err) {
				assert.ok(!err);
				FlatFileAccess.isPathCreated(path, function(exists) {
					assert.ok(exists);
					if(exists) {
						FlatFileAccess.loadJSONObject(path, function(err2, data) {
							assert.ok(!err2);
							assert.deepEqual(data, obj1);
							FlatFileAccess.deleteFile(path, function(err3) {
								done();
							});
						});
					} else {
						done();
					}
				});
			});
		});
		it('should save a JSON Object, overriding an existing filepath', function(done) {
			FlatFileAccess.saveJSONObject(path, obj1, function(err) {
				if(!err) {
					// stub file created, now test overriding
					FlatFileAccess.saveJSONObject(path, obj2, function(err2) {
						assert.ok(!err2);
						FlatFileAccess.isPathCreated(path, function(exists) {
							assert.ok(exists);
							if(exists) {
								FlatFileAccess.loadJSONObject(path, function(err3, data) {
									assert.ok(!err3);
									assert.notDeepEqual(data, obj1);
									assert.deepEqual(data, obj2);
									FlatFileAccess.deleteFile(path, function(err4) {
										done();
									});
								});
							} else {
								done();
							}
						});
					});
				} else {
					done();
				}
			});
		});
	});
	describe("loadJSONObject()", function() {
		it('should handle undefined/null input', function() {
			assert.throws(function() { FlatFileAccess.loadJSONObject(null) }, Error);
			assert.throws(function() { FlatFileAccess.loadJSONObject(undefined) }, Error);
		});
		it('should handle invalid input', function(done) {
			assert.throws(function() { FlatFileAccess.loadJSONObject(1) }, Error);
			assert.throws(function() { FlatFileAccess.loadJSONObject({a:1}) }, Error);
			assert.throws(function() { FlatFileAccess.loadJSONObject(true) }, Error);
			assert.throws(function() { FlatFileAccess.loadJSONObject([]) }, Error);
			assert.throws(function() { FlatFileAccess.loadJSONObject("text.txt") }, Error);
			FlatFileAccess.loadJSONObject("doesntexist.json", function(err, data) {
				assert.ok(err);
				var fs = require("fs");
				fs.writeFile(path, "Not JSON content", function(err) {
					if(!err) {
						FlatFileAccess.loadJSONObject(path, function(err2, data) {
							assert.ok(err2);
							FlatFileAccess.deleteFile(path, function(err3) {
								done();
							});
						});
					} else {
						done();
					}
				});
			});
		});
		it('should load a JSON object from a filepath', function(done) {
			FlatFileAccess.saveJSONObject(path, obj1, function(err) {
				if(!err) {
					FlatFileAccess.loadJSONObject(path, function(err2, data) {
						assert.ok(!err2);
						assert.equal(typeof data, "object");
						assert.deepEqual(data, obj1);
						FlatFileAccess.deleteFile(path, function(err3) {
							done();
						});
					});
				} else {
					done();
				}
			});
		});
	});
	describe("isPathCreated()", function() {
		var noop = function() {};
		it('should handle undefined/null input', function() {
			assert.throws(function() { FlatFileAccess.isPathCreated(null, noop) }, Error);
			assert.throws(function() { FlatFileAccess.isPathCreated(__filename, null) }, Error);
			assert.throws(function() { FlatFileAccess.isPathCreated(undefined, noop) }, Error);
			assert.throws(function() { FlatFileAccess.isPathCreated(__filename, undefined) }, Error);
		});
		it('should handle invalid input', function() {
			assert.throws(function() { FlatFileAccess.isPathCreated(1, noop) }, Error);
			assert.throws(function() { FlatFileAccess.isPathCreated(noop, {a:1}) }, Error);
			assert.throws(function() { FlatFileAccess.isPathCreated(path, true) }, Error);
			assert.throws(function() { FlatFileAccess.isPathCreated([], "blah") }, Error);
		});
		it('should check to see if a filepath exists or not', function(done) {
			FlatFileAccess.isPathCreated(__filename, function(exists) {
				assert.ok(exists);
				FlatFileAccess.isPathCreated("doesntexist.json", function(exists) {
					assert.ok(!exists);
					done();
				});
			});
		});
	});
	describe("deleteFile()", function() {
		it('should handle undefined/null input', function() {
			assert.throws(function() { FlatFileAccess.deleteFile(null) }, Error);
			assert.throws(function() { FlatFileAccess.deleteFile(undefined) }, Error);
		});
		it('should handle invalid input', function() {
			assert.throws(function() { FlatFileAccess.deleteFile(1) }, Error);
			assert.throws(function() { FlatFileAccess.deleteFile({a:1}) }, Error);
			assert.throws(function() { FlatFileAccess.deleteFile(true) }, Error);
			assert.throws(function() { FlatFileAccess.deleteFile([]) }, Error);
		});
		it('should delete a file at a given filepath', function(done) {
			FlatFileAccess.saveJSONObject(path, obj1, function(err) {
				if(!err) {
					FlatFileAccess.deleteFile(path, function(err2) {
						assert.ok(!err);
						if(!err2) {
							FlatFileAccess.isPathCreated(path, function(exists) {
								assert.ok(!exists);
								done();
							});
						} else {
							done();
						}
					});
				} else {
					done();
				}
			});
		});
	});
});
