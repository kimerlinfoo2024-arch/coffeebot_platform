import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="ftr-in">
        <div style={{ maxWidth: '32ch' }}>
          <h4>CoffeeBot · Grounds Up</h4>
          <p className="small muted">
            Turning used coffee grounds into measurable sustainability impact, visibility and
            hands-on learning for schools, workplaces and families.
          </p>
        </div>
        <div>
          <h4>Platform</h4>
          <Link to="/about">About &amp; impact</Link>
          <Link to="/signin">Sign in</Link>
        </div>
        <div>
          <h4>Work with us</h4>
          <Link to="/partner">Partner with us</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
