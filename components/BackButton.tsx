'use client'

import { ArrowLeft } from 'lucide-react'

// Goes back when the visitor came from this site, otherwise falls through to the home link.
export default function BackButton() {
  return (
    <div className="fixed top-5 left-5 sm:top-6 sm:left-8 z-50">
      <a href="/" aria-label="Go back"
        onClick={e => { if (document.referrer.startsWith(location.origin)) { e.preventDefault(); history.back() } }}
        className="liquid-glass w-11 h-11 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform">
        <ArrowLeft size={20} />
      </a>
    </div>
  )
}
