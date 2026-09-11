import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import type { PointerEvent, ReactNode } from 'react'
import './TiltCard.css'

type Props = { children: ReactNode; className?: string; max?: number }

/** A card that rotates in 3D toward the cursor with a violet edge light. */
export function TiltCard({ children, className = '', max = 9 }: Props) {
  const reduce = useReducedMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const srx = useSpring(rx, { stiffness: 180, damping: 20 })
  const sry = useSpring(ry, { stiffness: 180, damping: 20 })
  const light = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, rgba(199,155,255,0.16), transparent 60%)`
  const edge = useMotionTemplate`radial-gradient(300px circle at ${mx}% ${my}%, rgba(199,155,255,0.9), transparent 55%)`

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    mx.set(px * 100)
    my.set(py * 100)
    if (reduce) return
    ry.set((px - 0.5) * 2 * max)
    rx.set(-(py - 0.5) * 2 * max)
  }
  const leave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      className={`tilt ${className}`}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1100 }}
      onPointerMove={move}
      onPointerLeave={leave}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
    >
      <motion.span aria-hidden className="tilt__edge" style={{ background: edge }} />
      <motion.span aria-hidden className="tilt__light" style={{ background: light }} />
      <div className="tilt__body">{children}</div>
    </motion.div>
  )
}
