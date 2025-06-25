// this assumes there is only a single light source lighting the scene
uniform vec3 lightPosition;

out vec3 viewPosition;
out vec3 worldPosition;
out vec3 interpolatedNormal;
out float fresnel;

void main() {
    // world position is the position of the vertex in the world space
    worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;

    // view position is the position of the camera
    // camera matrix is the inverse of the view matrix
    // last column is the translation in the world space (camera position in world space)
    viewPosition = (inverse(viewMatrix) * vec4(0.0 ,0.0 ,0.0 , 1.0)).xyz;

    // normal is a vector in the world frame
    // translation of the normal is done my the inverse transpose of the of the transformation matrix
    // applied to the object
    interpolatedNormal = mat3(inverse(transpose(modelMatrix))) * normal;

    fresnel = dot(normalize(viewPosition), normalize(interpolatedNormal));

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
