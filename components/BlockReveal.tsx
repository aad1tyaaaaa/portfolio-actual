'use client'

import { useEffect, useRef, useState } from 'react'

/*
  Block reveal: when the paragraph scrolls into view, a violet block sweeps across each line (staggered line by line),
  then pulls back left to right while the letters type in just behind its edge; a block cursor blinks at the end and goes.
  Lines are measured from a hidden copy of the words (re-measured on resize / font load), so wrapping stays natural.
  Styles + timings: .block-reveal in globals.css.
*/
export default function BlockReveal({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const measure = useRef<HTMLSpanElement>(null)
  const [lines, setLines] = useState<string[]>([text])
  const [on, setOn] = useState(false)
  const words = text.split(/\s+/).filter(Boolean)

  useEffect(() => {
    const m = measure.current!
    const calc = () => {
      const out: string[] = []
      let top = -1
      for (const s of Array.from(m.children) as HTMLElement[]) {
        const w = s.textContent!.trim()
        if (s.offsetTop !== top) { out.push(w); top = s.offsetTop } else out[out.length - 1] += ' ' + w
      }
      setLines(l => (l.join('\n') === out.join('\n') ? l : out))
    }
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(m)
    document.fonts?.ready.then(calc)
    return () => ro.disconnect()
  }, [text])

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { threshold: 0.3 })
    io.observe(ref.current!)
    return () => io.disconnect()
  }, [])

  return (
    <p ref={ref} className={`block-reveal ${className}`} data-on={on || undefined} aria-label={text} style={{ '--n': lines.length } as React.CSSProperties}>
      <span ref={measure} className="br-measure" aria-hidden="true">{words.map((w, i) => <span key={i}>{w} </span>)}</span>
      {lines.map((l, i) => (
        <span key={i} className="br-line" aria-hidden="true" style={{ '--i': i } as React.CSSProperties}>
          {[...l].map((c, j) => <span key={j} className="br-ch" style={{ '--j': j / l.length } as React.CSSProperties}>{c}</span>)}
          {i === lines.length - 1 && <i className="br-cursor" />}
        </span>
      ))}
    </p>
  )
}
