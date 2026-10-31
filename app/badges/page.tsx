import BackButton from '@/components/BackButton'
import { badges } from '@/lib/badges'

export default function Badges() {
  return (
    <main className="min-h-dvh bg-[#0c0c0c] px-5 pt-20 pb-16 text-[#d7e2ea] sm:px-8">
      <BackButton />
      <h1 className="font-['Instrument_Serif',serif] text-6xl leading-[.9] italic sm:text-8xl">the badges i design</h1>
      <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {badges.map(b => (
          <li key={b.name}>
            <a href={b.src} target="_blank" rel="noreferrer" className="group block">
              <img src={b.src} alt={`${b.name} badge`} loading="lazy" className="mx-auto aspect-square w-full max-w-72 object-contain transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-6" />
              <p className="mt-3 text-center text-sm tracking-wide text-[#d7e2ea]/70">{b.name}</p>
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
