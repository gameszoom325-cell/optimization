uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 1.6);
  float pulse = 0.5 + 0.5 * sin(uTime + vPosition.y * 2.4);
  vec3 cyan = vec3(0.22, 0.92, 1.0);
  vec3 violet = vec3(0.58, 0.35, 1.0);
  vec3 color = mix(cyan, violet, 0.5 + 0.5 * sin(uTime * 0.35 + vPosition.y));
  gl_FragColor = vec4(color, 0.12 + fresnel * (0.16 + pulse * 0.13));
}
