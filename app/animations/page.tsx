'use client'

import BackButton from '@/components/BackButton'
import { animations } from '@/lib/animations'

export default function Animations() {
  return (
    <main className="min-h-dvh bg-[#0c0c0c] px-5 pt-20 pb-16 text-[#d7e2ea] sm:px-8">
      <BackButton />
      <h1 className="font-['Instrument_Serif',serif] text-6xl leading-[.9] italic sm:text-8xl">the animation i design</h1>
      <p className="mt-4 text-sm text-[#d7e2ea]/60">designed by <span className="text-[#e28bed]">Aaditya Jaiswar</span> · press play for sound</p>
      <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        {animations.map(a => (
          <li key={a.name}>
            <video src={a.src} poster={a.poster} controls controlsList="nodownload" disablePictureInPicture onContextMenu={e => e.preventDefault()} playsInline preload="none" className="aspect-video w-full rounded-3xl bg-white/5 object-cover" />
            <p className="mt-3 text-sm tracking-wide text-[#d7e2ea]/70">{a.name} <span className="text-[#d7e2ea]/40">— designed by Aaditya Jaiswar</span></p>
          </li>
        ))}
      </ul>
    </main>
  )
}
