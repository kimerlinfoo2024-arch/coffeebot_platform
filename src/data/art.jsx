/* ============================================================
   SVG artwork: carried verbatim from the prototype.
   Rendered via dangerouslySetInnerHTML to preserve the exact
   illustrations (patterns, gradients) without hand-porting attrs.
   ============================================================ */

const DEFS = `<defs>
  <pattern id="speck" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r="1.4" fill="#33241A"/><circle cx="10" cy="9" r="1" fill="#33241A"/><circle cx="7" cy="12" r=".8" fill="#4E3628"/></pattern>
  <pattern id="speckLight" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="4" cy="5" r="1.3" fill="#624635" opacity=".55"/><circle cx="12" cy="11" r="1" fill="#624635" opacity=".5"/></pattern>
</defs>`;

export const ART = {
  scrub: `<svg viewBox="0 0 200 270" role="img" aria-label="Jar of coffee scrub">${DEFS}
    <rect x="38" y="20" width="124" height="34" rx="8" fill="#33241A"/>
    <rect x="30" y="50" width="140" height="200" rx="26" fill="#ECE6D6"/>
    <rect x="30" y="50" width="140" height="200" rx="26" fill="url(#speckLight)"/>
    <rect x="40" y="110" width="120" height="132" rx="18" fill="#4E3628"/><rect x="40" y="110" width="120" height="132" rx="18" fill="url(#speck)"/>
    <circle cx="100" cy="150" r="42" fill="#F4EFE3"/><circle cx="100" cy="150" r="42" fill="none" stroke="#624635" stroke-width="2"/>
    <text x="100" y="146" text-anchor="middle" font-family="Poppins,Arial" font-weight="800" font-size="15" fill="#624635">COFFEE</text>
    <text x="100" y="164" text-anchor="middle" font-family="Poppins,Arial" font-weight="800" font-size="15" fill="#624635">SCRUB</text>
    <text x="100" y="232" text-anchor="middle" font-family="Barlow,Arial" font-size="10" fill="#F4EFE3">200 g</text></svg>`,
  soap: `<svg viewBox="0 0 220 220" role="img" aria-label="Bar of coffee soap">${DEFS}
    <rect x="22" y="78" width="176" height="104" rx="22" fill="#4E3628"/>
    <path d="M22 100 Q22 60 62 60 L158 60 Q198 60 198 100 L198 120 L22 120 Z" fill="#624635"/>
    <rect x="22" y="60" width="176" height="122" rx="22" fill="url(#speck)" opacity=".8"/>
    <rect x="86" y="58" width="48" height="126" fill="#ECE6D6"/>
    <text x="110" y="112" text-anchor="middle" font-family="Poppins,Arial" font-weight="800" font-size="11" fill="#624635">COFFEE</text>
    <text x="110" y="128" text-anchor="middle" font-family="Poppins,Arial" font-weight="800" font-size="11" fill="#624635">SOAP</text></svg>`,
  candle: `<svg viewBox="0 0 200 280" role="img" aria-label="Coffee candle in a glass">${DEFS}
    <path d="M100 22 C 88 40, 92 54, 100 58 C 108 54, 112 40, 100 22 Z" fill="#B8946E"/><path d="M100 34 C 95 44, 97 52, 100 54 C 103 52, 105 44, 100 34 Z" fill="#E0D0B9"/>
    <rect x="98.5" y="56" width="3" height="20" fill="#33241A"/>
    <rect x="34" y="72" width="132" height="190" rx="14" fill="#B8946E" opacity=".55"/>
    <rect x="42" y="78" width="116" height="176" rx="10" fill="#ECE6D6"/>
    <rect x="42" y="78" width="116" height="40" rx="10" fill="#4E3628"/><rect x="42" y="78" width="116" height="40" rx="10" fill="url(#speck)"/>
    <rect x="54" y="150" width="92" height="64" rx="6" fill="#33241A"/>
    <text x="100" y="178" text-anchor="middle" font-family="Poppins,Arial" font-weight="800" font-size="13" fill="#ECE6D6">COFFEE</text>
    <text x="100" y="196" text-anchor="middle" font-family="Poppins,Arial" font-weight="800" font-size="13" fill="#ECE6D6">CANDLE</text></svg>`,
  planter: `<svg viewBox="0 0 200 270" role="img" aria-label="Planter pot made from coffee grounds">${DEFS}
    <ellipse cx="78" cy="62" rx="20" ry="44" fill="#8C6E5A" transform="rotate(-28 78 62)"/>
    <ellipse cx="124" cy="58" rx="20" ry="46" fill="#B8946E" transform="rotate(24 124 58)"/>
    <ellipse cx="100" cy="46" rx="16" ry="40" fill="#8A6440"/>
    <rect x="98" y="80" width="4" height="40" fill="#8A6440"/>
    <path d="M38 112 L162 112 L146 250 L54 250 Z" fill="#4E3628"/><path d="M38 112 L162 112 L146 250 L54 250 Z" fill="url(#speck)"/>
    <rect x="30" y="104" width="140" height="24" rx="6" fill="#624635"/>
    <rect x="62" y="160" width="76" height="42" rx="21" fill="#ECE6D6"/>
    <text x="100" y="178" text-anchor="middle" font-family="Poppins,Arial" font-weight="800" font-size="11" fill="#624635">GROUNDS</text>
    <text x="100" y="193" text-anchor="middle" font-family="Poppins,Arial" font-weight="800" font-size="11" fill="#624635">POT</text></svg>`,
  compost: `<svg viewBox="0 0 200 270" role="img" aria-label="Compost bin">${DEFS}
    <path d="M44 96 L156 96 L146 250 L54 250 Z" fill="#8C6E5A"/>
    <path d="M44 96 L156 96 L146 250 L54 250 Z" fill="url(#speckLight)" opacity=".4"/>
    <rect x="36" y="84" width="128" height="20" rx="6" fill="#8A6440"/>
    <ellipse cx="100" cy="150" rx="42" ry="18" fill="#4E3628"/><ellipse cx="100" cy="150" rx="42" ry="18" fill="url(#speck)"/>
    <ellipse cx="82" cy="66" rx="14" ry="7" fill="#B8946E" transform="rotate(-25 82 66)"/>
    <ellipse cx="118" cy="62" rx="14" ry="7" fill="#B8946E" transform="rotate(25 118 62)"/>
    <rect x="98" y="60" width="4" height="30" fill="#8A6440"/></svg>`,
  seeds: `<svg viewBox="0 0 200 270" role="img" aria-label="Seedlings in a grounds mix">${DEFS}
    <path d="M40 150 L160 150 L150 250 L50 250 Z" fill="#4E3628"/><path d="M40 150 L160 150 L150 250 L50 250 Z" fill="url(#speck)"/>
    <rect x="34" y="142" width="132" height="18" rx="5" fill="#624635"/>
    <path d="M70 150 C70 110 70 96 70 84" stroke="#8A6440" stroke-width="5"/><ellipse cx="58" cy="90" rx="13" ry="6" fill="#B8946E" transform="rotate(-25 58 90)"/><ellipse cx="82" cy="84" rx="13" ry="6" fill="#B8946E" transform="rotate(25 82 84)"/>
    <path d="M118 150 C118 104 118 88 118 72" stroke="#8A6440" stroke-width="5"/><ellipse cx="106" cy="78" rx="14" ry="7" fill="#B8946E" transform="rotate(-25 106 78)"/><ellipse cx="132" cy="70" rx="14" ry="7" fill="#B8946E" transform="rotate(25 132 70)"/></svg>`,
};

/* coffee bean decoration (homepage, ticker strip, About carousel): the illustrated
   bean in /public/art, wrapped in an <svg> so the existing size rules keep working */
export const BEAN = `<svg viewBox="0 0 580 600" aria-hidden="true"><image href="/art/bean.webp" width="580" height="600"/></svg>`;

export const LOGO = `<svg viewBox="0 0 30 34" aria-hidden="true"><rect x="13" y="0" width="4" height="5" rx="2" fill="#33241A"/><rect x="3" y="5" width="24" height="18" rx="9" fill="#33241A"/><circle cx="11" cy="14" r="2.6" fill="#FFFFFF"/><circle cx="19" cy="14" r="2.6" fill="#FFFFFF"/><rect x="6" y="22" width="18" height="12" rx="3" fill="#624635"/><rect x="11" y="25" width="8" height="6" rx="1.5" fill="#ECE6D6"/></svg>`;

/* a picture in a 4:3 frame on cream: `slice` fills the frame (scenes),
   `meet` keeps the whole object with a margin (single objects) */
const framed = (src, fit = 'meet', pad = 0) => `<svg viewBox="0 0 240 180" aria-hidden="true">
  <rect width="240" height="180" fill="#F4EFE3"/>
  <image href="${src}" x="${pad}" y="${pad}" width="${240 - 2 * pad}" height="${180 - 2 * pad}" preserveAspectRatio="xMidYMid ${fit}"/></svg>`;

/* Partner page: the hero picture and the stamp on each partner's letter */
export const STORY_PICS = {
  compost: framed('/art/partner-hero.webp', 'slice'),
  fungi: framed('/art/mushrooms.webp', 'meet', 14),
  soap: framed('/products/soap.webp', 'meet', 14),
};

/* Render helper: <Svg markup={ART.scrub} className="product" />
   The 'svgbox' class forces the inner <svg> to a definite size so it can't
   enter an intrinsic-size feedback loop inside auto-sized grid/flex cells. */
export function Svg({ markup, className, style }) {
  return (
    <span
      className={['svgbox', className].filter(Boolean).join(' ')}
      style={style}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
