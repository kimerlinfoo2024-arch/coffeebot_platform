/* ============================================================
   CoffeeBot Education Hub — learning content.
   Shared concepts first; anything keyed by `teacher` / `corporate`
   is the audience-specific version, picked from the account role.
   Deliberately free of statistics: nothing here is a measured claim.
   ============================================================ */

export const AUDIENCE = {
  teacher: {
    eyebrow: 'Education Hub · for teachers',
    title: 'Teach sustainability through a cup of coffee',
    intro: 'Three short topics with classroom-ready explanations, plus activities, discussion questions and resources you can use to lead a lesson.',
    tab: 'For your classroom',
  },
  corporate: {
    eyebrow: 'Education Hub · for workplaces',
    title: 'Sustainability at work, starting at the pantry',
    intro: 'Three short topics explained through the coffee your team already drinks, plus scenarios and practical steps for your organisation.',
    tab: 'For your workplace',
  },
};

/* ---------- A. Introduction to sustainability ---------- */
export const SUSTAINABILITY = {
  definition: 'Sustainability means meeting our needs today without making it harder for people in the future to meet theirs.',
  detail: 'It is not only about the environment. A choice is sustainable when it works for the planet, for people and for the economy at the same time — if one of the three is ignored, the other two eventually suffer.',
  pillars: [
    { k: 'env', icon: 'leaf', name: 'Environmental', accent: 'leaf',
      what: 'Using natural resources — water, land, energy, materials — at a rate nature can keep up with, and keeping pollution and waste low.',
      coffee: 'Coffee needs land, water and energy long before it reaches a cup. What happens to the used grounds afterwards is part of the same picture.' },
    { k: 'soc', icon: 'users', name: 'Social', accent: 'teal',
      what: 'Treating people fairly: safe work, fair pay, healthy communities and access to education.',
      coffee: 'Coffee is grown and picked by farming communities. How they are paid and treated is as much a sustainability question as the farming itself.' },
    { k: 'eco', icon: 'recycle', name: 'Economic', accent: 'amber',
      what: 'Running households, schools and businesses in a way that can last, without relying on waste or on costs pushed onto someone else.',
      coffee: 'Throwing grounds away costs money to collect and dispose of. Finding a use for them can turn a disposal cost into something of value.' },
  ],
  why: [
    ['Resources are limited', 'Water, land and energy are shared. Using them carelessly in one place leaves less for somewhere, or someone, else.'],
    ['Small habits add up', 'One cup makes a small amount of waste. A school or office drinking coffee every day makes a steady stream of it.'],
    ['Choices are connected', 'What we buy, how we use it and where it ends up are one chain. Changing any link changes the result.'],
  ],
  apply: {
    teacher: [
      'Start from something students can see: ask where the coffee grounds from the staff room go.',
      'Use the three pillars as a checklist when students judge an idea — is it good for the planet, people and cost?',
      'Run a one-day waste check in class and sort what was thrown away into avoid, reuse and recycle.',
      'Let students propose one change for the school and explain which pillar it helps most.',
    ],
    corporate: [
      'Look at one routine first — the pantry is a good start — and list what comes in and what is thrown out.',
      'Weigh decisions against all three pillars, not only cost: environmental effect, effect on people, long-term value.',
      'Put reusable cups and a separate grounds container where the coffee is made, so the easy choice is the better one.',
      'Share what changed with colleagues. Awareness grows when people can see a result.',
    ],
  },
};

/* ---------- B. Circular economy ---------- */
export const CIRCULAR = {
  definition: 'A circular economy keeps materials in use for as long as possible, instead of using them once and throwing them away.',
  models: {
    linear: {
      label: 'Linear', steps: ['Take', 'Make', 'Use', 'Dispose'],
      text: 'The traditional model. Resources are taken, made into products, used, then thrown away. Every new product needs new resources, and everything ends as waste.',
      coffee: 'Coffee is brewed, the grounds go in the bin, and the story ends there.',
    },
    circular: {
      label: 'Circular', steps: ['Take less', 'Make', 'Use', 'Collect', 'Reuse'],
      text: 'Products and materials are designed to be used again. What is left over from one process becomes an input for another, so less new material is needed and less is wasted.',
      coffee: 'Coffee is brewed, the grounds are collected, and they become an ingredient or input for something else.',
    },
  },
  principles: [
    { name: 'Reduce', icon: 'trash', text: 'The best waste is the waste that is never created. Use only what is needed.', coffee: 'Brew what will be drunk, and skip the single-use cup.' },
    { name: 'Reuse', icon: 'recycle', text: 'Use a product or material again, for the same purpose or a new one.', coffee: 'Used grounds can be an ingredient in a scrub or soap, or go into compost.' },
    { name: 'Recycle', icon: 'bolt', text: 'Break a material down so it can be made into something new.', coffee: 'Clean paper cups, lids and packaging go into the right recycling stream where one exists.' },
    { name: 'Extend life', icon: 'award', text: 'Repair, maintain and share things so they stay useful for longer.', coffee: 'A coffee machine that is cleaned and serviced lasts longer than one that is replaced.' },
  ],
  grounds: [
    ['Compost', 'Grounds can be added to compost as one part of a balanced mix with drier materials such as leaves or cardboard.'],
    ['Growing mushrooms', 'Some growers use fresh grounds as part of the material that oyster mushrooms grow on.'],
    ['Personal-care products', 'Dried grounds can be the exfoliating ingredient in a scrub or soap, combined with oils or a soap base.'],
    ['Crafts and planters', 'Mixed with a binder, grounds can be moulded into pots, or used as a decorative layer in a candle.'],
  ],
  groundsNote: 'In every case the grounds are one ingredient, not the whole product, and they need to be clean and handled promptly — wet grounds go mouldy quickly. Reuse is a possibility to explore, not a guaranteed environmental benefit.',
  apply: {
    teacher: [
      ['At school', 'Set up a grounds collection tub in the staff room and use it for a class compost bin or planting activity.'],
      ['In daily life', 'Ask students to find one item at home that is reused, repaired or shared instead of replaced.'],
      ['In a lesson', 'Give groups a product and have them redraw its journey as a circle instead of a straight line.'],
    ],
    corporate: [
      ['In the office', 'Separate pantry grounds from general waste so they can be collected and reused.'],
      ['In operations', 'Map one material your team throws away regularly and ask who could use it as an input.'],
      ['In purchasing', 'Prefer products that can be refilled, repaired or returned over single-use alternatives.'],
    ],
  },
};

/* ---------- C. Lifecycle of a coffee bean ---------- */
export const LIFECYCLE = [
  { name: 'Growing', icon: 'sprout',
    what: 'Coffee grows on shrubs in warm regions near the equator. A plant takes several years before it produces fruit, called coffee cherries.',
    uses: ['Land', 'Water', 'Sunlight', 'Sometimes fertiliser'],
    impact: 'Clearing land for farms can reduce forest cover, and fertiliser can run off into rivers. Shade-grown and well-managed farms lower these pressures.',
    waste: 'Prunings and fallen leaves, which usually return to the soil on the farm.',
    circular: 'Farm leftovers can be composted and put back on the fields.' },
  { name: 'Harvesting', icon: 'leaf',
    what: 'Ripe cherries are picked, often by hand because cherries on the same branch ripen at different times.',
    uses: ['Human labour', 'Tools and transport on the farm'],
    impact: 'This is where the social side of sustainability is most visible: working conditions and fair pay for pickers.',
    waste: 'Unripe or damaged cherries that are sorted out.',
    circular: 'Sorted-out cherries can be composted rather than dumped.' },
  { name: 'Processing', icon: 'recycle',
    what: 'The fruit is removed to get to the seed inside — the coffee bean. This is done by washing the fruit off with water, or by drying the whole cherry in the sun first.',
    uses: ['Water (washed method)', 'Sun and time (natural method)', 'Energy for machinery'],
    impact: 'Washing uses water and leaves wastewater that needs treating before it is released. Sun-drying uses far less water but takes longer.',
    waste: 'Fruit pulp, skins and wastewater.',
    circular: 'Pulp can be composted, and the dried fruit skin is sometimes brewed as a tea called cascara.' },
  { name: 'Transport', icon: 'send',
    what: 'The dried green beans are bagged and shipped from the growing countries to roasters around the world.',
    uses: ['Fuel', 'Packaging such as sacks and liners'],
    impact: 'Moving goods long distances burns fuel and produces emissions.',
    waste: 'Used sacks and packaging.',
    circular: 'Coffee sacks are sturdy and are often reused for storage, gardening or crafts.' },
  { name: 'Roasting', icon: 'bolt',
    what: 'Heat turns green beans brown and develops the flavours and aroma we recognise as coffee.',
    uses: ['Heat energy (gas or electricity)', 'Packaging for the roasted beans'],
    impact: 'Roasting needs a lot of heat and gives off smoke, so energy source and filtering matter.',
    waste: 'Chaff — a thin papery skin that comes off the bean while roasting.',
    circular: 'Chaff is light and dry, and can be added to compost or used as garden mulch.' },
  { name: 'Brewing', icon: 'cup',
    what: 'Beans are ground and hot water is passed through them. Only what dissolves ends up in the cup — the rest stays behind as used grounds.',
    uses: ['Water', 'Electricity', 'Cups, lids and stirrers'],
    impact: 'Most of the bean is left over after brewing. Single-use cups add to the waste from each drink.',
    waste: 'Used coffee grounds, plus cups and packaging.',
    circular: 'Use a reusable cup, and keep the grounds separate so they can be collected.' },
  { name: 'After the cup', icon: 'trash',
    what: 'Used grounds are either thrown away with general waste or collected and given another use.',
    uses: ['Collection and transport', 'Drying, for some uses'],
    impact: 'Grounds thrown away are landfilled or burned along with other waste. In a landfill, food waste that breaks down without air can release methane, a greenhouse gas.',
    waste: 'The grounds themselves — unless they are repurposed.',
    circular: 'This is where the loop can close: compost, mushroom growing, scrubs, soaps and planters all start with collected grounds.' },
];

/* ---------- D. Audience-specific resources ---------- */
export const TEACHER = {
  activities: [
    { title: 'Line or loop?', mins: 20, level: 'Ages 8+',
      text: 'Give each group one everyday product. They draw its journey as a straight line, then redraw it as a loop and explain what changed.' },
    { title: 'The bean journey relay', mins: 25, level: 'Ages 10+',
      text: 'Hand out the seven lifecycle stages on cards. Groups put them in order, then mark where waste appears and where it could be reused.' },
    { title: 'Three-pillar debate', mins: 30, level: 'Ages 12+',
      text: 'Pose a choice — disposable or reusable cups in the canteen — and have teams argue from the environmental, social and economic side.' },
  ],
  questions: [
    ['Where do you think used coffee grounds go after a drink is made?', 'Most are thrown out with general waste. Use this to introduce the idea that "away" is still a place.'],
    ['Which stage of the bean\'s journey surprised you most, and why?', 'There is no single right answer — listen for students noticing resources they had not thought about, such as water or transport.'],
    ['Can something be good for the environment but unfair to people? Give an example.', 'This draws out the three pillars: a solution that ignores people or cost is unlikely to last.'],
    ['What is one thing in our classroom that follows the "take, make, dispose" pattern? How could we make it circular?', 'Guide students towards reduce and reuse before recycle.'],
  ],
  tips: [
    'Bring a small tub of used grounds so students can see, touch and smell the material being discussed.',
    'Ask students to predict before you explain — it shows you what they already believe.',
    'Link each idea to a choice students actually make: what they pack for lunch, what they throw away.',
    'Finish with one action the class will try for a week, then check back on it.',
  ],
};

export const CORPORATE = {
  practices: [
    ['Pantry and coffee', 'Reusable cups by default, a labelled container for used grounds, and a regular collection.'],
    ['Waste reduction', 'Check what is thrown away in one week. The biggest items are the best places to start.'],
    ['Resource use', 'Switch equipment off at the wall after hours and set printers to double-sided by default.'],
    ['Corporate responsibility', 'Report what you actually did, with honest figures. Small verified results build more trust than large claims.'],
  ],
  scenarios: [
    { title: 'The pantry bin',
      text: 'Your floor drinks a lot of coffee. The grounds go into the general waste bin, which is full by mid-afternoon.',
      options: [
        ['Order a bigger bin', false, 'This handles the symptom. The same amount of material is still thrown away.'],
        ['Add a separate container for grounds and arrange collection', true, 'Separating at the source is what makes reuse possible, and it frees up the general bin as well.'],
        ['Ask people to drink less coffee', false, 'Reducing can help, but this is unlikely to stick and ignores a material that could be reused.'],
      ] },
    { title: 'The supplier choice',
      text: 'Two suppliers offer the same product. One is slightly cheaper; the other takes back and refills its packaging.',
      options: [
        ['Choose on price alone', false, 'Price matters, but disposal has a cost too, and it does not appear on the quote.'],
        ['Compare total cost, including disposal, and how each fits your sustainability goals', true, 'Looking at the full picture — environmental, social and economic — is the three-pillar approach.'],
        ['Always choose the "green" option', false, 'A label is not evidence. Ask what actually happens to the packaging.'],
      ] },
    { title: 'The sustainability report',
      text: 'Your team diverted some pantry waste this quarter. A colleague suggests describing it as "zero waste" in the company update.',
      options: [
        ['Go with "zero waste" — it sounds better', false, 'Overstating a result is greenwashing, and it undermines trust in everything else you report.'],
        ['Report what was measured, and what was not', true, 'Specific, honest reporting is more credible and gives you a baseline to improve on.'],
        ['Leave it out to be safe', false, 'Real progress is worth sharing. It encourages others to take part.'],
      ] },
  ],
  actions: [
    'Name one person to look after pantry waste on each floor.',
    'Put a grounds container next to every coffee machine.',
    'Run a short quiz at a team meeting to build awareness.',
    'Book a hands-on activity as a team session.',
    'Review progress after a month and share the result.',
  ],
};
