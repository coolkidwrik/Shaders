uniform float ticks;

in vec3 vNormal;




float rand(float n){return fract(sin(n) * 43758.5453123);}

float noise(float p){
	float fl = floor(p);
  float fc = fract(p);
	return mix(rand(fl), rand(fl + 1.0), fc);
}

void main() {
    vec3 normal = normalize(vNormal);
    gl_FragColor = vec4(vec3(noise(ticks*normal.x)), 1.0);
}
