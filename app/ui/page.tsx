'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BackButton from '@/components/BackButton'
import MeadowBlush from '@/components/MeadowBlush'
import { uiDesigns } from '@/lib/ui'

// same carousel as the characters page: the current design big in the centre, its neighbours dimmed at the sides,
// prev / next arrows that wrap around, arrow keys too. Over the voxel meadow, which parts its grass under the pointer
// (the text and images let the pointer through to it; only the buttons catch it).
const n = uiDesigns.length
const at = (i: number) => uiDesigns[((i % n) + n) % n]

export default function UI() {
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

  const d = at(i), num = ((i % n) + n) % n + 1
  const img = 'pointer-events-none select-none max-h-full max-w-full rounded-2xl object-contain shadow-[0_20px_60px_#0008]'

  return (
    <main className="relative flex h-dvh flex-col overflow-hidden bg-[#0c0c0c] px-5 pt-20 pb-8 text-[#fdf6f0] sm:px-8">
      <BackButton />
      {/* MeadowBlush forces position:relative on itself, so the fixed placement goes on a wrapper */}
      <div className="fixed inset-0"><MeadowBlush /></div>
      <div className="pointer-events-none fixed inset-0 bg-black/25" aria-hidden="true" />
      <h1 className="pointer-events-none relative font-['Instrument_Serif',serif] text-5xl leading-[.9] italic drop-shadow-[0_2px_12px_#0006] sm:text-7xl">the UI i design</h1>

      <section className="pointer-events-none relative mt-4 flex min-h-0 flex-1 items-center justify-center" aria-roledescription="carousel" aria-label="UI designs">
        {/* neighbours, dimmed and smaller (hidden on phones) */}
        <div className="char-side absolute top-1/2 left-[4%] hidden h-[50%] w-[24%] -translate-y-1/2 items-center justify-center md:flex">
          <img src={at(i - 1).src} alt="" aria-hidden="true" draggable={false} className={img} />
        </div>
        <div className="char-side absolute top-1/2 right-[4%] hidden h-[50%] w-[24%] -translate-y-1/2 items-center justify-center md:flex">
          <img src={at(i + 1).src} alt="" aria-hidden="true" draggable={false} className={img} />
        </div>

        {/* the selected design: key remounts it so the slide-in plays on every change */}
        <div key={i} className="char-enter relative flex h-full w-full max-w-[860px] items-center justify-center" style={{ '--from': `${dir * 60}px` } as React.CSSProperties}>
          <img src={d.src} alt={d.name} draggable={false} className={img} />
        </div>

        <button type="button" onClick={() => go(-1)} aria-label="Previous design" className="char-nav pointer-events-auto left-0 sm:left-2"><ChevronLeft /></button>
        <button type="button" onClick={() => go(1)} aria-label="Next design" className="char-nav pointer-events-auto right-0 sm:right-2"><ChevronRight /></button>
      </section>

      <div className="pointer-events-none relative mt-4 text-center drop-shadow-[0_2px_10px_#0007]" aria-live="polite">
        <p className="text-xs tracking-[.3em] text-[#ffe3f6]">{String(num).padStart(2, '0')} / {String(n).padStart(2, '0')}</p>
        <p className="mt-1 font-['Instrument_Serif',serif] text-2xl italic sm:text-3xl">{d.name}</p>
      </div>
    </main>
  )
}
