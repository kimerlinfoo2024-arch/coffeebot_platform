import { motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import Icon from '../../components/ui/Icon';
import { COMPANY, telHref } from '../../data/company';
import './contact.css';

const TOPICS = [
  ['Activities and bookings', 'Which activity suits your group, changing a booking, or what a session needs.'],
  ['Your account', 'Trouble logging in, or your school or company is not being recognised.'],
  ['Partnerships', 'You can put used coffee grounds to use and want a regular supply.'],
];

export default function Contact() {
  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">Contact</span>
        <h1>Talk to CoffeeBot</h1>
        <p>Have a question, or need something clarified? Email us and the CoffeeBot team will get back to you.</p>
      </div>

      <motion.div className="contact-hero" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div>
          <span className="sticker-mini">Email us</span>
          <a className="contact-mail" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          <p>Tell us your school or company and what you'd like to know. There's no form to fill in — an email is all we need.</p>
        </div>
        <a className="pill dark" href={`mailto:${COMPANY.email}?subject=${encodeURIComponent('Grounds Up enquiry')}`}>Write an email</a>
      </motion.div>

      <div className="grid2" style={{ marginTop: 'var(--s5)' }}>
        {COMPANY.offices.map((o) => (
          <address key={o.country} className="panel office">
            <span className="tag t-gen">{o.country}</span>
            <h2>{o.name}</h2>
            <div className="office-row">
              <Icon name="home" size={18} />
              <span>{o.address.map((line) => <span key={line} className="line">{line}</span>)}</span>
            </div>
            <div className="office-row">
              <Icon name="plug" size={18} />
              <span>{o.phones.map((p) => <a key={p} className="line" href={telHref(p)}>{p}</a>)}</span>
            </div>
            <div className="office-row">
              <Icon name="send" size={18} />
              <a href={`mailto:${o.email}`}>{o.email}</a>
            </div>
          </address>
        ))}
      </div>

      <div className="panel" style={{ marginTop: 'var(--s5)' }}>
        <h2>What you can ask us about</h2>
        <div className="grid3">
          {TOPICS.map(([h, t]) => <div key={h} className="card soft"><h3>{h}</h3><p className="small muted">{t}</p></div>)}
        </div>
      </div>
    </Page>
  );
}
