'use client'

import LiquidEther from '@/components/LiquidEther'
import DitherVeil from '@/components/DitherVeil'
import BackButton from '@/components/BackButton'
import LetterSwap from '@/components/LetterSwap'

const education = [
  { years: 'Undergraduate', degree: 'BTech in Electronics & Computer Science Engineering', school: 'Shah & Anchor Kutchhi Engineering College', note: 'GPA 8.72 / 10', logo: '/education/sakec.png' },
  { years: 'Junior College', degree: 'Bifocal in Electronics', school: 'Jai Hind College', logo: '/education/jai-hind.png' },
  { years: 'School', degree: 'Secondary School', school: 'M. V. High School', logo: '/education/school.png' },
]

export default function Education() {
  return (
    <section className="relative w-full h-dvh overflow-hidden bg-black text-white">
      <BackButton />
      <div className="absolute inset-0">
        <LiquidEther colors={['#5227FF', '#FF9FFC', '#B497CF']} mouseForce={20} cursorSize={100} persistence={0.9} autoDemo alwaysAuto autoSpeed={0.5} autoIntensity={2.2} />
      </div>

      {/* fits one screen: title row, then the image cell takes whatever height the cards leave */}
      <div className="relative z-[1] h-full flex flex-col px-5 sm:px-6 pt-5 sm:pt-6 pb-5">
        <h1 className="text-center text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-none pt-1"><LetterSwap text="EDUCATION" /></h1>
        <div className="flex-1 min-h-0 grid grid-cols-1 grid-rows-[minmax(0,1fr)_auto] md:grid-rows-1 md:grid-cols-[1.1fr_1fr] gap-4 lg:gap-8 mt-4 lg:mt-6">
          <div className="relative min-h-0">
            <div className="absolute inset-0"><DitherVeil src="https://images.unsplash.com/photo-1737071371043-761e02b1ef95?q=80&w=1400&auto=format&fit=crop" fit="contain" knockout pattern="floyd" pixelSize={2} inkColor="#120f17" paperColor="#f4f1ea" revealRadius={200} softness={0.6} linger={1} /></div>
          </div>
          <div className="grid gap-3 lg:gap-5 content-center">
            {education.map(e => (
              <article key={e.degree} className="liquid-glass rounded-3xl p-4 lg:p-7 flex items-center gap-4 lg:gap-6">
                <img src={e.logo} alt={`${e.school} logo`} loading="lazy" className="w-12 h-12 lg:w-24 lg:h-24 object-contain shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] lg:text-sm uppercase tracking-wider text-white/60">{e.years}</p>
                  <h2 className="text-lg lg:text-3xl mt-1 leading-tight"><LetterSwap text={e.degree} /></h2>
                  <p className="mt-1 lg:mt-2 text-xs lg:text-base text-white/80">{e.school}{e.note && <> · {e.note}</>}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
