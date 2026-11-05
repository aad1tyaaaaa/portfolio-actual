import BackButton from '@/components/BackButton'
import { characters } from '@/lib/characters'
import StainedGlass from '@/components/StainedGlass'

export default function Characters() {
  return (
    <main className="relative min-h-dvh bg-[#0c0c0c] px-5 pt-20 pb-16 text-[#d7e2ea] sm:px-8">
      <BackButton />
      {/* fixed so the glass stays put while the grid scrolls; the scrim keeps the text readable */}
      <StainedGlass className="fixed inset-0 size-full" />
      <div className="pointer-events-none fixed inset-0 bg-black/30" aria-hidden="true" />
      <h1 className="relative font-['Instrument_Serif',serif] text-6xl leading-[.9] italic sm:text-8xl">the characters i design</h1>
      <ul className="relative mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {characters.map(c => (
          <li key={c.name}>
            <a href={c.src} target="_blank" rel="noreferrer" className="group block">
              <div className="overflow-hidden">
                <img src={c.src} alt={c.name} loading="lazy" className="aspect-[2/3] w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
              </div>
              <p className="mt-3 text-sm tracking-wide text-[#d7e2ea]/70">{c.name}</p>
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
