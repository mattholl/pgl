/**
 * Camera object
 * Responds directly to mouse drag increasing / decreasing azimuth or elevation accordingly
 *
 * @TODO
 *     + better way of dealing with params getting passed into the constructor
 *     + improve the track function, it's not really a tracking camera...
 *     + easing, lerping -> animation/simulation code
 *     + adjust zoom / perspective matrix when dollying, Hitchcock dolly zoom
 *     + Magic Mouse dollying - using dx as well?
 */

var plask = require('plask');

function camera(params) {

    var self = this;
    //@TODO if params is an object with other params use it otherwise assume it's the scene object

    if(!params) {

        this.position = new plask.Vec3(0,0,0);
        this.eye = new plask.Mat4();
        this.perspMat = new plask.Mat4().perspective(45, 640 / 480, 0.1, 100.0);

    } else {

        this.scene = params.scene;

        // Set a starting eye matrix from the scene.
        this.eye = this.scene.eyeCurrent.dup();

        // @TODO apply starting rotations to the correct axes
        this.elevation = params.elevation || 0;
        this.azimuth = params.azimuth || 0;

        // Position vector
        this.position = params.position || new plask.Vec3(0,0,0);
        this.eye.translate(this.position.x, this.position.y, this.position.z);

        // Projection matrix
        this.perspMat = new plask.Mat4().perspective(45, params.width / params.height, 0.1, 100.0) || new plask.Mat4().perspective(45, 640 / 480, 0.1, 100.0);

        // Set the centre of orbit for the camera
        this.target = new plask.Vec3(0 ,0, 0);

        // Emit the camera eye matrix, the scene keeps an up to date reference to this matrix and it
        // is used in the renderer.
        this.scene.emit('camera', { 'eye' : this.eye });
    }

    // Set up event handlers for the events coming through from the scene.
    this.scene.on('mouse', function(e) {

        // Key presses trigger interactions with objects / meshes in the scene
        if(e.ctrl || e.shift) {
            return;
        } else if(e.cmd) {
            // Move the target origin, look at target
            self.track(e);
        } else {
            switch (e.type) {
                case 'scrollWheel':
                    self.dolly(e);
                    break;
                case 'leftMouseDown':
                    self.mouseDown(e);
                    break;
                case 'leftMouseUp':
                    self.mouseUp(e);
                    break;
                case 'leftMouseDragged':
                    self.orbit(e);
                    break;
            }
        }
    });

    this.scene.on('key', function(e) {
        switch(e.str) {
            case 'r':
                self.resetTarget();
                break;
        }
    });

    // Keep track of the mouse events
    this.mouse = {
        down : false,
        x : null,
        y : null
    };

}

// @TODO add smoothing / easing between values here
// for the magic mouse scrollWheeel has a dx
// @TODO adjust perspective when dollying for dolly zoom
camera.prototype.dolly = function(e) {

    this.position.z = this.position.z + e.dy;

    // Get an identity matrix
    var newTrans = new plask.Mat4();

    // Centre on the target location
    newTrans.translate(this.target.x, this.target.y, this.target.z);

    // Apply the rotations for elevation and azimuth changes
    newTrans.rotate(this.azimuth, 0, 1, 0);
    newTrans.rotate(this.elevation, 1, 0, 0);

    // Translate to camera position
    newTrans.translate(this.position.x, this.position.y, this.position.z);

    // Set to the current eye matrix, and emit an event so that other objects can respond if necessary.
    this.eye = newTrans;
    this.scene.emit('camera', { 'eye' : this.eye });
};

camera.prototype.mouseDown = function(e) {
    this.mouse.down = true;
    this.mouse.x = e.x;
    this.mouse.y = e.y;
};

camera.prototype.orbit = function(e) {

    if(!this.mouse.down) {
        return;
    }

    var diffX = e.x - this.mouse.x;
    var diffY = e.y - this.mouse.y;

    var sensitivity = -0.0001;

    // e.dx and e.dy represent the acceleration in the respective direction
    this.azimuth += (diffX * sensitivity) * Math.abs(e.dx);
    this.elevation += (diffY * sensitivity) * Math.abs(e.dy);

    var newTrans = new plask.Mat4();

    // Centre on the target location
    newTrans.translate(this.target.x, this.target.y, this.target.z);

    // Apply the rotations to each axes
    newTrans.rotate(this.azimuth, 0, 1, 0);
    newTrans.rotate(this.elevation, 1, 0, 0);

    // Translate to the camera position
    newTrans.translate(this.position.x, this.position.y, this.position.z);

    // Set the eye matrix, update the last mouse position and emit the new eye matrix as event data.
    this.eye = newTrans;
    this.mouse.x = e.x;
    this.mouse.y = e.y;
    this.scene.emit('camera', { 'eye' : this.eye });
};

// Not really a tracking camera just translation x and y
// Events aren't emitted if CMD key is pressed before mouse drag
// @TODO if rotated then the change in x might need to be applied to the z axis
// multiply by the inverse of the camera matrix to get world coords?
camera.prototype.track = function(e) {

    if(!this.mouse.down) {
        return;
    }

    var diffX = e.x - this.mouse.x;
    var diffY = e.y - this.mouse.y;

    var sensitivity = 0.01;

    var newTrans = new plask.Mat4();

    this.target.x += diffX * sensitivity;
    this.target.y += diffY * sensitivity;

    // translate to centre on the target location
    newTrans.translate(this.target.x, this.target.y, this.target.z);

    // apply camera rotations
    newTrans.rotate(this.azimuth, 0, 1, 0);
    newTrans.rotate(this.elevation, 1, 0, 0);

    // translate to camera position
    newTrans.translate(this.position.x, this.position.y, this.position.z);

    this.eye = newTrans;
    this.mouse.x = e.x;
    this.mouse.y = e.y;

    this.scene.emit('camera', { 'eye' : this.eye });

};

camera.prototype.mouseUp = function() {
    this.mouse.down = false;
};

camera.prototype.resetTarget = function() {
    this.target = new plask.Vec3(0, 0, 0);

    var newTrans = new plask.Mat4();
    // translate to centre on the target location
    newTrans.translate(this.target.x, this.target.y, this.target.z);

    // apply camera rotations
    newTrans.rotate(this.azimuth, 0, 1, 0);
    newTrans.rotate(this.elevation, 1, 0, 0);

    // translate to camera position
    newTrans.translate(this.position.x, this.position.y, this.position.z);

    this.eye = newTrans;

    this.scene.emit('camera', { 'eye' : this.eye });
};

module.exports = camera;