// Route lines for the map at the bottom of /journeys — one entry per
// journey in journeys.ts (matched by slug). Kept separate from that file
// for the same reason tourRegions.ts is separate from tours.ts: this is
// map-drawing data, not trip content.
//
// Points are in NamibiaMap.astro's 0 0 751 740 viewBox. Coastal/Spitzkoppe/
// Etosha/Sossusvlei points reuse the exact coordinates already established
// in tourRegions.ts for those same real places, so this map lines up with
// the one on the tours page. Everywhere else (Windhoek, Damaraland, the
// far south, Okahandja) doesn't have an established pin yet, so those are
// placed by region — same "hand-placed within a real region shape"
// approach NamibiaMap.astro's own internal region borders already use,
// not a precise survey.

import type { MapRoute } from '../components/NamibiaMap.astro';

const windhoek = { x: 355, y: 320 };
const okahandja = { x: 350, y: 275 };
const sossusvlei = { x: 210, y: 469 }; // same point as tourRegions.ts's sossusvlei-tour pin
const swakopmund = { x: 180, y: 370 };
const walvisBay = { x: 188, y: 390 };
const hentiesBay = { x: 168, y: 345 };
const spitzkoppe = { x: 204, y: 303 }; // same point as tourRegions.ts's spitzkoppe-tour pin
const damaraland = { x: 185, y: 250 };
const etosha = { x: 230, y: 200 }; // same point as tourRegions.ts's etosha-tour pin
const kalahari = { x: 440, y: 440 };
const keetmanshoop = { x: 300, y: 585 };
const fishRiverCanyon = { x: 330, y: 660 };
const luderitz = { x: 220, y: 610 };

export const journeyRoutes: MapRoute[] = [
  {
    slug: '5-day-sossusvlei-coast',
    color: '#9c4d33', // terracotta-600
    points: [windhoek, sossusvlei, swakopmund, walvisBay],
  },
  {
    slug: '10-day-namibia-grand-tour',
    color: '#c1863a', // ochre-500
    points: [windhoek, sossusvlei, swakopmund, spitzkoppe, damaraland, etosha, windhoek],
  },
  {
    slug: '8-day-windhoek-coastal-discovery',
    color: '#3a231c', // earth-900
    dash: '9 7',
    points: [windhoek, swakopmund, walvisBay, hentiesBay],
  },
  {
    slug: '13-day-namibia-complete-safari',
    color: '#b5623f', // terracotta-500
    dash: '2 5',
    points: [
      windhoek,
      kalahari,
      keetmanshoop,
      fishRiverCanyon,
      luderitz,
      sossusvlei,
      swakopmund,
      damaraland,
      etosha,
      okahandja,
      windhoek,
    ],
  },
];
