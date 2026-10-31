'use client';

/*
 * AiBlob — designed by Aaditya Jaiswar
 * LinkedIn  https://www.linkedin.com/in/aadityaaaaa
 * GitHub    https://github.com/aad1tyaaaaa
 * Dribbble  https://dribbble.com/aadityaaaaa-jaiswar
 * Email     aadityaaaaa.jaiswar@gmail.com
 * WhatsApp  https://wa.me/917710024884
 */
import { useEffect, useRef } from "react";

/**
 * AiBlob — realistic glass orb with a volumetric, morphing plasma core.
 * Zero dependencies (raw WebGL).
 *
 *   <AiBlob size={320} />
 *   <AiBlob size={200} speed={1.6} intensity={1.2} />   // e.g. "thinking"
 *
 * Props
 *   size       px, square (default 320)
 *   speed      animation speed multiplier (default 1)
 *   intensity  core/rim brightness (default 1)
 *   background CSS colour behind the orb (default transparent)
 */

/** @typedef {{ size?: number, speed?: number, intensity?: number, background?: string, className?: string, style?: import('react').CSSProperties }} AiBlobProps */

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform float uIntensity;

#define TAU 6.28318530718

vec3 hash3(vec3 p){
  p = vec3(dot(p,vec3(127.1,311.7,74.7)),dot(p,vec3(269.5,183.3,246.1)),dot(p,vec3(113.5,271.9,124.6)));
  return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}
float noise(vec3 p){
  vec3 i=floor(p), f=fract(p), u=f*f*(3.0-2.0*f);
  return mix(mix(mix(dot(hash3(i),f),dot(hash3(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x),
                 mix(dot(hash3(i+vec3(0,1,0)),f-vec3(0,1,0)),dot(hash3(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),
             mix(mix(dot(hash3(i+vec3(0,0,1)),f-vec3(0,0,1)),dot(hash3(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x),
                 mix(dot(hash3(i+vec3(0,1,1)),f-vec3(0,1,1)),dot(hash3(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z);
}
float fbm(vec3 p){ float v=0.0,a=0.5; for(int i=0;i<3;i++){v+=a*noise(p);p=p*2.03+1.7;a*=0.5;} return v; }

// magenta <-> cyan <-> periwinkle cycle (matches reference)
vec3 hue(float t){
  vec3 m=vec3(1.0,0.12,0.92), c=vec3(0.10,1.0,0.92), b=vec3(0.55,0.62,1.0);
  float s=fract(t)*3.0;
  if(s<1.0) return mix(m,c,smoothstep(0.0,1.0,s));
  if(s<2.0) return mix(c,b,smoothstep(1.0,2.0,s));
  return mix(b,m,smoothstep(2.0,3.0,s));
}

vec3 coreCenter(float t){
  // slow orbit + noisy wander so the core roams around the orb
  vec3 orbit = 0.075*vec3(cos(t*0.42), sin(t*0.57), sin(t*0.33));
  vec3 wander = 0.11*vec3(noise(vec3(t*0.38,1.0,0.0)), noise(vec3(t*0.38,4.0,0.0)), noise(vec3(t*0.3,9.0,0.0)));
  return orbit + wander;
}

// metaball density of the plasma core in 3D
float coreField(vec3 p, float t){
  vec3 w = p + 0.12*vec3(fbm(p*5.0+vec3(0,0,t*0.7)), fbm(p*5.0+vec3(5.2,1.3,t*0.6)), fbm(p*5.0+vec3(2.1,7.7,t*0.65)));
  vec3 c0 = coreCenter(t);
  vec3 c1 = c0 + 0.13*vec3(sin(t*0.83), cos(t*0.61), sin(t*0.47));
  vec3 c2 = c0 + 0.16*vec3(cos(t*0.53+2.0), sin(t*0.71+1.0), cos(t*0.9));
  float br = 1.0 + 0.18*sin(t*1.25) + 0.12*noise(vec3(t*0.7,2.0,3.0));
  float f = 0.0095*br/dot(w-c0,w-c0)
          + 0.0042*br/dot(w-c1,w-c1)
          + 0.0024/dot(w-c2,w-c2);
  return f;
}

float sphereRim(float r, float R){
  float inside = smoothstep(R+0.002, R-0.002, r);
  float x = clamp(r/R,0.0,1.0);
  float fres = pow(x, 26.0)*inside;            // glass edge brightening
  float line = exp(-pow((r-R)/0.0035,2.0));     // crisp outline
  return fres*0.75 + line*0.7;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*uRes)/uRes.y;
  float t = uTime;
  float R = 0.40;
  float r = length(uv);
  float ang = atan(uv.y, uv.x);

  vec3 col = vec3(0.0);

  // ---------- volumetric core (raymarch through the sphere) ----------
  vec3 coreTint = hue(t*0.045);
  if(r < R){
    float zh = sqrt(R*R - r*r);
    float zMax = min(zh, 0.32);
    const int N = 22;
    float dz = 2.0*zMax/float(N);
    float jitter = fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);
    for(int i=0;i<N;i++){
      float z = -zMax + (float(i)+jitter)*dz;
      vec3 p = vec3(uv, z);
      float f = coreField(p, t);
      float dens = smoothstep(0.55, 1.35, f);
      if(dens > 0.001){
        float local = fbm(p*3.0 + t*0.15);
        vec3 c = hue(t*0.045 + local*0.35);
        col += c * dens * dz * 17.0;
        vec3 n0 = p - coreCenter(t);
        col += vec3(1.0) * exp(-dot(n0,n0)/0.0024) * dens * dz * 70.0;   // single white-hot nucleus
      }
    }
  }

  // soft bloom halo around the core (2D, cheap)
  vec2 cc = coreCenter(t).xy;
  float dc = length(uv-cc);
  col += coreTint * exp(-dc*dc/0.022) * 0.22 * smoothstep(R, R-0.02, r);
  col += coreTint * exp(-dc/0.08) * 0.02;

  // ---------- glass shell with thin-film iridescence ----------
  // film thickness varies around the bubble and drifts over time
  float th = fbm(vec3(cos(ang)*1.2, sin(ang)*1.2, t*0.18)) + 0.25*sin(ang*1.0 + t*0.3);
  vec3 film = mix(hue(th*0.9 + t*0.03), coreTint, 0.2);
  // light "pooling" on parts of the rim (caustic-like bright arcs)
  float arcs = 0.10 + 2.2*pow(max(0.0, 0.5+1.0*noise(vec3(cos(ang)*1.6, sin(ang)*1.6, t*0.35))), 3.0);

  // chromatic dispersion: each channel sees the edge at a slightly different radius
  float ca = 0.0028;
  vec3 rim = vec3(sphereRim(r-ca,R), sphereRim(r,R), sphereRim(r+ca,R));
  col += rim * film * arcs * 1.25;

  // inner border gradient: a colour band hugging the inside of the rim,
  // sweeping magenta -> cyan -> periwinkle around the circle and rotating over time
  float a01 = ang/TAU;
  vec3 gradA = hue(a01 + t*0.06);
  vec3 gradB = hue(a01 + 0.45 - t*0.04);
  float mixAB = 0.5 + 0.5*sin(ang*2.0 + t*0.5);
  vec3 grad = mix(gradA, gradB, mixAB);
  float band = smoothstep(R*0.70, R, r);
  band = band*band*band * smoothstep(R+0.002, R-0.004, r);
  float bandVar = 0.55 + 0.45*noise(vec3(cos(ang)*2.0, sin(ang)*2.0, t*0.3));
  col += grad * band * bandVar * 0.8;

  // faint internal reflection ring
  float inner = exp(-pow((r-R*0.93)/0.012,2.0)) * 0.06;
  col += inner * film * arcs;

  // glass body: barely-there tint + core light scattering into the shell
  float body = smoothstep(R+0.002, R-0.002, r);
  col += body * (0.003 + 0.018*pow(r/R,6.0)) * mix(film, coreTint, 0.6);

  // soft specular highlight on the upper edge
  float specArc = exp(-pow((r-R*0.955)/0.007,2.0)) * exp(-pow((ang-2.05)/0.32,2.0));
  col += vec3(0.92,0.96,1.0) * specArc * 0.22;

  // ---------- tone map (bright colour saturates to white like a real emitter) ----------
  col *= uIntensity;
  col = 1.0 - exp(-col*1.35);
  col = pow(col, vec3(0.95));

  vec3 bg = vec3(0.039);
  float grain = (fract(sin(dot(gl_FragCoord.xy+t,vec2(12.9898,78.233)))*43758.5453)-0.5)/255.0;
  vec3 outc = bg + col*(1.0-bg) + grain;
  // transparent outside the glass so only the orb shows (premultiplied alpha)
  float a = smoothstep(R+0.012, R+0.002, r);
  gl_FragColor = vec4(outc*a, a);
}`;

/** @param {AiBlobProps} props */
export default function AiBlob({
  size = 320,
  speed = 1,
  intensity = 1,
  background = "transparent",
  className,
  style,
}) {
  const canvasRef = useRef(null);
  const propsRef = useRef({ speed, intensity });
  propsRef.current = { speed, intensity };

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { antialias: false, alpha: true });
    if (!gl) return;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uIntensity = gl.getUniformLocation(prog, "uIntensity");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);

    // pause when offscreen / tab hidden
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let raf;
    let t = 3.0; // start mid-cycle so the first frame already looks alive
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (visible && !document.hidden) {
        t += dt * propsRef.current.speed * (reduced ? 0.25 : 1);
        gl.uniform1f(uTime, t);
        gl.uniform1f(uIntensity, propsRef.current.intensity);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: size, height: size, display: "block", background, ...style }}
      aria-hidden="true"
    />
  );
}
