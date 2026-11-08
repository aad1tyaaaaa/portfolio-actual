'use client'

import { useEffect, useRef, useState } from 'react'
import { Renderer, Program, Mesh, Triangle, Texture, RenderTarget } from 'ogl'

/*
  Face → skull video reveal, landonorris.com style: the cursor leaves a decaying "liquid" trail in a low-res
  ping-pong buffer; the composite shader thresholds trail+noise into a hard-edged blob and shows the skull
  inside it, the face outside, with a neon rim on the boundary. Tap / the Tab key sweeps the skull in fully (and locks it) until toggled back.
  face-cutout.webp is pre-cropped onto the skull's 16:9 frame (face 1.232x of source, bottom-anchored; eyes on the skull sockets, shoulders on its jacket) so both share one UV space.
  No WebGL → the <video>/<img> layers stay visible and the CSS crossfade in globals.css takes over.
*/

const VERT = /* glsl */ `attribute vec2 uv; attribute vec2 position; varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position, 0., 1.); }`

const TRAIL = /* glsl */ `precision highp float;
uniform sampler2D tPrev; uniform vec2 uA, uB; uniform float uR, uActive, uAspect, uDecay, uTime; varying vec2 vUv;
float seg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0., 1.); return length(pa - ba * h); }
void main(){
  // slow swirl so old trail drifts and melts instead of fading in place
  vec2 flow = vec2(sin(vUv.y * 9. + uTime * 1.3), cos(vUv.x * 8. - uTime * 1.1)) * .0015;
  float prev = texture2D(tPrev, vUv - flow).r - uDecay; // linear decay: multiplicative would stall in 8-bit
  vec2 asp = vec2(uAspect, 1.);
  float s = smoothstep(uR, uR * .3, seg(vUv * asp, uA * asp, uB * asp)) * uActive;
  gl_FragColor = vec4(max(prev, s), 0., 0., 1.);
}`

const COMPOSITE = /* glsl */ `precision highp float;
uniform sampler2D tSkull, tFace, tMask, tSkullDepth, tFaceDepth; uniform float uTime, uFull, uAspect; uniform vec2 uLook; uniform vec4 uBox; varying vec2 vUv;
// depth parallax = fake head turn: near pixels (nose, chest) slide toward the look direction more than far ones.
// fixed-point iteration samples depth at the displaced spot, so edges don't tear. head (upper half) turns more than the chest.
vec2 turn(sampler2D dm, vec2 uv){
  vec2 o = uLook * vec2(.028, .018) * mix(.45, 1., smoothstep(.3, .48, uv.y));
  vec2 d = o * texture2D(dm, uv).r;
  d = o * texture2D(dm, uv - d).r;
  d = o * texture2D(dm, uv - d).r;
  return uv - d;
}
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + 1.), f.x), f.y); }
void main(){
  // the canvas covers the whole hero (so the trail paints edge to edge); the character lives in uBox (offset.xy, size.zw)
  vec2 c = (vUv - uBox.xy) / uBox.zw;
  float inb = step(0., c.x) * step(c.x, 1.) * step(0., c.y) * step(c.y, 1.);
  // skull: black backdrop becomes transparent (premultiplied, alpha = brightest channel, approx. screen blend), soft frame edges
  vec4 s = texture2D(tSkull, turn(tSkullDepth, c)) * inb;
  s.rgb = max(s.rgb - .035, 0.) / .965; // crush the video's near-black purple so empty areas are truly transparent
  s.rgb *= smoothstep(0., .09, c.x) * smoothstep(1., .91, c.x) * pow(smoothstep(1., .7, c.y), 1.6); // long soft top fade: the source flames hit the frame edge
  float sa = max(s.r, max(s.g, s.b));
  vec4 f = texture2D(tFace, turn(tFaceDepth, c)) * inb;

  vec2 p = vUv * vec2(uAspect, 1.);
  float n = noise(p * 4. + uTime * .25) * .65 + noise(p * 11. - uTime * .35) * .35;

  // cursor trail to hard blob with noisy edge
  float v = texture2D(tMask, vUv).r + (n - .5) * .35;
  float m = smoothstep(.42, .46, v);
  float rim = smoothstep(.26, .42, v) * (1. - m);

  // full reveal: rises from the bottom with an arched, noisy front
  float d = uFull * 1.45 - .25 + sin(vUv.x * 3.14159) * sin(uFull * 3.14159) * .2 + (n - .5) * .12 - vUv.y;
  float full = smoothstep(0., .02, d);
  m = max(m, full);
  rim = max(rim * (1. - full), smoothstep(-.07, 0., d) * (1. - full) * sin(uFull * 3.14159));

  vec4 col = mix(vec4(f.rgb * f.a, f.a), vec4(s.rgb, sa), m);
  vec3 glow = mix(vec3(.71, 0., .66), vec3(0., .9, 1.), n);
  float g = rim * rim * (.55 + .45 * max(sa, f.a));
  col.rgb += glow * g;
  col.a = max(col.a, g * .7);
  gl_FragColor = col;
}`

export default function HeroCharacter() {
  const [on, setOn] = useState(false)
  const reveal = useRef(false) // read by the render loop; avoids re-running the GL effect on toggle
  const bg = useRef<HTMLVideoElement>(null)
  const skull = useRef<HTMLVideoElement>(null)
  const face = useRef<HTMLImageElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const vids = [bg.current, skull.current].filter(v => v !== null)
    const rm = matchMedia('(prefers-reduced-motion: reduce)')
    // autoplay attr can be ignored (low-power mode etc.); posters/first frame stay visible if play fails
    const sync = () => vids.forEach(v => (rm.matches ? v.pause() : v.play().catch(() => {})))
    sync()
    rm.addEventListener('change', sync)
    return () => rm.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const el = box.current!, cv = canvas.current!, vid = skull.current!, img = face.current!, hero = cv.parentElement!
    let renderer: Renderer
    try { renderer = new Renderer({ canvas: cv, alpha: true, premultipliedAlpha: true, dpr: Math.min(devicePixelRatio, 1.5), depth: false }) }
    catch { return } // no WebGL: CSS fallback
    const gl = renderer.gl
    const tri = new Triangle(gl)
    const tex = (image?: HTMLImageElement | HTMLVideoElement) => new Texture(gl, { image, generateMipmaps: false, minFilter: gl.LINEAR })
    const skullTex = tex(), faceTex = tex()
    const depth = (src: string) => { const t = tex(); const i = new Image(); i.onload = () => { t.image = i }; i.src = src; return t }
    const skullDepth = depth('/hero/skull-depth.webp'), faceDepth = depth('/hero/face-depth.webp')
    const rt = () => new RenderTarget(gl, { width: 2, height: 2, depth: false })
    let read = rt(), write = rt()

    const trail = new Mesh(gl, { geometry: tri, program: new Program(gl, { vertex: VERT, fragment: TRAIL, depthTest: false, uniforms: {
      tPrev: { value: read.texture }, uA: { value: [0, 0] }, uB: { value: [0, 0] }, uR: { value: .09 }, uActive: { value: 0 },
      uAspect: { value: 16 / 9 }, uDecay: { value: .012 }, uTime: { value: 0 } } }) })
    const comp = new Mesh(gl, { geometry: tri, program: new Program(gl, { vertex: VERT, fragment: COMPOSITE, depthTest: false, uniforms: {
      tSkull: { value: skullTex }, tFace: { value: faceTex }, tMask: { value: read.texture },
      tSkullDepth: { value: skullDepth }, tFaceDepth: { value: faceDepth }, uLook: { value: [0, 0] },
      uTime: { value: 0 }, uFull: { value: 0 }, uAspect: { value: 16 / 9 }, uBox: { value: [0, 0, 1, 1] } } }) })

    const resize = () => {
      const hr = hero.getBoundingClientRect(), b = el.getBoundingClientRect()
      const { width, height } = hr
      renderer.setSize(width, height)
      comp.program.uniforms.uBox.value = [(b.left - hr.left) / width, (hr.bottom - b.bottom) / height, b.width / width, b.height / height]
      // trail at ~1/4 res: cheap, and the bilinear upscale softens it before thresholding
      const w = Math.max(2, Math.round(width / 4)), h = Math.max(2, Math.round(height / 4))
      read = new RenderTarget(gl, { width: w, height: h, depth: false })
      write = new RenderTarget(gl, { width: w, height: h, depth: false })
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el); ro.observe(hero)

    // pointer in canvas UV (y up); eased so fast moves draw continuous segments
    const target = { x: .5, y: .5, in: false }, eased = { x: .5, y: .5 }, last = { x: .5, y: .5 }
    // head-turn direction from the cursor anywhere on the page (-1..1), like landonorris.com
    const look = { x: 0, y: 0, tx: 0, ty: 0, mouse: false }
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      look.mouse = true
      look.tx = e.clientX / innerWidth * 2 - 1
      look.ty = 1 - e.clientY / innerHeight * 2
      const r = hero.getBoundingClientRect()
      target.x = (e.clientX - r.left) / r.width
      target.y = 1 - (e.clientY - r.top) / r.height
      // the canvas fills the hero: the cursor paints wherever it goes over it
      const inside = target.x >= 0 && target.x <= 1 && target.y >= 0 && target.y <= 1
      // entering: jump the eased point to the cursor so it doesn't paint a streak from where it last was
      if (inside && !target.in) { eased.x = last.x = target.x; eased.y = last.y = target.y }
      target.in = inside
    }
    const leave = () => { target.in = false }
    addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)

    let ready = false, full = 0, raf = 0, prev = performance.now(), time = 0, visible = true
    img.decode().catch(() => {}).then(() => { faceTex.image = img; ready = true; el.classList.add('gl') })
    const rm = matchMedia('(prefers-reduced-motion: reduce)')

    const frame = (now: number) => {
      raf = visible ? requestAnimationFrame(frame) : 0
      const dt = Math.min((now - prev) / 1000, .05); prev = now
      if (!rm.matches) time += dt
      if (!ready) return
      if (vid.readyState >= 2) { skullTex.image = vid; skullTex.needsUpdate = true }

      last.x = eased.x; last.y = eased.y
      const k = 1 - Math.exp(-dt * 18)
      eased.x += (target.x - eased.x) * k; eased.y += (target.y - eased.y) * k
      const speed = Math.hypot(eased.x - last.x, eased.y - last.y) / Math.max(dt, 1e-3)
      // no mouse (touch): slow idle sway so the head still feels alive; reduced motion: hold still
      const lx = rm.matches ? 0 : look.mouse ? look.tx : Math.sin(time * .6) * .45
      const ly = rm.matches ? 0 : look.mouse ? look.ty : Math.sin(time * .43) * .2
      const lk = 1 - Math.exp(-dt * 3.5) // heavy, lagging follow
      look.x += (lx - look.x) * lk; look.y += (ly - look.y) * lk
      full += ((reveal.current ? 1 : 0) - full) * (rm.matches ? 1 : 1 - Math.exp(-dt * 2.2))

      const tu = trail.program.uniforms, cu = comp.program.uniforms
      const aspect = cv.width / cv.height
      tu.tPrev.value = read.texture; tu.uA.value = [last.x, last.y]; tu.uB.value = [eased.x, eased.y]
      tu.uActive.value = target.in ? 1 : 0; tu.uR.value = .12 + Math.min(speed * .03, .07)
      tu.uDecay.value = .45 * dt; tu.uAspect.value = aspect; tu.uTime.value = time
      renderer.render({ scene: trail, target: write });
      [read, write] = [write, read]

      cu.tMask.value = read.texture; cu.uTime.value = time; cu.uFull.value = full; cu.uAspect.value = aspect; cu.uLook.value = [look.x, look.y]
      renderer.render({ scene: comp })
    }
    // stop rendering while the hero is scrolled away
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) { prev = performance.now(); raf = requestAnimationFrame(frame) }
    })
    io.observe(el)

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); el.classList.remove('gl')
      removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  const set = (v: boolean) => { reveal.current = v; setOn(v) }

  // Tab toggles face <-> skull (and the choice stays locked) while the hero fills the middle of the screen;
  // past the hero, or with the menu / a dialog open, Tab moves focus as usual
  useEffect(() => {
    // Ghost Rider laugh when Tab turns the face into the skull; switching back to the face stops it
    const laugh = new Audio('/hero/' + encodeURIComponent('GHOST RIDER SPIRIT OF VENGEANCE 3D - Laugh - In Theaters 217.mp3'))
    laugh.preload = 'auto'
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || e.altKey || e.ctrlKey || e.metaKey) return
      const hero = box.current?.closest('.hero')
      if (!hero || hero.getBoundingClientRect().bottom < innerHeight / 2) return
      if (document.querySelector('.menu[data-open], dialog[open]')) return
      e.preventDefault()
      reveal.current = !reveal.current; setOn(reveal.current)
      if (reveal.current) { laugh.currentTime = 0; laugh.play().catch(() => {}) }
      else laugh.pause()
    }
    addEventListener('keydown', onKey)
    return () => { removeEventListener('keydown', onKey); laugh.pause() }
  }, [])

  return <>
    <video ref={bg} className="hero-bg" src="/hero/background-loop.mp4" autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
    {/* shown while the home music plays (html[data-music], set by HomeAudio) */}
    <img className="hero-moon" src="/hero/moon.jpg" alt="" aria-hidden="true" decoding="async" />
    <div ref={box} className="char" data-on={on || undefined}>
      <div className="char-glow" aria-hidden="true" />
      <video ref={skull} className="char-skull" autoPlay muted loop playsInline preload="auto" poster="/hero/skull-poster.webp" aria-hidden="true">
        <source src="/hero/skull-720.mp4" type="video/mp4" media="(max-width: 900px)" />
        <source src="/hero/skull-1080.mp4" type="video/mp4" />
      </video>
      <img ref={face} className="char-face" src="/hero/face-cutout.webp" alt="" fetchPriority="high" />
      <button
        type="button"
        className="char-hit"
        aria-pressed={on}
        aria-label="Reveal the flaming skull behind the face"
        // mouse users reveal by moving over the character; touch-first devices and keyboard (Tab, Enter/Space) get a sticky toggle
        onClick={e => (e.detail === 0 || matchMedia('(hover: none)').matches) && set(!reveal.current)}
      />
    </div>
    <canvas ref={canvas} className="char-gl" aria-hidden="true" />
  </>
}
