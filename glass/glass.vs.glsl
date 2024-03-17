
out vec3 FragPos;
out vec3 Normal;


void main()
{
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    FragPos = worldPos.xyz;
    Normal = mat3(transpose(inverse(modelMatrix))) * normal;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}