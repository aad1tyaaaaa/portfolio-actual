'use client'

import { useEffect, useRef, useState } from 'react'

/*
  Full-screen menu. Layout: socials + small links on the left, big page links from the centre;
  top bar: logo left, CTA pill + hamburger (morphs to X) right. Motion: the panel drops from the top with a
  curved (ellipse clip-path) edge, links rise in staggered, the current page gets a hand-drawn strike;
  closing retracts the panel upward.
*/

export type MenuItem = { label: string; href: string }
type Link = [label: string, href: string]

const ext = (href: string) => (/^https?:/.test(href) ? { target: '_blank', rel: 'noreferrer' } : {})

export default function SiteMenu({ items, socials, small, current = 0, cta, onNavigate }: {
  items: MenuItem[]
  socials: Link[]
  small: Link[]
  current?: number
  cta: { label: string; href: string }
  // page-level navigation (intro videos etc.); called after the menu starts closing
  onNavigate?: (e: React.MouseEvent) => void
}) {
  const [open, setOpen] = useState(false)
  const btn = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const bgVid = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const root = document.documentElement
    if (!open) { bgVid.current?.pause(); return }
    root.style.overflow = 'hidden'
    bgVid.current?.play().catch(() => {})
    // focus the first link once it has started revealing
    const t = setTimeout(() => panel.current?.querySelector<HTMLAnchorElement>('.menu-link')?.focus({ preventScroll: true }), 350)
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus() } }
    addEventListener('keydown', esc)
    return () => { root.style.overflow = ''; clearTimeout(t); removeEventListener('keydown', esc) }
  }, [open])

  // hide the top bar (and the music control, via html[data-bar-hidden]) while scrolling down, bring it back on scroll up
  useEffect(() => {
    const root = document.documentElement
    let last = scrollY
    const onScroll = () => {
      const y = scrollY, d = y - last
      if (Math.abs(d) < 6) return
      if (y > 80 && d > 0) root.dataset.barHidden = ''
      else delete root.dataset.barHidden
      last = y
    }
    addEventListener('scroll', onScroll, { passive: true })
    return () => { removeEventListener('scroll', onScroll); delete root.dataset.barHidden }
  }, [])

  // same-site links close the menu first; external ones just open
  const go = (e: React.MouseEvent, href: string) => { if (!ext(href).target) { setOpen(false); onNavigate?.(e) } }

  return <>
    <header className="topbar" data-open={open || undefined}>
      <a href="/" className="topbar-logo" aria-label="Aaditya Jaiswar, home" onClick={() => setOpen(false)}><i>aaditya</i><b>JAISWAR</b></a>
      {/* the preloader's aJ monogram, centred in the bar */}
      <a href="/" className="topbar-mark" aria-label="Home" onClick={() => setOpen(false)}><i>a</i><b>J</b></a>
      <a href={cta.href} className="topbar-cta" onClick={e => go(e, cta.href)}>{cta.label} <span aria-hidden="true">↗</span></a>
      <button ref={btn} type="button" className="menu-btn" aria-expanded={open} aria-controls="site-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(o => !o)}>
        <span className="burger" aria-hidden="true"><i /><i /><i /></span>
      </button>
    </header>

    <div ref={panel} id="site-menu" className="menu" data-open={open || undefined} aria-hidden={!open}
      // closed panel stays mounted for the reverse animation; inert keeps it out of tab order / AT
      {...(!open && { inert: true })}>
      <video ref={bgVid} className="menu-bg" src="/hero/background-loop.mp4" muted loop playsInline preload="none" aria-hidden="true" />

      <aside className="menu-side">
        <ul className="menu-socials" aria-label="Social">
          {socials.map(([name, href], i) => <li key={name} style={{ '--i': i } as React.CSSProperties}><a href={href} {...ext(href)}>{name}</a></li>)}
        </ul>
        <ul className="menu-small">
          {small.map(([name, href], i) => <li key={name} style={{ '--i': i } as React.CSSProperties}><a href={href} {...ext(href)} onClick={e => go(e, href)}>{name}</a></li>)}
        </ul>
      </aside>

      <nav className="menu-nav" aria-label="Site">
        <ul>
          {items.map((it, i) => <li key={it.href} style={{ '--i': i } as React.CSSProperties}>
            <a className="menu-link" href={it.href} aria-current={i === current ? 'page' : undefined}
              onClick={e => { setOpen(false); onNavigate?.(e) }}>
              {it.label}
              {i === current && <svg className="menu-strike" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
                <path pathLength={1} d="M2 12 C 30 2, 45 18, 70 10 S 110 4, 130 12 S 170 16, 198 8" />
              </svg>}
            </a>
          </li>)}
        </ul>
      </nav>
    </div>
  </>
}
