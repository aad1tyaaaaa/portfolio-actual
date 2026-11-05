'use client'

import { useEffect, useRef } from 'react'
import MarbleSprite from '@/components/MarbleSprite'

// Site-wide mascot: drifts around the viewport as the page scrolls, home at
// bottom-right when scrolled to the top. pointer-events-none so it never blocks clicks.
export default function Mascot() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = (e: Event) => {
      // capture: also catches pages that scroll an inner container instead of the window
      const t = e.target instanceof Element ? e.target.scrollTop : window.scrollY
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const a = t / 600 // one wander loop roughly every few screens
        const maxX = innerWidth - el.offsetWidth - 24
        const maxY = innerHeight - el.offsetHeight - 24
        const x = ((1 - Math.cos(a)) / 2) * maxX
        const y = ((1 - Math.cos(a * 0.7)) / 2) * maxY
        el.style.transform = `translate(${-x}px, ${-y}px)`
      })
    }
    addEventListener('scroll', onScroll, { passive: true, capture: true })
    return () => {
      removeEventListener('scroll', onScroll, { capture: true })
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed right-3 bottom-3 z-40 size-24 transition-transform duration-1000 ease-out sm:right-5 sm:bottom-5 sm:size-32"
      aria-hidden="true"
    >
      <MarbleSprite background="transparent" follow="page" scale={130} />
    </div>
  )
}
