import { identity, papers, recognition, researchThemes } from '../data/profile'
import { ArrowIcon } from './Icons'
import { Reveal } from './Reveal'
import { SplitHeading } from './SplitHeading'
import { TiltCard } from './TiltCard'
import './Research.css'

export function Research() {
  return (
    <section id="research" className="section research">
      <div className="glow research__glow" aria-hidden />
      <div className="wrap">
        <Reveal>
          <p className="kicker">Research & recognition</p>
        </Reveal>
        <SplitHeading text="Applied AI, peer reviewed" accent="peer" />

        <div className="research__grid">
          <div>
            <Reveal delay={0.05}>
              <ul className="papers">
                {papers.map((p) => (
                  <li key={p.title}>
                    <TiltCard className="paper" max={5}>
                      <div className="paper__meta">
                        <span className="paper__year">{p.year}</span>
                        {p.award && <span className="paper__award">{p.award}</span>}
                      </div>
                      <h3 className="paper__title">{p.title}</h3>
                      <p className="paper__venue muted">{p.venue}</p>
                    </TiltCard>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <a className="research__scholar" href={identity.scholar} target="_blank" rel="noreferrer">
                All publications on Google Scholar <ArrowIcon />
              </a>
            </Reveal>
          </div>

          <div className="research__side">
            <Reveal delay={0.1}>
              <h3 className="research__h3">Research themes</h3>
              <ul className="research__themes">
                {researchThemes.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15}>
              <h3 className="research__h3">Boards & judging</h3>
              <ul className="research__recog">
                {recognition.map((r) => (
                  <li key={r.title}>
                    <span>{r.title}</span>
                    <span className="muted">{r.detail}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
