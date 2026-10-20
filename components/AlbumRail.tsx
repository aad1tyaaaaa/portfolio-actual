'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

export type Album = { src: string; title: string; artist: string; year: string; track: string; preview: string }

// Fan of sleeves around the focused one; the focused sleeve's record slides out, spins, and plays its preview.
export default function AlbumRail({ items, interval = 4000 }: { items: Album[]; interval?: number }) {
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audio = useRef<HTMLAudioElement>(null)
  const reduce = useReducedMotion()
  const lastWheel = useRef(0)
  const dragX = useRef<number | null>(null)
  const n = items.length
  const go = (d: number) => setActive(a => (a + d + n) % n)

  useEffect(() => {
    if (hover || reduce || playing) return
    const t = setInterval(() => go(1), interval)
    return () => clearInterval(t)
  }, [hover, reduce, interval, active, playing])

  // src follows the active album; browsers block play() until the visitor presses play once
  useEffect(() => {
    const el = audio.current
    if (!el) return
    if (playing) el.play().catch(() => setPlaying(false))
    else el.pause()
  }, [playing, active])

  const a = items[active]
  return (
    <div
      className="relative flex h-full min-h-[420px] w-full flex-col items-center justify-center overflow-hidden outline-none select-none"
      tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Albums on repeat"
      onKeyDown={e => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onWheel={e => { const now = Date.now(); if (now - lastWheel.current < 450 || Math.abs(e.deltaX) + Math.abs(e.deltaY) < 8) return; lastWheel.current = now; go(Math.sign(e.deltaX || e.deltaY)) }}
      onPointerDown={e => { dragX.current = e.clientX }}
      onPointerUp={e => { if (dragX.current === null) return; const dx = e.clientX - dragX.current; dragX.current = null; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1) }}
    >
      <div className="relative aspect-square w-[min(48vmin,340px)] [perspective:1400px]">
        {items.map((it, i) => {
          // shortest signed distance around the loop
          let o = i - active
          if (o > n / 2) o -= n
          if (o < -n / 2) o += n
          const d = Math.abs(o)
          const isActive = o === 0
          return (
            <motion.div
              key={it.src}
              className="absolute inset-0 [transform-style:preserve-3d]"
              style={{ zIndex: 100 - d, pointerEvents: d > 3 ? 'none' : 'auto' }}
              initial={false}
              animate={{
                x: `${o * 52 + (o > 0 ? 30 : 0) - 16}%`,
                rotateY: Math.max(-60, Math.min(60, -o * 22)),
                rotateZ: o * 6,
                y: `${d * 4}%`,
                z: -d * 120,
                scale: isActive ? 1 : 0.86,
                opacity: d > 3 ? 0 : 1,
                filter: `brightness(${isActive ? 1 : 0.55})`,
              }}
              transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 24 }}
              onClick={() => isActive ? setPlaying(p => !p) : go(o)}
            >
              {/* record tucked in the sleeve, slides out on focus */}
              <motion.div
                className="absolute inset-[3%] rounded-full shadow-[0_10px_40px_#000a,inset_0_0_0_2px_#ffffff1f]"
                initial={false}
                animate={{ x: isActive ? '46%' : '0%' }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 20, delay: isActive ? 0.25 : 0 }}
              >
                <div
                  className="size-full rounded-full animate-[spin_1.8s_linear_infinite] motion-reduce:animate-none"
                  style={{
                    animationPlayState: isActive && (playing || !hover) ? 'running' : 'paused',
                    background: 'radial-gradient(circle,#0000 33%,#ffffff14 34%,#0000 35%),repeating-radial-gradient(circle,#121014 0 2px,#2a2630 2px 3px),conic-gradient(from 30deg,#0000,#ffffff1a,#0000 20%,#0000 50%,#ffffff1a,#0000 70%)',
                    backgroundBlendMode: 'screen',
                  }}
                >
                  <img src={it.src} alt="" draggable={false} className="absolute inset-[33%] size-[34%] rounded-full object-cover" />
                  <span className="absolute inset-[48.5%] rounded-full bg-[#0c0c0c]" />
                </div>
              </motion.div>
              <img
                src={it.src} alt={`${it.title} by ${it.artist}`} draggable={false}
                className="relative size-full rounded-[14px] object-cover shadow-[0_30px_60px_#000c]"
              />
            </motion.div>
          )
        })}
      </div>

      <div className="mt-[6vh] w-[min(80vw,360px)] text-center text-[#d7e2ea]" aria-live="polite">
        <p className="truncate font-['Instrument_Serif',serif] text-2xl italic text-[#e28bed]">{a.title}</p>
        <p className="truncate text-xs uppercase tracking-[.16em] opacity-70">{a.track} · {a.artist} · {a.year}</p>
      </div>
      <div className="mt-5 flex items-center gap-5 text-[#d7e2ea]">
        <button type="button" aria-label="Previous album" onClick={() => go(-1)} className="liquid-glass grid size-11 place-items-center rounded-full transition-transform hover:scale-105"><ChevronLeft size={20} /></button>
        <button type="button" aria-label={playing ? `Pause ${a.track}` : `Play ${a.track}`} onClick={() => setPlaying(p => !p)} className="grid size-14 place-items-center rounded-full bg-[#e28bed] text-[#0c0c0c] transition-transform hover:scale-105">{playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="translate-x-px" />}</button>
        <button type="button" aria-label="Next album" onClick={() => go(1)} className="liquid-glass grid size-11 place-items-center rounded-full transition-transform hover:scale-105"><ChevronRight size={20} /></button>
      </div>
      {/* finished preview rolls on to the next record */}
      <audio ref={audio} src={a.preview} preload="none" onEnded={() => go(1)} />
    </div>
  )
}
