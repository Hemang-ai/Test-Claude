import { motion, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps } from 'motion/react'
import type { PointerEvent } from 'react'

type Props = HTMLMotionProps<'a'> & { strength?: number }

/** An anchor that leans toward the cursor while hovered. */
export function MagneticButton({ strength = 0.32, children, onPointerMove, onPointerLeave, ...rest }: Props) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  const move = (e: PointerEvent<HTMLAnchorElement>) => {
    onPointerMove?.(e)
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = (e: PointerEvent<HTMLAnchorElement>) => {
    onPointerLeave?.(e)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a style={{ x: sx, y: sy, display: 'inline-flex' }} onPointerMove={move} onPointerLeave={leave} {...rest}>
      {children}
    </motion.a>
  )
}
