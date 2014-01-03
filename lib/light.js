/**
 * Basic light object
 * Position and colour. That is all.
 */

var plask = require('plask');

function light(params) {

    if(!params) {
        this.position = new plask.Vec3();
        this.ambientColor = new plask.Vec3(1.0, 1.0, 1.0);
        this.diffuseColor = new plask.Vec3(1.0, 1.0, 1.0);
    } else {
        this.position = new plask.Vec3(params.position.x, params.position.y, params.position.z) || new plask.Vec3();
        this.ambientColor = params.ambientVec || new plask.Vec3(1.0, 1.0, 1.0);
        this.diffuseColor = params.diffuseVec || new plask.Vec3(1.0, 1.0, 1.0);
        this.scene = params.scene;
    }

    this.scene.on('camera', function() {
        // console.log('light : camera added');
    });

}

module.exports = light;