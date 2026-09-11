import { articles } from '../data/profile'
import { ArrowIcon } from './Icons'
import { Reveal } from './Reveal'
import { TiltCard } from './TiltCard'
import './Writing.css'

export function Writing() {
  return (
    <section id="writing" className="section writing">
      <div className="wrap">
        <Reveal>
          <p className="kicker">Writing</p>
          <h2 className="h2">
            Notes from <em>inside</em> the platform
          </h2>
        </Reveal>
        <ul className="articles">
          {articles.map((a, i) => (
            <Reveal key={a.title} delay={0.06 * i}>
              <TiltCard className="article" max={6}>
                <a href={a.href} target="_blank" rel="noreferrer" className="article__link">
                  <span className="article__outlet">
                    {a.outlet}
                    {a.when ? ` · ${a.when}` : ''}
                  </span>
                  <h3 className="article__title">{a.title}</h3>
                  <p className="article__blurb muted">{a.blurb}</p>
                  <span className="article__read">
                    Read <ArrowIcon size={16} />
                  </span>
                </a>
              </TiltCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
