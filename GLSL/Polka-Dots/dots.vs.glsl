uniform vec3 lightPosition;

out vec3 interpolatedNormal;
out vec3 lightDirection;
out vec3 vertexPosition;

void main() {
    // Calculate the normal in world space
    interpolatedNormal = normalMatrix * normal;
    // using model coordinates as the 3D space
    vertexPosition = position;

    // Calculate the light direction in model coordinates
    vec3 modelPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    lightDirection = normalize(lightPosition - modelPosition);

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
