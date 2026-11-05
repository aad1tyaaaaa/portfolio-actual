'use client'

// Stained Glass (Originkit), ported from three.js to raw WebGL2 - one full-screen
// shader doesn't need the library. Leaded Voronoi panes lit from behind by a light
// that drifts and leans toward the cursor (tracked on window, since it sits behind content).

import { useEffect, useRef } from 'react'

const PALETTE = ['#FF4D0F', '#FFA51F', '#FFE3A3', '#C6D64B', '#2FA8C8', '#A82820']
const LEAD = '#000000'
const LIGHT = '#FFF3D6'
// The original's panel defaults, already mapped to shader units
const S = {
  cellSize: 1.5 + 15 * 0.55,
  irregularity: 20 * 0.025,
  leadWidth: 0.01 + 1 * 0.006,
  backlight: 0.2 + 5 * 0.075,
  lightRadius: 0.18 + 3 * 0.055,
  speed: 20 * 0.06,
  texture: 0,
  streaks: 6 * 0.05,
  seeds: 0,
  contrast: 0.55 + 20 * 0.055,
}

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
#define MAX_COLORS 8
uniform vec2 uResolution;
uniform vec2 uLight;
uniform vec3 uPalette[MAX_COLORS];
uniform float uPaletteCount;
uniform vec3 uLead;
uniform vec3 uLightColor;
uniform float uCellSize, uIrregularity, uLeadWidth, uTexture, uStreaks, uSeeds, uBacklight, uLightRadius, uContrast;
in vec2 vUv;
out vec4 fragColor;

vec2 hash2(vec2 p) {
  vec3 q = vec3(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)), dot(p, vec2(419.2, 371.9)));
  return fract(sin(q.xy) * 43758.5453);
}
float hash1(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash1(i), hash1(i + vec2(1, 0)), u.x), mix(hash1(i + vec2(0, 1)), hash1(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float sum = 0.0, amp = 0.5;
  for (int i = 0; i < 4; i++) { sum += noise(p) * amp; p *= 2.07; amp *= 0.5; }
  return sum;
}
vec2 seedAt(vec2 cell) { return cell + 0.5 + (hash2(cell) - 0.5) * uIrregularity * 2.0; }

void main() {
  float aspect = uResolution.x / max(1.0, uResolution.y);
  vec2 uv = vec2(vUv.x * aspect, vUv.y);
  vec2 p = uv * uCellSize;
  vec2 base = floor(p);

  // which pane
  vec2 bestCell = base, bestSeed = seedAt(base);
  float bestDist = 1e9;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 cell = base + vec2(i, j), s = seedAt(cell);
    float d = dot(p - s, p - s);
    if (d < bestDist) { bestDist = d; bestCell = cell; bestSeed = s; }
  }
  // distance to the lead: nearest bisector against every other seed
  float edge = 1e9;
  for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++) {
    vec2 s = seedAt(base + vec2(i, j)), toS = s - bestSeed;
    float len = length(toS);
    if (len > 0.0001) edge = min(edge, dot(0.5 * (bestSeed + s) - p, toS / len));
  }
  float aa = max(fwidth(edge), 0.0001);
  float glass = smoothstep(uLeadWidth - aa, uLeadWidth + aa, edge);

  int index = int(floor(hash1(bestCell + 3.7) * uPaletteCount));
  vec3 tint = uPalette[0];
  for (int i = 0; i < MAX_COLORS; i++) if (i == index) tint = uPalette[i];

  vec2 local = p - bestSeed;
  float ang = hash1(bestCell + 11.3) * 6.28318, ca = cos(ang), sa = sin(ang);
  vec2 r = vec2(local.x * ca - local.y * sa, local.x * sa + local.y * ca);
  float mottle = fbm(r * (2.5 + hash1(bestCell) * 3.0) + bestCell * 17.0);
  float streak = fbm(vec2(r.x * 14.0, r.y * 1.2) + bestCell * 31.0);
  float bubble = pow(noise(r * 26.0 + bestCell * 7.0), 6.0);
  float body = 1.0 + (mottle - 0.5) * uTexture * 4.0 + (streak - 0.5) * uStreaks * 3.0 + bubble * uSeeds * 5.0;

  vec2 toLight = uv - uLight;
  float lamp = exp(-dot(toLight, toLight) / max(0.01, uLightRadius * uLightRadius));
  float passes = 0.75 + hash1(bestCell + 23.1) * 0.5;
  vec3 col = tint * body * passes;
  col *= 0.35 + (uBacklight * lamp) * 2.2;
  col += uLightColor * lamp * lamp * uBacklight * 0.35 * passes;
  col = pow(max(col, 0.0), vec3(uContrast));

  vec2 grad = vec2(dFdx(edge), dFdy(edge));
  float bevel = length(grad) > 0.00001 ? dot(normalize(grad), normalize(vec2(-0.55, 0.83))) : 0.0;
  vec3 leadCol = uLead * (1.0 + bevel * 0.85) + uLightColor * max(bevel, 0.0) * 0.12;
  fragColor = vec4(mix(leadCol, col, glass), 1.0);
}`

// three.js converts hex colours to linear before upload; match it so the look is the same
const linear = (hex: string) =>
  [1, 3, 5].map(i => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })

export default function StainedGlass({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const gl = canvas.getContext('webgl2', { antialias: false })
    if (!gl) return // no WebGL2: the page's own background shows instead

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s))
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG))
    gl.bindAttribLocation(prog, 0, 'aPos')
    gl.linkProgram(prog)
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    const u = (n: string) => gl.getUniformLocation(prog, n)
    const pal = Array.from({ length: 8 }, (_, i) => linear(PALETTE[i % PALETTE.length])).flat()
    gl.uniform3fv(u('uPalette'), pal)
    gl.uniform1f(u('uPaletteCount'), PALETTE.length)
    gl.uniform3fv(u('uLead'), linear(LEAD))
    gl.uniform3fv(u('uLightColor'), linear(LIGHT))
    for (const k of ['cellSize', 'irregularity', 'leadWidth', 'texture', 'streaks', 'seeds', 'backlight', 'lightRadius', 'contrast'] as const)
      gl.uniform1f(u('u' + k[0].toUpperCase() + k.slice(1)), S[k])
    const uRes = u('uResolution'), uLight = u('uLight')

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.75)
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr))
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    // light: wanders on two slow sines, pulled to the cursor while it is over the page
    const pointer = { x: 0.5, y: 0.6 }
    let grip = 0, gripTarget = 0, time = 0, lx = 0.5, ly = 0.6, last = performance.now(), raf = 0
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      pointer.x = ((e.clientX - r.left) / r.width) * (r.width / r.height)
      pointer.y = 1 - (e.clientY - r.top) / r.height
      gripTarget = 1
    }
    const leave = (e: PointerEvent) => { if (!e.relatedTarget) gripTarget = 0 }
    addEventListener('pointermove', move, { passive: true })
    addEventListener('pointerout', leave, { passive: true })

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min(Math.max((now - last) / 1000, 0), 0.05)
      last = now
      if (!still) time += dt * S.speed
      const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight)
      const dx = 0.5 + Math.sin(time * 0.7) * 0.22
      const dy = 0.55 + Math.sin(time * 0.43 + 1.3) * 0.18
      grip += (gripTarget - grip) * (1 - Math.exp(-dt * 4.5))
      const k = 1 - Math.exp(-dt * (3 + grip * 12))
      lx += (dx * aspect * (1 - grip) + pointer.x * grip - lx) * k
      ly += (dy * (1 - grip) + pointer.y * grip - ly) * k
      gl.uniform2f(uLight, lx, ly)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      removeEventListener('pointermove', move)
      removeEventListener('pointerout', leave)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
