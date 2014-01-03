attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
varying vec4 vColor;

void main() {
    vColor = vec4(aVertexColor, 1.0);
    gl_Position = vec4(aVertexPosition, 1.0);
}