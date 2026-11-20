'use client'

import { useEffect, useRef, useState } from 'react'

// Home-page music. Browsers block audible autoplay until the visitor interacts, so if play() is
// refused we start on the first click/tap/key. Mute + volume are remembered for the next visit.
// The icon mutes; hovering (or focusing) it slides out a volume slider.
export default function HomeAudio({ src }: { src: string }) {
  const audio = useRef<HTMLAudioElement>(null)
  const [muted, setMuted] = useState(false)
  const [vol, setVol] = useState(0.5)
  const [playing, setPlaying] = useState(false)

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
    const sync = () => { setPlaying(!a.paused); if (a.paused) delete root.dataset.music; else root.dataset.music = '' }
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
  // S1 / S2 are two "sides": clicking the inactive one switches face + track; clicking the active one plays / pauses
  const [s2, setS2] = useState(false)
  const toggle = () => { if (!silent && !audio.current!.paused) return setMute(true); if (vol === 0) change(0.5); setMute(false) }
  const side = (next: boolean) => {
    if (next === s2) return toggle()
    const f = document.querySelector<HTMLImageElement>('.char-face') // HeroCharacter re-uploads the texture on load
    if (f) f.src = next ? '/hero/face-s2.webp' : '/hero/face-cutout.webp'
    audio.current!.src = next ? encodeURI('/mix_3m12s (audio-joiner.com).mp3') : src
    setS2(next)
    if (vol === 0) change(0.5)
    setMute(false)
  }

  return <div className="home-audio">
    <audio ref={audio} src={src} loop preload="auto" />
    <label className="home-audio-slider">
      <span className="sr-only">Music volume</span>
      <input type="range" min={0} max={1} step={0.05} value={silent ? 0 : vol}
        onChange={e => change(+e.target.value)} style={{ '--v': `${(silent ? 0 : vol) * 100}%` } as React.CSSProperties} />
    </label>
    {/* segmented toggle: a pill slides under the active side; its equalizer bars move while the track plays */}
    <div className="home-audio-sides" data-side={s2 ? 2 : 1} data-playing={playing || undefined}>
      {[false, true].map(isS2 => {
        const active = isS2 === s2
        return <button key={+isS2} type="button" onClick={() => side(isS2)} aria-pressed={active && playing} data-active={active || undefined}
          aria-label={!active ? `Switch to ${isS2 ? 'S2' : 'S1'}` : playing ? 'Pause music' : 'Play music'} className="home-audio-btn">
          <span className="home-audio-eq" aria-hidden="true"><i /><i /><i /></span>{isS2 ? 'S2' : 'S1'}
        </button>
      })}
    </div>
  </div>
}
