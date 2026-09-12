import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { resumeUrl } from '../assets'
import { identity, nav } from '../data/profile'
import { scrollToHash } from '../hooks/useLenis'
import { MenuIcon } from './Icons'
import './Nav.css'

const ease = [0.22, 1, 0.36, 1] as const

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    scrollToHash(href)
  }

  return (
    <>
      <motion.div className="progress" style={{ scaleX: progress }} aria-hidden />
      <motion.header
        className={`nav ${scrolled ? 'is-scrolled' : ''}`}
        initial={{ opacity: 0, y: reduce ? 0 : -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.1 }}
      >
        <a className="nav__logo" href="#top" onClick={go('#top')} aria-label="Back to top">
          <span>{identity.monogram}</span>
        </a>
        <nav className="nav__links" aria-label="Primary">
          {nav.map((item, i) => (
            <motion.a
              key={item.href}
              href={item.href}
              onClick={go(item.href)}
              initial={{ opacity: 0, y: reduce ? 0 : -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.35 + i * 0.06 }}
            >
              {item.label}
            </motion.a>
          ))}
        </nav>
        <button className="nav__burger" aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((v) => !v)}>
          <MenuIcon open={open} />
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div className="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <div className="menu__glow" aria-hidden />
            <nav aria-label="Mobile">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={go(item.href)}
                  initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease, delay: 0.08 + i * 0.06 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
            <a className="menu__resume" href={resumeUrl} target="_blank" rel="noreferrer">
              Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
