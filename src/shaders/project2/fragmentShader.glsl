// === Uniforms ===
uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uScale;

// === varying ===
varying vec2 vUv;
float PI = 3.14159265;

void main() {
  vec2 uv = (vUv - 0.5) * uScale + 0.5;

  vec4 tt = texture2D(uTexture, uv);

  gl_FragColor = tt;
}
