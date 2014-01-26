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
        var self = this;

        pgl.renderer.create({
            gl : gl,
            width : this.width,
            height : this.height,
            shaderPath : __dirname + '/shaders',
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
        pgl.scene.addFloor();
        pgl.scene.addAxes();

        // var points = new pgl.mesh({
        //     geometry : new pgl.geom.points(),
        //     scene : pgl.scene,
        //     name : 'points',
        //     position : new plask.Vec3(0, 0, 0),
        //     pointMesh : true,
        //     pointSize : 3
        // });

        // points.addPoint({
        //     position : new plask.Vec3(1, 2.0, 1),
        //     material : {
        //         diffuse : new plask.Vec3(1.0, 0.0, 0.0)
        //     }
        // });

        // pgl.scene.addMesh( points );

        setTimeout(function() {
            cube.addTriangle({
                vertices : [1, 1, 1,-1, -1, -1, 1, 2, 1],
                material : {
                    ambient : new plask.Vec3(1.0, 0.0, 0.0),
                    diffuse : new plask.Vec3(1.0, 0.0, 0.0)
                }
            });
        }, 1000);

        var mouseEvents = ['leftMouseDown', 'leftMouseUp', 'leftMouseDragged', 'scrollWheel'];

        mouseEvents.forEach(function(mouseEvent) {
            self.on(mouseEvent, function(e) {
                pgl.scene.handleMouse(e);
            });
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