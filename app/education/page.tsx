'use client'

import type { ReactNode } from 'react'
import LiquidEther from '@/components/LiquidEther'
// import DitherVeil from '@/components/DitherVeil'
import BackButton from '@/components/BackButton'
import LetterSwap from '@/components/LetterSwap'
import PageFlip from '@/components/PageFlip'

const education = [
  { years: 'Undergraduate', degree: 'BTech in Electronics & Computer Science Engineering', school: 'Shah & Anchor Kutchhi Engineering College', note: 'GPA 8.72 / 10', logo: '/education/sakec.png' },
  { years: 'Junior College', degree: 'Bifocal in Electronics', school: 'Jai Hind College', logo: '/education/jai-hind.png' },
  { years: 'School', degree: 'Secondary School', school: 'M. V. High School', logo: '/education/school.png' },
]

// halftone print texture; each page shows a different vertical slice of it
const PAGE_BG = '/education/page-bg.webp'
const serif = "font-['Instrument_Serif'] italic font-normal"

/** A page printed with the texture. `y` picks the slice (0–100%). */
function Sheet({ y, children }: { y: number; children: ReactNode }) {
  return (
    <div className="relative size-full bg-cover" style={{ backgroundImage: `url(${PAGE_BG})`, backgroundPosition: `center ${y}%` }}>
      {children}
    </div>
  )
}

/** Paper panel inset on a textured page, so text stays readable. */
function Panel({ children, folio, header }: { children: ReactNode; folio: number; header: string }) {
  return (
    <div className="absolute inset-[5cqw] flex flex-col rounded-[1.5cqw] bg-[#fbfaf7]/95 px-[7cqw] pt-[5cqw] pb-[4cqw] shadow-[0_1cqw_4cqw_rgb(0_0_0/0.3)]">
      {/* running header */}
      <div className="flex items-center justify-between text-[2.6cqw] uppercase tracking-[0.25em] text-zinc-400">
        <span>Education</span>
        <span>{header}</span>
      </div>
      <div className="mt-[2cqw] h-px bg-zinc-900/10" />
      {children}
      {/* folio */}
      <div className="mt-auto flex items-center gap-[3cqw] pt-[3cqw] text-[2.8cqw] text-zinc-400 tabular-nums">
        <span className="h-px flex-1 bg-zinc-900/10" />
        {folio}
        <span className="h-px flex-1 bg-zinc-900/10" />
      </div>
    </div>
  )
}

/** Dark tinted cover with a debossed double frame. */
function Cover({ y, children }: { y: number; children: ReactNode }) {
  return (
    <Sheet y={y}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(18_15_23/0.45),rgb(18_15_23/0.85))]" />
      {/* binding: cloth darkening along the spine */}
      <div className="absolute inset-y-0 left-0 w-[6cqw] bg-gradient-to-r from-black/50 to-transparent" />
      <div className="absolute inset-[6cqw] rounded-[1cqw] border border-[#f3efe4]/35">
        <div className="absolute inset-[1.6cqw] rounded-[0.6cqw] border border-[#f3efe4]/20" />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[12cqw] text-center text-[#f3efe4]">
        {children}
      </div>
    </Sheet>
  )
}

const Ornament = () => (
  <div aria-hidden="true" className="flex items-center gap-[2cqw] text-[#e28bed]">
    <span className="h-px w-[10cqw] bg-current opacity-60" />
    <span className="size-[1.6cqw] rotate-45 border border-current" />
    <span className="h-px w-[10cqw] bg-current opacity-60" />
  </div>
)

// sizes are in cqw so each page scales as a whole with the book
const cover = (
  <Cover key="cover" y={50}>
    <p className="text-[2.8cqw] uppercase tracking-[0.4em] opacity-70">Vol. I</p>
    <svg aria-hidden="true" className="mt-[7cqw] w-[16cqw] text-[#e28bed]" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinejoin="round" viewBox="0 0 48 48">
      <path d="M4 18 24 9l20 9-20 9z" />
      <path d="M12 22v10c4 4 20 4 24 0V22M44 18v12" />
    </svg>
    <p className={`${serif} mt-[5cqw] text-[15cqw] leading-[0.9] [text-shadow:0_0.6cqw_3cqw_rgb(0_0_0/0.6)]`}>Education</p>
    <div className="mt-[5cqw]"><Ornament /></div>
    <p className="mt-[5cqw] text-[3cqw] uppercase tracking-[0.35em] opacity-80">School to BTech</p>
    <p className="absolute bottom-[11cqw] text-[2.8cqw] tracking-[0.15em] opacity-60">Turn the corner →</p>
  </Cover>
)

const contents = (
  <Sheet key="contents" y={0}>
    <Panel folio={1} header="Contents">
      <p className={`${serif} mt-[9cqw] text-[11cqw] leading-none`}>Contents</p>
      <p className="mt-[4cqw] text-[3.4cqw] leading-relaxed text-zinc-600">Electronics first, then computer science. Each chapter is one stop along the way.</p>
      <ol className="mt-[8cqw] flex flex-col gap-[5cqw]">
        {education.map((e, i) => (
          <li key={e.school} className="flex items-baseline gap-[2.5cqw]">
            <span className={`${serif} text-[5cqw] text-[#7621b0]`}>{String(i + 1).padStart(2, '0')}</span>
            <span className="min-w-0">
              <span className="block text-[3.6cqw] font-medium leading-tight">{e.years}</span>
              <span className="block truncate text-[2.8cqw] text-zinc-500">{e.school}</span>
            </span>
            <span className="mb-[0.8cqw] flex-1 self-end border-b border-dotted border-zinc-300" />
            <span className="text-[3.2cqw] tabular-nums text-zinc-500">{i + 2}</span>
          </li>
        ))}
      </ol>
    </Panel>
  </Sheet>
)

const slices = [22, 68, 100]

const chapters = education.map((e, i) => (
  <Sheet key={e.degree} y={slices[i]}>
    <Panel folio={i + 2} header={`Chapter ${String(i + 1).padStart(2, '0')}`}>
      <div className="mt-[6cqw] flex items-end justify-between">
        <span className={`${serif} text-[20cqw] leading-[0.8] text-transparent [-webkit-text-stroke:0.25cqw_#7621b0]`}>{String(i + 1).padStart(2, '0')}</span>
        <span className="grid size-[17cqw] place-items-center rounded-full bg-white shadow-[0_0.5cqw_2cqw_rgb(0_0_0/0.12)] ring-1 ring-zinc-900/5">
          <img src={e.logo} alt={`${e.school} logo`} loading="lazy" draggable={false} className="size-[11cqw] object-contain" />
        </span>
      </div>
      <p className="mt-[7cqw] text-[2.8cqw] font-medium uppercase tracking-[0.3em] text-[#b600a8]">{e.years}</p>
      <h2 className={`${serif} mt-[2cqw] text-[8cqw] leading-[1.02]`}>{e.degree}</h2>
      <p className="mt-[3cqw] text-[3.4cqw] leading-snug text-zinc-600">{e.school}</p>
      {e.note && (
        <p className="mt-[4cqw] inline-flex self-start rounded-full bg-gradient-to-r from-[#7621b0] to-[#b600a8] px-[3cqw] py-[1cqw] text-[3cqw] font-medium text-white tabular-nums">{e.note}</p>
      )}
    </Panel>
  </Sheet>
))

const backCover = (
  <Cover key="back" y={82}>
    <Ornament />
    <p className={`${serif} mt-[5cqw] text-[9cqw] leading-none`}>Still learning</p>
    <p className="mt-[4cqw] text-[3cqw] uppercase tracking-[0.3em] opacity-70">Thanks for reading</p>
  </Cover>
)

const pages = [cover, contents, ...chapters, backCover]

export default function Education() {
  return (
    <section className="relative w-full h-dvh overflow-hidden bg-black text-white">
      <BackButton />
      <div className="absolute inset-0">
        <LiquidEther colors={['#5227FF', '#FF9FFC', '#B497CF']} mouseForce={20} cursorSize={100} persistence={0.9} autoDemo alwaysAuto autoSpeed={0.5} autoIntensity={2.2} />
      </div>

      <div className="relative z-[1] h-full flex flex-col px-5 sm:px-6 pt-5 sm:pt-6 pb-5">
        <h1 className="text-center text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-none pt-1"><LetterSwap text="EDUCATION" /></h1>
        {/* DitherVeil image column, commented out:
        <div className="relative min-h-0">
          <div className="absolute inset-0"><DitherVeil src="https://images.unsplash.com/photo-1737071371043-761e02b1ef95?q=80&w=1400&auto=format&fit=crop" fit="contain" knockout pattern="floyd" pixelSize={2} inkColor="#120f17" paperColor="#f4f1ea" revealRadius={200} softness={0.6} linger={1} /></div>
        </div>
        */}
        {/* the book is as wide as the screen height allows (3:2 spread + nav row) */}
        <div className="flex-1 min-h-0 flex items-center justify-center mt-4 lg:mt-6">
          <PageFlip pages={pages} className="max-w-[min(60rem,calc((100dvh-13rem)*1.5))] px-3 drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]" />
        </div>
      </div>
    </section>
  )
}
