import BackButton from '@/components/BackButton'
import AlbumRail from '@/components/AlbumRail'
import Prism from '@/components/Prism'
import { ArrowUpRight } from 'lucide-react'

// previews are Apple's iTunes Search API URLs (30s clips), re-fetch if one stops loading
const albums = [
  { src: '/music/pink-floyd.jpg', title: 'The Dark Side of the Moon', artist: 'Pink Floyd', year: '1973', track: 'Time', preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a2/73/36/a27336b7-07c8-207a-74fd-9926910f9903/mzaf_10065953245083721782.plus.aac.p.m4a' },
  { src: '/music/elliott-smith.jpg', title: 'Either/Or', artist: 'Elliott Smith', year: '1997', track: 'Between the Bars', preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/56/a7/df/56a7df52-3fb4-1c49-11e7-72438cb07330/mzaf_11460446142122429949.plus.aac.p.m4a' },
  { src: '/music/the-doors.jpg', title: 'L.A. Woman', artist: 'The Doors', year: '1971', track: 'Riders on the Storm', preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ba/1d/59/ba1d598c-e369-bb90-178d-de4be5ec642b/mzaf_14953698594657028707.plus.aac.p.m4a' },
  { src: '/music/led-zeppelin.jpg', title: 'Led Zeppelin IV', artist: 'Led Zeppelin', year: '1971', track: 'Stairway to Heaven', preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a2/e9/c8/a2e9c8fb-e282-9e9d-b5f9-d44fadb07e1e/mzaf_13939222705716798166.plus.aac.p.m4a' },
  { src: '/music/radiohead.jpg', title: 'OK Computer', artist: 'Radiohead', year: '1997', track: 'Karma Police', preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/46/21/35/46213520-da4a-1806-0c59-5ca6ad008b4e/mzaf_5277404092043261430.plus.aac.p.m4a' },
  { src: '/music/black-sabbath.jpg', title: 'Paranoid', artist: 'Black Sabbath', year: '1970', track: 'Paranoid', preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/be/9d/07/be9d07a7-0e2b-7973-a503-87e12c564d22/mzaf_11577128408735924283.plus.aac.p.m4a' },
  { src: '/music/queen.jpg', title: 'A Night at the Opera', artist: 'Queen', year: '1975', track: 'Bohemian Rhapsody', preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/17/fc/1e/17fc1eba-946d-84a9-710b-a0e88ea64209/mzaf_3049006317693088799.plus.aac.p.m4a' },
  { src: '/music/guns-n-roses.jpg', title: 'Appetite for Destruction', artist: "Guns N' Roses", year: '1987', track: "Sweet Child O' Mine", preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a5/82/2d/a5822d67-2e65-fe95-511e-1f785d23e5cc/mzaf_8619467974951398014.plus.aac.p.m4a' },
  { src: '/music/rolling-stones.jpg', title: 'Sticky Fingers', artist: 'The Rolling Stones', year: '1971', track: 'Wild Horses', preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/2a/06/65/2a06657a-75cf-2487-e1b6-e4b42f4bfee9/mzaf_3872235870977535530.plus.aac.p.m4a' },
]

const profile = 'https://open.spotify.com/user/313l7uyf2bbfstrhhbl5tssjpdxm'
const playlists = ['4VklYpMs41bt2olE34BRhE', '0cZ9ZhOuiUl7QRjmeOcsDW', '4HX8rHnX7PFIes4uhx6shq', '5IZbSLeFamlKNMOOcPVZJu', '78g1XuwEUEfMG1b3uoFAvI', '0UsizwnWMiZ1XyemyPtS5W']

export default function Music() {
  return (
    <main className="relative w-full overflow-x-hidden bg-[#0c0c0c]">
      <BackButton />
      {/* fixed so the light stays behind the playlists while scrolling; dimmed so the covers stay the focus */}
      <div className="pointer-events-none fixed inset-0 opacity-60" aria-hidden="true"><Prism animationType="rotate" timeScale={0.5} height={3.5} baseWidth={5.5} scale={3.6} glow={1} /></div>
      <section className="relative flex h-svh flex-col pt-20">
        <h1 className="text-center font-['Instrument_Serif',serif] text-4xl italic text-[#d7e2ea]">on repeat</h1>
        <div className="flex-1"><AlbumRail items={albums} /></div>
      </section>
      <section id="playlists" className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-8">
        <h2 className="mb-8 font-['Instrument_Serif',serif] text-4xl italic text-[#d7e2ea]">my playlists</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {playlists.map(id => (
            <iframe key={id} src={`https://open.spotify.com/embed/playlist/${id}?theme=0`} title="Spotify playlist" height={352} loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" className="w-full rounded-xl border-0" />
          ))}
        </div>
        <div className="fixed top-5 right-5 sm:top-6 sm:right-8 z-50">
          <a href={profile} target="_blank" rel="noreferrer"
            className="group inline-flex items-center gap-3 rounded-full border border-[#1DB954]/40 bg-[#1DB954]/10 py-2 pr-6 pl-2 text-[#d7e2ea] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1DB954] hover:bg-[#1DB954]/20 hover:shadow-[0_8px_30px_#1DB95440]">
            <svg viewBox="0 0 24 24" className="size-10 shrink-0 text-[#1DB954] transition-transform duration-500 group-hover:rotate-[360deg]" fill="currentColor" aria-hidden="true"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
            <span className="flex flex-col leading-tight">
              <span className="text-[11px] tracking-wide opacity-60">@aad1tyaaaaa.</span>
              <span className="text-sm font-semibold whitespace-nowrap">Follow on Spotify</span>
            </span>
            <ArrowUpRight size={16} className="opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
          </a>
        </div>
      </section>
    </main>
  )
}
