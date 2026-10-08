/* ============================================================
   SVG artwork — carried verbatim from the prototype.
   Rendered via dangerouslySetInnerHTML to preserve the exact
   illustrations (patterns, gradients) without hand-porting attrs.
   ============================================================ */

const DEFS = `<defs>
  <pattern id="speck" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r="1.4" fill="#2F1D10"/><circle cx="10" cy="9" r="1" fill="#2F1D10"/><circle cx="7" cy="12" r=".8" fill="#5A3A22"/></pattern>
  <pattern id="speckLight" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="4" cy="5" r="1.3" fill="#6B4A2E" opacity=".55"/><circle cx="12" cy="11" r="1" fill="#6B4A2E" opacity=".5"/></pattern>
</defs>`;

export const ART = {
  scrub: `<svg viewBox="0 0 200 270" role="img" aria-label="Jar of coffee scrub">${DEFS}
    <rect x="38" y="20" width="124" height="34" rx="8" fill="#2B1D14"/>
    <rect x="30" y="50" width="140" height="200" rx="26" fill="#EDE7DA"/>
    <rect x="30" y="50" width="140" height="200" rx="26" fill="url(#speckLight)"/>
    <rect x="40" y="110" width="120" height="132" rx="18" fill="#5A3A22"/><rect x="40" y="110" width="120" height="132" rx="18" fill="url(#speck)"/>
    <circle cx="100" cy="150" r="42" fill="#F4EFE4"/><circle cx="100" cy="150" r="42" fill="none" stroke="#6B4A2E" stroke-width="2"/>
    <text x="100" y="146" text-anchor="middle" font-family="Archivo,Arial" font-weight="900" font-size="15" fill="#6B4A2E">COFFEE</text>
    <text x="100" y="164" text-anchor="middle" font-family="Archivo,Arial" font-weight="900" font-size="15" fill="#6B4A2E">SCRUB</text>
    <text x="100" y="232" text-anchor="middle" font-family="Figtree,Arial" font-size="10" fill="#F4EFE4">200 g</text></svg>`,
  soap: `<svg viewBox="0 0 220 220" role="img" aria-label="Bar of coffee soap">${DEFS}
    <rect x="22" y="78" width="176" height="104" rx="22" fill="#4E321E"/>
    <path d="M22 100 Q22 60 62 60 L158 60 Q198 60 198 100 L198 120 L22 120 Z" fill="#6B4A2E"/>
    <rect x="22" y="60" width="176" height="122" rx="22" fill="url(#speck)" opacity=".8"/>
    <rect x="86" y="58" width="48" height="126" fill="#EDE7DA"/>
    <text x="110" y="112" text-anchor="middle" font-family="Archivo,Arial" font-weight="900" font-size="11" fill="#6B4A2E">COFFEE</text>
    <text x="110" y="128" text-anchor="middle" font-family="Archivo,Arial" font-weight="900" font-size="11" fill="#6B4A2E">SOAP</text></svg>`,
  candle: `<svg viewBox="0 0 200 280" role="img" aria-label="Coffee candle in a glass">${DEFS}
    <path d="M100 22 C 88 40, 92 54, 100 58 C 108 54, 112 40, 100 22 Z" fill="#E9A23B"/><path d="M100 34 C 95 44, 97 52, 100 54 C 103 52, 105 44, 100 34 Z" fill="#FFE2A6"/>
    <rect x="98.5" y="56" width="3" height="20" fill="#2B1D14"/>
    <rect x="34" y="72" width="132" height="190" rx="14" fill="#B98A5A" opacity=".55"/>
    <rect x="42" y="78" width="116" height="176" rx="10" fill="#EFE6D6"/>
    <rect x="42" y="78" width="116" height="40" rx="10" fill="#5A3A22"/><rect x="42" y="78" width="116" height="40" rx="10" fill="url(#speck)"/>
    <rect x="54" y="150" width="92" height="64" rx="6" fill="#2B1D14"/>
    <text x="100" y="178" text-anchor="middle" font-family="Archivo,Arial" font-weight="900" font-size="13" fill="#EFE6D6">COFFEE</text>
    <text x="100" y="196" text-anchor="middle" font-family="Archivo,Arial" font-weight="900" font-size="13" fill="#EFE6D6">CANDLE</text></svg>`,
  planter: `<svg viewBox="0 0 200 270" role="img" aria-label="Planter pot made from coffee grounds">${DEFS}
    <ellipse cx="78" cy="62" rx="20" ry="44" fill="#4C7A47" transform="rotate(-28 78 62)"/>
    <ellipse cx="124" cy="58" rx="20" ry="46" fill="#5E9157" transform="rotate(24 124 58)"/>
    <ellipse cx="100" cy="46" rx="16" ry="40" fill="#3E6B3A"/>
    <rect x="98" y="80" width="4" height="40" fill="#3E6B3A"/>
    <path d="M38 112 L162 112 L146 250 L54 250 Z" fill="#5A3A22"/><path d="M38 112 L162 112 L146 250 L54 250 Z" fill="url(#speck)"/>
    <rect x="30" y="104" width="140" height="24" rx="6" fill="#6B4A2E"/>
    <rect x="62" y="160" width="76" height="42" rx="21" fill="#EDE7DA"/>
    <text x="100" y="178" text-anchor="middle" font-family="Archivo,Arial" font-weight="900" font-size="11" fill="#6B4A2E">GROUNDS</text>
    <text x="100" y="193" text-anchor="middle" font-family="Archivo,Arial" font-weight="900" font-size="11" fill="#6B4A2E">POT</text></svg>`,
  compost: `<svg viewBox="0 0 200 270" role="img" aria-label="Compost bin">${DEFS}
    <path d="M44 96 L156 96 L146 250 L54 250 Z" fill="#4C7A47"/>
    <path d="M44 96 L156 96 L146 250 L54 250 Z" fill="url(#speckLight)" opacity=".4"/>
    <rect x="36" y="84" width="128" height="20" rx="6" fill="#3E6B3A"/>
    <ellipse cx="100" cy="150" rx="42" ry="18" fill="#5A3A22"/><ellipse cx="100" cy="150" rx="42" ry="18" fill="url(#speck)"/>
    <ellipse cx="82" cy="66" rx="14" ry="7" fill="#5E9157" transform="rotate(-25 82 66)"/>
    <ellipse cx="118" cy="62" rx="14" ry="7" fill="#5E9157" transform="rotate(25 118 62)"/>
    <rect x="98" y="60" width="4" height="30" fill="#3E6B3A"/></svg>`,
  seeds: `<svg viewBox="0 0 200 270" role="img" aria-label="Seedlings in a grounds mix">${DEFS}
    <path d="M40 150 L160 150 L150 250 L50 250 Z" fill="#5A3A22"/><path d="M40 150 L160 150 L150 250 L50 250 Z" fill="url(#speck)"/>
    <rect x="34" y="142" width="132" height="18" rx="5" fill="#6B4A2E"/>
    <path d="M70 150 C70 110 70 96 70 84" stroke="#3E6B3A" stroke-width="5"/><ellipse cx="58" cy="90" rx="13" ry="6" fill="#5E9157" transform="rotate(-25 58 90)"/><ellipse cx="82" cy="84" rx="13" ry="6" fill="#5E9157" transform="rotate(25 82 84)"/>
    <path d="M118 150 C118 104 118 88 118 72" stroke="#3E6B3A" stroke-width="5"/><ellipse cx="106" cy="78" rx="14" ry="7" fill="#5E9157" transform="rotate(-25 106 78)"/><ellipse cx="132" cy="70" rx="14" ry="7" fill="#5E9157" transform="rotate(25 132 70)"/></svg>`,
};

export const BEAN = `<svg viewBox="0 0 100 140" aria-hidden="true"><ellipse cx="50" cy="70" rx="44" ry="64" fill="#5A3A22"/><ellipse cx="38" cy="50" rx="14" ry="26" fill="#7A5434" opacity=".7"/><path d="M50 10 C 28 50, 72 92, 50 130" stroke="#2F1D10" stroke-width="7" fill="none" stroke-linecap="round"/></svg>`;

/* ---- polished artwork for the scroll journey (gradients + depth) ---- */
const JDEFS = `<defs>
  <linearGradient id="jg-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFDF7"/><stop offset="1" stop-color="#ECE5D7"/></linearGradient>
  <linearGradient id="jg-sleeve" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7C5636"/><stop offset="1" stop-color="#55361F"/></linearGradient>
  <linearGradient id="jg-lid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A2A1E"/><stop offset="1" stop-color="#20140C"/></linearGradient>
  <linearGradient id="jg-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F3EDE0"/><stop offset=".5" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E6DECE"/></linearGradient>
  <linearGradient id="jg-grounds" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E4C2F"/><stop offset="1" stop-color="#3C2616"/></linearGradient>
  <radialGradient id="jg-mound" cx=".42" cy=".3" r=".75"><stop offset="0" stop-color="#7E572F"/><stop offset="1" stop-color="#3A2416"/></radialGradient>
  <radialGradient id="jg-hi" cx=".4" cy=".3" r=".5"><stop offset="0" stop-color="#9A6A3C" stop-opacity=".85"/><stop offset="1" stop-color="#9A6A3C" stop-opacity="0"/></radialGradient>
  <pattern id="jg-speck" width="15" height="15" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r="1.3" fill="#2F1D10" opacity=".55"/><circle cx="10" cy="10" r="1" fill="#1F140C" opacity=".5"/><circle cx="7" cy="13" r=".7" fill="#5A3A22" opacity=".6"/></pattern>
</defs>`;

const miniBean = (x, y, r, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><ellipse cx="0" cy="0" rx="${r}" ry="${r * 1.4}" fill="#4E321E"/><path d="M0 ${-r * 1.4} C ${-r * 0.5} ${-r * 0.3}, ${r * 0.5} ${r * 0.3}, 0 ${r * 1.4}" stroke="#241610" stroke-width="${r * 0.4}" fill="none" stroke-linecap="round"/></g>`;

export const JCUP = `<svg viewBox="0 0 220 270" role="img" aria-label="Cup of CoffeeBot coffee">${JDEFS}
  <ellipse cx="110" cy="252" rx="70" ry="11" fill="#2F1D10" opacity=".16"/>
  <path d="M86 58 C 80 44, 92 40, 88 28" stroke="#C9BBA4" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M110 54 C 104 40, 116 36, 112 24" stroke="#C9BBA4" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/>
  <path d="M134 58 C 128 44, 140 40, 136 28" stroke="#C9BBA4" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M58 88 L162 88 L148 236 Q146 248 134 248 L86 248 Q74 248 72 236 Z" fill="url(#jg-body)" stroke="#E2DACA" stroke-width="2"/>
  <rect x="74" y="98" width="11" height="130" rx="5.5" fill="#FFFFFF" opacity=".5"/>
  <path d="M66 150 L154 150 L149 198 L71 198 Z" fill="url(#jg-sleeve)"/>
  <path d="M66 150 L154 150 L149 198 L71 198 Z" fill="url(#jg-speck)"/>
  <text x="110" y="179" text-anchor="middle" font-family="Archivo,Arial" font-weight="900" font-size="13" letter-spacing="-.3" fill="#F4EBDD">COFFEEBOT</text>
  <path d="M54 72 Q110 54 166 72 L166 90 L54 90 Z" fill="url(#jg-lid)"/>
  <rect x="98" y="62" width="24" height="8" rx="4" fill="#20140C"/></svg>`;

export const JPILE = `<svg viewBox="0 0 260 190" role="img" aria-label="Collected used coffee grounds">${JDEFS}
  <ellipse cx="130" cy="166" rx="116" ry="20" fill="#2F1D10" opacity=".16"/>
  <path d="M22 166 Q68 72 130 68 Q192 72 238 166 Z" fill="url(#jg-mound)"/>
  <path d="M22 166 Q68 72 130 68 Q192 72 238 166 Z" fill="url(#jg-speck)"/>
  <ellipse cx="104" cy="110" rx="50" ry="32" fill="url(#jg-hi)"/>
  ${miniBean(52, 158, 7, -30)}${miniBean(212, 156, 7, 35)}${miniBean(188, 168, 6, 10)}${miniBean(70, 170, 6, 60)}</svg>`;

export const JSCRUB = `<svg viewBox="0 0 200 276" role="img" aria-label="Jar of coffee body scrub">${JDEFS}
  <ellipse cx="100" cy="266" rx="62" ry="9" fill="#2F1D10" opacity=".16"/>
  <rect x="34" y="62" width="132" height="198" rx="28" fill="url(#jg-glass)" stroke="#E2DACA" stroke-width="2"/>
  <path d="M42 150 H158 V232 Q158 250 140 250 H60 Q42 250 42 232 Z" fill="url(#jg-grounds)"/>
  <path d="M42 150 H158 V232 Q158 250 140 250 H60 Q42 250 42 232 Z" fill="url(#jg-speck)"/>
  <circle cx="100" cy="150" r="41" fill="#F6F1E7"/><circle cx="100" cy="150" r="41" fill="none" stroke="#6B4A2E" stroke-width="2"/>
  <text x="100" y="146" text-anchor="middle" font-family="Archivo,Arial" font-weight="900" font-size="15" fill="#6B4A2E">COFFEE</text>
  <text x="100" y="164" text-anchor="middle" font-family="Archivo,Arial" font-weight="900" font-size="15" fill="#6B4A2E">SCRUB</text>
  <rect x="30" y="34" width="140" height="34" rx="12" fill="url(#jg-lid)"/>
  <rect x="44" y="28" width="112" height="10" rx="5" fill="#2A1C12"/>
  <rect x="48" y="78" width="13" height="150" rx="6.5" fill="#FFFFFF" opacity=".5"/></svg>`;

/* A takeaway cup of black coffee — opens Scene 1 of the scroll journey */
export const CUP = `<svg viewBox="0 0 200 240" role="img" aria-label="Cup of coffee">${DEFS}
  <path d="M46 92 L154 92 L140 224 Q138 234 128 234 L72 234 Q62 234 60 224 Z" fill="#FAF9F4" stroke="#2B1D14" stroke-width="4"/>
  <rect x="38" y="78" width="124" height="22" rx="8" fill="#2B1D14"/>
  <ellipse cx="100" cy="90" rx="52" ry="12" fill="#3A2416"/>
  <ellipse cx="100" cy="88" rx="44" ry="9" fill="#5A3A22"/><ellipse cx="100" cy="88" rx="44" ry="9" fill="url(#speck)"/>
  <path d="M84 64 C 78 52, 92 46, 86 34" stroke="#C9BBA4" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M112 62 C 106 50, 120 44, 114 32" stroke="#C9BBA4" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>
  <rect x="62" y="152" width="76" height="34" rx="6" fill="#E5E3D6"/>
  <text x="100" y="174" text-anchor="middle" font-family="Archivo,Arial" font-weight="900" font-size="10" letter-spacing="-.2" fill="#6B4A2E">COFFEEBOT</text></svg>`;

/* A mound of collected used grounds — Scene 2 */
export const PILE = `<svg viewBox="0 0 240 180" role="img" aria-label="Pile of used coffee grounds">${DEFS}
  <ellipse cx="120" cy="150" rx="104" ry="24" fill="#2F1D10" opacity=".25"/>
  <path d="M26 150 Q60 70 120 64 Q180 70 214 150 Z" fill="#5A3A22"/>
  <path d="M26 150 Q60 70 120 64 Q180 70 214 150 Z" fill="url(#speck)"/>
  <path d="M60 150 Q90 104 120 100 Q150 104 180 150 Z" fill="#4E321E" opacity=".7"/></svg>`;

export const LOGO = `<svg viewBox="0 0 30 34" aria-hidden="true"><rect x="13" y="0" width="4" height="5" rx="2" fill="#2B1D14"/><rect x="3" y="5" width="24" height="18" rx="9" fill="#2B1D14"/><circle cx="11" cy="14" r="2.6" fill="#FFF"/><circle cx="19" cy="14" r="2.6" fill="#FFF"/><rect x="6" y="22" width="18" height="12" rx="3" fill="#6B4A2E"/><rect x="11" y="25" width="8" height="6" rx="1.5" fill="#E5E3D6"/></svg>`;

export const STORY_PICS = {
  compost: `<svg viewBox="0 0 240 180" aria-hidden="true"><rect width="240" height="180" fill="#DCE6D3"/><rect y="128" width="240" height="52" fill="#8A6A4A"/>
    <rect x="34" y="70" width="80" height="70" rx="6" fill="#4C7A47"/><rect x="30" y="62" width="88" height="14" rx="4" fill="#3E6B3A"/><rect x="50" y="92" width="48" height="10" rx="3" fill="#2F5A2C"/>
    <path d="M150 128 C150 100 150 90 150 80" stroke="#3E6B3A" stroke-width="4"/><ellipse cx="138" cy="86" rx="12" ry="6" fill="#5E9157" transform="rotate(-25 138 86)"/><ellipse cx="162" cy="80" rx="12" ry="6" fill="#5E9157" transform="rotate(25 162 80)"/>
    <path d="M190 128 C190 106 190 100 190 94" stroke="#3E6B3A" stroke-width="3"/><ellipse cx="182" cy="98" rx="9" ry="4.5" fill="#5E9157" transform="rotate(-25 182 98)"/><ellipse cx="198" cy="94" rx="9" ry="4.5" fill="#5E9157" transform="rotate(25 198 94)"/>
    <ellipse cx="120" cy="146" rx="60" ry="10" fill="#5A3A22"/></svg>`,
  fungi: `<svg viewBox="0 0 240 180" aria-hidden="true"><rect width="240" height="180" fill="#E7DED0"/><rect y="138" width="240" height="42" fill="#C9BBA4"/>
    ${[40, 110, 180].map(x => `<rect x="${x - 24}" y="66" width="48" height="76" rx="10" fill="#F4EFE4" stroke="#D3CFBF"/><rect x="${x - 24}" y="96" width="48" height="46" rx="8" fill="#5A3A22" opacity=".85"/>
    <ellipse cx="${x - 12}" cy="72" rx="14" ry="8" fill="#EDE2CC"/><ellipse cx="${x + 10}" cy="64" rx="16" ry="9" fill="#F6EEDC"/><rect x="${x - 14}" y="72" width="4" height="10" fill="#EDE2CC"/><rect x="${x + 8}" y="64" width="4" height="12" fill="#F6EEDC"/>`).join('')}</svg>`,
  soap: `<svg viewBox="0 0 240 180" aria-hidden="true"><rect width="240" height="180" fill="#F2E3C4"/><rect x="0" y="100" width="240" height="10" fill="#9A6414"/><rect x="0" y="152" width="240" height="10" fill="#9A6414"/>
    ${[30, 80, 130, 180].map(x => `<rect x="${x}" y="70" width="38" height="30" rx="6" fill="#5A3A22"/><rect x="${x + 13}" y="70" width="12" height="30" fill="#EDE7DA"/>`).join('')}
    ${[40, 95, 150].map(x => `<rect x="${x}" y="114" width="34" height="38" rx="6" fill="#EDE7DA"/><rect x="${x + 4}" y="128" width="26" height="20" rx="4" fill="#6B4A2E"/><rect x="${x + 2}" y="108" width="30" height="8" rx="3" fill="#2B1D14"/>`).join('')}</svg>`,
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
