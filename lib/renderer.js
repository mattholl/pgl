/**
 * Main WebGL renderer
 * Tightly bound with the Plask WebGL implementation.
 *
 * @TODO
 *     + Shader attributes are hardcoded on creation, these should be queried from the mprogram obj
 *     + is the caching of buffer objects working?
 */

var plask = require('plask');
var pglUtils = require('./utils');

var mesh;
var light = {};

var gl, mprogram;
var buffersForAttributes = {};

function create( params ) {

    var gl = params.gl;
    var mprogram = plask.gl.MagicProgram.createFromBasename(gl, params.shaderPath, params.shaderName);

    gl.viewport(0, 0, params.width, params.height);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    this.gl = gl;
    this.mprogram = mprogram;

    // @TODO Get these out of the mprogram
    // but the attributes are strings in the render function

    this.buffersForAttributes = {
        'location_aVertexPosition': {
            itemSize : 3,
            arrayData : null,
            cacheData : null
        },
        'location_aAmbient': {
            itemSize : 3,
            arrayData : null,
            cacheData : null
        },
        'location_aDiffuse' : {
            itemSize : 3,
            arrayData : null,
            cacheData : null
        },
        'location_aVertexNormal' : {
            itemSize : 3,
            arrayData : null,
            cacheData : null
        },
        'location_aVertexCentroid' : {
            itemSize : 3,
            arrayData : null,
            cacheData : null
        }
    };
}


// A scene object contains the meshes to be drawn, any lights and a simple camera object
function render( scene ) {

    var gl = this.gl;
    var mprogram = this.mprogram;

    mprogram.use();

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // push the curernt mv into the stack scene.mvStack
    var viewGlobal = scene.viewCurrent.dup();

    // reset mv stack
    scene.mvStack = [];
    scene.mvStack.push(viewGlobal);

    for(var meshIndex = 0; meshIndex < scene.meshes.length; meshIndex++) {

        var globMat = scene.mvStack[0];

        var mesh = scene.meshes[meshIndex];

        // apply rotations and translations from the mesh object
        // dup mv multiply by mvMesh
        var mvLocal = new plask.Mat4();
        mvLocal.mul2(globMat, mesh.model);

        // push this into the mesh stach
        scene.mvStack.push(mvLocal);

        // Set the shader attribute to the top in the matrix stack
        // At the end of the render loop for this mesh pop the stack
        mprogram.set_uMVMatrix( mvLocal );

        // Set the projection matrix and light position + color
        mprogram.set_uPMatrix( scene.cameras[0].perspMat );

        // // Set the position and colour values for the light
        mprogram.set_uLightPosition( scene.lights[0].position );
        mprogram.set_uLightAmbient( scene.lights[0].ambientColor );
        mprogram.set_uLightDiffuse( scene.lights[0].diffuseColor );

        var numVertices = 0;
        var numItems = 0;

        var i = 0, k = 0;
        var triangle, vertex;
        var buffer, itemSize;

        var vecColourAmbient;
        var vecColourDiffuse;
        var vertexIndex = 0;

        // var norm = scene.meshes[0].normMat;
        var norm;

        switch(mesh.meshType) {

            case 'TRIANGLES':

                // How many vertices are there?
                numVertices = mesh.triangles.length * 3;
                numItems = numVertices * 3;

                // Boolean to switch shading
                mprogram.set_uWireframe(mesh.wireframe);

                // Set normal matrix
                norm = pglUtils.toInverseMat3( mvLocal );
                norm.transpose();
                mprogram.set_uNMatrix( norm );

                if(mesh.dirty) {

                    for(var attribute in this.buffersForAttributes) {

                        // dirty cache i want you, dirty cache i need you
                        // reset values of i and k
                        i = 0; k = 0;
                        triangle = null;
                        vertex = null;
                        vecColourAmbient = null;
                        vecColourDiffuse = null;

                        // Create buffer object
                        itemSize = this.buffersForAttributes[attribute].itemSize;
                        this.buffersForAttributes[attribute].arrayData = createBuffer(numVertices, itemSize);
                        buffer = this.buffersForAttributes[attribute].arrayData;

                        this.buffersForAttributes[attribute].cacheData = createCache(numVertices, itemSize);

                        vertexIndex = 0;

                        for(i = 0; i < mesh.triangles.length; i++) {
                            triangle = mesh.triangles[i];

                            for(k = 0; k < triangle.vertices.length; k++) {
                                vertex = triangle.vertices[k];

                                switch(attribute) {
                                    case 'location_aVertexPosition':
                                        setBufferData(vertexIndex, this.buffersForAttributes[attribute], vertex);
                                        break;

                                    case 'location_aAmbient':
                                        // vecColourAmbient = utils.hexToRGB(triangle.material.ambient); ////// actually need to convert to a vector
                                        setBufferData(vertexIndex, this.buffersForAttributes[attribute], triangle.material.ambient);
                                        break;

                                    case 'location_aDiffuse':
                                        // vecColourDiffuse = utils.hexToRGB(triangle.material.diffuse);
                                        setBufferData(vertexIndex, this.buffersForAttributes[attribute], triangle.material.diffuse);
                                        break;

                                    case 'location_aVertexNormal':
                                        setBufferData(vertexIndex, this.buffersForAttributes[attribute], triangle.normal);
                                        break;

                                    case 'location_aVertexCentroid':
                                        setBufferData(vertexIndex, this.buffersForAttributes[attribute], triangle.centroid);
                                        break;

                                }
                                vertexIndex++;
                            }

                        }

                        // Upload attribute buffer data
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
                        gl.bufferData(gl.ARRAY_BUFFER, buffer.data, gl.STATIC_DRAW);

                        gl.enableVertexAttribArray(mprogram[attribute]);
                        gl.vertexAttribPointer(mprogram[attribute], buffer.itemSize, gl.FLOAT, false, 0, 0);

                    }

                    // @TODO
                    // mesh.dirty = false; // can't do this because buffer needs to get reused for other meshes
                    // dirty flag can be used to avoid unecessary updates

                } else {

                    // The mesh geometry is clean so set directly from the cached Float32Array
                    for(var cacheAttribute in this.buffersForAttributes) {

                        // @TODO
                        // mprogram.location not set return with an error

                        var cacheArray = this.buffersForAttributes[cacheAttribute].cacheData;

                        itemSize = this.buffersForAttributes[cacheAttribute].itemSize;
                        buffer = this.buffersForAttributes[cacheAttribute].arrayData;

                        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
                        gl.bufferData(gl.ARRAY_BUFFER, cacheArray.data, gl.STATIC_DRAW);

                        gl.enableVertexAttribArray(mprogram.location_aVertexPosition);
                        gl.vertexAttribPointer(mprogram[cacheAttribute], buffer.itemSize, gl.FLOAT, false, 0, 0);
                    }

                }

                // Draw the triangles
                gl.drawArrays(gl.TRIANGLES, 0, numItems);

                break;

            case 'LINES':

                var line;

                // How many vertices are there?
                numVertices = mesh.lines.length * 2;
                numItems = numVertices * 3;

                mprogram.set_uMVMatrix( mvLocal );
                mprogram.set_uWireframe(mesh.wireframe);

                if(mesh.dirty) {
                    for(var lineAttribute in this.buffersForAttributes) {

                        itemSize = this.buffersForAttributes[lineAttribute].itemSize;
                        this.buffersForAttributes[lineAttribute].arrayData = createBuffer(numVertices, itemSize);
                        buffer = this.buffersForAttributes[lineAttribute].arrayData;

                        this.buffersForAttributes[lineAttribute].cacheData = createCache(numVertices, itemSize);

                        vertexIndex = 0;

                        for (i = 0; i < mesh.lines.length; i++) {

                            line = mesh.lines[i];

                            for(k = 0; k < line.vertices.length; k++) {

                                vertex = line.vertices[k];

                                switch(lineAttribute) {
                                    case 'location_aVertexPosition':
                                        setBufferData(vertexIndex, this.buffersForAttributes[lineAttribute], vertex);
                                        break;
                                    case 'location_aDiffuse':
                                        setBufferData(vertexIndex, this.buffersForAttributes[lineAttribute], line.material.diffuse);
                                        break;
                                }
                                vertexIndex++;
                            }
                        }

                        // Upload attribute buffer data
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
                        gl.bufferData(gl.ARRAY_BUFFER, buffer.data, gl.STATIC_DRAW);

                        gl.enableVertexAttribArray(mprogram[lineAttribute]);
                        gl.vertexAttribPointer(mprogram[lineAttribute], buffer.itemSize, gl.FLOAT, false, 0, 0);

                    }

                } else {
                    // need to set buffers for each object array ....?
                }

                gl.drawArrays(gl.LINES, 0, numItems);

                break;

            case 'POINTS':
                var point;

                numVertices = mesh.points.length;
                numItems = numVertices * 3;

                mprogram.set_uMVMatrix( mvLocal );
                mprogram.set_uPointMesh(mesh.pointMesh);

                if(mesh.pointMesh) {
                    mprogram.set_uPointSize(mesh.pointSize);
                }

                if(mesh.dirty) {
                    for(var pointAttribute in this.buffersForAttributes) {

                        itemSize = this.buffersForAttributes[pointAttribute].itemSize;
                        this.buffersForAttributes[pointAttribute].arrayData = createBuffer(numVertices, itemSize);
                        buffer = this.buffersForAttributes[pointAttribute].arrayData;

                        this.buffersForAttributes[pointAttribute].cacheData = createCache(numVertices, itemSize);

                        vertexIndex = 0;

                        for (i = 0; i < mesh.points.length; i++) {

                            point = mesh.points[i];

                            switch(pointAttribute) {
                                case 'location_aVertexPosition':
                                    setBufferData(vertexIndex, this.buffersForAttributes[pointAttribute], point.position);
                                    break;
                                case 'location_aDiffuse':
                                    setBufferData(vertexIndex, this.buffersForAttributes[pointAttribute], point.material.diffuse);
                                    break;
                            }

                        }

                        // Upload attribute buffer data
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
                        gl.bufferData(gl.ARRAY_BUFFER, buffer.data, gl.STATIC_DRAW);

                        gl.enableVertexAttribArray(mprogram[pointAttribute]);
                        gl.vertexAttribPointer(mprogram[pointAttribute], buffer.itemSize, gl.FLOAT, false, 0, 0);

                    }

                } else {
                    // need to set buffers for each object array ....?
                }

                gl.drawArrays(gl.POINTS, 0, numItems);

                break;

        } // close case switch for the mesh type

        // pop the stack
        scene.mvStack.pop();

    } // close for each on meshes in the scene

}


function createBuffer(numItems, itemSize, floatArray) {
    var gl = module.exports.gl;
    var data = new Float32Array(numItems * itemSize);
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    return {
        buffer : buffer,
        numItems : numItems,
        data : data,
        itemSize : itemSize
    };
}

function createCache(numItems, itemSize) {
    var data = new Float32Array(numItems * itemSize);

    return {
        data : data,
        numItems : numItems,
        itemSize : itemSize
    };
}

function setBufferData(index, buffer, value) {
    if(typeof value === 'number') {
        buffer.arrayData.data[index * buffer.itemSize] = value;
        buffer.cacheData.data[index * buffer.itemSize] = value;
    } else if(value instanceof plask.Vec3) {
        buffer.arrayData.data[index * buffer.itemSize] = value.x;
        buffer.arrayData.data[index * buffer.itemSize + 1] = value.y;
        buffer.arrayData.data[index * buffer.itemSize + 2] = value.z;

        buffer.cacheData.data[index * buffer.itemSize] = value.x;
        buffer.cacheData.data[index * buffer.itemSize + 1] = value.y;
        buffer.cacheData.data[index * buffer.itemSize + 2] = value.z;
    } else if(typeof value === 'object') {
        for(var i = value.length - 1; i >=0; i--) {
            buffer.arrayData.data[index * buffer.itemSize + i] = value[i];
            buffer.cacheData.data[index * buffer.itemSize + i] = value[i];
        }
    }

}


module.exports = {
    gl : gl,
    mprogram : mprogram,
    create : create,
    render : render
};