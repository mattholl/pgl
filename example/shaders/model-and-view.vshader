attribute vec3 aVertexPosition;
attribute vec3 aAmbient;
attribute vec3 aDiffuse;

attribute vec3 aVertexNormal;
attribute vec3 aVertexCentroid;

uniform mat4 umMatrix;
uniform mat4 uvMatrix;

uniform mat4 uPMatrix;

varying vec4 vColor;

void main() {

    // vColor = vec4(aAmbient, 1.0);
    // vColor = vec4(aDiffuse, 1.0);
    vColor = vec4(aDiffuse, 1.0);
    vec3 norm = aVertexNormal;
    vec3 cent = aVertexCentroid;
    gl_Position = uPMatrix *  umMatrix * uvMatrix * vec4(aVertexPosition, 1.0);
}