/**
 * Some utility functions which require plask
 */

var plask = require('plask');

module.exports = {

    toInverseMat3 : function(mat4) {
        var m = new plask.Mat3();
        var  x11 = mat4.a11,  x12 = mat4.a12,  x13 = mat4.a13,
           x21 = mat4.a21,  x22 = mat4.a22,  x23 = mat4.a23,
           x31 = mat4.a31,  x32 = mat4.a32,  x33 = mat4.a33;

        var   b11 = x22 * x33 - x23 * x32,
            b12 = x32 * x13 - x33 * x12,
            b13 = x12 * x23 - x13 * x22,
            b21 = x23 * x31 - x21 * x33,
            b22 = x33 * x11 - x31 * x13,
            b23 = x13 * x21 - x11 * x23,
            b31 = x21 * x32 - x22 * x31,
            b32 = x31 * x12 - x32 * x11,
            b33 = x11 * x22 - x12 * x21;

        var det = x11 * b11 + x21 * b12 + x31 * b13;
        var invdet;

        if (!det){
        return console.log('det is zero');
        }
        else{
        invdet = 1 / det;
        m.set3x3r(b11 * invdet,
                b12 * invdet,
                b13 * invdet,
                b21 * invdet,
                b22 * invdet,
                b23 * invdet,
                b31 * invdet,
                b32 * invdet,
                b33 * invdet);
        return m;
        }
    }

};