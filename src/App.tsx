import { useReducedMotion } from 'motion/react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Experience } from './components/Experience'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Research } from './components/Research'
import { Speaking } from './components/Speaking'
import { Work } from './components/Work'
import { Writing } from './components/Writing'
import { useLenis } from './hooks/useLenis'
import { usePointerTracking } from './hooks/usePointer'

export default function App() {
  const reduce = useReducedMotion()
  useLenis(!reduce)
  usePointerTracking()
  return (
    <>
      <a className="skip" href="#about">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Work />
        <Speaking />
        <Research />
        <Writing />
        <Contact />
      </main>
    </>
  )
}
