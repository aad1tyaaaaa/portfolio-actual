'use client'

import { useState } from 'react'
import BackButton from '@/components/BackButton'
import InfiniteSpiral from '@/components/InfiniteSpiral'
import MicroSlats from '@/components/MicroSlats'
import { badges } from '@/lib/badges'

// round badges with transparent corners, so no card frame; clicking one highlights it (click again to clear)
const items = badges.map(b => ({ src: b.src, alt: `${b.name} badge`, label: b.name }))

export default function Badges() {
  const [active, setActive] = useState(-1)
  return (
    <main className="relative isolate flex h-dvh flex-col overflow-hidden bg-[#0c0c0c] px-5 pt-20 text-[#d7e2ea] sm:px-8">
      {/* page background: purple slat sea that the cursor stirs */}
      <div className="absolute inset-0 -z-10">
        <MicroSlats preset="swell" color="#A855F7" glintColor="#ffffff" backgroundColor="#0c0c0c" slatWidth={10} slatHeight={25} gap={3}
          roundness={0.75} interactive cursorStrength={1} cursorSize={40} swirl={0} trail={1.4} lean={0} intro />
      </div>
      <BackButton />
      <h1 className="font-['Instrument_Serif',serif] text-6xl leading-[.9] italic sm:text-8xl">the badges i design</h1>
      <div className="relative min-h-0 flex-1 mask-[linear-gradient(transparent,#000_12%_88%,transparent)]">
        <InfiniteSpiral
          className="badge-spiral"
          items={items}
          animationMode="all"
          speed={0.55}
          radius={260}
          cardWidth={170}
          cardHeight={170}
          verticalSpacing={80}
          cardRadius={999}
          centerScale={1.2}
          edgeBlur={6}
          cardsPerTurn={7}
          imageFit="contain"
          pauseOnHover={false}
          activeIndex={active}
          onItemClick={(i: number) => setActive(a => (a === i ? -1 : i))}
        />
      </div>
      {/* name of the highlighted badge */}
      <p aria-live="polite" className="pointer-events-none absolute inset-x-0 bottom-6 text-center font-['Instrument_Serif',serif] text-3xl italic text-[#f6e6f8] [text-shadow:0_2px_16px_#0c0c0c]">
        {active >= 0 ? badges[active].name : ''}
      </p>
    </main>
  )
}
