import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import './Cursor.css'

/** A violet cursor ring that lags the pointer and grows over links and buttons. */
export function Cursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [hover, setHover] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 400, damping: 32, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 400, damping: 32, mass: 0.5 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine || reduce) return
    setEnabled(true)
    document.documentElement.classList.add('has-cursor')
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = e.target as HTMLElement | null
      setHover(Boolean(t?.closest('a, button, [role="button"]')))
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [reduce, x, y])

  if (!enabled) return null
  return (
    <>
      <motion.div className="cursor__dot" style={{ x, y }} aria-hidden />
      <motion.div className={`cursor__ring ${hover ? 'is-hover' : ''}`} style={{ x: sx, y: sy }} aria-hidden />
    </>
  )
}
