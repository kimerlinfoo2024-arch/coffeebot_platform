/* ============================================================
   Education Hub artwork — drawn for students.
   Same flat, speckled look as the product art (art.jsx), plus a
   friendly bean mascot. Strings are rendered with <Svg markup>.
   ============================================================ */

const DEFS = `<defs>
  <linearGradient id="hb-bean" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A5232"/><stop offset="1" stop-color="#462B18"/></linearGradient>
  <linearGradient id="hb-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFDF7"/><stop offset="1" stop-color="#ECE5D7"/></linearGradient>
  <linearGradient id="hb-sleeve" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7C5636"/><stop offset="1" stop-color="#55361F"/></linearGradient>
  <linearGradient id="hb-lid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A2A1E"/><stop offset="1" stop-color="#20140C"/></linearGradient>
  <radialGradient id="hb-mound" cx=".42" cy=".3" r=".75"><stop offset="0" stop-color="#7E572F"/><stop offset="1" stop-color="#3A2416"/></radialGradient>
  <radialGradient id="hb-hi" cx=".4" cy=".3" r=".5"><stop offset="0" stop-color="#9A6A3C" stop-opacity=".85"/><stop offset="1" stop-color="#9A6A3C" stop-opacity="0"/></radialGradient>
  <linearGradient id="hb-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4EFDF"/><stop offset="1" stop-color="#E2E7D5"/></linearGradient>
  <linearGradient id="hb-hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#DEE3D4"/><stop offset="1" stop-color="#F0E5D0"/></linearGradient>
  <linearGradient id="hb-hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#86AE74"/><stop offset="1" stop-color="#4C7A47"/></linearGradient>
  <linearGradient id="hb-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A979E"/><stop offset="1" stop-color="#24727A"/></linearGradient>
  <linearGradient id="hb-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3CB6B"/><stop offset="1" stop-color="#D19A2C"/></linearGradient>
  <radialGradient id="hb-cherry" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#E86A50"/><stop offset="1" stop-color="#A2301F"/></radialGradient>
  <linearGradient id="hb-metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9C978F"/><stop offset="1" stop-color="#5B5751"/></linearGradient>
  <linearGradient id="hb-leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#76AC68"/><stop offset="1" stop-color="#3E6B3A"/></linearGradient>
  <linearGradient id="hb-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C99A62"/><stop offset="1" stop-color="#9A6A3C"/></linearGradient>
  <pattern id="hb-speck" width="15" height="15" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r="1.3" fill="#2F1D10" opacity=".55"/><circle cx="10" cy="10" r="1" fill="#1F140C" opacity=".5"/><circle cx="7" cy="13" r=".7" fill="#5A3A22" opacity=".6"/></pattern>
  <marker id="hb-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#6B4A2E"/></marker>
</defs>`;

const svg = (vb, label, body) =>
  `<svg viewBox="${vb}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${DEFS}${body}</svg>`;

/* ---------- building blocks ---------- */

/** plain coffee bean */
const bean = (x, y, r, rot = 0, fill = 'url(#hb-bean)') => `<g transform="translate(${x} ${y}) rotate(${rot})">
  <ellipse rx="${r}" ry="${r * 1.4}" fill="${fill}"/>
  <ellipse cx="${-r * 0.35}" cy="${-r * 0.45}" rx="${r * 0.28}" ry="${r * 0.5}" fill="#B07E4E" opacity=".4"/>
  <path d="M0 ${-r * 1.3} C ${-r * 0.55} ${-r * 0.3}, ${r * 0.55} ${r * 0.3}, 0 ${r * 1.3}" stroke="#2A1A0F" stroke-width="${r * 0.3}" fill="none" stroke-linecap="round"/></g>`;

/** the mascot: a coffee bean with a face, arms and little feet */
function buddy(x, y, r, { rot = 0, mood = 'happy', wave = false, shades = false } = {}) {
  const sw = r * 0.15;
  const ink = '#24160C';
  const ex = r * 0.34, ey = -r * 0.1;
  const leg = (d) => `<path d="M${d * r * 0.35} ${r * 1.12} L${d * r * 0.42} ${r * 1.55}" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round"/>
    <ellipse cx="${d * r * 0.5}" cy="${r * 1.6}" rx="${r * 0.2}" ry="${r * 0.1}" fill="${ink}"/>`;
  const armL = `<path d="M${-r * 0.9} ${r * 0.2} Q ${-r * 1.3} ${r * 0.5} ${-r * 1.25} ${r * 0.85}" stroke="${ink}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`;
  const armR = wave
    ? `<path d="M${r * 0.9} ${r * 0.05} Q ${r * 1.35} ${-r * 0.2} ${r * 1.4} ${-r * 0.72}" stroke="${ink}" stroke-width="${sw}" fill="none" stroke-linecap="round"/><circle cx="${r * 1.42}" cy="${-r * 0.82}" r="${r * 0.15}" fill="${ink}"/>`
    : `<path d="M${r * 0.9} ${r * 0.2} Q ${r * 1.3} ${r * 0.5} ${r * 1.25} ${r * 0.85}" stroke="${ink}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`;
  const eye = (d) => shades ? '' : `<ellipse cx="${d * ex}" cy="${ey}" rx="${r * 0.19}" ry="${r * 0.23}" fill="#fff"/>
    <circle cx="${d * ex + r * 0.03}" cy="${ey + r * 0.05}" r="${r * 0.11}" fill="${ink}"/>
    <circle cx="${d * ex - r * 0.01}" cy="${ey - r * 0.02}" r="${r * 0.04}" fill="#fff"/>`;
  const glasses = shades ? `<rect x="${-ex - r * 0.26}" y="${ey - r * 0.17}" width="${r * 0.52}" height="${r * 0.32}" rx="${r * 0.12}" fill="${ink}"/>
    <rect x="${ex - r * 0.26}" y="${ey - r * 0.17}" width="${r * 0.52}" height="${r * 0.32}" rx="${r * 0.12}" fill="${ink}"/>
    <path d="M${-ex + r * 0.26} ${ey - r * 0.05} H ${ex - r * 0.26}" stroke="${ink}" stroke-width="${r * 0.07}"/>
    <path d="M${-ex - r * 0.14} ${ey - r * 0.08} l ${r * 0.12} ${-r * 0.05}" stroke="#fff" stroke-width="${r * 0.05}" stroke-linecap="round" opacity=".7"/>` : '';
  const mouth = mood === 'sad'
    ? `<path d="M${-r * 0.2} ${r * 0.48} Q 0 ${r * 0.28} ${r * 0.2} ${r * 0.48}" stroke="${ink}" stroke-width="${r * 0.09}" fill="none" stroke-linecap="round"/>
       <path d="M${ex + r * 0.12} ${ey + r * 0.24} q ${r * 0.08} ${r * 0.16} 0 ${r * 0.24} q ${-r * 0.08} ${-r * 0.08} 0 ${-r * 0.24} Z" fill="#8FD0DC"/>`
    : `<path d="M${-r * 0.24} ${r * 0.26} Q 0 ${r * 0.6} ${r * 0.24} ${r * 0.26} Z" fill="${ink}"/>
       <path d="M${-r * 0.1} ${r * 0.42} Q 0 ${r * 0.36} ${r * 0.1} ${r * 0.42} Q 0 ${r * 0.5} ${-r * 0.1} ${r * 0.42} Z" fill="#E0705A"/>`;
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <ellipse cx="0" cy="${r * 1.66}" rx="${r * 0.95}" ry="${r * 0.14}" fill="#2F1D10" opacity=".15"/>
    ${leg(-1)}${leg(1)}
    <ellipse rx="${r}" ry="${r * 1.25}" fill="url(#hb-bean)"/>
    <ellipse cx="${-r * 0.45}" cy="${-r * 0.55}" rx="${r * 0.2}" ry="${r * 0.36}" fill="#B07E4E" opacity=".45" transform="rotate(20 ${-r * 0.45} ${-r * 0.55})"/>
    <path d="M${r * 0.08} ${-r * 1.22} C ${-r * 0.14} ${-r * 1.0}, ${r * 0.12} ${-r * 0.82}, ${-r * 0.06} ${-r * 0.62}" stroke="#2A1A0F" stroke-width="${r * 0.12}" fill="none" stroke-linecap="round"/>
    ${armL}${armR}
    ${eye(-1)}${eye(1)}${glasses}
    <ellipse cx="${-r * 0.6}" cy="${r * 0.24}" rx="${r * 0.15}" ry="${r * 0.08}" fill="#F08E6E" opacity=".6"/>
    <ellipse cx="${r * 0.6}" cy="${r * 0.24}" rx="${r * 0.15}" ry="${r * 0.08}" fill="#F08E6E" opacity=".6"/>
    ${mouth}</g>`;
}

/** CoffeeBot takeaway cup, centred on (x, y) */
const cup = (x, y, s) => `<g transform="translate(${x - 110 * s} ${y - 150 * s}) scale(${s})">
  <ellipse cx="110" cy="252" rx="70" ry="11" fill="#2F1D10" opacity=".16"/>
  <path d="M86 58 C 80 44, 92 40, 88 28" stroke="#C9BBA4" stroke-width="5" fill="none" stroke-linecap="round" opacity=".75"/>
  <path d="M110 54 C 104 40, 116 36, 112 24" stroke="#C9BBA4" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>
  <path d="M134 58 C 128 44, 140 40, 136 28" stroke="#C9BBA4" stroke-width="5" fill="none" stroke-linecap="round" opacity=".75"/>
  <path d="M58 88 L162 88 L148 236 Q146 248 134 248 L86 248 Q74 248 72 236 Z" fill="url(#hb-body)" stroke="#E2DACA" stroke-width="2"/>
  <rect x="74" y="98" width="11" height="130" rx="5.5" fill="#fff" opacity=".55"/>
  <path d="M66 150 L154 150 L149 198 L71 198 Z" fill="url(#hb-sleeve)"/><path d="M66 150 L154 150 L149 198 L71 198 Z" fill="url(#hb-speck)"/>
  <text x="110" y="179" text-anchor="middle" font-family="Archivo,Arial" font-weight="900" font-size="13" fill="#F4EBDD">COFFEEBOT</text>
  <path d="M54 72 Q110 54 166 72 L166 90 L54 90 Z" fill="url(#hb-lid)"/><rect x="98" y="62" width="24" height="8" rx="4" fill="#20140C"/></g>`;

/** mound of used grounds, centred on (x, y) */
const pile = (x, y, s) => `<g transform="translate(${x - 130 * s} ${y - 120 * s}) scale(${s})">
  <ellipse cx="130" cy="166" rx="116" ry="20" fill="#2F1D10" opacity=".16"/>
  <path d="M22 166 Q68 72 130 68 Q192 72 238 166 Z" fill="url(#hb-mound)"/><path d="M22 166 Q68 72 130 68 Q192 72 238 166 Z" fill="url(#hb-speck)"/>
  <ellipse cx="104" cy="110" rx="50" ry="32" fill="url(#hb-hi)"/></g>`;

const leaf = (x, y, rx, ry, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><ellipse rx="${rx}" ry="${ry}" fill="url(#hb-leaf)"/><path d="M${-rx * 0.8} 0 L${rx * 0.8} 0" stroke="#2F5A2C" stroke-width="1.5" opacity=".45"/></g>`;

/** seedling growing up from (x, y) */
const sprout = (x, y, h, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M0 0 C 0 ${-h * 0.4}, 3 ${-h * 0.7}, 0 ${-h}" stroke="#3E6B3A" stroke-width="4" fill="none" stroke-linecap="round"/>
  ${leaf(-11, -h + 2, 12, 6, -30)}${leaf(11, -h - 3, 12, 6, 30)}</g>`;

const cherries = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  ${[[-6, 0], [6, -2], [0, 8]].map(([dx, dy]) => `<circle cx="${dx}" cy="${dy}" r="7" fill="url(#hb-cherry)"/><circle cx="${dx - 2}" cy="${dy - 3}" r="1.8" fill="#fff" opacity=".7"/>`).join('')}</g>`;

/** coffee shrub with ripe cherries; base at (x, y) */
const plant = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cx="0" cy="4" rx="46" ry="8" fill="#2F1D10" opacity=".15"/>
  <path d="M0 0 C -6 -40, 6 -80, 0 -128" stroke="#5A3A22" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M0 -50 Q 24 -62 40 -58" stroke="#5A3A22" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M0 -84 Q -24 -96 -40 -92" stroke="#5A3A22" stroke-width="4" fill="none" stroke-linecap="round"/>
  ${leaf(-30, -60, 24, 10, -20)}${leaf(34, -74, 24, 10, 25)}${leaf(-36, -104, 22, 9, -30)}${leaf(28, -108, 22, 9, 30)}${leaf(2, -138, 18, 8, -80)}${leaf(-24, -26, 20, 8, -10)}${leaf(26, -32, 20, 8, 12)}
  ${cherries(20, -52)}${cherries(-20, -86)}${cherries(6, -112, 0.8)}</g>`;

const sparkle = (x, y, s) => `<path transform="translate(${x} ${y})" d="M0 ${-s} L${s * 0.28} ${-s * 0.28} L${s} 0 L${s * 0.28} ${s * 0.28} L0 ${s} L${-s * 0.28} ${s * 0.28} L${-s} 0 L${-s * 0.28} ${-s * 0.28} Z" fill="#E9B44C"/>`;

const cloud = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity=".9"><circle cx="-18" cy="4" r="12"/><circle cx="0" cy="-4" r="16"/><circle cx="20" cy="4" r="12"/><rect x="-30" y="4" width="62" height="12" rx="6"/></g>`;

const sun = (x, y, r) => `<g transform="translate(${x} ${y})">
  ${Array.from({ length: 10 }, (_, i) => `<path d="M0 ${-r - 6} V${-r - 14}" stroke="#E9B44C" stroke-width="4" stroke-linecap="round" transform="rotate(${i * 36})"/>`).join('')}
  <circle r="${r}" fill="url(#hb-gold)"/></g>`;

/** small pointing triangle, used as an arrowhead on loops */
const tip = (x, y, rot, fill = '#6B4A2E') => `<path d="M-8 -7 L8 0 L-8 7 Z" transform="translate(${x} ${y}) rotate(${rot})" fill="${fill}"/>`;

/** planter pot made from grounds, with a sprout; base centre (x, y) */
const pot = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cx="0" cy="4" rx="40" ry="7" fill="#2F1D10" opacity=".15"/>
  ${sprout(0, -58, 34, 1.2)}
  <path d="M-34 -58 L34 -58 L26 0 L-26 0 Z" fill="#5A3A22"/><path d="M-34 -58 L34 -58 L26 0 L-26 0 Z" fill="url(#hb-speck)"/>
  <rect x="-40" y="-64" width="80" height="14" rx="5" fill="#6B4A2E"/></g>`;

const frame = (w, h, fill = 'url(#hb-sky)') => `<rect width="${w}" height="${h}" rx="18" fill="${fill}"/>`;

/* ============================================================
   Scenes
   ============================================================ */

export const HUB_HERO = svg('0 0 1000 300', 'Coffee beans growing, brewed into a CoffeeBot cup, and the grounds feeding a new plant', `
  <clipPath id="hb-heroclip"><rect width="1000" height="300" rx="24"/></clipPath>
  <g clip-path="url(#hb-heroclip)">
    <rect width="1000" height="300" fill="url(#hb-hero)"/>
    <text x="500" y="222" text-anchor="middle" font-family="Archivo,Arial" font-weight="900" font-size="200" letter-spacing="-8" fill="#2B1D14" opacity=".06">GROUNDS UP</text>
    <ellipse cx="500" cy="160" rx="330" ry="108" fill="none" stroke="#6B4A2E" stroke-width="3.5" stroke-dasharray="2 13" stroke-linecap="round" opacity=".45"/>
    ${tip(500, 52, 0)}${tip(500, 268, 180)}
    ${plant(170, 228, 0.95)}
    ${pile(830, 214, 0.55)}${sprout(830, 180, 34, 1.2)}
    ${cup(500, 158, 0.9)}
    ${buddy(320, 214, 26, { wave: true })}
    ${buddy(700, 222, 21, { rot: 6 })}
    ${bean(80, 62, 15, -25)}${bean(935, 74, 13, 40)}${bean(400, 38, 8, 20)}${bean(620, 280, 9, -40)}${bean(950, 262, 14, 30)}${bean(52, 250, 10, 70)}
    ${sparkle(250, 86, 10)}${sparkle(760, 68, 8)}${sparkle(590, 46, 6)}${sparkle(392, 274, 7)}
  </g>`);

/* ---- sustainability pillars ---- */
export const PILLAR_ART = {
  env: svg('0 0 240 150', 'A smiling bean next to the Earth with a sprout growing on top', `
    ${frame(240, 150, '#DCE6D3')}
    ${sun(204, 34, 13)}${cloud(62, 30, 0.7)}
    <circle cx="128" cy="96" r="44" fill="url(#hb-sea)"/>
    <path d="M100 74 q 15 -14 32 -4 q 10 8 -2 16 q -14 6 -20 18 q -12 -4 -14 -14 q -6 -10 4 -16 Z" fill="#7AAE68"/>
    <path d="M140 102 q 18 -6 22 8 q 2 14 -14 18 q -10 -2 -8 -14 Z" fill="#7AAE68"/>
    <path d="M100 118 q 8 -4 14 2 q -2 8 -10 6 Z" fill="#7AAE68"/>
    <ellipse cx="112" cy="76" rx="16" ry="8" fill="#fff" opacity=".22" transform="rotate(-30 112 76)"/>
    ${sprout(128, 53, 26)}
    ${buddy(46, 104, 15, { wave: true })}`),
  soc: svg('0 0 240 150', 'Three bean friends standing together under a heart', `
    ${frame(240, 150, '#D5E8E7')}
    <path d="M120 40 C 102 26, 106 8, 120 17 C 134 8, 138 26, 120 40 Z" fill="#E0604A"/>
    ${sparkle(86, 24, 6)}${sparkle(158, 28, 5)}
    ${buddy(66, 88, 19, { rot: -6 })}
    ${buddy(174, 88, 19, { rot: 6, wave: true })}
    ${buddy(120, 80, 23)}`),
  eco: svg('0 0 240 150', 'Stacks of coins growing taller, with a sprout on the tallest', `
    ${frame(240, 150, '#F2E3C4')}
    ${[[96, 3], [146, 5], [196, 7]].map(([x, n]) => Array.from({ length: n }, (_, i) => {
      const y = 128 - i * 9;
      return `<ellipse cx="${x}" cy="${y + 3}" rx="21" ry="7" fill="#A87418"/><ellipse cx="${x}" cy="${y}" rx="21" ry="7" fill="url(#hb-gold)" stroke="#9A6414" stroke-width="1"/>`;
    }).join('') + bean(x, 128 - (n - 1) * 9, 2.6, 90)).join('')}
    ${sprout(196, 72, 26)}
    ${sparkle(150, 52, 6)}
    ${buddy(40, 98, 15, { wave: true })}`),
};

/* ---- linear vs circular ---- */
const bin = (x, y) => `<g transform="translate(${x} ${y})">
  <ellipse cx="0" cy="44" rx="34" ry="6" fill="#2F1D10" opacity=".15"/>
  <path d="M-28 -24 L28 -24 L22 42 L-22 42 Z" fill="url(#hb-metal)"/>
  ${[-12, 0, 12].map((dx) => `<path d="M${dx} -14 L${dx * 0.85} 34" stroke="#3F3C37" stroke-width="3" stroke-linecap="round" opacity=".5"/>`).join('')}
  <rect x="-33" y="-34" width="66" height="12" rx="5" fill="#4F4B46"/><rect x="-9" y="-40" width="18" height="7" rx="3" fill="#4F4B46"/></g>`;

export const MODEL_ART = {
  linear: svg('0 0 640 200', 'Linear economy: cup, then grounds, then the bin, then landfill — with a sad bean', `
    ${frame(640, 200, '#F4EBE6')}
    ${cup(86, 104, 0.5)}
    ${pile(240, 116, 0.42)}
    ${bin(400, 104)}
    <path d="M490 160 Q 540 96 600 160 Z" fill="#9C978E"/>
    <rect x="512" y="138" width="16" height="10" rx="2" fill="#6F6A63" transform="rotate(-15 520 143)"/>
    <circle cx="566" cy="146" r="6" fill="#7C776F"/><rect x="540" y="128" width="12" height="16" rx="3" fill="#B7B1A6" transform="rotate(20 546 136)"/>
    <path d="M520 92 q -6 -10 0 -18 M548 82 q -6 -10 0 -18 M576 92 q -6 -10 0 -18" stroke="#8C9A6A" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>
    <circle cx="590" cy="74" r="2.5" fill="#2B1D14"/><circle cx="506" cy="70" r="2.5" fill="#2B1D14"/>
    ${buddy(550, 92, 16, { mood: 'sad' })}
    ${[[128, 186], [290, 344], [446, 494]].map(([a, b]) => `<path d="M${a} 112 H ${b}" stroke="#6B4A2E" stroke-width="3" stroke-dasharray="6 7" stroke-linecap="round" marker-end="url(#hb-arrow)"/>`).join('')}`),
  circular: svg('0 0 640 230', 'Circular economy: cup, grounds, planter and coffee plant joined in a loop around a happy bean', `
    ${frame(640, 230, '#E4EDDD')}
    <ellipse cx="320" cy="115" rx="240" ry="80" fill="none" stroke="#4C7A47" stroke-width="4" stroke-dasharray="3 12" stroke-linecap="round"/>
    ${tip(150, 58, -18.5, '#4C7A47')}${tip(490, 58, 18.5, '#4C7A47')}${tip(490, 172, 161.5, '#4C7A47')}${tip(150, 172, -161.5, '#4C7A47')}
    ${cup(80, 112, 0.42)}
    ${pile(320, 46, 0.36)}
    ${pot(560, 150, 0.8)}
    ${plant(320, 220, 0.42)}
    ${buddy(320, 102, 22, { wave: true })}
    ${sparkle(266, 86, 8)}${sparkle(378, 128, 7)}${sparkle(372, 70, 5)}`),
};

/* ---- life of a coffee bean: one scene per stage, same order as LIFECYCLE ---- */
const W = 320, H = 200;

const growing = svg(`0 0 ${W} ${H}`, 'Coffee plants with red cherries growing on a sunny hillside', `
  ${frame(W, H)}
  ${sun(262, 46, 20)}${cloud(84, 40, 0.9)}
  <path d="M0 150 Q 80 112 160 140 T 320 128 V200 H0 Z" fill="url(#hb-hill)"/>
  <path d="M0 170 Q 110 150 200 168 T 320 160 V200 H0 Z" fill="#4C7A47" opacity=".6"/>
  ${plant(118, 146, 0.72)}${plant(214, 150, 0.56)}
  ${buddy(46, 150, 14, { wave: true })}`);

const harvesting = svg(`0 0 ${W} ${H}`, 'A woven basket full of ripe coffee cherries', `
  ${frame(W, H)}
  <rect y="168" width="${W}" height="32" fill="#9DBB8C"/>
  <path d="M0 26 Q 70 34 130 52" stroke="#5A3A22" stroke-width="6" fill="none" stroke-linecap="round"/>
  ${leaf(36, 22, 20, 8, -10)}${leaf(78, 48, 20, 8, 30)}${leaf(110, 36, 18, 7, -20)}${cherries(60, 42)}${cherries(118, 60, 0.8)}
  ${cherries(150, 84, 0.7)}${cherries(206, 66, 0.6)}
  ${[118, 132, 146, 160, 174, 188, 202, 125, 139, 153, 167, 181, 195].map((cx, i) => `<circle cx="${cx}" cy="${i < 7 ? 112 : 102}" r="8" fill="url(#hb-cherry)"/><circle cx="${cx - 2.5}" cy="${(i < 7 ? 112 : 102) - 3}" r="2" fill="#fff" opacity=".6"/>`).join('')}
  <ellipse cx="160" cy="182" rx="70" ry="8" fill="#2F1D10" opacity=".18"/>
  <path d="M100 112 H220 L206 172 Q 160 184 114 172 Z" fill="url(#hb-wood)"/>
  ${[128, 144, 160].map((yy) => `<path d="M${100 + (yy - 112) * 0.23} ${yy} H ${220 - (yy - 112) * 0.23}" stroke="#7E5530" stroke-width="2.5" opacity=".6"/>`).join('')}
  ${[124, 142, 160, 178, 196].map((xx) => `<path d="M${xx} 116 L${160 + (xx - 160) * 0.85} 174" stroke="#7E5530" stroke-width="2.5" opacity=".45"/>`).join('')}
  <rect x="94" y="106" width="132" height="12" rx="6" fill="#9A6A3C"/>
  ${buddy(262, 148, 16, { wave: true })}`);

const processing = svg(`0 0 ${W} ${H}`, 'Coffee beans drying in the sun on a raised bed', `
  ${frame(W, H)}
  ${sun(250, 44, 22)}
  <rect y="172" width="${W}" height="28" fill="#C9B48E"/>
  ${[86, 150, 214].map((x) => `<path d="M${x} 96 q -6 -9 0 -18 q 6 -9 0 -18" stroke="#E9B44C" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>`).join('')}
  <rect x="44" y="128" width="8" height="46" fill="#7E5530"/><rect x="226" y="128" width="8" height="46" fill="#7E5530"/>
  <rect x="34" y="118" width="210" height="14" rx="4" fill="url(#hb-wood)"/>
  ${Array.from({ length: 14 }, (_, i) => bean(48 + i * 14.5, 112, 4.2, i % 2 ? 70 : 110, i % 3 ? '#C4AA6A' : '#A88B4E')).join('')}
  ${Array.from({ length: 6 }, (_, i) => bean(70 + i * 28, 104, 4, i % 2 ? 40 : 140, '#C4AA6A')).join('')}
  ${buddy(280, 148, 15, { shades: true })}`);

const transport = svg(`0 0 ${W} ${H}`, 'A cargo ship carrying sacks of coffee across the sea', `
  ${frame(W, H)}
  ${cloud(70, 44, 0.8)}${cloud(250, 30, 0.6)}
  <path d="M210 52 l 6 5 l 6 -5 M232 64 l 5 4 l 5 -4" stroke="#4A3626" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M206 68 q 8 -10 4 -22 q 10 -6 6 -18" stroke="#C9BBA4" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/>
  <rect x="196" y="72" width="16" height="30" rx="3" fill="#2B1D14"/><rect x="196" y="78" width="16" height="6" fill="#E9B44C"/>
  <rect x="172" y="88" width="56" height="30" rx="4" fill="#F4EFE4"/><rect x="180" y="96" width="10" height="9" rx="2" fill="#8FD0DC"/><rect x="196" y="96" width="10" height="9" rx="2" fill="#8FD0DC"/><rect x="212" y="96" width="10" height="9" rx="2" fill="#8FD0DC"/>
  ${[[78, 104], [112, 104], [146, 104], [95, 84], [129, 84]].map(([x, y]) => `<rect x="${x - 16}" y="${y - 2}" width="32" height="22" rx="8" fill="#C9A877"/><rect x="${x - 16}" y="${y - 2}" width="32" height="22" rx="8" fill="url(#hb-speck)" opacity=".25"/><text x="${x}" y="${y + 12}" text-anchor="middle" font-family="Archivo,Arial" font-weight="900" font-size="6.5" fill="#6B4A2E">COFFEE</text>`).join('')}
  <path d="M44 120 H262 L242 158 H66 Z" fill="#A93C2B"/><rect x="50" y="120" width="206" height="8" fill="#F4EFE4"/>
  <path d="M0 150 q 20 -10 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 V200 H0 Z" fill="url(#hb-sea)"/>
  <path d="M0 170 q 20 -8 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0" stroke="#fff" stroke-width="2.5" fill="none" opacity=".4"/>
  ${buddy(242, 103, 10, { wave: true })}`);

const roasting = svg(`0 0 ${W} ${H}`, 'A roasting drum turning green beans brown over a flame', `
  ${frame(W, H)}
  <rect y="174" width="${W}" height="26" fill="#C9B48E"/>
  <rect x="196" y="12" width="14" height="46" fill="#5B5751"/>
  <path d="M203 10 q -8 -6 -2 -12" stroke="#C9BBA4" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M136 30 L184 30 L174 54 L146 54 Z" fill="#7C776F"/>
  <rect x="86" y="52" width="148" height="92" rx="46" fill="url(#hb-metal)"/>
  <rect x="100" y="60" width="120" height="8" rx="4" fill="#fff" opacity=".18"/>
  <circle cx="160" cy="98" r="32" fill="#2B1D14" stroke="#B7B1A6" stroke-width="6"/>
  ${[[148, 90, 30], [168, 86, -40], [158, 106, 80], [176, 104, 10], [142, 108, -20]].map(([x, y, r]) => bean(x, y, 5, r)).join('')}
  <circle cx="150" cy="84" r="9" fill="#fff" opacity=".12"/>
  <rect x="112" y="144" width="96" height="10" rx="3" fill="#4F4B46"/>
  <rect x="118" y="154" width="10" height="22" fill="#4F4B46"/><rect x="192" y="154" width="10" height="22" fill="#4F4B46"/>
  ${[136, 160, 184].map((x) => `<path d="M${x} 172 q -10 -10 0 -24 q 4 10 10 12 q 2 -8 -2 -14 q 12 10 2 26 Z" fill="#E86A30"/><path d="M${x + 3} 172 q -4 -6 0 -12 q 4 6 2 12 Z" fill="#F3CB6B"/>`).join('')}
  ${bean(36, 150, 8, -20, '#C4AA6A')}<path d="M52 150 H 70" stroke="#6B4A2E" stroke-width="3" marker-end="url(#hb-arrow)"/>
  ${buddy(276, 146, 15, { wave: true })}`);

const brewing = svg(`0 0 ${W} ${H}`, 'A smiling CoffeeBot machine pouring coffee into a cup', `
  ${frame(W, H)}
  <rect y="176" width="${W}" height="24" fill="#C9B48E"/>
  <rect x="152" y="14" width="6" height="16" rx="3" fill="#2B1D14"/><circle cx="155" cy="12" r="6" fill="#E9B44C"/>
  <rect x="92" y="28" width="126" height="146" rx="24" fill="#2B1D14"/>
  <rect x="108" y="42" width="94" height="52" rx="22" fill="#3E2C20"/>
  <circle cx="136" cy="66" r="9" fill="#fff"/><circle cx="174" cy="66" r="9" fill="#fff"/>
  <circle cx="138" cy="68" r="4.5" fill="#2B1D14"/><circle cx="176" cy="68" r="4.5" fill="#2B1D14"/>
  <path d="M144 80 Q 155 88 166 80" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <rect x="145" y="102" width="20" height="12" rx="3" fill="#6B4A2E"/>
  <path d="M155 114 V 138" stroke="#5A3A22" stroke-width="4" stroke-linecap="round" stroke-dasharray="6 4"/>
  ${cup(155, 160, 0.26)}
  <rect x="112" y="166" width="86" height="6" rx="3" fill="#6B4A2E"/>
  ${buddy(264, 146, 16, { wave: true })}
  ${bean(46, 60, 9, -20)}${bean(60, 150, 7, 40)}${sparkle(254, 50, 7)}`);

const afterCup = svg(`0 0 ${W} ${H}`, 'Used grounds growing a new plant, with two happy beans celebrating', `
  ${frame(W, H, '#E4EDDD')}
  <rect y="172" width="${W}" height="28" fill="#9DBB8C"/>
  ${pile(110, 154, 0.5)}${sprout(110, 120, 38, 1.2)}
  ${pot(236, 176, 0.75)}
  <path d="M168 78 Q 210 30 252 70" stroke="#4C7A47" stroke-width="3" fill="none" stroke-dasharray="4 7" stroke-linecap="round" marker-end="url(#hb-arrow)"/>
  ${buddy(40, 146, 14, { wave: true })}${buddy(292, 146, 13, { wave: true, rot: -8 })}
  ${sparkle(160, 120, 7)}${sparkle(196, 150, 5)}${sparkle(60, 60, 6)}`);

export const STAGE_ART = [growing, harvesting, processing, transport, roasting, brewing, afterCup];

/* ---- teacher tab: a classroom of beans ---- */
export const CLASSROOM = svg('0 0 640 220', 'A class of bean students at their desks in front of a chalkboard', `
  ${frame(640, 220, 'url(#hb-hero)')}
  <rect x="150" y="16" width="340" height="124" rx="10" fill="#8A6A4A"/>
  <rect x="160" y="26" width="320" height="104" rx="6" fill="#2F4A3A"/>
  <text x="250" y="76" text-anchor="middle" font-family="Archivo,Arial" font-weight="900" font-size="26" fill="#EFE9DA" opacity=".9">Grounds Up!</text>
  <text x="250" y="104" text-anchor="middle" font-family="Figtree,Arial" font-size="13" fill="#EFE9DA" opacity=".7">reduce · reuse · recycle</text>
  <ellipse cx="410" cy="78" rx="38" ry="30" fill="none" stroke="#EFE9DA" stroke-width="2.5" stroke-dasharray="5 6" opacity=".7"/>
  <path d="M444 62 l 6 -10 l 4 12" stroke="#EFE9DA" stroke-width="2.5" fill="none" opacity=".7"/>
  <ellipse cx="410" cy="78" rx="8" ry="11" fill="none" stroke="#EFE9DA" stroke-width="2.5" opacity=".7"/><path d="M410 68 q -4 10 0 20" stroke="#EFE9DA" stroke-width="2" fill="none" opacity=".7"/>
  <rect x="300" y="134" width="40" height="5" rx="2" fill="#EFE9DA"/>
  ${[[110, 168, 18, { wave: true }], [245, 172, 20, {}], [395, 172, 20, { wave: true }], [530, 168, 18, {}]].map(([x, y, r, o]) => buddy(x, y, r, o)).join('')}
  ${[110, 245, 395, 530].map((x) => `<rect x="${x - 42}" y="186" width="84" height="12" rx="4" fill="url(#hb-wood)"/><rect x="${x - 36}" y="198" width="72" height="22" fill="#9A6A3C"/>`).join('')}
  ${sparkle(560, 60, 9)}${sparkle(90, 70, 7)}${bean(600, 120, 10, 30)}${bean(46, 120, 9, -30)}`);

/* ---- workplace tab: a team of beans in the office pantry ---- */
export const OFFICE = svg('0 0 640 220', 'A team of bean coworkers at a desk next to a CoffeeBot machine', `
  ${frame(640, 220, 'url(#hb-hero)')}
  <rect x="34" y="20" width="160" height="104" rx="8" fill="#F4EFE4"/>
  <rect x="42" y="28" width="144" height="88" rx="4" fill="#CFE3E2"/>
  ${[[50, 70, 22], [76, 52, 18], [98, 80, 24], [126, 60, 20], [150, 74, 16], [170, 58, 14]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${116 - y}" fill="#9DBFBE"/>`).join('')}
  <rect x="112" y="28" width="4" height="88" fill="#F4EFE4"/>
  ${cloud(80, 44, 0.45)}
  <rect x="236" y="26" width="132" height="84" rx="6" fill="#F4EFE4" stroke="#D3CFBF" stroke-width="2"/>
  <text x="302" y="54" text-anchor="middle" font-family="Archivo,Arial" font-weight="900" font-size="16" fill="#6B4A2E">Grounds Up</text>
  <text x="302" y="72" text-anchor="middle" font-family="Figtree,Arial" font-size="10" fill="#6F655A">reduce · reuse · recycle</text>
  <rect x="256" y="82" width="92" height="8" rx="4" fill="#E4E1D4"/><rect x="256" y="82" width="64" height="8" rx="4" fill="#4C7A47"/>
  <rect x="490" y="70" width="72" height="92" rx="14" fill="#2B1D14"/>
  <rect x="500" y="80" width="52" height="30" rx="12" fill="#3E2C20"/>
  <circle cx="516" cy="94" r="5" fill="#fff"/><circle cx="536" cy="94" r="5" fill="#fff"/><circle cx="517" cy="95" r="2.5" fill="#2B1D14"/><circle cx="537" cy="95" r="2.5" fill="#2B1D14"/>
  <path d="M520 102 Q 526 106 532 102" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <rect x="518" y="116" width="16" height="9" rx="2" fill="#6B4A2E"/>
  ${cup(526, 150, 0.14)}
  ${pot(600, 162, 0.5)}
  ${buddy(110, 160, 18, { wave: true })}${buddy(250, 162, 19, {})}${buddy(390, 160, 18, { shades: true })}
  <rect x="30" y="172" width="440" height="12" rx="4" fill="url(#hb-wood)"/>
  <rect x="44" y="184" width="10" height="36" fill="#9A6A3C"/><rect x="446" y="184" width="10" height="36" fill="#9A6A3C"/>
  <rect x="478" y="162" width="148" height="10" rx="4" fill="url(#hb-wood)"/><rect x="486" y="172" width="132" height="48" fill="#C99A62" opacity=".6"/>
  <path d="M170 172 L176 146 H226 L220 172 Z" fill="#5B5751"/><rect x="164" y="170" width="70" height="4" rx="2" fill="#4F4B46"/>${bean(198, 159, 3.5, 90, '#E4E1D4')}
  ${cup(320, 166, 0.11)}${cup(150, 166, 0.11)}
  ${sparkle(212, 40, 8)}${sparkle(420, 50, 6)}${bean(440, 110, 9, 30)}`);
