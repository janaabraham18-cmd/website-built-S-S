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
  location: string;
  description: string;
}

export interface Journey {
  slug: string;
  name: string;
  tagline: string;
  durationDays: number;
  regions: string[];
  tripType: TripType;
  heroImage: string;
  imageCredit?: { name: string; username: string };
  itinerary: JourneyDay[];
  includes: string[];
  excludes: string[];
  /** e.g. "From N$X,XXX pp sharing" — omit until real pricing is confirmed. */
  price?: string;
}

export const journeys: Journey[] = [
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
      'https://images.unsplash.com/photo-1493062133140-518bd1f26539?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2200',
    imageCredit: { name: 'Marcelo Novais', username: 'marnovais' },
    itinerary: [
      {
        day: 1,
        title: 'Windhoek Arrival & Drive to Sossusvlei',
        location: 'Windhoek → Sossusvlei',
        description:
          'Airport pickup, a Windhoek city tour, then the drive into the Namib Desert to your lodge near Sossusvlei.',
      },
      {
        day: 2,
        title: 'Sossusvlei, Dead Vlei & Dune 45',
        location: 'Sossusvlei',
        description:
          'Sunrise climb up Dune 45, then Sossusvlei, Dead Vlei and Sesriem Canyon, with time to relax back at the lodge in the afternoon.',
      },
      {
        day: 3,
        title: 'Into the Namib to Swakopmund',
        location: 'Sossusvlei → Swakopmund',
        description:
          'A scenic drive through the Gaub and Kuiseb Passes, with a stop at Dune 7, before arriving on the coast in Swakopmund.',
      },
      {
        day: 4,
        title: 'Sandwich Harbour & Catamaran Cruise',
        location: 'Swakopmund / Walvis Bay',
        description:
          'A morning dolphin and seal catamaran cruise, then an afternoon Sandwich Harbour 4x4 excursion, finishing with sunset on the beach.',
      },
      {
        day: 5,
        title: 'Quad Biking, Camel Ride & Departure',
        location: 'Swakopmund → Walvis Bay Airport',
        description:
          'Morning quad biking in the dunes and a camel ride, then a Swakopmund town tour before your transfer to the airport.',
      },
    ],
    includes: [
      'Private transport with a professional guide',
      'Accommodation, sharing basis',
      'Activities listed in the itinerary',
      'Airport transfers',
    ],
    excludes: [
      'International flights',
      'Travel insurance',
      'Personal spending and gratuities',
      'Meals not specified as included',
    ],
  },

  // Flagship route — the owner drafted three versions of this same 10-day
  // trip that differ only in direction and start/end airport (Windhoek vs.
  // Walvis Bay). Publishing three near-identical itineraries would be the
  // exact "layers of content" problem to avoid, so this uses the owner's
  // own pick for first-time visitors (the clockwise route) as the one
  // public itinerary, with the airport flexibility folded into a line of
  // copy instead of duplicated as a separate product. Pricing follows the
  // owner's own "strongest recommendation": one public "from" price
  // instead of publishing all three tiers.
  {
    slug: '10-day-namibia-grand-tour',
    name: '10-Day Namibia Grand Tour',
    tagline:
      "Our flagship route across Namibia's desert, coast and wildlife — from the dunes of Sossusvlei to the game drives of Etosha.",
    durationDays: 10,
    regions: ['Windhoek', 'Sossusvlei', 'Swakopmund', 'Spitzkoppe', 'Damaraland', 'Etosha'],
    tripType: 'guided',
    heroImage:
      'https://images.unsplash.com/photo-1643749678251-76783e5f1777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2200',
    imageCredit: { name: 'Bernd Dittrich', username: 'hdbernd' },
    price: 'From N$79,500 pp — final quote depends on group size, accommodation, and activities selected.',
    itinerary: [
      {
        day: 1,
        title: 'Windhoek',
        location: 'Windhoek',
        description: 'Airport pickup and a Windhoek city tour, then an evening at leisure.',
      },
      {
        day: 2,
        title: 'Into the Namib Desert',
        location: 'Windhoek → Sossusvlei',
        description: 'Drive into the Namib Desert to Sesriem, with a dune experience if time allows.',
      },
      {
        day: 3,
        title: 'Sossusvlei & Dead Vlei',
        location: 'Sossusvlei',
        description: 'Sunrise at Dune 45, then Sossusvlei and Dead Vlei, followed by Sesriem Canyon.',
      },
      {
        day: 4,
        title: 'To the Coast',
        location: 'Sossusvlei → Swakopmund',
        description: 'A scenic drive via Solitaire and the Kuiseb area to Swakopmund.',
      },
      {
        day: 5,
        title: 'Sandwich Harbour & Walvis Bay Lagoon',
        location: 'Swakopmund / Walvis Bay',
        description: 'A Sandwich Harbour 4x4 excursion and the Walvis Bay Lagoon’s flamingos.',
      },
      {
        day: 6,
        title: 'Swakopmund Adventure Activity',
        location: 'Swakopmund',
        description:
          'Choice of one activity — catamaran cruise, quad biking, camel riding, Living Desert tour, sandboarding, kayaking, or skydiving.',
      },
      {
        day: 7,
        title: 'Spitzkoppe to Damaraland',
        location: 'Swakopmund → Damaraland',
        description: "A stop at Spitzkoppe's granite peaks, then on to Damaraland.",
      },
      {
        day: 8,
        title: 'Damaraland',
        location: 'Damaraland',
        description: "Twyfelfontein's rock engravings, the Organ Pipes and Burnt Mountain.",
      },
      {
        day: 9,
        title: 'To Etosha',
        location: 'Damaraland → Etosha',
        description: 'Travel to Etosha National Park, with an afternoon game drive.',
      },
      {
        day: 10,
        title: 'Etosha & Departure',
        location: 'Etosha → Windhoek',
        description: 'A final morning game drive, then the drive back to Windhoek for your departure.',
      },
    ],
    includes: [
      'High-end lodge/hotel accommodation, sharing basis',
      'Breakfast daily, dinner where noted',
      'Private 4x4 vehicle with professional guide/driver',
      'Fuel and all planned transfers',
      'Park and conservation fees',
      'Airport transfers',
    ],
    excludes: [
      'International flights',
      'Travel insurance',
      'Upgrades beyond the included Swakopmund activity',
      'Personal spending and gratuities',
    ],
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
    regions: ['Windhoek', 'Swakopmund', 'Walvis Bay'],
    tripType: 'guided',
    heroImage:
      'https://images.unsplash.com/photo-1669220228835-6c80412646d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2200',
    imageCredit: { name: 'Joshua Kettle', username: 'joshuakettle' },
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Windhoek',
        location: 'Windhoek',
        description: 'Arrival and a relaxed day settling in, with sightseeing around the city.',
      },
      {
        day: 2,
        title: 'Windhoek Day Trip',
        location: 'Windhoek',
        description:
          'Choose one: the Na’ankusê Wildlife Sanctuary, a San Bushmen cultural walk, or a game drive at Daan Viljoen.',
      },
      {
        day: 3,
        title: 'Drive to the Coast',
        location: 'Windhoek → Swakopmund',
        description:
          'A scenic drive through Karibib and Usakos, with an optional detour to Spitzkoppe, arriving in the German-influenced coastal town of Swakopmund.',
      },
      {
        day: 4,
        title: 'Swakopmund City Tour',
        location: 'Swakopmund',
        description:
          'A relaxed morning followed by a town tour taking in the historic German architecture, the Aquarium, and the Kristall Galerie.',
      },
      {
        day: 5,
        title: 'Sandwich Harbour Adventure',
        location: 'Walvis Bay / Sandwich Harbour',
        description:
          "A 4x4 excursion through Walvis Bay's lagoon, salt works and pink lake en route to Sandwich Harbour, passing Pelican Point.",
      },
      {
        day: 6,
        title: 'Catamaran Cruise',
        location: 'Walvis Bay',
        description: 'A boat cruise with seals and pelicans, plus drinks and snacks on board.',
      },
      {
        day: 7,
        title: 'Quad Biking & Camel Rides',
        location: 'Swakopmund Dunes',
        description: 'An adrenaline-filled day in the dunes on quad bikes, followed by a camel ride.',
      },
      {
        day: 8,
        title: 'Henties Bay & Departure',
        location: 'Swakopmund → Henties Bay',
        description:
          'A drive up the coast through the fishing town of Henties Bay, passing a shipwreck, with the option to visit the seal colony at Cape Cross before departure.',
      },
    ],
    includes: [
      'Private transport with a professional guide',
      'Optional day-trip activities available (priced individually — ask us for current rates)',
    ],
    excludes: [
      'Accommodation (quoted separately based on your preference)',
      'International flights',
      'Travel insurance',
      'Personal spending and gratuities',
    ],
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
    regions: ['Windhoek', 'Kalahari', 'Fish River Canyon', 'Sossusvlei', 'Swakopmund', 'Damaraland', 'Etosha'],
    tripType: 'guided',
    heroImage:
      'https://images.unsplash.com/photo-1588453603478-3fda575e236c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2200',
    imageCredit: { name: 'Max Murauer', username: 'maxtheaviator' },
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Windhoek',
        location: 'Windhoek',
        description: 'Airport pickup and a relaxed first day.',
      },
      {
        day: 2,
        title: 'Windhoek City Tour & Kalahari',
        location: 'Windhoek → Kalahari',
        description:
          'A city tour taking in the Christuskirche and Alte Feste, then a sundowner drive into the Kalahari.',
      },
      {
        day: 3,
        title: 'Bushmen Wisdom & Quivertree Forest',
        location: 'Kalahari → Keetmanshoop',
        description:
          "A San Bushmen cultural experience, then the Quivertree Forest and Giant's Playground rock formations.",
      },
      {
        day: 4,
        title: 'Fish River Canyon & Kolmanskop',
        location: 'Fish River Canyon / Lüderitz',
        description:
          'A morning at Fish River Canyon, a visit to the ghost town of Kolmanskop, and an afternoon with the area’s wild horses.',
      },
      {
        day: 5,
        title: 'Into the Namib to Sossusvlei',
        location: '→ Sossusvlei',
        description: 'The drive north to Sossusvlei, with an afternoon stop at Elim Dune and Sesriem Canyon.',
      },
      {
        day: 6,
        title: 'Sossusvlei & Dead Vlei',
        location: 'Sossusvlei',
        description: 'A full day exploring Sossusvlei, Dead Vlei, Big Daddy Dune and Dune 45.',
      },
      {
        day: 7,
        title: 'To Swakopmund via the Moon Landscape',
        location: 'Sossusvlei → Swakopmund',
        description:
          "Departure through Solitaire and the Kuiseb Pass's moon landscape, arriving in Swakopmund for an afternoon of quad biking in the dunes.",
      },
      {
        day: 8,
        title: 'Marine & Desert Adventure',
        location: 'Swakopmund / Walvis Bay',
        description:
          'A morning dolphin and seal cruise, then an afternoon Sandwich Harbour 4x4 excursion with stops at the pink lake and its flamingos.',
      },
      {
        day: 9,
        title: 'Along the Coast to Damaraland',
        location: '→ Damaraland',
        description: 'More time at the pink lake and lagoon, then the drive to Twyfelfontein, passing the Zeila shipwreck.',
      },
      {
        day: 10,
        title: 'Twyfelfontein & Himba Village',
        location: 'Damaraland',
        description: 'The rock art at Twyfelfontein in the morning, then a visit to a Himba village in the afternoon.',
      },
      {
        day: 11,
        title: 'Etosha National Park',
        location: 'Etosha',
        description: 'A full day of game drives in Etosha National Park.',
      },
      {
        day: 12,
        title: 'Etosha & Okahandja',
        location: 'Etosha → Okahandja',
        description: "A final morning game drive, then a stop at the Okahandja woodcarvers' market.",
      },
      {
        day: 13,
        title: 'Departure',
        location: 'Windhoek Airport',
        description: 'Drop-off at Hosea Kutako International Airport.',
      },
    ],
    includes: [
      'Private transport with a professional guide',
      'Accommodation, sharing basis',
      'Park and conservation fees',
      'Activities listed in the itinerary',
      'Airport transfers',
    ],
    excludes: [
      'International flights',
      'Travel insurance',
      'Personal spending and gratuities',
      'Meals not specified as included',
    ],
  },
];

export const journeyBySlug = (slug: string): Journey | undefined =>
  journeys.find((journey) => journey.slug === slug);
