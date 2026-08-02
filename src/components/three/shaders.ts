/**
 * GLSL for the hero particle field.
 *
 * The field is a spherical shell of points displaced along its own normal by
 * two octaves of 3D simplex noise, plus a falloff repulsion around the
 * pointer. All of it runs on the GPU — the CPU only advances a clock and
 * lerps a pointer position, so particle count barely affects main-thread cost.
 */

const SIMPLEX_3D = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

export const particleVertex = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
uniform float uAmplitude;
uniform vec3  uPointer;
uniform float uPointerStrength;

attribute float aScale;
attribute float aSeed;

varying float vDisplacement;
varying float vSeed;

${SIMPLEX_3D}

void main() {
  vec3 pos = position;
  vec3 dir = normalize(position);

  // Two octaves at different speeds keep the surface from looking like it is
  // breathing on a single sine.
  float t = uTime * 0.16;
  float low  = snoise(dir * 1.05 + vec3(0.0, 0.0, t));
  float high = snoise(dir * 2.60 - vec3(t * 0.8, t * 0.3, 0.0));
  float displacement = low * 0.62 + high * 0.24;

  pos += dir * displacement * uAmplitude;

  // Pointer pushes particles outward with a gaussian falloff, so the cursor
  // leaves a soft crater rather than a hard edge.
  vec3 away = pos - uPointer;
  float dist = length(away);
  float push = uPointerStrength * exp(-dist * dist * 1.6);
  pos += normalize(away + 0.0001) * push;

  vDisplacement = displacement;
  vSeed = aSeed;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / max(-mvPosition.z, 0.001));
}
`;

export const particleFragment = /* glsl */ `
uniform vec3  uColorLow;
uniform vec3  uColorHigh;
uniform float uOpacity;
uniform float uSparkle;

varying float vDisplacement;
varying float vSeed;

void main() {
  // Round the square point sprite into a soft disc.
  vec2 offset = gl_PointCoord - 0.5;
  float sqrDist = dot(offset, offset);
  if (sqrDist > 0.25) discard;
  float alpha = smoothstep(0.25, 0.0, sqrDist);

  float ramp = clamp(vDisplacement * 0.9 + 0.5, 0.0, 1.0);
  vec3 color = mix(uColorLow, uColorHigh, ramp);

  // A sparse handful of particles stand out from the rest; reads as depth, costs
  // nothing. uSparkle is positive on the dark palette and negative on the light
  // one, where standing out means going darker than the page rather than brighter.
  color = max(color + step(0.988, vSeed) * uSparkle, vec3(0.0));

  gl_FragColor = vec4(color, alpha * uOpacity);

  #include <colorspace_fragment>
}
`;
