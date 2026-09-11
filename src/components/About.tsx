import { motion, useReducedMotion } from 'motion/react'
import { about, certifications, education, identity, stats } from '../data/profile'
import { Reveal } from './Reveal'
import './About.css'

const ease = [0.22, 1, 0.36, 1] as const

export function About() {
  const reduce = useReducedMotion()
  return (
    <section id="about" className="section about">
      <div className="glow about__glow" aria-hidden />
      <div className="wrap about__grid">
        <div className="about__intro">
          <Reveal>
            <p className="kicker">About</p>
            <h2 className="h2">
              Products that <em>ship</em>, and keep shipping
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lead about__lead">{about.lead}</p>
          </Reveal>
          <Reveal delay={0.15}>
            {about.body.map((p) => (
              <p key={p.slice(0, 24)} className="about__p">
                {p}
              </p>
            ))}
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="about__focus" aria-label="Focus areas">
              {about.focus.map((f) => (
                <li key={f} className="tag">
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="about__now">
              Now: {identity.currentRole} at {identity.currentCompany}.
            </p>
          </Reveal>
        </div>

        <ul className="stats" aria-label="Business impact">
          {stats.map((s, i) => (
            <motion.li
              key={s.value + s.label}
              className="stat"
              initial={{ opacity: 0, y: reduce ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.9, ease, delay: 0.05 * i }}
            >
              <span className="stat__value">{s.value}</span>
              <span className="stat__label">{s.label}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="wrap about__edu">
        <Reveal>
          <div className="about__edu-grid">
            <div>
              <h3 className="about__h3">Education</h3>
              <ul>
                {education.map((e) => (
                  <li key={e.school} className="about__row">
                    <span>{e.degree}</span>
                    <span className="muted">
                      {e.school}, {e.when}
                      {e.note ? ` · ${e.note}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="about__h3">Certifications</h3>
              <ul>
                {certifications.map((c) => (
                  <li key={c} className="about__row about__row--single">
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
