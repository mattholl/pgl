/**
 * A scene graph object.
 * The scene does not maintain hierarchy it just facilitates event emission and
 * response between child objects. It also keeps a current eye / view matrix to pass to the renderer
 * this is set whenever the camera emits an update event.
 *
 * @TODO
 *     + Throttle the event emission rate?
 *     + move the model view stack onto the renderer?
 *
 */

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var plask = require('plask');

var pglUtils = require('./utils');
var camera = require('./camera');
var light = require('./light');

var mesh = require('./mesh');
var geom = require('./geom');

var scene = function() {
    var self = this;

    this.winWidth = null;
    this.winHeight = null;

    EventEmitter.call(this);
    this.lights = [];
    this.cameras = [];
    this.meshes = [];

    // add a transform stack to push onto and pop from when rendering
    this.mvStack = [];

    this.viewCurrent = new plask.Mat4();
    this.eyeCurrent = new plask.Mat4();

    // When the camera sends eye matrix updates store it and set the inverse to a view matrix
    this.on('camera', function(camera) {
        self.eyeCurrent = camera.eye;
        self.viewCurrent = camera.eye.dup().invert();
    });

    this.on('mesh', function(mesh) {
        console.log('mesh added : ' + mesh.name);
    });
};

util.inherits(scene, EventEmitter);

scene.prototype.setWindow = function(width, height) {
    this.winWidth = width;
    this.winHeight = height;
};

scene.prototype.addLight = function(params) {

    var l;

    if(!params){
        l = new light();
    } else {
        params.scene = this;
        l = new light(params);
    }

    this.lights.push(l);
};

scene.prototype.addCamera = function(params) {
    // @TODO add different camera types, different focal lengths
    // orthographic and perspective to swap out on command
    // var c = new camera(width, height, location);
    var c;

    if(!params) {
        c = new camera();
    } else {
        c = new camera({
            width : params.width,
            height : params.height,
            position : params.position,
            scene : this
        });
    }

    this.cameras.push(c);

    this.setWindow(params.width, params.height);
};

// Objects

scene.prototype.addMesh = function(mesh) {
    this.meshes.push(mesh);
};

scene.prototype.addFloor = function() {

};

scene.prototype.addAxes = function() {

};

// Interaction

scene.prototype.handleMouse = function(e) {
    // alternative would be to split out the mouse vectors here?
    // process the event to emit just relevent data for the scene object to respond
    // emit rotQuat events?
    this.emit('mouse', e);
};

scene.prototype.handleKey = function(e) {
    // currently only reset the camera target with 'r'
    this.emit('key', e);
};

// @TODO target or scene.mesh = a flag to show whichever mesh is active
// each one chooses whether to respond if it has been picked

scene.prototype.update = function() {
    // anything animating on a timer
};

module.exports = scene;
