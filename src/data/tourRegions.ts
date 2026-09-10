// Map-journey data for the redesigned /tours page. Pin coordinates and
// zoom targets are hand-placed on the simplified NamibiaMap.astro
// viewBox (0 0 600 740) to approximate each tour's real relative
// position — not survey-accurate, just clearly separated and in the
// right part of the country (see NamibiaMap.astro for the region
// shapes this is drawn against).

export interface MapPin {
  slug: string;
  x: number;
  y: number;
}

export interface MapStop {
  region: 'erongo' | 'kunene' | 'hardap';
  regionLabel: string;
  /** Center of the zoom for this stop, in map viewBox units. */
  zoom: { x: number; y: number; scale: number };
  pins: MapPin[];
}

export const mapStops: MapStop[] = [
  {
    region: 'erongo',
    regionLabel: 'Erongo — Walvis Bay & Swakopmund',
    zoom: { x: 105, y: 400, scale: 2.1 },
    pins: [
      { slug: 'pelican-point-tour', x: 55, y: 430 },
      { slug: 'dolphin-seal-catamaran-cruise', x: 78, y: 393 },
      { slug: 'sandwich-harbour-full-day', x: 88, y: 462 },
      { slug: 'spitzkoppe-tour', x: 202, y: 328 },
    ],
  },
  {
    region: 'kunene',
    regionLabel: 'Kunene',
    zoom: { x: 135, y: 250, scale: 1.6 },
    pins: [
      { slug: 'skeleton-coast-tour', x: 50, y: 200 },
      { slug: 'etosha-tour', x: 220, y: 300 },
    ],
  },
  {
    region: 'hardap',
    regionLabel: 'Hardap',
    zoom: { x: 250, y: 490, scale: 1.5 },
    pins: [{ slug: 'sossusvlei-tour', x: 200, y: 480 }],
  },
];

/** Flat ordered list of every stop, for the scroll-journey step sequence. */
export const mapJourney = mapStops.flatMap((stop) =>
  stop.pins.map((pin) => ({ ...pin, region: stop.region, regionLabel: stop.regionLabel, zoom: stop.zoom }))
);
