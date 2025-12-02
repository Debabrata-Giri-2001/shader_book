uniform float uTime;

varying vec3 vPosition;
varying vec2 vUv;

float PI = 3.14159265;

void main() {
    vUv = uv;
    vPosition = position;

    vec4 mvPosition = modelViewMatrix * vec4(vPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;

}