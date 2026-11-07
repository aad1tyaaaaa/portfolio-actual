'use client'

import { useEffect, useRef, useState } from 'react'
import MarbleSprite from '@/components/MarbleSprite'

// d4vd: the home page's ghost tour guide. Starts large in the hero's empty left column, then shrinks and
// drifts around the viewport as the page scrolls (fixed, so it follows you down); its eyes track the cursor
// (MarbleSprite). A speech bubble says something about whichever section is in the middle of the screen.
// It stays silent while the hero is on screen. pointer-events-none so it never blocks clicks.

// [selector, line]; checked in order, the section crossing the viewport's middle wins
const TOUR: [string, string][] = [
  ['.hero', ''], // quiet while the hero is on screen
  ['.about', "Hey, I'm d4vd 👻 Meet Aaditya Jaiswar, a Mumbai-based software engineer who turns complex ideas into AI-powered, full-stack products."],
  ['.explore', 'Explore: every corner of the site. Hover a row, click to jump in.'],
  ['.skills', 'His toolbox: the languages and tech he builds with.'],
  ['.services', 'What he can build for you, start to finish.'],
  ['.projects', 'Projects! Keep scrolling through his recent work.'],
  ['main > section:last-of-type', "End of the tour. Say hi with Let's talk ↗"],
]

export default function Mascot() {
  const ref = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const bubble = useRef<HTMLDivElement>(null)
  const [line, setLine] = useState(0)

  useEffect(() => {
    const el = ref.current, inner = body.current, say = bubble.current
    if (!el || !inner || !say) return
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0, t = 0
    const place = () => {
      const w = inner.offsetWidth, h = inner.offsetHeight
      // big while the hero is on screen, normal size once scrolled a screen down
      const big = innerWidth < 768 ? 1.25 : 1.75
      const s = big - (big - 1) * Math.min(t / innerHeight, 1)
      let x = 0, y = 0
      if (!still) {
        const a = t / 600 // one wander loop roughly every few screens
        const maxX = innerWidth - w * s - 48
        const maxY = (innerHeight - h * s) / 2 - 24
        x = ((1 - Math.cos(a)) / 2) * maxX // 0 at the top: home is the left edge
        y = Math.sin(a * 0.7) * maxY       // around the vertical middle
      }
      el.style.transform = `translate(${x}px, calc(-50% + ${y}px))`
      inner.style.transform = `scale(${s})`
      // bubble beside the (scaled) ghost; flips to the left when there's no room on the right
      const left = el.getBoundingClientRect().left - x // un-translated left edge
      const right = left + x + w * s + 12 + say.offsetWidth < innerWidth - 16
      say.dataset.side = right ? 'right' : 'left'
      say.style.left = right ? `${w * s + 12}px` : ''
      say.style.right = right ? '' : 'calc(100% + 12px)'
    }
    const onScroll = (e: Event) => {
      // capture: also catches pages that scroll an inner container instead of the window
      t = e.target instanceof Element ? e.target.scrollTop : window.scrollY
      update()
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(place)
    }

    // which tour stop is crossing the middle of the screen
    // (the footer is shorter than half a screen, so the last stop also triggers at the very bottom of the page)
    const seen = new Map<Element, number>()
    let best = 0
    const update = () => setLine(innerHeight + scrollY >= document.documentElement.scrollHeight - 4 ? TOUR.length - 1 : best)
    const io = new IntersectionObserver(entries => {
      for (const e of entries) e.isIntersecting ? seen.set(e.target, TOUR.findIndex(([s]) => e.target.matches(s))) : seen.delete(e.target)
      if (seen.size) best = Math.max(...seen.values())
      update()
    }, { rootMargin: '-45% 0px -45% 0px' })
    TOUR.forEach(([s]) => { const n = document.querySelector(s); if (n) io.observe(n) })

    place()
    addEventListener('scroll', onScroll, { passive: true, capture: true })
    addEventListener('resize', place)
    return () => {
      removeEventListener('scroll', onScroll, { capture: true })
      removeEventListener('resize', place)
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  return (
    <div ref={ref} className="pointer-events-none fixed top-[34%] left-4 z-40 size-24 transition-transform duration-1000 ease-out sm:top-1/2 sm:left-[4vw] sm:size-32">
      <div ref={body} className="size-full origin-left transition-transform duration-1000 ease-out" aria-hidden="true">
        <MarbleSprite variant="ghost" spriteColor="#16121c" background="transparent" follow="page" scale={130} />
      </div>
      <div ref={bubble} className="d4vd-bubble" data-quiet={!TOUR[line][1] || undefined} role="status" aria-live="polite">
        <b>d4vd</b>
        <p key={line}>{TOUR[line][1]}</p>
      </div>
    </div>
  )
}
