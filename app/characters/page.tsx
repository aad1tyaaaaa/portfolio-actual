import BackButton from '@/components/BackButton'
import { characters } from '@/lib/characters'

export default function Characters() {
  return (
    <main className="min-h-dvh bg-[#0c0c0c] px-5 pt-20 pb-16 text-[#d7e2ea] sm:px-8">
      <BackButton />
      <h1 className="font-['Instrument_Serif',serif] text-6xl leading-[.9] italic sm:text-8xl">the characters i design</h1>
      <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {characters.map(c => (
          <li key={c.name}>
            <a href={c.src} target="_blank" rel="noreferrer" className="group block">
              <div className="overflow-hidden rounded-3xl bg-white/5">
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
