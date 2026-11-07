'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume1, Volume2, VolumeX } from 'lucide-react'

// Home-page music. Browsers block audible autoplay until the visitor interacts, so if play() is
// refused we start on the first click/tap/key. Mute + volume are remembered for the next visit.
// The icon mutes; hovering (or focusing) it slides out a volume slider.
export default function HomeAudio({ src }: { src: string }) {
  const audio = useRef<HTMLAudioElement>(null)
  const [muted, setMuted] = useState(false)
  const [vol, setVol] = useState(0.5)

  useEffect(() => {
    const a = audio.current!
    let off = false, v = 0.5
    try {
      off = localStorage.getItem('home-audio-muted') === '1'
      const saved = parseFloat(localStorage.getItem('home-audio-volume') ?? '')
      if (saved >= 0 && saved <= 1) v = saved
    } catch {}
    setMuted(off); setVol(v); a.volume = v
    // while the music plays the hero swaps its background for the moon (CSS: html[data-music])
    const root = document.documentElement
    const sync = () => { if (a.paused) delete root.dataset.music; else root.dataset.music = '' }
    a.addEventListener('play', sync); a.addEventListener('pause', sync)
    const cleanup = () => { a.removeEventListener('play', sync); a.removeEventListener('pause', sync); delete root.dataset.music }
    if (off) return cleanup
    // clicks on the control itself are left to its own handler
    const start = (e: Event) => { if (!(e.target instanceof Element && e.target.closest('.home-audio'))) a.play().then(stop, () => {}) }
    const stop = () => ['pointerdown', 'keydown'].forEach(t => removeEventListener(t, start))
    a.play().catch(() => ['pointerdown', 'keydown'].forEach(t => addEventListener(t, start)))
    return () => { stop(); a.pause(); cleanup() }
  }, [])

  const save = (k: string, v: string) => { try { localStorage.setItem(k, v) } catch {} }
  const setMute = (next: boolean) => {
    const a = audio.current!
    setMuted(next)
    if (next) a.pause(); else a.play().catch(() => {})
    save('home-audio-muted', next ? '1' : '0')
  }
  const change = (v: number) => {
    audio.current!.volume = v
    setVol(v); save('home-audio-volume', String(v))
    if (v > 0 && muted) setMute(false) // dragging the slider up turns the music back on
  }

  const silent = muted || vol === 0
  const Icon = silent ? VolumeX : vol < 0.5 ? Volume1 : Volume2

  return <div className="home-audio">
    <audio ref={audio} src={src} loop preload="auto" />
    <label className="home-audio-slider">
      <span className="sr-only">Music volume</span>
      <input type="range" min={0} max={1} step={0.05} value={silent ? 0 : vol}
        onChange={e => change(+e.target.value)} style={{ '--v': `${(silent ? 0 : vol) * 100}%` } as React.CSSProperties} />
    </label>
    <button type="button" onClick={() => { if (!silent && !audio.current!.paused) return setMute(true); if (vol === 0) change(0.5); setMute(false) }} aria-pressed={!silent}
      aria-label={silent ? 'Turn music on' : 'Turn music off'} className="home-audio-btn">
      <Icon size={20} />
    </button>
  </div>
}
