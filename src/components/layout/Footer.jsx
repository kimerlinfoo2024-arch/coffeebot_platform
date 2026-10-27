import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { COMPANY } from '../../data/company';

export default function Footer() {
  const user = useStore((s) => s.user);
  const sync = useStore((s) => s.sync);
  const dataLabel = { live: 'Live · shared data', connecting: 'Connecting…', error: 'Sync error · this browser only', local: 'This browser only' }[sync.status] || sync.status;
  const office = COMPANY.offices[0];

  return (
    <footer className="ftr">
      <div className="ftr-in">
        <div className="ftr-about">
          <h4>Grounds Up by CoffeeBot</h4>
          <p>
            Used coffee grounds as a resource: hands-on sustainability learning for schools and workplaces.
          </p>
        </div>
        {!user && (
          <div>
            <h4>Explore</h4>
            <Link to="/about">About</Link>
            <Link to="/partner">Partner with us</Link>
            <Link to="/contact">Contact</Link>
          </div>
        )}
        <div>
          <h4>Get in touch</h4>
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          <span>{office.address.join(', ')}</span>
        </div>
      </div>
      <div className="ftr-word" aria-hidden="true">coffeebot.</div>
      <div className="ftr-legal">© {new Date().getFullYear()} {office.name} · <span title={sync.error || `Data: ${sync.backend}`}>{dataLabel}</span></div>
    </footer>
  );
}
