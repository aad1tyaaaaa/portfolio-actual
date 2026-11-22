'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import FlexCarousel from '@/components/FlexCarousel'
import AcidSquares from '@/components/AcidSquares'
import BackButton from '@/components/BackButton'
import LetterSwap from '@/components/LetterSwap'
import { projects } from '@/lib/projects'

// screenshots taken with headless Edge (1440x900); re-shoot into /public/projects when a site changes, same order as lib/projects
const shots = ['provenyx', 'blackbox', 'terraq', 'negotiara', 'parth-ngo', 'feeding-hands']
// module-level so the carousel's WebGL engine isn't rebuilt every render
const items = projects.map(([, cat, title], i) => ({ src: `/projects/${shots[i]}.png`, alt: `${title} homepage`, title, subtitle: cat }))

export default function Projects() {
  const [active, setActive] = useState(0)
  const [, , title, url, label] = projects[active]
  return (
    <section className="relative w-full h-dvh overflow-hidden bg-black text-white flex flex-col">
      <BackButton />
      <div className="absolute inset-0">
        <AcidSquares color="#000000" accentColor="#b600a8" secondaryColor="#7621b0" fade={0.3} />
      </div>
      <h1 className="relative text-center text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-none pt-6"><LetterSwap text="PROJECTS" /></h1>
      <div className="relative flex-1 min-h-0">
        <FlexCarousel items={items} preset="liquid" intro="rise" cardHeight={0.6} gap={16} radius={16} onChange={setActive} />
      </div>
      <a href={url} target="_blank" rel="noreferrer" className="relative liquid-glass self-center mb-8 rounded-full px-6 py-3 flex items-center gap-2 hover:scale-105 transition-transform">
        {label}: {title} <ArrowUpRight size={16} />
      </a>
    </section>
  )
}
