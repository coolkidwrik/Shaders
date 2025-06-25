// Assumes only one light source lighting up the scene
uniform vec3 lightPosition;

out vec3 interpolatedNormal;
out vec3 lightDirection;
out vec3 viewPosition;
out float fresnel;

void main() {
    vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    
    // normal is a vector in the world frame
    // translation of the normal is done my the inverse transpose of the of the transformation matrix
    // applied to the object
    interpolatedNormal = normalize(mat3(inverse(transpose(modelMatrix))) * normal);

    lightDirection = normalize(lightPosition - worldPosition);

    // view position is the position of the camera
    // camera matrix is the inverse of the view matrix
    // last column is the translation in the world space (camera position in world space)
    viewPosition = normalize((inverse(viewMatrix) * vec4(0.0 ,0.0 ,0.0 , 1.0)).xyz);

    // this refers to the dot product of view direction and normal
    fresnel = dot(normalize(viewPosition), normalize(interpolatedNormal));

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
