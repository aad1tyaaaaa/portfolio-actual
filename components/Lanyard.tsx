'use client'

import { useEffect, useRef } from 'react'

/*
  ID card on a lanyard tied to the moon. Grab the card and pull: dragging down stretches the strap (1:1 up to FREE px,
  then stiffer, up to MAX px), dragging sideways swings it around the moon. Letting go springs it back with a bounce,
  then the gentle CSS sway resumes. Buttons / links on the card still click normally (drags never start on them).
  The geometry lives in CSS (.lanyard* in globals.css): JS only writes --pull (extra strap length) and --ang (swing).
*/
const MAX = 220
const FREE = 140

export default function Lanyard({ moon, children }: { moon: string; children: React.ReactNode }) {
  const swing = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = swing.current!
    // drag state: where the grab started relative to the moon (the pivot), plus pull / angle at that moment
    let drag: { id: number; r0: number; a0: number; pull0: number; ang0: number } | null = null
    let pull = 0, ang = 0, vp = 0, va = 0, raf = 0
    const write = () => { el.style.setProperty('--pull', `${pull.toFixed(2)}px`); el.style.setProperty('--ang', `${ang.toFixed(3)}deg`) }
    // the moon's centre on screen (re-read every move, in case the page scrolls mid-drag)
    const pivot = () => { const r = el.parentElement!.querySelector('.moon')!.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } }
    // grab point relative to the pivot: distance, and angle from straight down (positive = to the right)
    const polar = (e: PointerEvent) => { const m = pivot(), dx = e.clientX - m.x, dy = e.clientY - m.y; return { r: Math.hypot(dx, dy), a: Math.atan2(dx, dy) } }

    const down = (e: PointerEvent) => {
      if (e.button !== 0 || (e.target as Element).closest('button, a')) return
      e.preventDefault() // no native image drag / text selection
      const { r, a } = polar(e)
      drag = { id: e.pointerId, r0: r, a0: a, pull0: pull, ang0: ang }
      el.setPointerCapture(e.pointerId)
      cancelAnimationFrame(raf)
      el.dataset.drag = ''
    }
    // the grabbed point stays under the cursor: the card turns by however much the moon->cursor line has turned,
    // and the strap stretches by however much further the cursor is from the moon (elastic, never shorter than rest)
    const move = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      const { r, a } = polar(e)
      const stretch = Math.max(0, drag.pull0 + r - drag.r0)
      // 1:1 with the hand up to FREE px, then it gets stiffer (rubber-band feel), capped at MAX
      pull = stretch <= FREE ? stretch : Math.min(MAX, FREE + (stretch - FREE) * 0.35)
      // CSS rotate is clockwise-positive, and with the pivot above, clockwise swings the card LEFT: hence the minus
      ang = Math.max(-45, Math.min(45, drag.ang0 - ((a - drag.a0) * 180) / Math.PI))
      write()
    }
    const up = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      drag = null
      vp = va = 0
      let last = performance.now()
      // damped springs back to rest: the strap snaps up (slight overshoot), the swing wobbles out
      const step = (now: number) => {
        const dt = Math.min(0.032, (now - last) / 1000); last = now
        vp += (-180 * pull - 9 * vp) * dt; pull += vp * dt
        va += (-60 * ang - 5 * va) * dt; ang += va * dt
        write()
        if (Math.abs(pull) + Math.abs(vp) + Math.abs(ang) + Math.abs(va) > 0.2) raf = requestAnimationFrame(step)
        else { pull = ang = 0; write(); delete el.dataset.drag }
      }
      raf = requestAnimationFrame(step)
    }

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [])

  return (
    <div className="lanyard">
      <img className="deco moon" src={moon} alt="" draggable={false} />
      <div ref={swing} className="lanyard-swing">
        <span className="lanyard-strap" aria-hidden="true" />
        <span className="lanyard-clip" aria-hidden="true" />
        {children}
      </div>
    </div>
  )
}
