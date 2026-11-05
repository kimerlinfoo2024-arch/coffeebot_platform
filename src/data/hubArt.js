/* ============================================================
   Education Hub artwork, in the same illustrated style as the homepage
   icons. Whole scenes are images in /public/art; the top banner and the
   line-or-loop diagrams are laid out here from single pieces (cup, pile,
   bean, mascots, plant, bin, landfill, pot). Strings are rendered with <Svg markup>.
   ============================================================ */

import { ICONS } from './icons';

const DEFS = `<defs>
  <linearGradient id="hb-bean" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8A6440"/><stop offset="1" stop-color="#4E3628"/></linearGradient>
  <linearGradient id="hb-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4EFE3"/><stop offset="1" stop-color="#ECE6D6"/></linearGradient>
  <linearGradient id="hb-hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ECE6D6"/><stop offset="1" stop-color="#ECE6D6"/></linearGradient>
  <linearGradient id="hb-hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8946E"/><stop offset="1" stop-color="#8C6E5A"/></linearGradient>
  <linearGradient id="hb-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FA9CF"/><stop offset="1" stop-color="#3F6D96"/></linearGradient>
  <linearGradient id="hb-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D3BFA2"/><stop offset="1" stop-color="#B8946E"/></linearGradient>
  <radialGradient id="hb-cherry" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#B8946E"/><stop offset="1" stop-color="#8E4A35"/></radialGradient>
  <linearGradient id="hb-metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8946E"/><stop offset="1" stop-color="#624635"/></linearGradient>
  <linearGradient id="hb-leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B8946E"/><stop offset="1" stop-color="#8A6440"/></linearGradient>
  <linearGradient id="hb-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8946E"/><stop offset="1" stop-color="#8A6440"/></linearGradient>
  <pattern id="hb-speck" width="15" height="15" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r="1.3" fill="#33241A" opacity=".55"/><circle cx="10" cy="10" r="1" fill="#33241A" opacity=".5"/><circle cx="7" cy="13" r=".7" fill="#4E3628" opacity=".6"/></pattern>
  <marker id="hb-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#624635"/></marker>
</defs>`;

const svg = (vb, label, body) =>
  `<svg viewBox="${vb}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${DEFS}${body}</svg>`;


/* ---------- illustrated pieces and scenes (public/art) ---------- */

/* pixel size of each file in /public/art, so pieces keep their shape.
   If a file is replaced with one of a different shape, update its size here. */
const ART_SIZE = {
  bean: [580, 600], 'bean-happy': [583, 600], 'bean-sad': [494, 600], 'bean-cheer': [573, 600],
  'coffee-plant': [425, 600], sprout: [600, 569], bin: [567, 600], landfill: [600, 391], 'pot-sprout': [531, 600],
  'pillar-planet': [800, 533], 'pillar-people': [800, 533], 'pillar-pockets': [800, 533],
  'stage-growing': [800, 500], 'stage-picking': [800, 500], 'stage-processing': [800, 500], 'stage-transport': [800, 500],
  'stage-roasting': [800, 500], 'stage-brewing': [800, 500], 'stage-after': [800, 500],
  classroom: [1920, 660], office: [1920, 660],
};
const artSrc = (name) => `/art/${name}.webp`;

/** a piece standing on the point (cx, base), `h` units tall, optionally tilted */
const pic = (name, cx, base, h, rot = 0) => {
  const [w0, h0] = ART_SIZE[name];
  const w = h * w0 / h0;
  const turn = rot ? ` transform="rotate(${rot} ${cx} ${base - h / 2})"` : '';
  return `<image href="${artSrc(name)}" x="${cx - w / 2}" y="${base - h}" width="${w}" height="${h}"${turn}/>`;
};

/** a whole scene: one image filling its own frame */
const scene = (name, label) => {
  const [w, h] = ART_SIZE[name];
  return svg(`0 0 ${w} ${h}`, label, `<image href="${artSrc(name)}" width="${w}" height="${h}"/>`);
};

/* ---------- building blocks ---------- */

/** plain coffee bean, centred on (x, y), about 2.8r tall */
const bean = (x, y, r, rot = 0) => pic('bean', x, y + r * 1.4, r * 2.8, rot);

/** the bean mascot, body centred on (x, y): waving, sad, or cheering */
const buddy = (x, y, r, { rot = 0, mood = 'happy', wave = false } = {}) =>
  pic(mood === 'sad' ? 'bean-sad' : wave ? 'bean-happy' : 'bean-cheer', x, y + r * 1.72, r * 3.4, rot);

/** CoffeeBot takeaway cup, centred on (x, y): the same illustrated cup as the homepage
    (public/icons/cup.png), filling the 236-unit-tall box the old drawn cup used (steam to shadow). */
const CUP_H = 236, CUP_W = Math.round(CUP_H * ICONS.cup.w / ICONS.cup.h);
const cup = (x, y, s) => `<g transform="translate(${x - 110 * s} ${y - 150 * s}) scale(${s})">
  <image href="${ICONS.cup.src}" x="${110 - CUP_W / 2}" y="24" width="${CUP_W}" height="${CUP_H}" preserveAspectRatio="xMidYMid meet"/></g>`;

/** mound of used grounds, centred on (x, y): the same illustrated pile as the homepage
    (public/icons/grounds.png), as wide as the old drawn mound and resting on its base line,
    so anything placed on top (sprouts) still lines up. */
const PILE_W = 232, PILE_H = Math.round(PILE_W * ICONS.grounds.h / ICONS.grounds.w);
const pile = (x, y, s) => `<g transform="translate(${x - 130 * s} ${y - 120 * s}) scale(${s})">
  <image href="${ICONS.grounds.src}" x="${130 - PILE_W / 2}" y="${186 - PILE_H}" width="${PILE_W}" height="${PILE_H}" preserveAspectRatio="xMidYMax meet"/></g>`;

/** coffee plant with ripe cherries; base at (x, y) */
const plant = (x, y, s = 1) => pic('coffee-plant', x, y + 6 * s, 150 * s);

/** plant pot with a sprout; base centre (x, y) */
const pot = (x, y, s = 1) => pic('pot-sprout', x, y + 6 * s, 108 * s);

/** general-waste bin, centred on (x, y) */
const bin = (x, y) => pic('bin', x, y + 48, 92);

const sparkle = (x, y, s) => `<path transform="translate(${x} ${y})" d="M0 ${-s} L${s * 0.28} ${-s * 0.28} L${s} 0 L${s * 0.28} ${s * 0.28} L0 ${s} L${-s * 0.28} ${s * 0.28} L${-s} 0 L${-s * 0.28} ${-s * 0.28} Z" fill="#B8946E"/>`;

/** small pointing triangle, used as an arrowhead on loops */
const tip = (x, y, rot, fill = '#624635') => `<path d="M-8 -7 L8 0 L-8 7 Z" transform="translate(${x} ${y}) rotate(${rot})" fill="${fill}"/>`;

const frame = (w, h, fill = 'url(#hb-sky)') => `<rect width="${w}" height="${h}" rx="18" fill="${fill}"/>`;

/* ============================================================
   Scenes
   ============================================================ */

export const HUB_HERO = svg('0 0 1000 300', 'Coffee beans growing, brewed into a CoffeeBot cup, and the grounds feeding a new plant', `
  <clipPath id="hb-heroclip"><rect width="1000" height="300" rx="24"/></clipPath>
  <g clip-path="url(#hb-heroclip)">
    <rect width="1000" height="300" fill="url(#hb-hero)"/>
    <text x="500" y="222" text-anchor="middle" font-family="Poppins,Arial" font-weight="800" font-size="200" letter-spacing="-8" fill="#33241A" opacity=".06">GROUNDS UP</text>
    <ellipse cx="500" cy="160" rx="330" ry="108" fill="none" stroke="#624635" stroke-width="3.5" stroke-dasharray="2 13" stroke-linecap="round" opacity=".45"/>
    ${tip(500, 52, 0)}${tip(500, 268, 180)}
    ${plant(170, 228, 0.95)}
    ${pic('sprout', 830, 226, 104)}
    ${cup(500, 158, 0.9)}
    ${buddy(320, 214, 26, { wave: true })}
    ${buddy(700, 222, 21, { rot: 6 })}
    ${bean(80, 62, 15, -25)}${bean(935, 74, 13, 40)}${bean(400, 38, 8, 20)}${bean(620, 280, 9, -40)}${bean(950, 262, 14, 30)}${bean(52, 250, 10, 70)}
    ${sparkle(250, 86, 10)}${sparkle(760, 68, 8)}${sparkle(590, 46, 6)}${sparkle(392, 274, 7)}
  </g>`);

/* ---- sustainability pillars ---- */
export const PILLAR_ART = {
  env: scene('pillar-planet', 'A smiling Earth with a sprout on top, the sun and a waving bean'),
  soc: scene('pillar-people', 'Three bean friends holding hands under a heart'),
  eco: scene('pillar-pockets', 'Stacks of coins growing taller, with a sprout on the tallest and a happy bean'),
};

/* ---- linear vs circular ---- */
export const MODEL_ART = {
  linear: svg('0 0 640 200', 'Linear economy: cup, then grounds, then the bin, then landfill, with a sad bean', `
    ${frame(640, 200, '#F4EFE3')}
    ${cup(86, 104, 0.5)}
    ${pile(240, 116, 0.42)}
    ${bin(400, 104)}
    ${pic('landfill', 545, 166, 72)}
    ${buddy(550, 92, 16, { mood: 'sad' })}
    ${[[128, 186], [290, 344], [446, 494]].map(([a, b]) => `<path d="M${a} 112 H ${b}" stroke="#624635" stroke-width="3" stroke-dasharray="6 7" stroke-linecap="round" marker-end="url(#hb-arrow)"/>`).join('')}`),
  circular: svg('0 0 640 230', 'Circular economy: cup, grounds, planter and coffee plant joined in a loop around a happy bean', `
    ${frame(640, 230, '#ECE6D6')}
    <ellipse cx="320" cy="115" rx="240" ry="80" fill="none" stroke="#8C6E5A" stroke-width="4" stroke-dasharray="3 12" stroke-linecap="round"/>
    ${tip(150, 58, -18.5, '#8C6E5A')}${tip(490, 58, 18.5, '#8C6E5A')}${tip(490, 172, 161.5, '#8C6E5A')}${tip(150, 172, -161.5, '#8C6E5A')}
    ${cup(80, 112, 0.42)}
    ${pile(320, 46, 0.36)}
    ${pot(560, 150, 0.8)}
    ${plant(320, 220, 0.42)}
    ${buddy(320, 102, 22, { wave: true })}
    ${sparkle(266, 86, 8)}${sparkle(378, 128, 7)}${sparkle(372, 70, 5)}`),
};

/* ---- life of a coffee bean: one scene per stage, same order as LIFECYCLE ---- */
export const STAGE_ART = [
  scene('stage-growing', 'Coffee plants with red cherries growing on a sunny hillside'),
  scene('stage-picking', 'A woven basket full of ripe coffee cherries'),
  scene('stage-processing', 'Coffee beans drying in the sun on a raised bed'),
  scene('stage-transport', 'A cargo ship carrying sacks of coffee across the sea'),
  scene('stage-roasting', 'A roasting drum turning green beans brown over a flame'),
  scene('stage-brewing', 'The CoffeeBot machine pouring coffee into a cup'),
  scene('stage-after', 'Used grounds growing a new plant, with two happy beans celebrating'),
];

/* ---- teacher tab: a classroom of beans ---- */
export const CLASSROOM = scene('classroom', 'A class of bean students at their desks in front of a chalkboard');

/* ---- workplace tab: a team of beans in the office ---- */
export const OFFICE = scene('office', 'A team of bean coworkers at a desk next to the CoffeeBot machine');
