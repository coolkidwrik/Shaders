varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
    gl_FragColor = vec4(abs(vNormal), 1.0);
}