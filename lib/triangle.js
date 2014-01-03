/**
 * Triangle object
 * @TODO
 *     + module.exports style differs from the others, make consistent
 *
 */

var plask = require('plask');
var vertex = require('./vertex');

function triangle(params) {

    params = params || {};

    var vertices = params.vertices;

    this.material = params.material;

    var vertexA = vertices[0],
        vertexB = vertices[1],
        vertexC = vertices[2];

    // create the vertices buffer here
    this.verticesArray = [vertexA.x, vertexA.y, vertexA.z,
                     vertexB.x, vertexB.y, vertexB.z,
                     vertexC.x, vertexC.y, vertexC.z];

    this.vertexA = vertexA;
    this.vertexB = vertexB;
    this.vertexC = vertexC;

    this.vertices = [];

    this.vertices.push([vertexA.x, vertexA.y, vertexA.z]);
    this.vertices.push([vertexB.x, vertexB.y, vertexB.z]);
    this.vertices.push([vertexC.x, vertexC.y, vertexC.z]);

    this.u = new plask.Vec3();
    this.v = new plask.Vec3();

    this.centroid = this.computeCentroid();
    this.normal = this.computeNormal();
}

triangle.prototype = {
    computeCentroid : function() {

        var centroidVertices = [];

        centroidVertices[0] = this.vertexA.x + this.vertexB.x + this.vertexC.x;
        centroidVertices[1] = this.vertexA.y + this.vertexB.y + this.vertexC.y;
        centroidVertices[2] = this.vertexA.z + this.vertexB.z + this.vertexC.z;

        var centroid = new plask.Vec3(centroidVertices[0], centroidVertices[1], centroidVertices[2]);

        centroid.scale(1/3);

        return centroid;
    },
    computeNormal : function() {
        this.u.sub2(this.vertexA, this.vertexB);
        this.v.sub2(this.vertexC, this.vertexA);

        var normal = new plask.Vec3();

        normal.cross2(this.u, this.v);
        normal.normalize();

        return normal;
    }
};

module.exports = triangle;