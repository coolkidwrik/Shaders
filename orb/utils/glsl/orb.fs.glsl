varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vViewPosition;

void main() {
    gl_FragColor = vec4(abs(-vViewPosition), 1.0);
}