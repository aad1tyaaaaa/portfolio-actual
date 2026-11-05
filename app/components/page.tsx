import { readFileSync } from 'fs'
import { join } from 'path'
import BackButton from '@/components/BackButton'
import CopyButton from '@/components/CopyButton'
import WashingMachine from '@/components/WashingMachine'
import PixelGhost from '@/components/PixelGhost'
import AiBlob from '@/components/AiBlob'
import ToyCamera from '@/components/ToyCamera'
import OrbitSphere from '@/components/OrbitSphere'
import CuteGhost from '@/components/CuteGhost'
import HamsterWheel from '@/components/HamsterWheel'
import ShadowWalker from '@/components/ShadowWalker'
import Astronaut from '@/components/Astronaut'
import PixelTorch from '@/components/PixelTorch'
import Bb8Toggle from '@/components/Bb8Toggle'
import EarthLoader from '@/components/EarthLoader'
import PyramidLoader from '@/components/PyramidLoader'

const showcase = [
  { name: 'Washing Machine', files: ['WashingMachine.jsx', 'WashingMachine.css'], preview: <WashingMachine /> },
  { name: 'Pixel Ghost', files: ['PixelGhost.jsx', 'PixelGhost.css'], preview: <PixelGhost /> },
  { name: 'AI Blob', files: ['AiBlob.jsx'], preview: <AiBlob size={220} /> },
  { name: 'Toy Camera', files: ['ToyCamera.jsx', 'ToyCamera.css'], preview: <ToyCamera /> },
  { name: 'Orbit Sphere', files: ['OrbitSphere.jsx', 'OrbitSphere.css'], preview: <OrbitSphere /> },
  { name: 'Cute Ghost', files: ['CuteGhost.jsx', 'CuteGhost.css'], preview: <CuteGhost /> },
  { name: 'Hamster Wheel', files: ['HamsterWheel.jsx', 'HamsterWheel.css'], preview: <HamsterWheel /> },
  // dark creature: needs a light backdrop to read
  { name: 'Shadow Walker', files: ['ShadowWalker.jsx', 'ShadowWalker.css'], preview: <ShadowWalker />, bg: '#e9e4f0' },
  { name: 'Astronaut', files: ['Astronaut.jsx', 'Astronaut.css'], preview: <Astronaut /> },
  { name: 'Pixel Torch', files: ['PixelTorch.jsx', 'PixelTorch.css'], preview: <PixelTorch /> },
  { name: 'BB-8 Toggle', files: ['Bb8Toggle.jsx', 'Bb8Toggle.css'], preview: <Bb8Toggle /> },
  { name: 'Earth Loader', files: ['EarthLoader.jsx', 'EarthLoader.css'], preview: <EarthLoader /> },
  { name: 'Pyramid Loader', files: ['PyramidLoader.jsx', 'PyramidLoader.css'], preview: <PyramidLoader /> },
]

const socials = [
  ['LinkedIn', 'https://www.linkedin.com/in/aadityaaaaa'],
  ['GitHub', 'https://github.com/aad1tyaaaaa'],
  ['Dribbble', 'https://dribbble.com/aadityaaaaa-jaiswar'],
  ['Email', 'mailto:aadityaaaaa.jaiswar@gmail.com'],
  ['WhatsApp', 'https://wa.me/917710024884'],
]

// read at build time so the shown code is always the real source
const source = (file: string) => readFileSync(join(process.cwd(), 'components', file), 'utf8')

export default function Components() {
  return (
    <main className="min-h-dvh bg-[#0c0c0c] px-5 pt-20 pb-16 text-[#d7e2ea] sm:px-8">
      <BackButton />
      <h1 className="font-['Instrument_Serif',serif] text-6xl leading-[.9] italic sm:text-8xl">the component i design</h1>
      <div className="mt-10 flex flex-col gap-16">
        {showcase.map(c => (
          <section key={c.name} className="rounded-3xl border border-[#d7e2ea22] p-5 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-2xl font-semibold">{c.name}</h2>
              <p className="text-sm text-[#d7e2ea]/60">designed by <span className="text-[#e28bed]">Aaditya Jaiswar</span></p>
            </div>
            <div className="mt-6 grid h-72 place-items-center rounded-2xl bg-[#141414]" style={c.bg ? { background: c.bg } : undefined}>{c.preview}</div>
            {c.files.map(f => {
              const code = source(f)
              return (
                <div key={f} className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-sm text-[#d7e2ea]/70">{f}</span>
                    <CopyButton text={code} />
                  </div>
                  <pre className="max-h-96 overflow-auto rounded-2xl bg-[#141414] p-4 text-xs leading-relaxed"><code>{code}</code></pre>
                </div>
              )
            })}
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Socials">
              {socials.map(([name, href]) => (
                <li key={name}><a href={href} target="_blank" rel="noreferrer" className="text-[#d7e2ea]/70 underline-offset-4 hover:text-[#e28bed] hover:underline">{name}</a></li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
