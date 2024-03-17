uniform vec3 specularColor;
uniform float kSpecular;
uniform float shininess;

uniform vec3 lightPosition;

// The value of our shared variable is given as the interpolation between normals computed in the vertex shader
// below we can see the shared variable we passed from the vertex shader using the 'in' classifier
in vec3 interpolatedNormal;
in vec3 viewPosition;
in vec3 worldPosition;
in float fresnel;

void fresnel_edge(vec3 fragmentColor, float edge) {
    // Set a dark fragment color if the current fragment is located near the edge of the 3D model
    if (fresnel < edge) {
        gl_FragColor = vec4(vec3(0.0, 0.0, 0.0), 1.0);
    } else {
        gl_FragColor = vec4(fragmentColor, 1.0);
    }
}


void main() {
    // compute the direction of the light
    vec3 lightDirection = normalize(lightPosition - worldPosition);

    // compute the normal of the object
    vec3 normal = normalize(interpolatedNormal);

    // compute reflected ray
    vec3 reflectedRay = reflect(-lightDirection, normal);

    // compute the view direction
    vec3 viewDirection = normalize(viewPosition - worldPosition);
    // vec3 viewDirection = normalize((inverse(projectionViewMatrix) * vec4(0.0, 0.0, 0.0, 1.0)).xyz);

    // compute the dot product of the reflected ray and the view direction
    float rDotV = max(dot(reflectedRay, viewDirection), 0.0);


    // compute specular component
    //////////////////////////////
    vec3 specular = kSpecular * specularColor * pow(rDotV, shininess); 

    vec3 one = normalize(vec3(1.0, 1.0, 1.0));

    float oneDotSpecular = dot(one, normalize(specular));

    // check of specular color is greater than 0
    if (oneDotSpecular > 1.0) {
        // compute the final color
        fresnel_edge(specular, 0.5);
    } else if (fresnel < 0.3) {
        gl_FragColor = vec4(vec3(0.0, 0.0, 0.0), 1.0);
    } else {
        discard;
    }
}
