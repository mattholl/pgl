
var assert = require('assert');
var pglUtils = require('../lib/pgl-utils.js');

describe('merge arguments passed in to a function with a defaults object', function() {
    var args = {
        text : 'overridden',
        arr : [1,2,3]
    };

    var defs = {
        text : 'default',
        arr : [3,2,1],
        num : 1
    };

    var testMerge = pglUtils.merge(args, defs);

    var obj = {
        text : 'overridden',
        arr : [1,2,3],
        num : 1
    };

    it('should override the defaults if arguments exists', function() {
        assert.equal(obj.text, args.text);
        assert.deepEqual(obj.arr, args.arr);
        assert.equal(obj.num, defs.num);
    });
});