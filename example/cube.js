var plask = require('plask');
var pgl = require('../index');
var util = require('util');

plask.simpleWindow({
    settings: {
        width: 640,
        height: 480,
        type: '3d',
        vsync: true,
        multisample: true
    },

    init : function() {

        this.framerate(60);

        var gl = this.gl;

        pgl.renderer.create({
            gl : gl,
            width : this.width,
            height : this.height,
            shaderPath : __dirname + '/pgl-shaders',
            shaderName : 'flat-surface'
        });

        pgl.scene.addLight({
            position : { x : -10, y : 0, z : 0 }
        });

        pgl.scene.addCamera({
            width : this.width,
            height : this.height,
            position : new plask.Vec3(0, 1, 10) // move the camera on the positve z axis
        });

        var cube = new pgl.mesh({
            geometry : new pgl.geom.cube(),
            scene : pgl.scene,
            name : 'cube', // generate
            position : new plask.Vec3(0, 0, 0),
            picked : true
        });

        pgl.scene.addMesh( cube );

        var floor = new pgl.mesh({
            geometry : new pgl.geom.planeGrid(),
            scene : pgl.scene,
            name : 'floor',
            position: new plask.Vec3(0, 0, 0),
            wireframe : true
        });

        pgl.scene.addMesh( floor );

        var axes = new pgl.mesh({
            geometry : new pgl.geom.axes(),
            scene : pgl.scene,
            name : 'axes',
            position : new plask.Vec3(0, 0, 0),
            wireframe : true
        });

        pgl.scene.addMesh( axes );

        setTimeout(function() {
            cube.addTriangle({
                vertices : [1, 1, 1,-1, -1, -1, 1, 2, 1],
                material : {
                    ambient : new plask.Vec3(1.0, 0.0, 0.0),
                    diffuse : new plask.Vec3(1.0, 0.0, 0.0)
                }
            });
        }, 1000);

        this.on('leftMouseDown', function(e) {
            pgl.scene.handleMouse(e);
        });

        this.on('leftMouseUp', function(e) {
            pgl.scene.handleMouse(e);
        });

        this.on('leftMouseDragged', function(e) {
            pgl.scene.handleMouse(e);
        });

        this.on('scrollWheel', function(e) {
            pgl.scene.handleMouse(e);
        });

        this.on('keyUp', function(e) {
            pgl.scene.handleKey(e);
        });

        this.pgl = pgl;
    },

    draw : function() {
        var pgl = this.pgl;
        pgl.renderer.render( pgl.scene );
    }
});