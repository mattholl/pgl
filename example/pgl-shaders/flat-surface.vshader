// Adapted from fss shader
// Lambert Reflection
// https://github.com/wagerfield/flat-surface-shader/blob/master/README.md

// Per vertex attributes
attribute vec3 aVertexPosition;
attribute vec3 aVertexCentroid;
attribute vec3 aVertexNormal;

attribute vec3 aAmbient;
attribute vec3 aDiffuse;

// Shader uniforms
// uniform mat4 uMMatrix;
// uniform mat4 uVMatrix;

uniform mat4 uMVMatrix;
uniform mat3 uNMatrix;

uniform mat4 uPMatrix;

uniform vec3 uLightPosition;
uniform vec3 uLightAmbient;
uniform vec3 uLightDiffuse;

uniform bool uWireframe;
uniform bool uPerVertexColor;

// Pass through to the fragment shader
varying vec4 vColor;

void main() {
    if(uWireframe) {
        vColor = vec4(aDiffuse, 1.0);
    } else {
        // Create color
        vColor = vec4(0.0);

        // Set the light
        vec3 lightPosition = uLightPosition;
        vec4 lightAmbient = vec4(uLightAmbient, 1.0);
        vec4 lightDiffuse = vec4(uLightDiffuse, 1.0);

        // Transform the normal and centroid
        vec3 normalEye = -normalize(uNMatrix * aVertexNormal);
        vec3 centroidEye = normalize(uNMatrix * aVertexCentroid);

        // Calculate illuminance
        vec3 ray = normalize(lightPosition - centroidEye);
        float illuminance = dot(normalEye, ray);

        // Calculate ambient light
        vColor += vec4(aAmbient, 1.0) * lightAmbient;

        // Calculate diffuse light
        vColor += vec4(aDiffuse, 1.0) * lightDiffuse * illuminance;

        // vColor = vec4(aDiffuse, 1.0);

        // Clamp color
        vColor = clamp(vColor, 0.0, 1.0);
    }
    // Set position
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    // gl_Position = uPMatrix * uMMatrix * uVMatrix * vec4(aVertexPosition, 1.0);
    // gl_Position = uPMatrix * uvMatrix * umMatrix * vec4(aVertexPosition, 1.0);


}