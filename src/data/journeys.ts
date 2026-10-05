// Multi-day, multi-location itineraries — a different product shape from
// the single-day/half-day entries in tours.ts, so they get their own data
// file, types, and pages (/journeys) rather than another `category` on
// the existing Tour type.
//
// Content below is transcribed from the owner's route drafts, generalized
// to a reusable product (no client names, group sizes, or fixed dates —
// see each journey's own note for what was changed and why).

export type TripType = 'accommodated' | 'camping' | 'self-drive' | 'guided';

export const tripTypeLabels: Record<TripType, string> = {
  accommodated: 'Lodge & Guesthouse',
  camping: 'Camping & Tented',
  'self-drive': 'Self-Drive',
  guided: 'Fully Guided',
};

export interface JourneyDay {
  day: number;
  title: string;
  /** The word in `title` to render as the page's one-word-per-heading
   * accent (see src/utils/text.ts's hl()) — deliberately varied day to
   * day between a place name and a distinct activity/feature word,
   * never the same choice twice in a row within one journey. */
  accentWord: string;
  location: string;
  description: string;
}

/** One tier's own includes/excludes, plus a short label for its column
 * heading — used by any journey offered two ways (see `tiers` below). */
export interface Tier {
  label: string;
  includes: string[];
  excludes: string[];
}

export interface Journey {
  slug: string;
  name: string;
  tagline: string;
  durationDays: number;
  regions: string[];
  tripType: TripType;
  /** Pins this journey first on /journeys and gives it a small distinguishing
   * badge instead of the plain trip-type label — reserved for a genuine
   * flagship, not a general-purpose "highlight" flag every journey reaches for. */
  featured?: boolean;
  heroImage: string;
  imageCredit?: { name: string; username: string };
  itinerary: JourneyDay[];
  /** Shared across every guest on this journey regardless of tier (e.g.
   * accommodation, activities, park fees) — tier-specific items (a private
   * guide and vehicle vs. self-drive route planning) live in `tiers`
   * instead, so the page doesn't show a guided guest's private driver as
   * something a self-drive guest also gets. */
  includes: string[];
  excludes: string[];
  /** Every journey here can be run guided (private vehicle/driver, or for
   * the camping journey, fully-outfitted) or self-drive (own/hired vehicle,
   * we plan the route and book ahead) — this holds each tier's own
   * includes/excludes alongside the shared ones above, instead of
   * duplicating the whole journey as a second entry per tier. */
  tiers: {
    primary: Tier;
    selfDrive: Tier;
  };
  /** A one-line cross-sell to the flagship camping journey, for a route
   * that already passes overnight through Sossusvlei and/or Spitzkoppe —
   * mirrors Tour['campingUpgrade'] in tours.ts. */
  campingUpgrade?: { text: string; href: string };
}

export const journeys: Journey[] = [
  // Flagship — the one journey built specifically around camping rather
  // than treating it as a lodge-based route with tents swapped in. Kept as
  // a single new route rather than a camping "twin" of an existing journey
  // (see the 10-Day Grand Tour's own comment below on why three near-
  // identical routes were rejected once already) — Spitzkoppe and
  // NamibRand/Sossusvlei are both genuinely camping-first destinations
  // (Spitzkoppe's granite arches are where the classic Namibian camping
  // photos come from; NamibRand is part of the world's first internationally
  // certified Dark Sky Reserve), so the route earns its own existence
  // instead of reusing another journey's itinerary with a different tag.
  {
    slug: '6-day-spitzkoppe-sossusvlei-camping-safari',
    name: '6-Day Spitzkoppe & Sossusvlei Camping Safari',
    tagline:
      "No lodge walls between you and the stars — rock art at Spitzkoppe, sunrise on the dunes at Sossusvlei, and a campfire in between.",
    durationDays: 6,
    regions: ['Windhoek', 'Spitzkoppe', 'NamibRand', 'Sossusvlei'],
    tripType: 'camping',
    featured: true,
    heroImage:
      'https://images.unsplash.com/photo-1639402479828-78bb0b67698d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2200',
    imageCredit: { name: 'Andrew Svk', username: 'andrew_svk' },
    itinerary: [
      {
        day: 1,
        title: 'Windhoek to Spitzkoppe',
        accentWord: 'Spitzkoppe',
        location: 'Windhoek → Spitzkoppe',
        description:
          'Airport pickup in Windhoek, then the drive out to Spitzkoppe’s granite arches, arriving in time to watch the rock face turn copper at sunset over your first campfire.',
      },
      {
        day: 2,
        title: 'Rock Art, Campfire, Stars',
        accentWord: 'Stars',
        location: 'Spitzkoppe',
        description:
          'A morning walk to Bushman’s Paradise for its San rock art, an afternoon free to climb or simply sit with the silence, then a campfire dinner under some of the clearest, least light-polluted skies on the continent.',
      },
      {
        day: 3,
        title: 'Spitzkoppe to Sossusvlei',
        accentWord: 'Sossusvlei',
        location: 'Spitzkoppe → NamibRand',
        description:
          'The drive south into the NamibRand Nature Reserve — the world’s first internationally certified Dark Sky Reserve — arriving at camp for sundowners as the dunes catch the last light.',
      },
      {
        day: 4,
        title: 'Sunrise on the Dunes',
        accentWord: 'Sunrise',
        location: 'NamibRand / Sossusvlei',
        description:
          'Up before the sun for the climb up Dune 45 or Big Daddy, watching the light change the dune face from the inside instead of racing a lodge shuttle to beat the gate. Dead Vlei and Sesriem Canyon in the afternoon, then a second night by the fire under the reserve’s dark sky.',
      },
      {
        day: 5,
        title: 'NamibRand to Windhoek',
        accentWord: 'NamibRand',
        location: 'NamibRand → Windhoek',
        description:
          'One more unhurried morning at camp — a short nature walk or a second dune, whichever you didn’t get to — before the drive back to Windhoek.',
      },
      {
        day: 6,
        title: 'Windhoek & Departure',
        accentWord: 'Departure',
        location: 'Windhoek',
        description: 'A free morning in Windhoek before your transfer to the airport.',
      },
    ],
    includes: ['Park and conservation fees'],
    excludes: ['International flights', 'Travel insurance', 'Personal spending and gratuities'],
    tiers: {
      primary: {
        label: 'Fully-Outfitted',
        includes: [
          'Private transport with a professional guide',
          'Camping equipment (tents, mattresses, bedding)',
          'All meals, camp-cooked, dinner Day 1 through breakfast Day 5',
          'Campfire dinners and a guided stargazing session at both camps',
          'Airport transfers',
        ],
        excludes: [],
      },
      selfDrive: {
        label: 'Self-Drive / BYO',
        includes: ['Campsite bookings at Spitzkoppe and NamibRand', 'A pre-departure route and camp briefing'],
        excludes: ['Vehicle and camping-gear hire (unless you already have your own)'],
      },
    },
  },

  // Generalized from a 5-day/4-night draft written for a specific group and
  // travel dates — group size and dates dropped, route and activities kept.
  {
    slug: '5-day-sossusvlei-coast',
    name: '5-Day Sossusvlei & Coast',
    tagline:
      "Namibia's red dunes and the Atlantic coast in one short trip — Sossusvlei, Swakopmund, and a full day of dune adventure.",
    durationDays: 5,
    regions: ['Windhoek', 'Sossusvlei', 'Swakopmund', 'Walvis Bay'],
    tripType: 'guided',
    heroImage:
      'https://images.unsplash.com/photo-1761205930775-b2b634bfcbe6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2200',
    imageCredit: { name: 'Nathalie Lays', username: 'nath_lays' },
    itinerary: [
      {
        day: 1,
        title: 'Windhoek Arrival & Drive to Sossusvlei',
        accentWord: 'Sossusvlei',
        location: 'Windhoek → Sossusvlei',
        description:
          'Airport pickup, a Windhoek city tour, then the drive into the Namib Desert to your lodge near Sossusvlei.',
      },
      {
        day: 2,
        title: 'Sossusvlei, Dead Vlei & Dune 45',
        accentWord: 'Dune',
        location: 'Sossusvlei',
        description:
          'Sunrise climb up Dune 45, then Sossusvlei, Dead Vlei and Sesriem Canyon, with time to relax back at the lodge in the afternoon.',
      },
      {
        day: 3,
        title: 'Into the Namib to Swakopmund',
        accentWord: 'Swakopmund',
        location: 'Sossusvlei → Swakopmund',
        description:
          'A scenic drive through the Gaub and Kuiseb Passes, with a stop at Dune 7, before arriving on the coast in Swakopmund.',
      },
      {
        day: 4,
        title: 'Sandwich Harbour & Catamaran Cruise',
        accentWord: 'Cruise',
        location: 'Swakopmund / Walvis Bay',
        description:
          'A morning dolphin and seal catamaran cruise, then an afternoon Sandwich Harbour 4x4 excursion, finishing with sunset on the beach.',
      },
      {
        day: 5,
        title: 'Quad Biking, Camel Ride & Departure',
        accentWord: 'Camel',
        location: 'Swakopmund → Walvis Bay Airport',
        description:
          'Morning quad biking in the dunes and a camel ride, then a Swakopmund town tour before your transfer to the airport.',
      },
    ],
    includes: ['Accommodation, sharing basis', 'Activities listed in the itinerary'],
    excludes: [
      'International flights',
      'Travel insurance',
      'Personal spending and gratuities',
      'Meals not specified as included',
    ],
    tiers: {
      primary: {
        label: 'Guided',
        includes: ['Private transport with a professional guide', 'Airport transfers'],
        excludes: [],
      },
      selfDrive: {
        label: 'Self-Drive',
        includes: [
          'Turn-by-turn route notes and daily driving distances',
          'Accommodation booked on your behalf',
          'A pre-departure briefing',
        ],
        excludes: ['Vehicle hire and fuel (unless you already have your own)', 'Airport transfer'],
      },
    },
    campingUpgrade: {
      text: 'Camp the Sossusvlei night instead of a lodge — see our 6-Day Spitzkoppe & Sossusvlei Camping Safari.',
      href: '/journeys#6-day-spitzkoppe-sossusvlei-camping-safari',
    },
  },

  // Flagship route — the owner drafted three versions of this same 10-day
  // trip that differ only in direction and start/end airport (Windhoek vs.
  // Walvis Bay). Publishing three near-identical itineraries would be the
  // exact "layers of content" problem to avoid, so this uses the owner's
  // own pick for first-time visitors (the clockwise route) as the one
  // public itinerary, with the airport flexibility folded into a line of
  // copy instead of duplicated as a separate product.
  {
    slug: '10-day-namibia-grand-tour',
    name: '10-Day Namibia Grand Tour',
    tagline:
      "Our most complete route across Namibia's desert, coast and wildlife — from the dunes of Sossusvlei to the game drives of Etosha.",
    durationDays: 10,
    regions: ['Windhoek', 'Sossusvlei', 'Swakopmund', 'Walvis Bay', 'Spitzkoppe', 'Damaraland', 'Etosha'],
    tripType: 'guided',
    heroImage:
      'https://images.unsplash.com/photo-1689917945545-bf7e6f744e10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2200',
    imageCredit: { name: 'Ultimate Safaris Namibia', username: 'ultimate_safaris_namibia' },
    itinerary: [
      {
        day: 1,
        title: 'Windhoek',
        accentWord: '',
        location: 'Windhoek',
        description: 'Airport pickup and a Windhoek city tour, then an evening at leisure.',
      },
      {
        day: 2,
        title: 'Into the Namib Desert',
        accentWord: 'Namib',
        location: 'Windhoek → Sossusvlei',
        description: 'Drive into the Namib Desert to Sesriem, with a dune experience if time allows.',
      },
      {
        day: 3,
        title: 'Sossusvlei & Dead Vlei',
        accentWord: 'Vlei',
        location: 'Sossusvlei',
        description: 'Sunrise at Dune 45, then Sossusvlei and Dead Vlei, followed by Sesriem Canyon.',
      },
      {
        day: 4,
        title: 'To the Coast',
        accentWord: 'Coast',
        location: 'Sossusvlei → Swakopmund',
        description: 'A scenic drive via Solitaire and the Kuiseb area to Swakopmund.',
      },
      {
        day: 5,
        title: 'Sandwich Harbour & Walvis Bay Lagoon',
        accentWord: 'Lagoon',
        location: 'Swakopmund / Walvis Bay',
        description: 'A Sandwich Harbour 4x4 excursion and the Walvis Bay Lagoon’s flamingos.',
      },
      {
        day: 6,
        title: 'Swakopmund Adventure Activity',
        accentWord: 'Adventure',
        location: 'Swakopmund',
        description:
          'Choice of one activity — catamaran cruise, quad biking, camel riding, Living Desert tour, sandboarding, kayaking, or skydiving.',
      },
      {
        day: 7,
        title: 'Spitzkoppe to Damaraland',
        accentWord: 'Spitzkoppe',
        location: 'Swakopmund → Damaraland',
        description: "A stop at Spitzkoppe's granite peaks, then on to Damaraland.",
      },
      {
        day: 8,
        title: 'Damaraland',
        accentWord: '',
        location: 'Damaraland',
        description: "Twyfelfontein's rock engravings, the Organ Pipes and Burnt Mountain.",
      },
      {
        day: 9,
        title: 'To Etosha',
        accentWord: 'Etosha',
        location: 'Damaraland → Etosha',
        description: 'Travel to Etosha National Park, with an afternoon game drive.',
      },
      {
        day: 10,
        title: 'Etosha & Departure',
        accentWord: 'Departure',
        location: 'Etosha → Windhoek',
        description: 'A final morning game drive, then the drive back to Windhoek for your departure.',
      },
    ],
    includes: [
      'High-end lodge/hotel accommodation, sharing basis',
      'Breakfast daily, dinner where noted',
      'Park and conservation fees',
    ],
    excludes: [
      'International flights',
      'Travel insurance',
      'Upgrades beyond the included Swakopmund activity',
      'Personal spending and gratuities',
    ],
    tiers: {
      primary: {
        label: 'Guided',
        includes: ['Private 4x4 vehicle with professional guide/driver', 'Fuel and all planned transfers', 'Airport transfers'],
        excludes: [],
      },
      selfDrive: {
        label: 'Self-Drive',
        includes: [
          'A detailed route plan with daily driving notes',
          'Lodge bookings made on your behalf',
          'A pre-departure briefing',
        ],
        excludes: ['4x4 vehicle hire and fuel (unless you already have your own)', 'Airport transfer'],
      },
    },
    campingUpgrade: {
      text: 'Camping upgrade available on request for the Sossusvlei night or the Spitzkoppe stop — see our 6-Day Spitzkoppe & Sossusvlei Camping Safari.',
      href: '/journeys#6-day-spitzkoppe-sossusvlei-camping-safari',
    },
  },

  // Source doc was titled "11 day tour" but only ever describes 8 days of
  // activity, closing with a note about leaving room for the holidays —
  // that's a date-specific placeholder, not four more days of real
  // content, so this ships as the 8 days it actually is rather than
  // padded out to match the title. Its source pricing was a USD
  // per-activity list with one line item ("City Tour") priced twice for
  // what are clearly two different tours (Windhoek vs. Swakopmund) — fixed
  // by naming them separately below. The rest of that price list wasn't
  // carried over: it's in USD while every other journey here is priced in
  // N$, and guessing an exchange rate for real pricing isn't a call to
  // make silently — flagged for the owner to confirm.
  {
    slug: '8-day-windhoek-coastal-discovery',
    name: '8-Day Windhoek & Coastal Discovery',
    tagline:
      'A flexible Windhoek-to-coast trip where you choose the day trips that interest you most, from wildlife sanctuaries to dune adventures.',
    durationDays: 8,
    regions: ['Windhoek', 'Swakopmund', 'Walvis Bay', 'Henties Bay'],
    tripType: 'guided',
    heroImage:
      'https://images.unsplash.com/photo-1693921148392-387157fc9a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2200',
    imageCredit: { name: 'Ultimate Safaris Namibia', username: 'ultimate_safaris_namibia' },
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Windhoek',
        accentWord: 'Windhoek',
        location: 'Windhoek',
        description: 'Arrival and a relaxed day settling in, with sightseeing around the city.',
      },
      {
        day: 2,
        title: 'Windhoek Day Trip',
        accentWord: 'Trip',
        location: 'Windhoek',
        description:
          'Choose one: the Na’ankusê Wildlife Sanctuary, a San Bushmen cultural walk, or a game drive at Daan Viljoen.',
      },
      {
        day: 3,
        title: 'Drive to the Coast',
        accentWord: 'Coast',
        location: 'Windhoek → Swakopmund',
        description:
          'A scenic drive through Karibib and Usakos, with an optional detour to Spitzkoppe, arriving in the German-influenced coastal town of Swakopmund.',
      },
      {
        day: 4,
        title: 'Swakopmund City Tour',
        accentWord: 'Tour',
        location: 'Swakopmund',
        description:
          'A relaxed morning followed by a town tour taking in the historic German architecture, the Aquarium, and the Kristall Galerie.',
      },
      {
        day: 5,
        title: 'Sandwich Harbour Adventure',
        accentWord: 'Harbour',
        location: 'Walvis Bay / Sandwich Harbour',
        description:
          "A 4x4 excursion through Walvis Bay's lagoon, salt works and pink lake en route to Sandwich Harbour, passing Pelican Point.",
      },
      {
        day: 6,
        title: 'Catamaran Cruise',
        accentWord: 'Cruise',
        location: 'Walvis Bay',
        description: 'A boat cruise with seals and pelicans, plus drinks and snacks on board.',
      },
      {
        day: 7,
        title: 'Quad Biking & Camel Rides',
        accentWord: 'Camel',
        location: 'Swakopmund Dunes',
        description: 'An adrenaline-filled day in the dunes on quad bikes, followed by a camel ride.',
      },
      {
        day: 8,
        title: 'Henties Bay & Departure',
        accentWord: 'Departure',
        location: 'Swakopmund → Henties Bay',
        description:
          'A drive up the coast through the fishing town of Henties Bay, passing a shipwreck, with the option to visit the seal colony at Cape Cross before departure.',
      },
    ],
    includes: ['Optional day-trip activities available (priced individually — ask us for current rates)'],
    excludes: [
      'Accommodation (quoted separately based on your preference)',
      'International flights',
      'Travel insurance',
      'Personal spending and gratuities',
    ],
    tiers: {
      primary: {
        label: 'Guided',
        includes: ['Private transport with a professional guide'],
        excludes: [],
      },
      selfDrive: {
        label: 'Self-Drive',
        includes: ['A day-by-day route plan for the coast drive', 'A pre-departure briefing'],
        excludes: ['Vehicle hire and fuel (unless you already have your own)'],
      },
    },
  },

  // Longest and southernmost route — the only journey reaching Fish River
  // Canyon, Kolmanskop and the Kalahari, so kept distinct from the 10-day
  // Grand Tour rather than merged into it.
  {
    slug: '13-day-namibia-complete-safari',
    name: '13-Day Namibia Complete Safari',
    tagline:
      "Namibia's full spectrum in one grand safari — the far south, the great dunes, the Atlantic coast, Damaraland's rock art, and Etosha's wildlife.",
    durationDays: 13,
    regions: [
      'Windhoek',
      'Kalahari',
      'Keetmanshoop',
      'Fish River Canyon',
      'Lüderitz',
      'Sossusvlei',
      'Swakopmund',
      'Damaraland',
      'Etosha',
      'Okahandja',
    ],
    tripType: 'guided',
    heroImage:
      'https://images.unsplash.com/photo-1739036177683-47c806ab4761?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2200',
    imageCredit: { name: 'Tim G', username: 'tim1001' },
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Windhoek',
        accentWord: 'Windhoek',
        location: 'Windhoek',
        description: 'Airport pickup and a relaxed first day.',
      },
      {
        day: 2,
        title: 'Windhoek City Tour & Kalahari',
        accentWord: 'Kalahari',
        location: 'Windhoek → Kalahari',
        description:
          'A city tour taking in the Christuskirche and Alte Feste, then a sundowner drive into the Kalahari.',
      },
      {
        day: 3,
        title: 'Bushmen Wisdom & Quivertree Forest',
        accentWord: 'Quivertree',
        location: 'Kalahari → Keetmanshoop',
        description:
          "A San Bushmen cultural experience, then the Quivertree Forest and Giant's Playground rock formations.",
      },
      {
        day: 4,
        title: 'Fish River Canyon & Kolmanskop',
        accentWord: 'Kolmanskop',
        location: 'Fish River Canyon / Lüderitz',
        description:
          'A morning at Fish River Canyon, a visit to the ghost town of Kolmanskop, and an afternoon with the area’s wild horses.',
      },
      {
        day: 5,
        title: 'Into the Namib to Sossusvlei',
        accentWord: 'Sossusvlei',
        location: '→ Sossusvlei',
        description: 'The drive north to Sossusvlei, with an afternoon stop at Elim Dune and Sesriem Canyon.',
      },
      {
        day: 6,
        title: 'Sossusvlei & Dead Vlei',
        accentWord: 'Vlei',
        location: 'Sossusvlei',
        description: 'A full day exploring Sossusvlei, Dead Vlei, Big Daddy Dune and Dune 45.',
      },
      {
        day: 7,
        title: 'To Swakopmund via the Moon Landscape',
        accentWord: 'Moon',
        location: 'Sossusvlei → Swakopmund',
        description:
          "Departure through Solitaire and the Kuiseb Pass's moon landscape, arriving in Swakopmund for an afternoon of quad biking in the dunes.",
      },
      {
        day: 8,
        title: 'Marine & Desert Adventure',
        accentWord: 'Marine',
        location: 'Swakopmund / Walvis Bay',
        description:
          'A morning dolphin and seal cruise, then an afternoon Sandwich Harbour 4x4 excursion with stops at the pink lake and its flamingos.',
      },
      {
        day: 9,
        title: 'Along the Coast to Damaraland',
        accentWord: 'Damaraland',
        location: '→ Damaraland',
        description: 'More time at the pink lake and lagoon, then the drive to Twyfelfontein, passing the Zeila shipwreck.',
      },
      {
        day: 10,
        title: 'Twyfelfontein & Himba Village',
        accentWord: 'Himba',
        location: 'Damaraland',
        description: 'The rock art at Twyfelfontein in the morning, then a visit to a Himba village in the afternoon.',
      },
      {
        day: 11,
        title: 'Etosha National Park',
        accentWord: 'Etosha',
        location: 'Etosha',
        description: 'A full day of game drives in Etosha National Park.',
      },
      {
        day: 12,
        title: 'Etosha & Okahandja',
        accentWord: 'Okahandja',
        location: 'Etosha → Okahandja',
        description: "A final morning game drive, then a stop at the Okahandja woodcarvers' market.",
      },
      {
        day: 13,
        title: 'Departure',
        accentWord: '',
        location: 'Windhoek Airport',
        description: 'Drop-off at Hosea Kutako International Airport.',
      },
    ],
    includes: ['Accommodation, sharing basis', 'Park and conservation fees', 'Activities listed in the itinerary'],
    excludes: [
      'International flights',
      'Travel insurance',
      'Personal spending and gratuities',
      'Meals not specified as included',
    ],
    tiers: {
      primary: {
        label: 'Guided',
        includes: ['Private transport with a professional guide', 'Airport transfers'],
        excludes: [],
      },
      // The Kalahari and Fish River Canyon legs are more remote than this
      // journey's other stops — still a normal self-drive route by
      // Namibian tourism standards (this is one of the country's most
      // common self-drive loops), but flagged here since it's the longest,
      // most involved route offering it: confirm before actually running
      // a self-drive guest through the far south unsupported.
      selfDrive: {
        label: 'Self-Drive',
        includes: [
          'A full route plan covering the Kalahari, Fish River Canyon and coastal legs',
          'Accommodation booked on your behalf',
          'A pre-departure briefing',
        ],
        excludes: ['4x4 vehicle hire and fuel (unless you already have your own)', 'Airport transfer'],
      },
    },
    campingUpgrade: {
      text: 'Camping upgrade available on request for the Sossusvlei night — see our 6-Day Spitzkoppe & Sossusvlei Camping Safari.',
      href: '/journeys#6-day-spitzkoppe-sossusvlei-camping-safari',
    },
  },

  // Short 3-day package from the owner — Windhoek-based, ending back in
  // Windhoek. Flights are handled the same way for both new short
  // packages: excluded, but the owner will arrange them on request, or a
  // guest can book their own and we run the rest of the package —
  // captured as a note on the excluded flights line rather than a new
  // includes/excludes field, since it's a one-off clarification, not a
  // new shape of data.
  {
    slug: '3-day-windhoek-sossusvlei-swakopmund-escape',
    name: '3-Day Windhoek – Sossusvlei – Swakopmund Escape',
    tagline:
      "A fast-paced taste of Namibia's icons — Sossusvlei's red dunes, Dead Vlei's ghost trees, and Swakopmund's coastal adventures, packed into three action-filled days.",
    durationDays: 3,
    regions: ['Windhoek', 'Sossusvlei', 'Swakopmund', 'Walvis Bay'],
    tripType: 'guided',
    heroImage:
      'https://images.unsplash.com/photo-1739036178003-5fa2789c4dff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2200',
    imageCredit: { name: 'Tim G', username: 'tim1001' },
    itinerary: [
      {
        day: 1,
        title: 'Windhoek Arrival & Drive to Sossusvlei',
        accentWord: 'Sossusvlei',
        location: 'Windhoek → Sossusvlei',
        description:
          'Airport pickup in Windhoek, then the drive into the Namib Desert towards Sossusvlei, with a stop at Sesriem Canyon on the way.',
      },
      {
        day: 2,
        title: 'Sossusvlei, Dead Vlei & Big Daddy Dune',
        accentWord: 'Dune',
        location: 'Sossusvlei → Swakopmund',
        description:
          'A full day among the towering red dunes — the climb up Big Daddy and the ghostly white pan of Dead Vlei — then the drive north to Swakopmund.',
      },
      {
        day: 3,
        title: 'Swakopmund Adventures & Return to Windhoek',
        accentWord: 'Swakopmund',
        location: 'Swakopmund / Walvis Bay → Windhoek',
        description:
          "A morning Sandwich Harbour 4x4 excursion and catamaran cruise, then quad biking and a camel ride in the dunes, before the drive back to Windhoek for your departure.",
      },
    ],
    includes: ['Accommodation, sharing basis', 'Activities listed in the itinerary'],
    excludes: [
      "International flights — arranged on request, or book your own and we'll handle the rest of the package",
      'Travel insurance',
      'Personal spending and gratuities',
      'Meals not specified as included',
    ],
    tiers: {
      primary: {
        label: 'Guided',
        includes: ['Private transport with a professional guide', 'Airport transfers'],
        excludes: [],
      },
      selfDrive: {
        label: 'Self-Drive',
        includes: [
          'Turn-by-turn route notes for the Windhoek–Sossusvlei–Swakopmund loop',
          'Accommodation booked on your behalf',
          'A pre-departure briefing',
        ],
        excludes: ['Vehicle hire and fuel (unless you already have your own)', 'Airport transfer'],
      },
    },
    campingUpgrade: {
      text: 'Camp the Sossusvlei night instead — see our 6-Day Spitzkoppe & Sossusvlei Camping Safari.',
      href: '/journeys#6-day-spitzkoppe-sossusvlei-camping-safari',
    },
  },

  // Same core route as the Windhoek escape above, run the other
  // direction and based out of Walvis Bay instead — kept as its own
  // entry rather than folded into the Windhoek one since the owner
  // drafted it as a distinct package for guests already on the coast.
  {
    slug: '3-day-walvis-bay-escape',
    name: '3-Day Walvis Bay Escape',
    tagline:
      "Namibia's dunes and ocean in one quick escape from Walvis Bay — Sandwich Harbour, a catamaran cruise, dune adventures and Sossusvlei's red sand, all in three days.",
    durationDays: 3,
    regions: ['Walvis Bay', 'Swakopmund', 'Sossusvlei'],
    tripType: 'guided',
    heroImage:
      'https://images.unsplash.com/photo-1761205930562-e176cfa86e64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2200',
    imageCredit: { name: 'Nathalie Lays', username: 'nath_lays' },
    itinerary: [
      {
        day: 1,
        title: 'Sandwich Harbour & Catamaran Cruise',
        accentWord: 'Cruise',
        location: 'Walvis Bay',
        description:
          'Arrival in Walvis Bay, a Sandwich Harbour 4x4 excursion along the dunes meeting the Atlantic, then a dolphin and seal catamaran cruise on the lagoon.',
      },
      {
        day: 2,
        title: 'Camel Ride, Quad Biking & Drive to Sossusvlei',
        accentWord: 'Sossusvlei',
        location: 'Swakopmund Dunes → Sossusvlei',
        description:
          'A morning camel ride and quad biking adventure in the dunes near Swakopmund, then the scenic drive inland to Sossusvlei.',
      },
      {
        day: 3,
        title: 'Sossusvlei, Sesriem Canyon, Big Daddy & Dead Vlei',
        accentWord: 'Canyon',
        location: 'Sossusvlei → Walvis Bay',
        description:
          'A full day among the red dunes — Sesriem Canyon, the climb up Big Daddy, and the ghostly white pan of Dead Vlei — before the drive back to Walvis Bay for your departure.',
      },
    ],
    includes: ['Accommodation, sharing basis', 'Activities listed in the itinerary'],
    excludes: [
      "International flights — arranged on request, or book your own and we'll handle the rest of the package",
      'Travel insurance',
      'Personal spending and gratuities',
      'Meals not specified as included',
    ],
    tiers: {
      primary: {
        label: 'Guided',
        includes: ['Private transport with a professional guide', 'Transfers, including to and from Walvis Bay'],
        excludes: [],
      },
      selfDrive: {
        label: 'Self-Drive',
        includes: [
          'Turn-by-turn route notes for the Walvis Bay–Sossusvlei loop',
          'Accommodation booked on your behalf',
          'A pre-departure briefing',
        ],
        excludes: ['Vehicle hire and fuel (unless you already have your own)'],
      },
    },
    campingUpgrade: {
      text: 'Camp the Sossusvlei night instead — see our 6-Day Spitzkoppe & Sossusvlei Camping Safari.',
      href: '/journeys#6-day-spitzkoppe-sossusvlei-camping-safari',
    },
  },
];

export const journeyBySlug = (slug: string): Journey | undefined =>
  journeys.find((journey) => journey.slug === slug);
