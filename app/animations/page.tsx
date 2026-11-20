'use client'

import { useRef, useState } from 'react'
import BackButton from '@/components/BackButton'
import GridMotion from '@/components/GridMotion'
import { animations } from '@/lib/animations'

// silent 480px loops drifting in the wall (module level: GridMotion re-tiles whenever the items array changes).
// data-i tells the click handler which animation a tile is.
const wall = animations.map((a, i) => <video key={a.name} data-i={i} src={a.thumb} poster={a.poster} autoPlay muted loop playsInline preload="metadata" />)

export default function Animations() {
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState<(typeof animations)[number] | null>(null)

  // click a tile -> play that animation full size with sound (the click is the user gesture that allows audio)
  const pick = (e: React.MouseEvent) => {
    const v = (e.target as Element).closest('.grid-motion__tile')?.querySelector<HTMLVideoElement>('video[data-i]')
    if (!v) return
    setOpen(animations[+v.dataset.i!])
    dialog.current!.showModal()
  }

  return (
    <main className="min-h-dvh bg-[#0c0c0c] text-[#d7e2ea]">
      <BackButton />
      <section className="relative h-svh cursor-pointer overflow-hidden" onClick={pick}>
        <GridMotion items={wall} rows={5} aspectRatio={16 / 9} gap={14} radius={18} angle={-12} speed={28} parallax={0.5} spotlight={0.6} dim={0.45} fade={0.5} />
        <div className="pointer-events-none absolute inset-0 grid place-content-center bg-[radial-gradient(ellipse_at_center,#0c0c0ccc,transparent_65%)] px-5 text-center">
          <h1 className="font-['Instrument_Serif',serif] text-6xl leading-[.9] italic sm:text-8xl">the animation i design</h1>
          <p className="mt-4 text-sm text-[#d7e2ea]/70">designed by <span className="text-[#e28bed]">Aaditya Jaiswar</span> · click any animation to play it with sound</p>
        </div>
      </section>

      {/* player: backdrop click or Esc closes; closing unmounts the video so the sound stops */}
      <dialog ref={dialog} onClose={() => setOpen(null)} onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close() }}
        aria-label={open?.name ?? 'Animation player'}
        className="m-auto w-[min(92vw,1200px)] overflow-visible outline-none bg-transparent p-0 text-[#d7e2ea] backdrop:bg-black/80 backdrop:backdrop-blur-sm">
        {open && <>
          <video key={open.src} src={open.src} poster={open.poster} autoPlay controls controlsList="nodownload" disablePictureInPicture
            onContextMenu={e => e.preventDefault()} playsInline className="aspect-video w-full rounded-3xl bg-black object-cover" />
          <div className="mt-3 flex items-center justify-between text-sm tracking-wide">
            <p className="text-[#d7e2ea]/80">{open.name} <span className="text-[#d7e2ea]/40">— designed by Aaditya Jaiswar</span></p>
            <button type="button" onClick={() => dialog.current!.close()} className="rounded-full border border-white/20 px-4 py-1.5 hover:border-[#e28bed] hover:text-[#e28bed]">Close</button>
          </div>
        </>}
      </dialog>
    </main>
  )
}
