/* Line-icon set (lucide-style) — used instead of emoji across the platform. */
const P = {
  recycle: ['M4 12a8 8 0 0 1 13-6l2 2', 'M20 12a8 8 0 0 1-13 6l-2-2', 'M19 4v4h-4', 'M5 20v-4h4'],
  cup: ['M5 8h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z', 'M16 9h2a2 2 0 0 1 0 4h-2', 'M8 3v2', 'M11 3v2'],
  leaf: ['M4 20C4 10 12 4 20 4c0 8-6 16-16 16Z', 'M4 20 14 10'],
  bolt: ['M13 3 4 14h7l-1 7 9-11h-7l1-7Z'],
  trash: ['M4 7h16', 'M9 7V5h6v2', 'M6 7l1 13h10l1-13'],
  sprout: ['M12 20v-8', 'M12 12C9 12 7 10 7 7c3 0 5 2 5 5Z', 'M12 12c3 0 5-2 5-5-3 0-5 2-5 5Z'],
  plug: ['M9 3v6', 'M15 3v6', 'M7 9h10v3a5 5 0 0 1-10 0V9Z', 'M12 17v4'],
  book: ['M12 6C10 4 6 4 3 5v13c3-1 7-1 9 1 2-2 6-2 9-1V5c-3-1-7-1-9 1Z', 'M12 6v13'],
  send: ['M22 2 11 13', 'M22 2 15 22l-4-9-9-4 20-7Z'],
  home: ['M4 11 12 4l8 7', 'M6 10v10h12V10'],
  award: ['M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 19l-4.8 2.5.9-5.4L4.2 8.7l5.4-.8L12 3Z'],
  check: ['M20 6 9 17l-5-5'],
  x: ['M18 6 6 18', 'M6 6l12 12'],
  arrowRight: ['M5 12h14', 'M13 6l6 6-6 6'],
  play: ['M7 4v16l13-8L7 4Z'],
  users: ['M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8', 'M22 20v-2a4 4 0 0 0-3-3.9', 'M16 2.1a4 4 0 0 1 0 7.8'],
};

export default function Icon({ name, size = 22, strokeWidth = 2, fill = false, className, style }) {
  const paths = P[name] || [];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style} aria-hidden="true">
      {paths.map((d, i) => <path key={i} d={d} fill={fill ? 'currentColor' : 'none'} />)}
    </svg>
  );
}
