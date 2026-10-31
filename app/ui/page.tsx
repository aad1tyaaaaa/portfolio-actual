import BackButton from '@/components/BackButton'
import { uiDesigns } from '@/lib/ui'

export default function UI() {
  return (
    <main className="min-h-dvh bg-[#0c0c0c] px-5 pt-20 pb-16 text-[#d7e2ea] sm:px-8">
      <BackButton />
      <h1 className="font-['Instrument_Serif',serif] text-6xl leading-[.9] italic sm:text-8xl">the UI i design</h1>
      <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        {uiDesigns.map(d => (
          <li key={d.name}>
            <a href={d.src} target="_blank" rel="noreferrer" className="group block">
              <div className="overflow-hidden rounded-3xl bg-white/5">
                <img src={d.src} alt={d.name} loading="lazy" className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
              </div>
              <p className="mt-3 text-sm tracking-wide text-[#d7e2ea]/70">{d.name}</p>
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
