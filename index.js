
var plask = require('plask');

// Renderer sets up shaders
// retains the gl and mprogram objects
var renderer = require('./lib/renderer');

var mesh = require('./lib/mesh');
var events = require('events');
var geom = require('./lib/geom');

// A scene object needs to be created to set up EventEmitter inheritance
// The scene acts as an event emitter, the lights, cameras and meshes can trigger events
// on the scene to emit updates without direct binding.
var scene = require('./lib/scene');
var sceneGraph = new scene();

module.exports = {
    renderer : renderer,
    mesh : mesh,
    geom : geom,
    scene : sceneGraph
};
