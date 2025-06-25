// https://makc3d.wordpress.com/2017/01/19/sampling-equirectangular-textures/
in vec3 vcsNormal;
in vec3 vcsPosition;
in vec2 vUv;

uniform samplerCube skybox;

uniform mat4 matrixWorld;

void main( void ) {
    // work in progress
  vec3 reflectionVector = reflect(normalize(vcsPosition), normalize(vcsNormal));

  gl_FragColor = texture(skybox, vec3(matrixWorld*vec4(reflectionVector, 0.0)));
  // gl_FragColor = vec4(texture(skybox, vUv).xyz, 1.0);

  // gl_FragColor = texture(skybox, vec3(inverse(viewMatrix)*vec4(reflectionVector, 0.0))); // alternative
}