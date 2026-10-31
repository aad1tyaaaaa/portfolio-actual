import { ArrowUpRight, Download } from 'lucide-react'
import BackButton from '@/components/BackButton'
import MoltenMetal from '@/components/MoltenMetal'

// Hotspots over /resume.webp, in % of the page (pulled from the PDF's link annotations).
// ponytail: hand-copied from resume.pdf; re-extract if the PDF layout changes.
// The PDF itself mislinks LinkedIn/email to GitHub and doubles the Blackbox URL; these are the intended targets.
const links = [
  { label: 'Call +91 77100 24884', href: 'tel:+917710024884', x: 34.81, y: 2.18, w: 12.85, h: 1.3 },
  { label: 'Email aadityaaaaa.jaiswar@gmail.com', href: 'mailto:aadityaaaaa.jaiswar@gmail.com', x: 49.66, y: 2.17, w: 24.74, h: 1.55 },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aadityaaaaa', x: 12.36, y: 3.3, w: 34.04, h: 1.5 },
  { label: 'GitHub', href: 'https://github.com/aad1tyaaaaa', x: 55.2, y: 3.35, w: 25.95, h: 1.43 },
  { label: 'Negotiara AI live', href: 'https://negotiara-main.vercel.app/', x: 3.39, y: 60.19, w: 35.02, h: 1.34 },
  { label: 'Negotiara AI on GitHub', href: 'https://github.com/aad1tyaaaaa/Negotiara-main', x: 39.94, y: 60.33, w: 4.66, h: 1.34 },
  { label: 'Provenyx live', href: 'https://provenyx.vercel.app/', x: 3.08, y: 66.45, w: 44.83, h: 1.34 },
  { label: 'Provenyx VS Code extension', href: 'https://marketplace.visualstudio.com/items?itemName=OmkarPramodBandikatte.provenyx-security', x: 49.05, y: 66.45, w: 10.21, h: 1.34 },
  { label: 'Provenyx on GitHub', href: 'https://github.com/aad1tyaaaaa/Provenyx', x: 60.93, y: 66.45, w: 4.66, h: 1.34 },
  { label: 'Black Box live', href: 'https://blackbox-five-alpha.vercel.app/?ws=nimbu', x: 3.09, y: 75.05, w: 30.76, h: 1.4 },
  { label: 'Black Box on GitHub', href: 'https://github.com/aad1tyaaaaa/Blackbox', x: 35.3, y: 75.09, w: 4.66, h: 1.34 },
  { label: 'TerraQ live', href: 'https://terra-q-seven.vercel.app/', x: 2.79, y: 83.9, w: 45.69, h: 1.34 },
  { label: 'TerraQ on GitHub', href: 'https://github.com/aad1tyaaaaa/TerraQ', x: 49.59, y: 83.84, w: 4.37, h: 1.34 },
  { label: 'ArogyaSense on GitHub', href: 'https://github.com/aad1tyaaaaa/ArogyaSense', x: 57.15, y: 92.13, w: 9.83, h: 1.34 },
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
