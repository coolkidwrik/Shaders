out vec3 vcsNormal;
out vec3 vcsPosition;
// out vec2 vUv;


void main() {
	// viewing coordinate system
	vcsNormal = normalMatrix * normal; 
	vcsPosition = vec3(modelViewMatrix * vec4(position, 1.0));
	// vUv = uv;
    
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}