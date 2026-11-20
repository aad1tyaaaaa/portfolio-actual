'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BackButton from '@/components/BackButton'
import { characters } from '@/lib/characters'
import StainedGlass from '@/components/StainedGlass'

// game-style character select: the current character big in the centre (idle loop), its neighbours dimmed
// at the sides, prev / next arrows that wrap around. Arrow keys work too.
// Images are not links and ignore the pointer: no opening the full file, no right-click "Save image", no drag-out.
const n = characters.length
const at = (i: number) => characters[((i % n) + n) % n]

export default function Characters() {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const go = (d: 1 | -1) => { setDir(d); setI(v => v + d) }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  const c = at(i), num = ((i % n) + n) % n + 1
  const img = 'pointer-events-none object-contain object-bottom select-none'

  return (
    <main className="relative flex h-dvh flex-col overflow-hidden bg-[#0c0c0c] px-5 pt-20 pb-8 text-[#d7e2ea] sm:px-8">
      <BackButton />
      {/* fixed so the glass stays put; the scrim keeps the text readable */}
      <StainedGlass className="fixed inset-0 size-full" />
      <div className="pointer-events-none fixed inset-0 bg-black/30" aria-hidden="true" />
      <h1 className="relative font-['Instrument_Serif',serif] text-5xl leading-[.9] italic sm:text-7xl">the characters i design</h1>

      <section className="relative mt-4 flex min-h-0 flex-1 items-end justify-center" aria-roledescription="carousel" aria-label="Characters">
        {/* neighbours, dimmed and smaller (hidden on phones) */}
        <img src={at(i - 1).src} alt="" aria-hidden="true" draggable={false} className={`${img} char-side absolute bottom-0 left-[6%] hidden h-[62%] w-[22%] md:block`} />
        <img src={at(i + 1).src} alt="" aria-hidden="true" draggable={false} className={`${img} char-side absolute right-[6%] bottom-0 hidden h-[62%] w-[22%] md:block`} />

        {/* the selected character: key remounts it so the slide-in plays on every change */}
        <div key={i} className="char-enter relative h-full w-full max-w-[520px]" style={{ '--from': `${dir * 60}px` } as React.CSSProperties}>
          <div className="char-idle h-full">
            <img src={c.src} alt={c.name} draggable={false} className={`${img} h-full w-full`} />
          </div>
        </div>

        <button type="button" onClick={() => go(-1)} aria-label="Previous character" className="char-nav left-0 sm:left-2"><ChevronLeft /></button>
        <button type="button" onClick={() => go(1)} aria-label="Next character" className="char-nav right-0 sm:right-2"><ChevronRight /></button>
      </section>

      <div className="relative mt-4 text-center" aria-live="polite">
        <p className="text-xs tracking-[.3em] text-[#e28bed]">{String(num).padStart(2, '0')} / {String(n).padStart(2, '0')}</p>
        <p className="mt-1 font-['Instrument_Serif',serif] text-2xl italic sm:text-3xl">{c.name}</p>
      </div>
    </main>
  )
}
