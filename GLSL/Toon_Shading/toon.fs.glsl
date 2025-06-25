uniform vec3 toonColor;
uniform vec3 toonColor2;
uniform vec3 outlineColor;
uniform int steps;

// The value of our shared variable is given as the interpolation between normals computed in the vertex shader
// below we can see the shared variable we passed from the vertex shader using the 'in' classifier
in vec3 interpolatedNormal;
in vec3 lightDirection;
in vec3 viewPosition;
in float fresnel;


// helpers
////////////////////////////////////////////
vec3 shade_cell_step(int number_steps, float intensity) {
    float steps = ceil(intensity * float(number_steps));
    vec3 final_color;

    for (int i = 1; i <= number_steps; i++) {
        if (steps == float(i)) {
            final_color = mix(toonColor, toonColor2, float(i - 1) / float(number_steps - 1));
            break; // Exit the loop once the match is found
        } else if (i == number_steps) {
            final_color = toonColor2; // If no match is found, set the default color
        }
    }
    return final_color;
}

void fresnel_edge(vec3 fragmentColor, float edge) {
    // Set a dark fragment color if the current fragment is located near the edge of the 3D model
    if (fresnel < edge) {
        gl_FragColor = vec4(outlineColor, 1.0);
    } else {
        gl_FragColor = vec4(fragmentColor, 1.0);
    }
}
////////////////////////////////////////////

// main
////////////////////////////////////////////

void main() {
    // Compute the light intensity of the current fragment
    float intensity = 1.0 - dot(interpolatedNormal, lightDirection);

    // get quantized steps
    // here I will use 4 steps
    int number_steps = steps;
    vec3 final_color = shade_cell_step(number_steps, intensity);
    
    // Set a dark fragment color if the current fragment is located near the edge of the 3D model
    const float edge = 0.4;
    fresnel_edge(final_color, edge);
}
