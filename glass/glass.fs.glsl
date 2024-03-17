// Inputs from the vertex shader
in vec3 FragPos;
in vec3 Normal;

void main()
{
    // Refractive index of glass
    float eta = 1.5;

    // Compute the view direction and normalize it
    vec3 viewDir = normalize(cameraPosition - FragPos);

    // Compute the Fresnel term (reflection coefficient)
    float cosTheta = dot(viewDir, Normal);
    float fresnelReflectence = 0.1;
    float fresnelTerm = mix(pow(1.0 - cosTheta, 5.0), 1.0, fresnelReflectence);

    // Compute the refracted ray
    vec3 refractDir = refract(-viewDir, Normal, 1.0 / eta);

    // Combine the reflection and refraction colors using the Fresnel term
    vec3 finalColor = mix(reflect(-viewDir, Normal), refract(refractDir, Normal, eta), fresnelTerm);

    gl_FragColor =  vec4(finalColor, 1.0);
}