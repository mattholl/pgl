/**
 * Base 3D object.
 * An array of triangles or lines
 * Should be able to use as the base object for inheritance with for example
 * different mesh generation algorithms.
 *
 * @TODO
 *     + Hit detection
 */

var util = require('util');
var plask = require('plask');
var vertex = require('./vertex');
var line = require('./line');
var triangle = require('./triangle');
var vertex = require('./vertex');
var geom = require('./geom');

var mesh = function( params ) {

    var self = this;
    this.scene = params.scene;

    this.timestamp = new Date().getTime();
    this.index = this.scene.meshes.length + 1;
    this.name = params.name || '';
    this.type = params.geometry.type;
    this.meshType = params.geometry.meshType;

    this.vertices = [];

    this.wireframe = params.wireframe || false;
    this.pointMesh = params.pointMesh || false;

    // If a geometry object was passed in to create the mesh use it
    if(params.geometry.meshType === 'TRIANGLES') {
        this.meshType = 'TRIANGLES';
        this.triangles = [];
        var triangles = params.geometry.triangles;
        var material = params.material || { ambient : new plask.Vec3(0.0, 1.0, 0.0), diffuse : new plask.Vec3(0.0, 1.0, 0.0) };

        triangles.forEach(function(triangle) {
            self.addTriangle({
                vertices : triangle,
                material : material
            });
        });
    }

    if(params.geometry.meshType === 'LINES') {
        this.meshType = 'LINES';
        this.lines = [];
        this.vertices = params.geometry.vertices;
        var lines = params.geometry.lines;

        var materialDiffuse = new plask.Vec3(0.0, 1.0, 0.0);

        lines.forEach(function(line, index) {
            self.addLine({
                vertices : line,
                material : {
                    diffuse : params.geometry.lineColors[index] || materialDiffuse
                }
            });
        });
    }

    if(params.geometry.meshType === 'POINTS') {
        this.meshType = 'POINTS';
        this.points = [];
        this.pointSize = params.pointSize;
    }

    // Setup matrix uniforms
    this.viewWorld = this.scene.viewCurrent.dup();
    this.model = new plask.Mat4();

    this.position = params.position || new plask.Vec3(0, 0, 0);
    this.model.translate(this.position.x, this.position.y, this.position.z);

    // Do we have a rotation?
    // @TODO set this.rotX, this.rotY, this.rotZ from params
    this.rotation = new plask.Mat4();

    // Keep the global eye/view
    this.scene.on('camera', function(eye) {
        self.eyeCurrent = eye.eye;
    });

    // Set listeners for events from the scene
    this.scene.on('mouse', function(e) {
        // Only deal with it if ctrl is pressed and it has been picked from the scene
        if(!e.ctrl && !this.picked) {
            return;
        } else {
            switch(e.type) {
                case 'scrollWheel':
                    break;
                case 'leftMouseDown':
                    self.mouseDown(e);
                    break;
                case 'leftMouseDragged':
                    self.rotate(e);
                    break;
                case 'leftMouseUp':
                    self.mouseUp(e);
                    break;
            }
        }
    });

    this.mouse = {
        down : false,
        x : null,
        y : null
    };

    // Should the cached float array for this mesh be regenerated
    this.dirty = true;

    // Is this object picked by default
    this.picked = params.picked || false;

    this.scene.emit('mesh', self);
};


// INTERACTION
mesh.prototype.mouseDown = function(e) {
    if(this.picked) {
        this.mouse.down = true;

        // Map the mouse events position to -1/+1
        this.mouse.x = (2.0 * e.x / this.scene.winWidth) - 1;
        this.mouse.y = -1 * (2.0 * e.y / this.scene.winHeight) + 1;
    }
};

mesh.prototype.rotate = function(e) {

    // Rotate around the axis perpendicular to the direction of the mouse drag
    // assume ctrl pressed
    if(!this.mouse.down) {
        return;
    }

    if(this.picked) {

        var sensitivity = 0.1;

        // Map the mouse events position to -1/+1
        var currMouseX = (2.0 * e.x / this.scene.winWidth) - 1;
        var currMouseY = -1 * (2.0 * e.y / this.scene.winHeight) + 1;

        // Get the start and end vectors for screen space for the mouse drag
        var start = new plask.Vec3(this.mouse.x, this.mouse.y, 0);
        var end = new plask.Vec3(currMouseX, currMouseY, 0);

        // Convert from screen to world space
        var startWorld = this.eyeCurrent.mulVec3(start);
        var endWorld = this.eyeCurrent.mulVec3(end);

        // Calculate a single vector for the drag in world space
        var dragVecWorld = new plask.Vec3().sub2(endWorld, startWorld);

        // Calculate the magnitude of the drag vector using the dx, dy acceleration component
        var mag = dragVecWorld.length();

        var diffVec = new plask.Vec3(e.dx, e.dy, 0);
        var diffVecWorld = this.eyeCurrent.mulVec3(diffVec);
        var diffVecWorldMag = diffVecWorld.length();

        var dragMag = diffVecWorldMag * mag * sensitivity;

        // Calculate the vector perpendicular to the drag vecto
        var dragVecWorldPerp = new plask.Vec3( startWorld.y * endWorld.z - startWorld.z*endWorld.y,
                                               startWorld.z*endWorld.x - startWorld.x*endWorld.z,
                                               startWorld.x*endWorld.y - startWorld.y*endWorld.x);

        dragVecWorldPerp.normalize();

        // Apply the new rotation
        var newRot = new plask.Mat4();
        newRot.rotate(dragMag, dragVecWorldPerp.x, dragVecWorldPerp.y, dragVecWorldPerp.z);

        // Apply the new rotation to the accumulated rotation
        newRot.mul(this.rotation);

        // Set model to identity
        this.model.reset();

        // Apply translation to position
        this.model.translate(this.position.x, this.position.y, this.position.z);

        this.rotation = newRot;
        this.model.mul(this.rotation);

        this.mouse.x = (2.0 * e.x / this.scene.winWidth) - 1;
        this.mouse.y = -1 * (2.0 * e.y / this.scene.winHeight) + 1;

    }

};

mesh.prototype.mouseUp = function(e) {
    this.mouse.down = false;
};


// GEOMETRY
mesh.prototype.addVertex = function(x, y, z) {
    var v = new vertex(x, y, z);
    this.vertices.push(v);
};

mesh.prototype.addTriangle = function(params) {

    var vertices = params.vertices;
    var material = params.material;

    var vertexA = new vertex(vertices[0], vertices[1], vertices[2]);
    var vertexB = new vertex(vertices[3], vertices[4], vertices[5]);
    var vertexC = new vertex(vertices[6], vertices[7], vertices[8]);

    var tri = new triangle({
        vertices : [vertexA, vertexB, vertexC],
        material : material
    });

    this.vertices.push(vertexA, vertexB, vertexC);
    this.triangles.push(tri);

    this.dirty = true;
};

mesh.prototype.addLine = function(params) {

    var vertices = params.vertices;
    var material = params.material;

    var vertexA = new vertex(vertices[0], vertices[1], vertices[2]);
    var vertexB = new vertex(vertices[3], vertices[4], vertices[5]);

    var l = new line({
        vertices : [vertexA, vertexB],
        material : material
    });

    this.vertices.push(vertexA, vertexB);
    this.lines.push(l);

    this.dirty = true;
};

mesh.prototype.addPoint = function(params) {

    this.points.push({
        position : params.position,
        material : params.material
    });

    this.dirty = true;
};

module.exports = mesh;