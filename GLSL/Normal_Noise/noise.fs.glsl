uniform float ticks;

// variables from the fragment shader
in vec3 vPosition;
in vec3 vNormal;
in vec2 vUv;

// colors that will be used throughout the shader
vec3 color1 = vec3(0.89, 0.08, 0.94); // pink
vec3 color2 = vec3(0.4, 0.92, 0.94); // light blue
vec3 color3 = vec3(0.26, 0.96, 0.61); // green

#define PI 3.14159265359


// Helper functions
/////////////////////////////////////////////////////////////////////////////////////


/* 
* SMOOTH MOD
* - authored by @charstiles -
* based on https://math.stackexchange.com/questions/2491494/does-there-exist-a-smooth-approximation-of-x-bmod-y
* (axis) input axis to modify
* (amp) amplitude of each edge/tip
* (rad) radius of each edge/tip
* returns => smooth edges
*/
float smoothMod(float axis, float amp, float rad){
    float top = cos(PI * (axis / amp)) * sin(PI * (axis / amp));
    float bottom = pow(sin(PI * (axis / amp)), 2.0) + pow(rad, 2.0);
    float at = atan(top / bottom);
    return amp * (1.0 / 2.0) - (1.0 / PI) * at;
}

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
    vec3 mix1 = mix(color1, color2, (0.5*sin(2.0*abs(y_comp + x_comp + z_comp + ticks))+1.0));
    vec3 mix2 = mix(mix1, color3, (0.025*sin(2.0*(y_comp + ticks/2.0)))+ 0.25);
    return mix2;
}


vec3 depth_adjustment() {
    // blends final color with white based on depth
    // this adds additional depth and color blending to the dots
    // I think it looks pretty cool
    
    // NOTE: I also realised that the shader material provides a cameraPosition uniform, 
    // so that could be used instead of the camera matrix as I did in the toon shader and blinn-phong shader

    // Smoothly change dot color
    float depthGradient = dot(normalize(-vPosition), normalize(cameraPosition - vPosition));
    // Mix the final color with the depth gradient
    vec3 depthColor = mix(color_intensity(), vec3(1.0), depthGradient);
    // Set the final color with depth gradient
    return depthColor;
}

vec3 wave(vec3 position) {
    float scale = 5.0;
    position.y -= 0.5* sin(0.5*ticks);
    position.x += 0.5* cos(0.5*ticks);
    return vec3(smoothMod((pow(position.x, 2.0) + position.y) * scale, 1.0, 1.0)) * depth_adjustment();
}



// Main
/////////////////////////////////////////////////////////////////////////////////////
void main() {
    // using normal ad coordinates creates an effect that looks like noise
    // the more detialed the mesh, the more detailed the noise
    vec3 coords = vNormal;

    // the noise comes in the from of waves, scattered accross varying normals
    vec3 final_color = wave(coords);
    gl_FragColor = vec4(final_color, 1.0);
}
