// Multi-day, multi-location itineraries — a different product shape from
// the single-day/half-day entries in tours.ts, so they get their own data
// file, types, and pages (/journeys) rather than another `category` on
// the existing Tour type.
//
// No real journeys are defined yet: day-by-day routes, accommodation
// partners, and multi-day pricing all have to come from the owner —
// inventing them here would mean publishing fabricated itinerary content
// for a real, paying client. The /journeys pages are built to work
// correctly with zero entries (see journeys.astro's empty state) and
// pick up real content the moment it's added below.

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

export const journeys: Journey[] = [];

export const journeyBySlug = (slug: string): Journey | undefined =>
  journeys.find((journey) => journey.slug === slug);
