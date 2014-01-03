/**
 * Various function to programatically create geometry
 *
 * @TODO
 *     + Add others eg. sphere
 *     + Be able to pass sizes in to the create the geometry
 */

var plask = require('plask');

module.exports.axes = function() {
    var meshType = 'LINES';
    var type = 'axes';
    var lines = [
        [-10, 0.0, 0.0, 10, 0.0, 0.0],
        [0.0, -10, 0.0, 0.0, 10, 0.0],
        [0.0, 0.0, -10, 0.0, 0.0, 10]
    ];

    var vertices = [-10,0.0,0.0,
                     10,0.0,0.0,
                     0.0,-10,0.0,
                     0.0,10,0.0,
                     0.0,0.0,-10,
                     0.0,0.0,10];

    var lineColors = [
        [1, 1, 0],
        [0, 1 ,0],
        [0, 0, 1]
    ];

    return {
        type : type,
        meshType : meshType,
        vertices : vertices,
        lines : lines,
        lineColors : lineColors
    };
};

module.exports.line = function(start, end) {
    var meshType = 'LINES';
    var type = 'single-line';
    var vertices = [];
    var lines = [];
    var lineColors = [];

    lines.push([start.x, start.y, start.z, end.x, end.y, end.z]);
    lineColors.push([1.0, 0, 0]);

    return {
        type : type,
        meshType : meshType,
        vertices : vertices,
        lines : lines,
        lineColors : lineColors
    };
},

module.exports.planeGrid = function() {
    //@TODO pass in surface vector and extent - parametric surfaces
    var meshType = 'LINES';
    var type = 'plane-grid';
    var vertices = [];
    var lines = [];
    var lineColors = [];

    var minX = -10;
    var maxX = 10;
    var minZ = -10;
    var maxZ = 10;
    var step = 1;

    for(var i = minX; i <= maxX; i += step) {
        lines.push([i, 0, minZ, i, 0, maxZ]);
        lineColors.push([0.643, 0.643, 0.643]);
    }

    for(var j = minZ; j <= maxZ; j += step) {
        lines.push([minX, 0, j, maxX, 0, j]);
        lineColors.push([0.643, 0.643, 0.643]);
    }

    return {
        type : type,
        meshType : meshType,
        vertices : vertices,
        lines : lines,
        lineColors : lineColors
    };
};

module.exports.cube = function() {
    var meshType = 'TRIANGLES';
    // cube geom just return ordered vertices for triangles
    var type = 'cube';
    var vertices = [];
    var triangleElements = [];

    // Triangle vertices
    var triangleIndices = [
        // Front face
        // 0 1 2
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,

        // 0 2 3
        -1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        //4, 5, 6,
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,

        //4, 6, 7,
        -1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,

        // Top face
        //8, 9, 10,
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,

        //8, 10, 11,
        -1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,

        // Bottom face
        //12, 13, 14,
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,

        //12, 14, 15,
        -1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
        //16, 17, 18,
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,

        //16, 18, 19,
         1.0, -1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,

        //Left face
        //20, 21, 22,
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,

        //20, 22, 23
        -1.0, -1.0, -1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0
    ];


 // Triangle vertices
    var triangles = [
        // Front face
        // 0 1 2
        [-1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0],

        // 0 2 3
        [-1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0],

        // Back face
        //4, 5, 6,
        [-1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0],

        //4, 6, 7,
        [-1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0],

        // Top face
        //8, 9, 10,
        [-1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0],

        //8, 10, 11,
        [-1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0],

        // Bottom face
        //12, 13, 14,
        [-1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0],

        //12, 14, 15,
        [-1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0],

        // Right face
        //16, 17, 18,
        [ 1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0],

        //16, 18, 19,
        [ 1.0, -1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0],

        //Left face
        //20, 21, 22,
        [-1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0],

        //20, 22, 23
        [-1.0, -1.0, -1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0]
    ];

    return {
        type : type,
        meshType : meshType,
        vertices : vertices,
        triangleIndices : triangleIndices,
        triangles : triangles
    };
};