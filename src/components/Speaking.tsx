import { motion, useReducedMotion } from 'motion/react'
import { identity, media, talks } from '../data/profile'
import { ArrowIcon } from './Icons'
import { Reveal } from './Reveal'
import { SplitHeading } from './SplitHeading'
import './Speaking.css'

const ease = [0.22, 1, 0.36, 1] as const

export function Speaking() {
  const reduce = useReducedMotion()
  const marquee = [...talks.map((t) => t.event), ...media]
  return (
    <section id="speaking" className="section speaking">
      <div className="wrap">
        <Reveal>
          <p className="kicker">Speaking & media</p>
        </Reveal>
        <SplitHeading text="On stage about agentic commerce" accent="agentic" />
        <Reveal delay={0.1}>
          <p className="speaking__intro muted">
            Keynotes, panels and talks on shipping non-deterministic AI inside large organizations, AI-native fraud detection, and the road from
            rule-driven automation to autonomous commerce.
          </p>
        </Reveal>
      </div>

      <div className="marquee" aria-hidden>
        <div className={`marquee__track ${reduce ? 'is-static' : ''}`}>
          {[...marquee, ...marquee].map((m, i) => (
            <span key={m + i}>
              {m}
              <i />
            </span>
          ))}
        </div>
      </div>

      <div className="wrap">
        <ol className="talks">
          {talks.map((t, i) => (
            <motion.li
              key={t.event + t.when}
              className="talk"
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.8, ease, delay: 0.04 * i }}
            >
              <span className="talk__when">{t.when}</span>
              <span className="talk__event">{t.event}</span>
              <span className="talk__title">{t.title ?? <span className="muted">{t.kind}</span>}</span>
              <span className="talk__kind muted">{t.title ? t.kind : ''}</span>
            </motion.li>
          ))}
        </ol>

        <Reveal delay={0.1}>
          <div className="speaking__foot">
            <p className="muted">
              Featured in <strong>{media.join(', ')}</strong> on AI-driven commerce strategy and product transformation.
            </p>
            <a className="speaking__cta" href={identity.sessionize} target="_blank" rel="noreferrer">
              Invite me to speak <ArrowIcon />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
