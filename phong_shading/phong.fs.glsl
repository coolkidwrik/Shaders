
uniform vec3 ambientColor;
uniform float kAmbient;

uniform vec3 diffuseColor;
uniform float kDiffuse;

uniform vec3 specularColor;
uniform float kSpecular;
uniform float shininess;

uniform vec3 lightPosition;

// The value of our shared variable is given as the interpolation between normals computed in the vertex shader
// below we can see the shared variable we passed from the vertex shader using the 'in' classifier
in vec3 interpolatedNormal;
in vec3 viewPosition;
in vec3 worldPosition;


void main() {
    // compute the direction of the light
    vec3 lightDirection = normalize(lightPosition - worldPosition);

    // compute the normal of the object
    vec3 normal = normalize(interpolatedNormal);
    
    // compute the dot product of the light direction and the normal
    float nDotL = dot(normal, lightDirection);

    // compute reflected ray
    vec3 reflectedRay = reflect(-lightDirection, normal);

    // compute the view direction
    vec3 viewDirection = normalize(viewPosition - worldPosition);
    // vec3 viewDirection = normalize((inverse(projectionViewMatrix) * vec4(0.0, 0.0, 0.0, 1.0)).xyz);

    // compute the dot product of the reflected ray and the view direction
    float rDotV = max(dot(reflectedRay, viewDirection), 0.0);


    // color of the surface of the model. Here I am assuming it to be white
    //////////////////////////////////////////////////////////////////////////
    vec3 modelColor = vec3(1.0, 1.0, 1.0);


    // compute the color of the light that is hitting the object
    //////////////////////////////////////////////////////////////////////////
    // Since we are using the phone shading model, we need to compute the following
    // 1. Ambient component
    // 2. Diffuse component
    // 3. Specular component
    // final light color = ambient + diffuse + specular

    // compute ambient component
    //////////////////////////////
    vec3 ambient = kAmbient * ambientColor;
    
    // compute diffuse component
    //////////////////////////////
    vec3 diffuse = nDotL * kDiffuse * diffuseColor;
    
    // compute specular component
    //////////////////////////////
    vec3 specular = kSpecular * specularColor * pow(rDotV, shininess); 

    // this is the final light color that is hitting the object
    //////////////////////////////
    vec3 phongShading = ambient + diffuse + specular;


    // compute the apparent color of the object
    //////////////////////////////////////////////////////////////////////////
    // the apparent color of the object is the combination of the color of the light hitting 
    // the object and the color of the object
    // an example of this situation is when a red light hits a white object, the object will appear red
    // similarly, when a red light hits a green object, the object will appear black. This is because the
    // object absorbs the red light and reflects the green light
    // white light contains all the colors of the spectrum, so when white light hits
    // any object, the object will appear in its true color
    vec3 finalColor = phongShading * modelColor;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
