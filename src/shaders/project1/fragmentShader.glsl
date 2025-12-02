//unifomrs
uniform float uTime;
varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.14159265;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

//noice function
float mod289(float x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 perm(vec4 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float noise(vec3 p) {
  vec3 a = floor(p);
  vec3 d = p - a;
  d = d * d * (3.0 - 2.0 * d);

  vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
  vec4 k1 = perm(b.xyxy);
  vec4 k2 = perm(k1.xyxy + b.zzww);

  vec4 c = k2 + a.zzzz;
  vec4 k3 = perm(c);
  vec4 k4 = perm(c + 1.0);

  vec4 o1 = fract(k3 * (1.0 / 41.0));
  vec4 o2 = fract(k4 * (1.0 / 41.0));

  vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
  vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

  return o4.y * d.y + o4.x * (1.0 - d.y);
}

float lines(vec2 uv, float offset) {
  return smoothstep(0., 0.5 + offset * 0.5, abs(0.5 * (sin(uv.x * 30.) + offset * 2.)));
}

mat2 rotat2D(float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main() {
  float n = noise(vPosition + uTime);
  vec2 baseUV = rotat2D(n) * vPosition.xy * 0.1;

  // colors
  // vec3 basefast = vec3(122.0 / 255.0, 158.0 / 255.0, 113.0 / 255.0);
  // vec3 accent = vec3(0.0, 0.0, 0.0);
  // vec3 baseSecond = vec3(224.0 / 255.0, 148.0 / 255.0, 66.0 / 255.0);
  
  vec3 basefast = uColor1;
  vec3 accent = uColor2;
  vec3 baseSecond = uColor3;

  float basePartern = lines(baseUV, 0.5);
  float secondPartern = lines(baseUV, 0.1);

  vec3 baseColor = mix(baseSecond, basefast, basePartern);
  vec3 secondColor = mix(baseColor, accent, secondPartern);

  gl_FragColor = vec4(vec3(secondColor), 1.0);
}
