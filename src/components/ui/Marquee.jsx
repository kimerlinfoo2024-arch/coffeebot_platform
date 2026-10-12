import { BEAN } from '../../data/art';

/** Scrolling ticker strip. Decorative — the text is repeated, so it is hidden from screen readers. */
export default function Marquee({ text, className = '' }) {
  const items = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className={`marquee ${className}`} aria-hidden="true">
      <div className="marquee-track">
        {items.map((i) => <span key={i}>{text}<i dangerouslySetInnerHTML={{ __html: BEAN }} /></span>)}
      </div>
    </div>
  );
}
