varying vec2 vUv;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

float PI = 3.14159265;

float sphere(vec3 p) {
  return length(p) - .5;
}
float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}


mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

float SineCrazy(vec3 p){
  return sin(p.x) + sin(p.y) + sin(p.z) / 3.;
}

vec3 GetColor(float amount){
  vec3 col = 0.5 + 0.5 * cos(6.28319 * (vec3(0.2,0.0,0.0) + amount * vec3(1.0,1.0,0.5)));
  return col * amount;
}

vec3 GetColorAmout(vec3 p){
  float amount = clamp((1.5 - length(p))/2.,0.,1.0);
  vec3 col = 0.5 + 0.5 * cos(6.28319 * (vec3(0.2,0.0,0.0) + amount * vec3(1.0,1.0,0.5)));
  return col * amount;
}
float scene(vec3 p) {
  // return sphere(p);
  // return sdBox(p1, vec3(0.5, 0.5, 0.5));
  vec3 p1 = rotate(p,vec3(1.,1.,1.),uTime/5.0);
  float scale = 15. + 10. * sin(uTime / 2.);
  // return max(sdBox(p1, vec3(0.4, 0.4, 0.4)),sphere(p));
  return max(sphere(p1),(SineCrazy(p1*scale)/scale));
}


vec3 getNormal(vec3 p) {
  vec2 o = vec2(0.001, 0.);

  return normalize(
    vec3(
      scene(p + o.xyy) - scene(p - o.xyy),
      scene(p + o.yxy) - scene(p - o.yxy), 
      scene(p + o.yyx) - scene(p - o.yyx)
    )
  );
}

void main() {
  vec2 newUV = vUv;

  float bw = step(newUV.y, 0.5);

  vec2 p = newUV - vec2(0.5);
  // p.x *= uResolution.x / uResolution.y;

  p.x -= uMouse.x * 0.1; 
  p.y -= uMouse.y * 0.1; 

  vec3 camPos = vec3(0.0, 0.0, 2. + 0.5*sin(uTime/4.0));
  vec3 ray = normalize(vec3(p, -1.));

  vec3 rayPos = camPos;

  float curDist = 0.0;
  float rayLen = 0.0;

  vec3 color = vec3(0.0);
  vec3 light = vec3(-1.0, 1.0, 1.0);

  for(int i = 0; i <= 64; i++) {
    curDist = scene(rayPos);
    rayLen += 0.6 * curDist;

    rayPos = camPos + ray * rayLen;

    if(abs(curDist) < 0.001) {
      vec3 n = getNormal(rayPos);
      float diff = dot(n,light);

      // color = GetColor(diff);
      // color = GetColor(2.*length(rayPos));
      break;
    }
    color += 0.04 * GetColorAmout(rayPos);
  }
  gl_FragColor = vec4(color, 1.0);
  gl_FragColor.r -= abs(uMouse.x)* .6;
}
