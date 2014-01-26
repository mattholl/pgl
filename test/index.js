
var assert = require('assert');
var pglUtils = require('../lib/pgl-utils.js');

describe('Merge arguments passed in to a function with a defaults object', function() {
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

describe('Converting geo coordinates to Cartesian', function() {
    var geoCoords = [ [50.8429, 0.1313], [-20.5878, -174.8103], [50.8429, 0.1313] ];

    var cartCoords = [];
    cartCoords[0] = pglUtils.geoCarte(geoCoords[0][0], geoCoords[0][1]);
    cartCoords[1] = pglUtils.geoCarte(geoCoords[1][0], geoCoords[1][1]);
    cartCoords[2] = pglUtils.geoCarte(geoCoords[2][0], geoCoords[2][1]);

    it('should calculate the correct location', function() {
        assert.equal(cartCoords[0][0], 4035587.0474534836);
        assert.equal(cartCoords[0][1], 9248.03731408002);
        assert.equal(cartCoords[0][2], 4922527.464350282);

        assert.equal(cartCoords[1][0], -5948780.075425479);
        assert.equal(cartCoords[1][1], -540303.152057656);
        assert.equal(cartCoords[1][2], -2228731.2513984353);

        assert.equal(cartCoords[2][0], 4035587.0474534836);
        assert.equal(cartCoords[2][1], 9248.03731408002);
        assert.equal(cartCoords[2][2], 4922527.464350282);
    });
});