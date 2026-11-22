import { ArrowUpRight, Download } from 'lucide-react'
import BackButton from '@/components/BackButton'
import MoltenMetal from '@/components/MoltenMetal'

// Hotspots over /resume.webp, in % of the page. Rendered + read from resume.pdf with pdf.js (render at 1787px wide,
// Link annotations -> %). ponytail: hand-curated from that dump; re-extract if the PDF layout changes.
// Curation: icon + label rects merged into one hotspot; project rows grown ~0.7% down because the PDF's own rects sit
// half a line above their text; stale annotations left over from an older layout (Negotiara / supply-chain over the
// PROJECTS heading, stray TerraQ boxes on a Black Box line) dropped; phone + email added (the PDF doesn't link them).
const links = [
  { label: 'Call +91 77100 24884', href: 'tel:+917710024884', x: 4.1, y: 4.2, w: 15.5, h: 1.4 },
  { label: 'Email aadityaaaaa.jaiswar@gmail.com', href: 'mailto:aadityaaaaa.jaiswar@gmail.com', x: 23.1, y: 4.2, w: 27.6, h: 1.4 },
  { label: 'Portfolio', href: 'https://aadityaaaaa.vercel.app/', x: 55.35, y: 4.16, w: 21.43, h: 1.44 },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aadityaaaaa', x: 12.9, y: 5.91, w: 35.76, h: 1.41 },
  { label: 'GitHub', href: 'https://github.com/aad1tyaaaaa', x: 53.9, y: 5.91, w: 32.61, h: 1.41 },
  { label: 'FeedingHands live', href: 'https://feeding-hands-olive.vercel.app/', x: 42.6, y: 61.36, w: 8.24, h: 2.05 },
  { label: 'FeedingHands on GitHub', href: 'https://github.com/aad1tyaaaaa/FeedingHands', x: 54.02, y: 61.36, w: 9.69, h: 2.05 },
  { label: 'Provenyx live', href: 'https://provenyx.vercel.app/', x: 44.19, y: 69.74, w: 8.04, h: 2.05 },
  { label: 'Provenyx on GitHub', href: 'https://github.com/aad1tyaaaaa/Provenyx', x: 55.41, y: 69.74, w: 9.68, h: 2.05 },
  { label: 'Provenyx VS Code extension', href: 'https://marketplace.visualstudio.com/items?itemName=OmkarPramodBandikatte.provenyx-security', x: 67.35, y: 69.5, w: 12.34, h: 2.25 },
  { label: 'Black Box live', href: 'https://blackbox-five-alpha.vercel.app/?ws=nimbu', x: 30.82, y: 77.32, w: 8.24, h: 2.05 },
  { label: 'Black Box on GitHub', href: 'https://github.com/aad1tyaaaaa/Blackbox', x: 42.24, y: 77.32, w: 9.68, h: 2.05 },
  { label: 'TerraQ live', href: 'https://terra-q-seven.vercel.app/', x: 44.27, y: 85.12, w: 8.24, h: 2.05 },
  { label: 'TerraQ on GitHub', href: 'https://github.com/aad1tyaaaaa/TerraQ', x: 55.69, y: 85.12, w: 9.69, h: 2.05 },
]

export default function Resume() {
  return (
    <main className="relative min-h-dvh w-full overflow-x-hidden bg-[#0c0c0c] text-[#d7e2ea]">
      <BackButton />
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <MoltenMetal colors={['#7621b0', '#e28bed']} speed={0.35} scale={4} detail={6.6} glow={1.6} haze={0.75} />
        {/* vignette keeps the paper the brightest thing on screen */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0c0c0ccc_100%)]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pt-24 pb-16 sm:px-8 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-16 lg:pt-20">
        <aside className="lg:sticky lg:top-20 lg:self-start lg:pt-6">
          <h1 className="font-['Instrument_Serif',serif] text-7xl leading-[.85] italic sm:text-8xl">resume</h1>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#d7e2ea]/70">
            software engineer across full-stack, AI and cloud. one page, zero fluff.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="/resume.pdf" download="Aaditya-Jaiswar-Resume.pdf" className="contact-button"><Download size={16} /> Download</a>
            <a href="/resume.pdf" target="_blank" rel="noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs font-medium tracking-[.16em] uppercase backdrop-blur-md transition-colors hover:border-white/50 hover:bg-white/10">
              Open PDF <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </aside>

        <figure className="group relative mx-auto w-full max-w-3xl">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#e28bed]/60 via-white/10 to-[#7621b0]/60" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_40px_120px_-20px_#7621b080]">
            <img src="/resume.webp" alt="Aaditya Jaiswar's resume" width={1787} height={2527} className="block h-auto w-full" />
            {links.map(l => (
              <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" aria-label={l.label} title={l.label}
                style={{ left: `${l.x}%`, top: `${l.y}%`, width: `${l.w}%`, height: `${l.h}%` }}
                className="absolute rounded-[3px] transition-colors group-hover:bg-[#b600a8]/10 hover:!bg-[#b600a8]/25 hover:ring-1 hover:ring-[#b600a8]/60 focus-visible:outline-2 focus-visible:outline-[#b600a8]" />
            ))}
          </div>
          <figcaption className="mt-3 text-center text-xs text-[#d7e2ea]/45 lg:hidden">tap the highlighted links to open them</figcaption>
        </figure>
      </div>
    </main>
  )
}
