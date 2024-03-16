uniform float ticks;

// variables from the fragment shader
in vec3 vPosition;
in vec3 vNormal;
in vec2 vUv;
in float vDisplacement;

// colors that will be used throughout the shader
vec3 color1 = vec3(0.89, 0.08, 0.94); // pink
vec3 color2 = vec3(0.4, 0.92, 0.94); // light blue
vec3 color3 = vec3(0.26, 0.96, 0.61); // green

// Helper Functions
/////////////////////////////////////////////////////////////////////////////////////

vec3 color_intensity() {
    // use the sin fucnction to change the color intensity based on time
    // sine function will give us a value between -1 and 1
    // we add 1 to the result to get a value between 0 and 2
    // we multiply by 0.5 to get a value between 0 and 1

    // I encorporate the vertexPosition components to have the change in color propogate through the mesh
    // powers can be adjusted to make interesting patterns
    float y_comp = pow(vPosition.y, 1.0);
    float x_comp = pow(vPosition.x, 1.0);
    float z_comp = pow(vPosition.x, 2.0);
    vec3 mix1 = mix(vec3(1.0), color2, (0.5*sin(2.0*abs(y_comp + x_comp + z_comp + ticks))+1.0));
    return mix1;
}


vec3 depth_adjustment() {
    // blends final color with white based on depth
    // this adds additional depth and color blending to the dots
    // I think it looks pretty cool
    
    // NOTE: I also realised that the shader material provides a cameraPosition uniform, 
    // so that could be used instead of the camera matrix as I did in the toon shader and blinn-phong shader

    // Smoothly change dot color
    float depthGradient = dot(normalize(vPosition), normalize(cameraPosition - vPosition));
    // Mix the final color with the depth gradient
    vec3 depthColor = mix(color_intensity(), vec3(1.0), depthGradient);
    // Set the final color with depth gradient
    return depthColor;
}

// Main
/////////////////////////////////////////////////////////////////////////////////////
void main() {
    gl_FragColor = vec4(vec3(vDisplacement) * depth_adjustment(), 1.0);
}
