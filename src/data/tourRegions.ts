// Map-journey data for the redesigned /tours page. Pin coordinates are
// projected from each tour's real approximate lon/lat (same
// equirectangular, latitude-corrected projection NamibiaMap.astro's
// region outline was generated from, onto its 0 0 751 740 viewBox),
// then nudged a few units where needed so every pin actually lands
// inside its intended region's hand-drawn polygon rather than
// crossing a boundary by a couple of pixels — see NamibiaMap.astro for
// the region shapes this is drawn against.

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
    zoom: { x: 165, y: 375, scale: 2.1 },
    pins: [
      { slug: 'pelican-point-tour', x: 165, y: 374 },
      { slug: 'dolphin-seal-catamaran-cruise', x: 178, y: 363 },
      { slug: 'sandwich-harbour-full-day', x: 186, y: 391 },
      { slug: 'spitzkoppe-tour', x: 204, y: 303 },
    ],
  },
  {
    region: 'kunene',
    regionLabel: 'Kunene',
    zoom: { x: 175, y: 210, scale: 1.6 },
    pins: [
      { slug: 'skeleton-coast-tour', x: 127, y: 214 },
      { slug: 'etosha-tour', x: 230, y: 200 },
    ],
  },
  {
    region: 'hardap',
    regionLabel: 'Hardap',
    zoom: { x: 210, y: 469, scale: 1.5 },
    pins: [{ slug: 'sossusvlei-tour', x: 210, y: 469 }],
  },
];

/** Flat ordered list of every stop, for the scroll-journey step sequence. */
export const mapJourney = mapStops.flatMap((stop) =>
  stop.pins.map((pin) => ({ ...pin, region: stop.region, regionLabel: stop.regionLabel, zoom: stop.zoom }))
);
