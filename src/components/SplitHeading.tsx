import { motion, useReducedMotion } from 'motion/react'
import './SplitHeading.css'

type Props = {
  text: string
  accent?: string
  as?: 'h1' | 'h2'
  className?: string
}

const ease = [0.22, 1, 0.36, 1] as const

/** A heading whose words rise into place one after another as it scrolls into view. */
export function SplitHeading({ text, accent, as: Tag = 'h2', className = '' }: Props) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  const accentWords = accent ? accent.toLowerCase().split(' ') : []
  const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '')

  return (
    <Tag className={`h2 split ${className}`} aria-label={text}>
      {words.map((word, i) => {
        const isAccent = accentWords.includes(norm(word))
        return (
          <span key={`${word}-${i}`} className="split__word" aria-hidden>
            <motion.span
              className={`split__inner ${isAccent ? 'is-accent' : ''}`}
              initial={{ y: reduce ? 0 : '110%', rotate: reduce ? 0 : 4 }}
              whileInView={{ y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.9, ease, delay: 0.06 * i }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        )
      })}
    </Tag>
  )
}
