// Adapted from fss shader
// Lambert Reflection
// https://github.com/wagerfield/flat-surface-shader/blob/master/README.md

// Per vertex attributes
attribute vec3 aVertexPosition;
attribute vec3 aVertexCentroid;
attribute vec3 aVertexNormal;

attribute vec4 aAmbient;
attribute vec4 aDiffuse;

// Shader uniforms
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

uniform vec3 uLightPosition;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;

// Pass through to the fragment shader
varying vec4 vColor;

void main() {
    // Create color
    vColor = vec4(0.0);

    // Set the light
    vec3 lightPosition = uLightPosition;
    vec4 lightAmbient = uLightAmbient;
    vec4 lightDiffuse = uLightDiffuse;

    // Transform the normal and centroid
    vec3 normalEye = -normalize(uNMatrix * aVertexNormal);
    vec3 centroidEye = normalize(uNMatrix * aVertexNormal);

    // Calculate illuminance
    vec3 ray = normalize(lightPosition - centroidEye);
    float illuminance = dot(normalEye, ray);

    // Calculate ambient light
    vColor += aAmbient * lightAmbient;

    // Calculate diffuse light
    vColor += aDiffuse * lightDiffuse * illuminance;

    // Clamp color
    vColor = clamp(vColor, 0.0, 1.0);

    // Set position
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}