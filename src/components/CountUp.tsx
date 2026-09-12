import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/** Animates the numeric part of strings like "$240M+", "+15%", "$1.2M" from zero. */
export function CountUp({ value, duration = 1.6 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduce = useReducedMotion()
  const match = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/)
  const [shown, setShown] = useState(() => (match && !reduce ? `${match[1]}0${match[3]}` : value))

  useEffect(() => {
    if (!inView || !match) return
    if (reduce) {
      setShown(value)
      return
    }
    const [, prefix, num, suffix] = match
    const decimals = num.includes('.') ? num.split('.')[1].length : 0
    const controls = animate(0, parseFloat(num), {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(`${prefix}${v.toFixed(decimals)}${suffix}`),
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, reduce])

  return <span ref={ref}>{shown}</span>
}
