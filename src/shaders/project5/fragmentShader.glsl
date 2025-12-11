varying vec3 vColor;
varying vec3 vNormal;

uniform vec3 uSkyColor;
uniform vec3 uGroundColor;

float PI = 3.14159265;

void main() {

  vec3 light = vec3(0.0);
  vec3 lightDireaction = normalize(vec3(0.,-1.,-1.));

  // vec3 skyColor = vec3(1.000,1.000,0.547);
  // vec3 groundColor = vec3(0.562,0.275,0.111);

  vec3 skyColor = uSkyColor;
  vec3 groundColor = uGroundColor;

  light += dot(lightDireaction,vNormal);
  light = mix(skyColor,groundColor, dot(lightDireaction,vNormal));

  gl_FragColor = vec4(vColor, 1.0);
  gl_FragColor = vec4(light*vColor, 1.0);
}
