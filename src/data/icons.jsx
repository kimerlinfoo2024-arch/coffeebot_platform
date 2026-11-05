import { useState } from 'react';
import { ART, Svg } from './art';

/* Illustrated icons (PNG, transparent background) from "coffeebot icons.zip",
   cropped, with the red parts recoloured to CoffeeBot orange (#DC4700,
   owner's choice). Files live in /public/icons. */
export const ICONS = {
  cup:     { src: '/icons/cup.png',     alt: 'Cup of CoffeeBot coffee', w: 270, h: 373 },
  grounds: { src: '/icons/grounds.png', alt: 'Collected used coffee grounds', w: 393, h: 263 },
  scrub:   { src: '/icons/scrub.png',   alt: 'Jar of CoffeeBot coffee body scrub', w: 376, h: 330 },
};

/* Product drawings (transparent WebP, same illustrated style) in /public/products,
   one per course / product. Used by the About carousel, the Courses page and the cart.
   A course without a drawing yet falls back to its older flat SVG (see ProductArt). */
export const PRODUCT_IMG = {
  scrub: '/products/scrub.webp',
  soap: '/products/soap.webp',
  candle: '/products/candle.webp',
  planter: '/products/planter.webp',
  compost: '/products/compost.webp',
  seeds: '/products/seeds.webp',  // not supplied yet: the flat SVG shows until the file is added
};

/** a product's drawing, or the flat SVG fallback (ART) if there's no drawing or it fails to load */
export function ProductArt({ k, alt = '' }) {
  const [missing, setMissing] = useState(!PRODUCT_IMG[k]);
  if (missing) return <Svg markup={ART[k]} />;
  return <img className="product-img" src={PRODUCT_IMG[k]} alt={alt} decoding="async" loading="lazy" onError={() => setMissing(true)} />;
}

/** an icon as an <img>, with its size set so the layout doesn't jump while it loads */
export function IconImg({ name, className, alt }) {
  const i = ICONS[name];
  return <img className={className} src={i.src} alt={alt ?? i.alt} width={i.w} height={i.h} decoding="async" />;
}
