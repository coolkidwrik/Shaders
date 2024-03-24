in vec3 vcsNormal;
in vec3 vcsPosition;

uniform vec3 lightDirection;

uniform samplerCube skybox;

uniform mat4 matrixWorld;

void main( void ) {
    // work in progress
    vec3 reflectionVector = reflect(normalize(vcsPosition), normalize(vcsNormal));

    gl_FragColor = texture(skybox, reflectionVector);
}