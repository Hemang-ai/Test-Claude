import { footer, identity } from '../data/profile'
import { DocIcon, LinkedInIcon, MailIcon, ScholarIcon } from './Icons'
import { MagneticButton } from './MagneticButton'
import { Reveal } from './Reveal'
import './Contact.css'

const base = import.meta.env.BASE_URL

export function Contact() {
  const year = new Date().getFullYear()
  return (
    <section id="contact" className="section contact">
      <div className="glow contact__glow" aria-hidden />
      <div className="wrap">
        <Reveal>
          <p className="kicker">Contact</p>
          <h2 className="h2 contact__h2">
            Let's <em>talk</em>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="contact__p">
            Speaking invitations, podcast guest spots, research collaboration, or a product problem worth comparing notes on.
            {' '}
            {identity.location}.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="contact__actions">
            <MagneticButton href={`mailto:${identity.email}`} className="btn btn--primary">
              <MailIcon size={20} />
              <span>{identity.email}</span>
            </MagneticButton>
            <MagneticButton href={identity.linkedin} target="_blank" rel="noreferrer" className="btn">
              <LinkedInIcon size={20} />
              <span>LinkedIn</span>
            </MagneticButton>
            <MagneticButton href={identity.scholar} target="_blank" rel="noreferrer" className="btn">
              <ScholarIcon size={20} />
              <span>Google Scholar</span>
            </MagneticButton>
            <MagneticButton href={`${base}${identity.resumeFile}`} target="_blank" rel="noreferrer" className="btn">
              <DocIcon size={20} />
              <span>Resume</span>
            </MagneticButton>
          </div>
        </Reveal>
      </div>

      <footer className="footer">
        <div className="wrap footer__grid">
          <span className="footer__logo" aria-hidden>
            {identity.monogram}
          </span>
          <p className="muted footer__note">{footer.volunteering}</p>
          <p className="muted footer__copy">
            © {year} {identity.firstName} {identity.lastName}
          </p>
        </div>
      </footer>
    </section>
  )
}
