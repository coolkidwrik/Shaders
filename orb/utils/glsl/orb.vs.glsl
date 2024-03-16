uniform float utime;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vViewPosition;

void main() {
    vNormal = normalMatrix * normal;
    vUv = uv;
    vec4 pos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // pos.z = pos.z + sin(utime + position.x) + 1.0;
    // pos.x = pos.x + sin(2.0*utime + position.x) + 1.0;
    // pos.y = pos.y + sin(3.0*utime + position.x) + 1.0;

    gl_Position = pos;
    vViewPosition = (modelMatrix * vec4(position, 1.0)).xyz;
}