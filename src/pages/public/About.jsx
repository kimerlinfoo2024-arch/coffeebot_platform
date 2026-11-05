import { motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import Icon from '../../components/ui/Icon';
import GroundsShowcase from '../../components/hero/GroundsShowcase';

const reveal = {
  initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10%' }, transition: { duration: 0.45 },
};

/* What CoffeeBot does, in plain words. Impact figures live in the staff
   dashboard (Overview and Reports), not on this public page. */
const WHAT_WE_DO = [
  { icon: 'cup', h: 'Coffee machines', p: 'Fresh coffee for offices and campuses, from compact tabletop machines.' },
  { icon: 'recycle', h: 'Grounds collection', p: 'The used grounds from those machines are kept out of the bin, collected on a schedule and sorted.' },
  { icon: 'sprout', h: 'A second life', p: 'Partners and hands-on activities turn the grounds into compost, planters, scrubs, soap and candles.' },
  { icon: 'book', h: 'Learning', p: 'Schools and workplaces use the Education Hub to learn about sustainability and the circular economy, one cup at a time.' },
];

const STEPS = [
  ['Brew', 'A coffee is made, and the used grounds are left behind in the machine.'],
  ['Collect', 'Grounds are kept apart from general waste and picked up on a schedule.'],
  ['Sort and dry', 'Clean batches are dried for products. Fresh batches go straight to compost or growers.'],
  ['Repurpose', 'The grounds become an ingredient in something new. See below.'],
];

export default function About() {
  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">About CoffeeBot</span>
        <h1>Grounds up, not thrown out</h1>
        <p>
          CoffeeBot makes tabletop coffee machines for offices and campuses. Every cup leaves about 20 g of
          used grounds. Grounds Up gives those grounds a second life, and teaches people how along the way.
        </p>
      </div>

      <motion.ul {...reveal} className="about-what">
        {WHAT_WE_DO.map((w) => (
          <li key={w.h}>
            <span className="about-what-ico"><Icon name={w.icon} size={22} /></span>
            <b>{w.h}</b>
            <span>{w.p}</span>
          </li>
        ))}
      </motion.ul>

      <div className="pagehead" style={{ marginTop: 'var(--s7)' }}>
        <span className="eyebrow">A resource, not just waste</span>
        <h2 style={{ fontSize: 'var(--t-xl)', fontWeight: 800 }}>What used grounds can become</h2>
        <p>Grounds don't have to end in the bin. Collected clean and handled quickly, they can be an ingredient in something new.</p>
      </div>

      <ol className="reuse-steps">
        {STEPS.map(([h, t], i) => (
          <motion.li key={h} {...reveal} transition={{ ...reveal.transition, delay: i * 0.12 }}>
            <b>{h}</b><span>{t}</span>
          </motion.li>
        ))}
      </ol>

      <motion.div {...reveal}><GroundsShowcase /></motion.div>
      <p className="small muted" style={{ marginTop: 'var(--s3)', maxWidth: '80ch' }}>
        These are possible uses, not guarantees. Grounds are one ingredient alongside others, and whether reuse is the
        better option depends on how the grounds are collected, dried and transported.
      </p>
    </Page>
  );
}
