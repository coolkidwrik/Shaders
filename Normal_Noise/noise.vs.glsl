uniform float ticks;

out vec3 vPosition;
out vec3 vNormal;
out vec2 vUv;

void main() {
    vPosition = position;
    vNormal = normal;
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
