'use client'

import { useEffect, useRef, useState } from 'react'
import MarbleSprite from '@/components/MarbleSprite'

// d4vd: the home page's ghost tour guide. Starts large in the hero's empty left column, then shrinks and
// drifts around the viewport as the page scrolls (fixed, so it follows you down); its eyes track the cursor
// (MarbleSprite). A speech bubble says something about whichever section is in the middle of the screen.
// On the hero it runs a short intro of the menu and the S1 / S2 music buttons (INTRO below). pointer-events-none so it never blocks clicks.

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

// While the hero is on screen d4vd introduces the controls one by one, pulsing a glow on each ([data-ghost-point]).
// Starts once the preloader is gone; ends after the last line, on an S1/S2 click, or when the hero scrolls away.
const INTRO: [string, string][] = [
  ['.menu-btn', "Psst 👻 I'm d4vd. Everything on this site lives behind the menu ☰ up top."],
  ['.home-audio-btn:nth-child(1)', 'For the full Cyberpunk: Edgerunners experience, hit S1 🎧 ↘'],
  ['.home-audio-btn:nth-child(2)', 'Want a different vibe? S2 flips the side: new track, new look.'],
]
const INTRO_MS = 4200

export default function Mascot() {
  const ref = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const bubble = useRef<HTMLDivElement>(null)
  const [line, setLine] = useState(0)
  const [step, setStep] = useState(-1) // intro line; -1 not started, INTRO.length done
  const aim = useRef<string | null>(null) // intro target selector: the ghost flies over beside it
  const placeRef = useRef<() => void>(() => {})

  // start once the preloader has lifted; an S1 / S2 click ends the intro
  useEffect(() => {
    // (only if the hero is still on screen by then: someone who already scrolled away skips it)
    const iv = setInterval(() => { if (!document.querySelector('.preloader')) { clearInterval(iv); setStep(s => (s >= 0 ? s : scrollY < innerHeight / 2 ? 0 : INTRO.length)) } }, 300)
    const end = (e: Event) => { if (e.target instanceof Element && e.target.closest('.home-audio')) setStep(INTRO.length) }
    addEventListener('pointerdown', end)
    return () => { clearInterval(iv); removeEventListener('pointerdown', end) }
  }, [])
  // fly to the current target and point at it, then move on
  useEffect(() => {
    const on = step >= 0 && step < INTRO.length
    aim.current = on ? INTRO[step][0] : null
    const r = requestAnimationFrame(() => placeRef.current()) // after the bubble has its new text (its width decides its side)
    if (!on) return () => cancelAnimationFrame(r)
    const el = document.querySelector(INTRO[step][0])
    el?.setAttribute('data-ghost-point', '')
    const t = setTimeout(() => setStep(step + 1), INTRO_MS)
    return () => { cancelAnimationFrame(r); clearTimeout(t); el?.removeAttribute('data-ghost-point') }
  }, [step])
  // leaving the hero ends it; the section tour takes over
  useEffect(() => { if (line !== 0) setStep(s => (s >= 0 ? INTRO.length : s)) }, [line])
  const intro = line === 0 && step >= 0 && step < INTRO.length
  const text = intro ? INTRO[step][1] : TOUR[line][1]

  useEffect(() => {
    const el = ref.current, inner = body.current, say = bubble.current
    if (!el || !inner || !say) return
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0, t = 0
    const place = () => {
      const w = inner.offsetWidth, h = inner.offsetHeight
      // big while the hero is on screen, normal size once scrolled a screen down
      const big = innerWidth < 768 ? 1.25 : 1.75
      let s = big - (big - 1) * Math.min(t / innerHeight, 1)
      let x = 0, y = 0
      const target = aim.current && document.querySelector(aim.current)
      if (target) {
        // intro: normal size, beside the target; just below it when it's in the top bar (left of the menu sits
        // "Let's talk", which would cover the ghost). offsetLeft/Top ignore the transform
        s = 1
        const r = target.getBoundingClientRect()
        // near the bottom edge (S1 / S2): just above it, so it hovers over each button in turn
        const below = r.top < h + 24, above = r.bottom > innerHeight - h - 24
        x = below || above ? r.left + r.width / 2 - w / 2 - el.offsetLeft : r.left - 16 - w - el.offsetLeft
        const cy = below ? r.bottom + 12 + h / 2 : above ? r.top - 12 - h / 2 : r.top + r.height / 2
        y = Math.min(Math.max(cy, h / 2 + 8), innerHeight - h / 2 - 8) - el.offsetTop
      } else if (!still) {
        const a = t / 600 // one wander loop roughly every few screens
        const maxX = innerWidth - w * s - 48
        const maxY = (innerHeight - h * s) / 2 - 24
        x = ((1 - Math.cos(a)) / 2) * maxX // 0 at the top: home is the left edge
        y = Math.sin(a * 0.7) * maxY       // around the vertical middle
      }
      el.style.transform = `translate(${x}px, calc(-50% + ${y}px))`
      inner.style.transform = `scale(${s})`
      // bubble beside the (scaled) ghost; flips to the left when there's no room on the right
      const left = el.offsetLeft // un-translated left edge (the rect would be mid-flight)
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

    placeRef.current = place
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
      <div ref={bubble} className="d4vd-bubble" data-quiet={!text || undefined} role="status" aria-live="polite">
        <b>d4vd</b>
        <p key={text}>{text}</p>
      </div>
    </div>
  )
}
