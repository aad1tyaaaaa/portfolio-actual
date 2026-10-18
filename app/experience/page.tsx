'use client'

import { useState } from 'react'
import BackButton from '@/components/BackButton'

const videos = [
  { label: 'Overview', src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4' },
  { label: 'Periscope', src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4' },
  { label: 'Bluestock', src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4' },
  { label: 'Ibtidaa Tech', src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4' },
  // ponytail: reuses the Overview video until CybraneX has its own
  { label: 'CybraneX', src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4#cybranex' },
]
const roles = [
  { badge: 'Software Development Engineer · Mumbai', title: ['Building Real Products', 'Across AI & Full-Stack'], text: 'Four internships shipping healthcare platforms, fintech tools, fine-tuned LLMs and quantum ML, measured in latency cut, throughput gained and workflows sped up.', stack: 'Python · FastAPI · Django · React · LLMs' },
  { badge: 'Feb 2026 – Present', title: ['Periscope Technologies', 'SDE Intern'], text: 'Architected RBAC with 4 admin personas and JWT auth, cutting clinical data retrieval latency by 30%. Built event-driven microservices ingesting real-time IoT wearable data via Kafka, and raised healthcare data throughput by 35% with FastAPI and Celery.', stack: 'FastAPI · Celery · Kafka · JWT · IoT' },
  { badge: 'Oct 2025 – Nov 2025', title: ['Bluestock', 'Software Development Intern'], text: 'Led end-to-end development of an IPO management platform, refactoring queries to speed up review workflows by 40%. Shipped secure REST endpoints with OAuth 2.0 and rate limiting that processed 500+ sensitive financial documents.', stack: 'React.js · Django REST · OAuth 2.0' },
  { badge: 'Jul 2025 – Aug 2025', title: ['Ibtidaa Tech', 'AI Intern'], text: 'Fine-tuned LLMs with Hugging Face PEFT/LoRA, improving contextual accuracy by 15%. Built ETL pipelines with Python and Apache Airflow for large-scale unstructured data, cutting evaluation benchmarking time by 25%.', stack: 'PEFT/LoRA · Hugging Face · Airflow' },
  { badge: 'Oct 2025 – Oct 2026', title: ['CybraneX', 'Quantum ML Intern'], text: 'Built a hybrid quantum-classical pipeline around a 6-qubit quantum autoencoder detecting lithium and vanadium in 198-band NASA Hyperion imagery, best of 7 benchmarked methods at 0.770 AUC. Shipped a live Sentinel-2 engine turning any lat/long into mineral prospectivity maps, with a Next.js dashboard.', stack: 'PennyLane · Python · Sentinel-2 · Next.js' },
]
const stats = ['4 Internships', '40% Faster Workflows', '35% Higher Throughput', '500+ Documents Secured']

export default function Experience() {
  const [activeVideo, setActiveVideo] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const dark = activeVideo === 2
  const role = roles[activeVideo]
  const tone = `transition-colors duration-700 ${dark ? 'text-[#182C41]' : 'text-white'}`

  const switchVideo = (i: number) => {
    if (i === activeVideo || isTransitioning) return
    setActiveVideo(i)
    setIsTransitioning(true)
    setTimeout(() => setIsTransitioning(false), 1000)
  }

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <BackButton />
      {videos.map((v, i) => (
        <video key={v.src} src={v.src} autoPlay muted loop playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${i === activeVideo ? 'opacity-100' : 'opacity-0'}`} />
      ))}

      <img src="https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png" alt=""
        className="train-bob absolute inset-0 w-full h-full object-cover pointer-events-none z-[1]" />

      <div className="relative z-[2] flex flex-col h-full px-5 sm:px-8 md:px-12 py-5 sm:py-6">
        <div className="flex flex-col items-center text-center mt-10 sm:mt-14 md:mt-16 gap-5 sm:gap-6">
          <div className={`liquid-glass rounded-full px-4 py-1.5 text-xs sm:text-sm ${tone}`}>{role.badge}</div>
          <h1 className={`text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] max-w-4xl ${tone}`}>{role.title[0]}<br />{role.title[1]}</h1>
          <p className={`max-w-xl leading-relaxed text-sm sm:text-base ${tone}`}>{role.text}</p>
          <div className={`liquid-glass rounded-full px-5 py-2 text-xs sm:text-sm ${tone}`}>{role.stack}</div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {videos.map((v, i) => (
              <button key={v.label} onClick={() => switchVideo(i)}
                className={`text-xs sm:text-sm pb-1 border-b transition-all duration-700 ${tone} ${i === activeVideo ? 'opacity-100 border-current' : 'opacity-50 border-transparent hover:opacity-80'}`}>{v.label}</button>
            ))}
          </div>
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
