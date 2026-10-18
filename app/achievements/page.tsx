'use client'

import LiquidEther from '@/components/LiquidEther'
import MorphSlider from '@/components/MorphSlider'
import BackButton from '@/components/BackButton'
import LetterSwap from '@/components/LetterSwap'

const achievements = [
  { rank: '1st Place', event: 'National-Level Hackathon', note: 'Won a ₹1 Lakh cash prize for ArogyaSense, an AI-integrated mobile health ecosystem.' },
  { rank: '2nd Runner-Up', event: 'DEEP BLUE Hackathon', note: 'National-level hackathon (Mastek-Majesco Season 10) for an AI-based food freshness detection system.' },
  { rank: 'Top 5 Finalist', event: 'CODEASTRA 2.0', note: 'Secured a top 5 finalist position at MCA-RGIT’s CODEASTRA 2.0.' },
  { rank: 'Top 10 Finalist', event: 'SAKEC CREATHON 2025', note: 'Secured a top 10 finalist position in SAKEC’s CREATHON 2025 hackathon.' },
  { rank: 'Top 20 Finalist', event: 'Somaiya Riidl Hackathon', note: 'Secured a top 20 finalist position at the Somaiya Riidl Hackathon.' },
]

// ponytail: stock React Bits images until real event photos land in /public/achievements
const photos = [
  'https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1781499455083-6ccc3beb20cd?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1776394254711-4a0d7345269a?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1781242629922-6f39cc3671cd?q=80&w=1600&auto=format&fit=crop',
]
// module-level so the slider's WebGL engine isn't rebuilt every render
const slides = achievements.map((a, i) => ({ image: photos[i % photos.length], caption: `${a.rank} — ${a.event}` }))

export default function Achievements() {
  return (
    <section className="relative w-full min-h-dvh lg:h-dvh overflow-hidden bg-black text-white">
      <BackButton />
      <div className="absolute inset-0">
        <LiquidEther colors={['#b600a8', '#7621b0', '#f6e6f8']} mouseForce={20} cursorSize={100} persistence={0.9} autoDemo alwaysAuto autoSpeed={0.5} autoIntensity={2.2} />
      </div>

      <div className="relative z-[1] h-full flex flex-col px-5 sm:px-6 pt-5 sm:pt-6 pb-5">
        <h1 className="text-center text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-none pt-1"><LetterSwap text="ACHIEVEMENTS" /></h1>
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4 lg:gap-8 mt-4 lg:mt-6">
          <div className="relative h-[45vh] lg:h-auto min-h-0">
            <MorphSlider items={slides} transition="melt" intensity={0.55} aberration={0.35} drift={0.4} radius={24} autoplay />
          </div>
          <ol className="grid gap-3 content-center min-h-0">
            {achievements.map((a, i) => (
              <li key={a.event} className="liquid-glass rounded-3xl p-4 lg:px-6 lg:py-4 flex items-center gap-4">
                <strong className="text-2xl lg:text-4xl font-bold text-white/40 tabular-nums shrink-0">{String(i + 1).padStart(2, '0')}</strong>
                <div className="min-w-0">
                  <p className="text-[11px] lg:text-xs uppercase tracking-wider text-[#f6e6f8]/70">{a.rank}</p>
                  <h2 className="text-lg lg:text-2xl leading-tight"><LetterSwap text={a.event} /></h2>
                  <p className="mt-0.5 text-xs lg:text-sm text-white/75">{a.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
