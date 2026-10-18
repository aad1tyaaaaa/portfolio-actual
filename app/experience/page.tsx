'use client'

import { useState } from 'react'
import BackButton from '@/components/BackButton'

// dark: video background is light, so text flips to navy
const roles = [
  { company: 'Periscope Technologies', role: 'SDE Intern', logo: '/experience/periscope.png', date: 'Feb 2026 – Present', video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4', text: 'Architected RBAC with 4 admin personas and JWT auth, cutting clinical data retrieval latency by 30%. Built event-driven microservices ingesting real-time IoT wearable data via Kafka, and raised healthcare data throughput by 35% with FastAPI and Celery.', stack: 'FastAPI · Celery · Kafka · JWT · IoT' },
  { company: 'Bluestock', role: 'Software Development Intern', logo: '/experience/bluestock.jpg', date: 'Oct 2025 – Nov 2025', dark: true, video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4', text: 'Led end-to-end development of an IPO management platform, refactoring queries to speed up review workflows by 40%. Shipped secure REST endpoints with OAuth 2.0 and rate limiting that processed 500+ sensitive financial documents.', stack: 'React.js · Django REST · OAuth 2.0' },
  { company: 'Ibtidaa Tech', role: 'AI Intern', logo: '/experience/ibtidaa.jpg', date: 'Jul 2025 – Aug 2025', video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4', text: 'Fine-tuned LLMs with Hugging Face PEFT/LoRA, improving contextual accuracy by 15%. Built ETL pipelines with Python and Apache Airflow for large-scale unstructured data, cutting evaluation benchmarking time by 25%.', stack: 'PEFT/LoRA · Hugging Face · Airflow' },
  // ponytail: reuses the old Overview video until CybraneX has its own
  { company: 'CybraneX', role: 'Quantum ML Intern', logo: '/experience/cybranex_logo.jpg', date: 'Oct 2025 – Oct 2026', video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4', text: 'Built a hybrid quantum-classical pipeline around a 6-qubit quantum autoencoder detecting lithium and vanadium in 198-band NASA Hyperion imagery, best of 7 benchmarked methods at 0.770 AUC. Shipped a live Sentinel-2 engine turning any lat/long into mineral prospectivity maps, with a Next.js dashboard.', stack: 'PennyLane · Python · Sentinel-2 · Next.js' },
]
const stats = ['4 Internships', '40% Faster Workflows', '35% Higher Throughput', '500+ Documents Secured']

export default function Experience() {
  const [active, setActive] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const r = roles[active]
  const tone = `transition-colors duration-700 ${r.dark ? 'text-[#182C41]' : 'text-white'}`

  const switchRole = (i: number) => {
    if (i === active || isTransitioning) return
    setActive(i)
    setIsTransitioning(true)
    setTimeout(() => setIsTransitioning(false), 1000)
  }

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <BackButton />
      {roles.map((v, i) => (
        <video key={v.video} src={v.video} autoPlay muted loop playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${i === active ? 'opacity-100' : 'opacity-0'}`} />
      ))}

      <img src="https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png" alt=""
        className="train-bob absolute inset-0 w-full h-full object-cover pointer-events-none z-[1]" />

      <div className="relative z-[2] flex flex-col h-full px-5 sm:px-8 md:px-12 py-5 sm:py-6">
        {/* tabs sit above the content so they never shift when descriptions change length */}
        <div role="tablist" aria-label="Companies" className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-14 sm:mt-10">
          {roles.map((v, i) => (
            <button key={v.company} role="tab" aria-selected={i === active} onClick={() => switchRole(i)}
              className={`liquid-glass rounded-full pl-1.5 pr-4 py-1.5 flex items-center gap-2 text-xs sm:text-sm transition-all duration-500 ${tone} ${i === active ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-90'}`}>
              <img src={v.logo} alt="" className="h-6 w-6 sm:h-7 sm:w-7 rounded-full object-cover object-left bg-white" />
              {v.company}
            </button>
          ))}
        </div>

        <div key={active} className="exp-fade flex flex-col items-center text-center mt-8 sm:mt-12 gap-4 sm:gap-5 max-w-3xl mx-auto w-full">
          <img src={r.logo} alt={`${r.company} logo`} className="h-14 sm:h-16 w-auto max-w-[220px] object-contain rounded-2xl bg-white shadow-lg" />
          <div className={`liquid-glass rounded-full px-4 py-1.5 text-xs sm:text-sm ${tone}`}>{r.date}</div>
          <div>
            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] ${tone}`}>{r.company}</h1>
            <p className={`mt-2 text-base sm:text-xl md:text-2xl opacity-80 ${tone}`}>{r.role}</p>
          </div>
          <p className={`max-w-2xl leading-relaxed text-sm sm:text-base ${tone}`}>{r.text}</p>
          <div className={`liquid-glass rounded-full px-5 py-2 text-xs sm:text-sm ${tone}`}>{r.stack}</div>
        </div>

        <div className="flex-1" />

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-white/70 text-xs sm:text-sm">
          {stats.map((s, i) => (
            <span key={s} className="flex items-center gap-4">
              {i > 0 && <span className="hidden sm:inline">|</span>}{s}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
