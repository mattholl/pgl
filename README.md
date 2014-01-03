## pgl

A node module to provide a mesh drawing libray for use with the Plask programming environment for OSX.

Light, camera and mesh objects can be added to a scene.

The scene is an even emitter which enables objects within the scene to respond to each other. This may be overkill.

This was written for a specific project requiring flat surface shading (heavily inspired by [https://github.com/wagerfield/flat-surface-shader](https://github.com/wagerfield/flat-surface-shader)) so there is a certain degree of hardcoding of values towards this end.

If the plask binaries are installed the cube example can run with the command:

        plask example/cube.js

Mouse drag over the window defaults to controlling the camera orbit.

Holding the Command key will translate the origin used for the orbit camera.

Pressing 'r' will reset to the world origin.

Holding Control will apply the mouse drag the rotation of the cube.

