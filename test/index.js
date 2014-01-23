

var assert = require('assert');
var pglUtils = require('../lib/pgl-utils.js');

describe('merge arguments passed in to a function with a defaults object', function() {
    var args = {
        text : 'string'
    };

    var defs = {
        text : 'overridden',
        num : 1
    };

    var testMerge = pglUtils.merge(args, defs);

    var obj = {
        text : 'overridden',
        num : 1
    };

    it('', function() {
        assert.equal(obj.text, defs.text);
        assert.equal(obj.num, defs.num);
    });
});