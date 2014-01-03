/**
 * Simple vertex
 * Inherits from the plask.Vec3 object
 * @TODO
 *     + add normals for interpolated shading over triangles/faces
 */

var plask = require('plask');
var util = require('util');

function vertex(x, y, z) {
    plask.Vec3.apply(this, arguments);
}

util.inherits(vertex, plask.Vec3);

module.exports = vertex;