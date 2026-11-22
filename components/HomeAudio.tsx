'use client'

import { useEffect, useRef, useState } from 'react'

// Home-page music. Never autoplays: it only starts when the visitor clicks S1 or S2 (d4vd, the ghost, introduces them).
// Volume is fixed at 50%.
export default function HomeAudio({ src }: { src: string }) {
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const s2Ref = useRef(false) // read by the play/pause listener below

  useEffect(() => {
    const a = audio.current!
    a.volume = 0.5
    // while the music plays the hero swaps its background for the moon, or S2.mp4 on S2 (CSS: html[data-music]),
    // and HeroCharacter stops painting the cursor trail
    const root = document.documentElement
    const sync = () => {
      setPlaying(!a.paused)
      if (a.paused) delete root.dataset.music; else root.dataset.music = s2Ref.current ? 's2' : ''
      const v = document.querySelector<HTMLVideoElement>('.hero-s2')
      if (v) { if (!a.paused && s2Ref.current) v.play().catch(() => {}); else v.pause() }
    }
    a.addEventListener('play', sync); a.addEventListener('pause', sync)
    return () => { a.removeEventListener('play', sync); a.removeEventListener('pause', sync); a.pause(); delete root.dataset.music }
  }, [])

  const play = () => audio.current!.play().catch(() => {})
  // S1 / S2 are two "sides": clicking the inactive one switches face + track; clicking the active one plays / pauses
  const [s2, setS2] = useState(false)
  const toggle = () => { if (audio.current!.paused) play(); else audio.current!.pause() }
  const side = (next: boolean) => {
    if (next === s2) return toggle()
    const f = document.querySelector<HTMLImageElement>('.char-face') // HeroCharacter re-uploads the texture on load
    if (f) f.src = next ? '/hero/face-s2.webp' : '/hero/face-cutout.webp'
    s2Ref.current = next
    audio.current!.src = next ? '/mix_final.mp3' : src
    setS2(next)
    play()
  }

  return <div className="home-audio">
    <audio ref={audio} src={src} loop preload="auto" />
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
