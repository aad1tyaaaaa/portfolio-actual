'use client'

import { useEffect, useRef, useState } from 'react'

const ICONS = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons'
const skills: [string, string][] = [
  ['Python', 'python/python-original'], ['FastAPI', 'fastapi/fastapi-original'], ['Django', 'django/django-plain'],
  ['React', 'react/react-original'], ['Next.js', 'nextjs/nextjs-original'], ['TypeScript', 'typescript/typescript-original'],
  ['JavaScript', 'javascript/javascript-original'], ['Node.js', 'nodejs/nodejs-original'], ['Kafka', 'apachekafka/apachekafka-original'],
  ['Airflow', 'apacheairflow/apacheairflow-original'], ['Redis', 'redis/redis-original'], ['Docker', 'docker/docker-original'],
  ['Kubernetes', 'kubernetes/kubernetes-original'], ['AWS', 'amazonwebservices/amazonwebservices-original-wordmark'],
  ['Google Cloud', 'googlecloud/googlecloud-original'], ['Git', 'git/git-original'], ['Figma', 'figma/figma-original'],
]
const IDLE = { x: 0.0015, y: 0.004 }
const CORNERS = ['sk-tl', 'sk-tr', 'sk-bl', 'sk-br']

// Bubbles sit on a sphere that slowly spins; the pointer steers the spin. Depth drives scale, opacity and stacking.
export default function SkillBubbles({ decor }: { decor: Record<string, string> }) {
  const stage = useRef<HTMLUListElement>(null)
  const items = useRef<(HTMLLIElement | null)[]>([])
  // corner images are shuffled after mount (not during render) so server and client markup match
  const [corners, setCorners] = useState<string[] | null>(null)
  useEffect(() => { setCorners([...CORNERS].sort(() => Math.random() - 0.5)) }, [])

  useEffect(() => {
    const el = stage.current
    if (!el) return
    const n = skills.length
    // Fibonacci sphere: evenly spread points on a unit sphere
    const points = skills.map((_, i) => {
      const y = 1 - (2 * i + 1) / n, r = Math.sqrt(1 - y * y), t = i * Math.PI * (3 - Math.sqrt(5))
      return [Math.cos(t) * r, y, Math.sin(t) * r]
    })
    let ax = 0, ay = 0, vx = IDLE.x, vy = IDLE.y, tx = IDLE.x, ty = IDLE.y, raf = 0, visible = false

    const draw = () => {
      const R = el.clientWidth * 0.38
      const sx = Math.sin(ax), cx = Math.cos(ax), sy = Math.sin(ay), cy = Math.cos(ay)
      points.forEach(([x, y, z], i) => {
        const x1 = x * cy + z * sy, z1 = -x * sy + z * cy
        const y2 = y * cx - z1 * sx, z2 = y * sx + z1 * cx
        const depth = (z2 + 1) / 2 // 0 = back, 1 = front
        const li = items.current[i]
        if (!li) return
        li.style.transform = `translate(-50%,-50%) translate3d(${x1 * R}px,${y2 * R}px,0) scale(${0.55 + depth * 0.6})`
        li.style.opacity = String(0.3 + depth * 0.7)
        li.style.zIndex = String(Math.round(depth * 100))
      })
    }
    const tick = () => {
      vx += (tx - vx) * 0.05; vy += (ty - vy) * 0.05
      ax += vx; ay += vy
      draw()
      raf = visible ? requestAnimationFrame(tick) : 0
    }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const onMove = (e: PointerEvent) => {
      // hold still while a bubble is hovered so it doesn't drift out from under the cursor
      if ((e.target as Element).closest('.skill')) { tx = ty = 0; return }
      const r = el.getBoundingClientRect()
      tx = ((e.clientY - r.top) / r.height - 0.5) * -0.03
      ty = ((e.clientX - r.left) / r.width - 0.5) * 0.03
    }
    const onLeave = () => { tx = IDLE.x; ty = IDLE.y }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf && !reduced) raf = requestAnimationFrame(tick)
    })
    const ro = new ResizeObserver(draw)
    io.observe(el); ro.observe(el)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    draw()
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect()
      el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <section className="skills" id="skills">
      {corners && Object.values(decor).map((src, i) => <img key={src} className={`deco ${corners[i]}`} src={src} alt="" />)}
      <h2 className="hero-heading">Skills</h2>
      <div className="skills-fit">
        <ul ref={stage} className="skills-stage">
          {skills.map(([name, icon], i) => (
            <li key={name} ref={el => { items.current[i] = el }} className="skill">
              <span className="skill-bubble"><img src={`${ICONS}/${icon}.svg`} alt={name} loading="lazy" /></span>
              <span className="skill-label" aria-hidden="true">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
