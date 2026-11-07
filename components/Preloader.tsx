'use client'

import { useEffect, useRef, useState } from 'react'

/*
  Opening screen: full-bleed neon pink (the site accent) with the flickering "aJ" monogram; a foot row with name, role and a 0-100 load counter.
  Stays at least ~1.8s from navigation start (so the flicker reads) and until the page has loaded, capped at
  4.5s; then it lifts away with the same curved curtain as the menu. Server-rendered, so there's no flash of
  the page underneath; if JS never runs, the CSS fallback animation in globals.css removes it.
*/
export default function Preloader() {
  const [done, setDone] = useState(false)
  const [gone, setGone] = useState(false)
  const count = useRef<HTMLSpanElement>(null)
  const loaded = useRef(false)

  useEffect(() => {
    let t = 0
    const finish = () => { loaded.current = true }
    if (document.readyState === 'complete') finish(); else addEventListener('load', finish, { once: true })
    const cap = setTimeout(finish, 4500)
    // counter: creeps toward 90 while loading, runs to 100 once loaded (written to the DOM directly, no re-renders);
    // the curtain lifts a beat after it reads 100
    let raf = 0, n = 0
    const tick = () => {
      n += ((loaded.current ? 100 : 90) - n) * (loaded.current ? .15 : .02)
      if (count.current) count.current.textContent = String(Math.min(100, Math.round(n))).padStart(3, '0')
      if (n < 99.5) { raf = requestAnimationFrame(tick); return }
      if (count.current) count.current.textContent = '100'
      t = window.setTimeout(() => setDone(true), Math.max(250, 1800 - performance.now()))
    }
    raf = requestAnimationFrame(tick)
    return () => { clearTimeout(t); clearTimeout(cap); cancelAnimationFrame(raf); removeEventListener('load', finish) }
  }, [])

  if (gone) return null
  return (
    <div className="preloader" data-done={done || undefined} aria-hidden="true"
      onTransitionEnd={e => { if (done && e.target === e.currentTarget) setGone(true) }}>
      <span className="preloader-mark"><i>a</i><b>J</b></span>
      <div className="preloader-foot">
        <span>Aaditya Jaiswar</span>
        <span className="preloader-role">Software Engineer · AI &amp; Full-Stack</span>
        <span><span ref={count}>000</span>%</span>
      </div>
    </div>
  )
}
