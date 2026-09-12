import { motion, useReducedMotion } from 'motion/react'
import { work } from '../data/profile'
import { Reveal } from './Reveal'
import { SplitHeading } from './SplitHeading'
import { TiltCard } from './TiltCard'
import './Work.css'

const ease = [0.22, 1, 0.36, 1] as const

export function Work() {
  const reduce = useReducedMotion()
  return (
    <section id="work" className="section work">
      <div className="glow work__glow" aria-hidden />
      <div className="wrap">
        <Reveal>
          <p className="kicker">Selected work</p>
        </Reveal>
        <SplitHeading text="Outcomes, not features" accent="features" />
        <Reveal delay={0.1}>
          <p className="work__intro muted">
            A few of the platforms and AI capabilities I have owned end to end, with the numbers they moved.
          </p>
        </Reveal>

        <ul className="work__grid">
          {work.map((p, i) => (
            <motion.li
              key={p.title}
              initial={{ opacity: 0, y: reduce ? 0 : 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.9, ease, delay: (i % 2) * 0.08 }}
            >
              <TiltCard className="card">
                <div className="card__top">
                  <span className="card__org">{p.org}</span>
                  <span className="card__index">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="card__title">{p.title}</h3>
                <p className="card__outcome">{p.outcome}</p>
                <p className="card__summary">{p.summary}</p>
                <ul className="card__tools">
                  {p.tools.map((t) => (
                    <li key={t} className="tag">
                      {t}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
