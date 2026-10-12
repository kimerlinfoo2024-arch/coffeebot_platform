/* ============================================================
   Course pricing and audience framing.

   !! PLACEHOLDER PRICES !!
   The amounts below are stand-ins so the cart can be built and
   tested. They are not CoffeeBot's real prices. Replace them,
   then set PRICES_ARE_PLACEHOLDERS to false to remove the notice
   shown on the Courses and Cart pages.
   ============================================================ */
export const PRICES_ARE_PLACEHOLDERS = true;
export const CURRENCY = 'S$';

/** one price per course; a course is bought once per organisation */
export const COURSE_PRICES = {
  scrub: 120,
  soap: 120,
  candle: 120,
  planter: 150,
  compost: 90,
  seeds: 90,
};

export const money = (n) => `${CURRENCY}${Number(n).toFixed(2)}`;

/** what a purchase unlocks in this platform today */
export const PURCHASE_INCLUDES = ['Downloadable lesson plan', 'Session booking, with the grounds prepared for your group'];

/** how each course is framed for the two audiences (existing course facts live in data/seed.js) */
export const COURSE_FIT = {
  teacher: {
    audience: 'Teachers running a class session',
    scrub:   'A hands-on way into the circular economy: students turn a waste stream into something usable.',
    soap:    'Introduces the product life-cycle, which students map for the bar they make.',
    candle:  'Students explore upcycling by working out how much value they added.',
    planter: 'Links nutrient cycles to something students can plant and watch grow.',
    compost: 'A six-week observation project on decomposition for science or CCA groups.',
    seeds:   'A simple fair-test experiment on soil health with a control tray.',
  },
  corporate: {
    audience: 'Workplace teams and sustainability committees',
    scrub:   'A team session that shows circular thinking using waste from your own pantry.',
    soap:    'Uses one product to talk through life-cycle thinking in purchasing and operations.',
    candle:  'A practical look at upcycling and adding value to a by-product.',
    planter: 'Closes the loop visibly: pantry grounds become planters for the office.',
    compost: 'Sets up an ongoing office compost bin as a waste-reduction habit.',
    seeds:   'A low-effort green activity that keeps sustainability visible at desks.',
  },
};
