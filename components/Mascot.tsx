'use client'

import { useEffect, useRef } from 'react'
import MarbleSprite from '@/components/MarbleSprite'

// Site-wide mascot: starts large in the hero's empty left column, then shrinks and drifts around the
// viewport as the page scrolls (fixed, so it follows you down). Its eyes track the cursor (MarbleSprite).
// pointer-events-none so it never blocks clicks.
export default function Mascot() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0, t = 0
    const place = () => {
      const w = el.offsetWidth, h = el.offsetHeight
      // big while the hero is on screen, normal size once scrolled a screen down
      const big = innerWidth < 768 ? 1.25 : 1.75
      const s = big - (big - 1) * Math.min(t / innerHeight, 1)
      if (still) { el.style.transform = `translate(0, -50%) scale(${s})`; return }
      const a = t / 600 // one wander loop roughly every few screens
      const maxX = innerWidth - w * s - 48
      const maxY = (innerHeight - h * s) / 2 - 24
      const x = ((1 - Math.cos(a)) / 2) * maxX // 0 at the top: home is the left edge
      const y = Math.sin(a * 0.7) * maxY       // around the vertical middle
      el.style.transform = `translate(${x}px, calc(-50% + ${y}px)) scale(${s})`
    }
    const onScroll = (e: Event) => {
      // capture: also catches pages that scroll an inner container instead of the window
      t = e.target instanceof Element ? e.target.scrollTop : window.scrollY
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(place)
    }
    place()
    addEventListener('scroll', onScroll, { passive: true, capture: true })
    addEventListener('resize', place)
    return () => {
      removeEventListener('scroll', onScroll, { capture: true })
      removeEventListener('resize', place)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed top-[34%] left-4 sm:top-1/2 z-40 size-24 origin-left transition-transform duration-1000 ease-out sm:left-[4vw] sm:size-32"
      aria-hidden="true"
    >
      <MarbleSprite variant="ghost" spriteColor="#16121c" background="transparent" follow="page" scale={130} />
    </div>
  )
}
