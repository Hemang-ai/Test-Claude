import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { pointer } from '../hooks/usePointer'
import './Aurora.css'

/**
 * A fixed, low-resolution canvas behind the page. Three soft violet fields drift
 * with time, follow the cursor a little, and slide as the page scrolls, so every
 * section sits on moving light instead of flat black.
 */
export function Aurora() {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    let w = 0
    let h = 0
    const scale = 0.12
    const resize = () => {
      w = Math.max(1, Math.floor(window.innerWidth * scale))
      h = Math.max(1, Math.floor(window.innerHeight * scale))
      canvas.width = w
      canvas.height = h
    }
    resize()
    window.addEventListener('resize', resize)

    const blobs = [
      { hue: 268, sat: 85, r: 0.55, sx: 0.32, sy: 0.7, ax: 0.18, ay: 0.12, spd: 0.11, ph: 0 },
      { hue: 255, sat: 80, r: 0.45, sx: 0.28, sy: 0.35, ax: 0.14, ay: 0.16, spd: 0.09, ph: 2.1 },
      { hue: 282, sat: 70, r: 0.5, sx: 0.4, sy: 0.55, ax: 0.2, ay: 0.1, spd: 0.07, ph: 4.2 },
    ]
    let px = 0
    let py = 0
    const draw = (now: number) => {
      const t = reduce ? 0 : now / 1000
      const doc = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const p = Math.min(1, window.scrollY / doc)
      px += (pointer.x - px) * 0.03
      py += (pointer.y - py) * 0.03
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      blobs.forEach((b, i) => {
        const cx = (0.5 + Math.sin(t * b.spd + b.ph) * b.ax + px * 0.08 + (i - 1) * 0.35 * Math.cos(p * Math.PI)) * w
        const cy = (0.5 + Math.cos(t * b.spd * 1.3 + b.ph) * b.ay + py * 0.06 + (p - 0.5) * 0.5 * (i === 1 ? -1 : 1)) * h
        const rad = b.r * Math.max(w, h) * b.sx * 2.2
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
        g.addColorStop(0, `hsla(${b.hue + p * 20}, ${b.sat}%, 55%, ${0.22 * b.sy})`)
        g.addColorStop(1, `hsla(${b.hue}, ${b.sat}%, 40%, 0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      })
      if (!reduce) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reduce])

  return <canvas ref={ref} className="aurora" aria-hidden />
}
