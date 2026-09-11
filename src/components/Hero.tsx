import { motion, useReducedMotion } from 'motion/react'
import { lazy, Suspense, useCallback, useState } from 'react'
import { identity } from '../data/profile'
import { useWebGL } from '../hooks/useWebGL'
import { DocIcon, LinkedInIcon, ScholarIcon } from './Icons'
import { MagneticButton } from './MagneticButton'
import './Hero.css'

const HeroScene = lazy(() => import('./HeroScene'))
const ease = [0.22, 1, 0.36, 1] as const
const base = import.meta.env.BASE_URL

export function Hero() {
  const reduce = useReducedMotion()
  const webgl = useWebGL()
  const [ready, setReady] = useState(false)
  const onReady = useCallback(() => setReady(true), [])
  const use3d = webgl && !reduce

  const item = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease, delay },
  })

  return (
    <section id="top" className="hero" aria-label="Introduction">
      <div className="hero__glow hero__glow--l" aria-hidden />
      <div className="hero__glow hero__glow--r" aria-hidden />
      <div className="hero__glow hero__glow--b" aria-hidden />

      <div className="hero__grid">
        <div className="hero__left">
          <motion.span className="orb" aria-hidden {...item(0.55)} />
          <motion.p className="hero__hello" {...item(0.6)}>
            {identity.greeting}
          </motion.p>
          <h1 className="hero__name">
            <motion.span {...item(0.7)}>{identity.firstName}</motion.span>
            <motion.span {...item(0.8)}>{identity.lastName}</motion.span>
          </h1>
        </div>

        <motion.div
          className={`hero__stage ${ready ? 'is-3d' : ''}`}
          initial={{ opacity: 0, scale: reduce ? 1 : 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease, delay: 0.3 }}
        >
          <div className="portrait" aria-hidden={ready}>
            <span className="portrait__halo" />
            <span className="portrait__glass" />
            <img src={`${base}${identity.headshot}`} alt={`${identity.firstName} ${identity.lastName}`} width={800} height={800} />
            <span className="portrait__ring" />
          </div>
          {use3d && (
            <Suspense fallback={null}>
              <HeroScene onReady={onReady} />
            </Suspense>
          )}
        </motion.div>

        <div className="hero__right">
          <motion.span className="hero__ai" {...item(0.85)}>
            {identity.roleEyebrow}
          </motion.span>
          <motion.p className="hero__role" {...item(0.95)}>
            <span className="hero__echo" aria-hidden>
              {identity.roleLines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </span>
            <span className="hero__role-main">
              {identity.roleLines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </span>
          </motion.p>
        </div>
      </div>

      <motion.div className="hero__rail" {...item(1.1)}>
        <a href={identity.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <LinkedInIcon />
        </a>
        <a href={identity.scholar} target="_blank" rel="noreferrer" aria-label="Google Scholar">
          <ScholarIcon />
        </a>
      </motion.div>

      <motion.div className="hero__resume" {...item(1.15)}>
        <MagneticButton href={`${base}${identity.resumeFile}`} target="_blank" rel="noreferrer" className="hero__resume-link">
          <span>Resume</span>
          <DocIcon />
        </MagneticButton>
      </motion.div>

      <motion.div className="hero__cue" aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 1 }}>
        <span />
      </motion.div>
    </section>
  )
}
