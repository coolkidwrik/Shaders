uniform float ticks;

// The value of our shared variable is given as the interpolation between normals computed in the vertex shader
// below we can see the shared variable we passed from the vertex shader using the 'in' classifier
in vec3 interpolatedNormal;
in vec3 lightDirection;
in vec3 vertexPosition;


// Math behind the shader to get the polka-dots
////////////////////////////////////////////////////////////////
// The model coordinates are used as a 3D grid. The polka-dots are modeled
// by the equation of a sphere. If I were to plot x^2+y^2+z^2=1, I would get a sphere of radius 1
// in the 3D grid, centered at the origin. If I rendered this, I would only get the intersection
// of the sphere with the mesh. Hence why it would look like a polka-dot.
// however this will render only one polka-dot. To render multiple polka-dots, I can use the mod function
// To simplify, lets consider a grid in only 2D. If I were to plot x^2+y^2<=1, I would get a circle of radius 1
// the modulus can help get a repeating pattern. consider (mod(x, 1)^2+ mod(y, 1))^2 <= 0.1^2 This will give me 
// a repeating pattern of circles, each 1 unit apart with radius 0.1. Try plotting on desmos.
// however this only gives a quarter circle, because it is only rendering quadrant 1.
// to fix this, I can shift the center of the circle to the center of the grid by subbing 0.1 to the mod function
// as follows (mod(x, 1)-0.1)^2+ (mod(y, 1)-0.1)^2 <= 0.1^2. Now this will give me repeating circles on the grid.

////////////////////////////////////////////////////////////////
// helpers
////////////////////////////////////////////////////////////////

// colors that will be used throughout the shader
vec3 color1 = vec3(0.89, 0.08, 0.94); // pink
vec3 color2 = vec3(0.4, 0.92, 0.94); // light blue

// returns final color for the polka-dots
vec3 color_intensity() {
    // use the sin fucnction to change the color intensity based on time
    // sine function will give us a value between -1 and 1
    // we add 1 to the result to get a value between 0 and 2
    // we multiply by 0.5 to get a value between 0 and 1

    // I encorporate the vertexPosition components to have the change in color propogate through the mesh
    // powers can be adjusted to make interesting patterns
    float y_comp = pow(vertexPosition.y, 1.0);
    float x_comp = pow(vertexPosition.x, 1.0);
    float z_comp = pow(vertexPosition.x, 2.0);
    return mix(color1, color2, (0.5*sin(2.0*abs(y_comp + x_comp + z_comp + ticks))+1.0));
}


vec3 get_dots_positions(float gridSpacing) {
    // using model coordinates as a 3D grid, we can determine the position of the dots
    // by taking the mod of the vertex position with the grid spacing
    // this will give us the center of the dots repeated along the mesh, each gridSpacing apart.

    vec3 dotPosition = vec3(
        mod(vertexPosition.x, gridSpacing),  // X position on the grid
        mod(vertexPosition.y + ticks/2.0, gridSpacing),  // Y position on the grid
        mod(vertexPosition.z, gridSpacing)   // Z position on the grid
    );
    return dotPosition;
}

float get_fragment_distance_to_dot_squared(float dotSize, float gridSpacing) {
    // Calculate distance from the fragment to the dot position
    vec3 dotPosition = get_dots_positions(gridSpacing);
    float distanceToDot = pow(dotPosition.x - 0.5*gridSpacing, 2.0) +
                          pow(dotPosition.y - 0.5*gridSpacing, 2.0) +
                          pow(dotPosition.z - 0.5*gridSpacing, 2.0);
    return distanceToDot;
}

void depth_adjustment() {
    // blends final color with white based on depth
    // this adds additional depth and color blending to the dots
    // I think it looks pretty cool
    
    // NOTE: I also realised that the shader material provides a cameraPosition uniform, 
    // so that could be used instead of the camera matrix as I did in the toon shader and blinn-phong shader

    // Smoothly change dot color
    float depthGradient = dot(normalize(-vertexPosition), normalize(cameraPosition - vertexPosition));
    // Mix the final color with the depth gradient
    vec3 depthColor = mix(color_intensity(), vec3(1.0), depthGradient);
    // Set the final color with depth gradient
    gl_FragColor = vec4(depthColor, 1.0);
}



// main function
////////////////////////////////////////////////////////////////

void main() {
    // distance between dot centers
    float gridSpacing = 0.2;  // Adjust this value to change grid spacing
    // dot size
    float dotSize = 0.01;  // Adjust this value to change dot size

    vec3 dotPosition = get_dots_positions(gridSpacing);

    // Calculate distance from the fragment to the dot position
    float distanceToDot = get_fragment_distance_to_dot_squared(dotSize, gridSpacing);

    // If the fragment is close enough to the dot position, render it as a dot
    if (distanceToDot < dotSize) {
        depth_adjustment();
    } else {
        discard;  // Otherwise, discard the fragment
    }
}
