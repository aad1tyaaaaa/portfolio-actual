'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

// Lenis smooth scrolling for the home page (skipped for reduced motion).
// SiteMenu locks scrolling with html{overflow:hidden}; Lenis would keep wheel-scrolling under it, so mirror that lock.
export default function SmoothScroll() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ autoRaf: true })
    const root = document.documentElement
    const mo = new MutationObserver(() => (root.style.overflow === 'hidden' ? lenis.stop() : lenis.start()))
    mo.observe(root, { attributes: true, attributeFilter: ['style'] })
    return () => { mo.disconnect(); lenis.destroy() }
  }, [])
  return null
}
