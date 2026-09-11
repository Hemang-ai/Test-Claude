import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { experience } from '../data/profile'
import { Reveal } from './Reveal'
import './Experience.css'

const ease = [0.22, 1, 0.36, 1] as const

export function Experience() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 70%'] })
  const fill = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 90, damping: 22, mass: 0.4 })
  const [showEarlier, setShowEarlier] = useState(false)

  const main = experience.filter((r) => !r.compact)
  const earlier = experience.filter((r) => r.compact)

  return (
    <section id="experience" className="section experience">
      <div className="wrap">
        <Reveal>
          <p className="kicker">Experience</p>
          <h2 className="h2">
            Sixteen years, <em>three</em> industries
          </h2>
        </Reveal>

        <div className="timeline" ref={ref}>
          <div className="timeline__rail" aria-hidden>
            <motion.div className="timeline__fill" style={{ scaleY: reduce ? 1 : fill }} />
          </div>

          <ol className="timeline__list">
            {main.map((r, i) => (
              <motion.li
                key={r.company}
                className="role"
                initial={{ opacity: 0, x: reduce ? 0 : -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 0.9, ease, delay: 0.05 * i }}
              >
                <span className="role__dot" aria-hidden />
                <div className="role__meta">
                  <span className="role__when">
                    {r.start} — {r.end}
                  </span>
                  <span className="role__where muted">{r.location}</span>
                </div>
                <div className="role__body">
                  <h3 className="role__company">{r.company}</h3>
                  <p className="role__title">{r.role}</p>
                  <ul className="role__bullets">
                    {r.bullets.map((b) => (
                      <li key={b.slice(0, 30)}>{b}</li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="earlier">
          <button className="earlier__toggle" aria-expanded={showEarlier} onClick={() => setShowEarlier((v) => !v)}>
            <span>{showEarlier ? 'Hide earlier roles' : `Earlier roles (${earlier.length})`}</span>
            <span className={`earlier__chev ${showEarlier ? 'is-open' : ''}`} aria-hidden>
              ↓
            </span>
          </button>
          <motion.div
            className="earlier__panel"
            initial={false}
            animate={{ height: showEarlier ? 'auto' : 0, opacity: showEarlier ? 1 : 0 }}
            transition={{ duration: 0.55, ease }}
            style={{ overflow: 'hidden' }}
          >
            <ul className="earlier__list">
              {earlier.map((r) => (
                <li key={r.company} className="earlier__row">
                  <span className="earlier__when muted">
                    {r.start} — {r.end}
                  </span>
                  <span>
                    <strong>{r.company}</strong>
                    <span className="muted"> · {r.role}</span>
                    <span className="earlier__desc">{r.bullets[0]}</span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
