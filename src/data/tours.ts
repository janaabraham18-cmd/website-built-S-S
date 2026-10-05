// Real offering content, transcribed from Salt and Sun Tours' 2026 rate sheet
// (pricing intentionally omitted until confirmed — see company notes).
// Skeleton Coast and Spitzkoppe each had two write-ups in the source with
// no price difference driving it; Version A was kept for both per the
// client's call. Sandwich Harbour's two versions are genuinely distinct
// products (full-day vs half-day), so both are kept.

export interface Tour {
  slug: string;
  category: 'tour' | 'adventure';
  name: string;
  description: string;
  duration?: string;
  note?: string;
  /**
   * A one-line cross-sell to the camping Journey that covers this same
   * destination overnight, for the handful of full-day tours a guest could
   * naturally extend into a camping trip. Kept as a distinct field rather
   * than reusing `note` — `note` is logistics (pickup times, minimum pax),
   * this is a cross-sell prompt, and conflating the two would make future
   * data entries ambiguous about which one they're writing.
   */
  campingUpgrade?: { text: string; href: string };
  included: string[];
  imageUrl?: string;
  imageCredit?: { name: string; username: string };
}

export const categoryLabels: Record<Tour['category'], { label: string; description: string }> = {
  tour: {
    label: 'Tours',
    description: 'Full-day, iconic-destination excursions further afield.',
  },
  adventure: {
    label: 'Adventures',
    description: 'An hour or an afternoon — the short, sharp stuff right around Swakopmund and Walvis Bay.',
  },
};

export const tours: Tour[] = [
  // --- Tours ---
  {
    slug: 'etosha-tour',
    category: 'tour',
    name: 'Etosha Tour',
    description:
      "Are you eager for an unforgettable wildlife experience? Join our Etosha Tour to explore one of Namibia's most iconic national parks, home to elephants, lions, rhinos, giraffes, and rich birdlife, set against breathtaking natural landscapes.",
    duration: 'Overnight · 2 days',
    campingUpgrade: {
      text: 'Prefer to sleep under the stars instead of a guesthouse? Ask us about swapping to a fenced camp inside Etosha.',
      href: '/contact',
    },
    included: [
      'Comfortable transport',
      'Professional guide',
      'Park entry fees',
      'Game drive inside Etosha',
      'Breakfast stop at Brandberg (meal at own cost)',
      'Bottled water, champagne and snacks',
      'Accommodation in Outjo (shared rooms)',
      'Return trip to Swakop',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1596225893172-1685676f0a50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    imageCredit: { name: 'Eelco Böhtlingk', username: 'eelco_bohtlingk' },
  },
  {
    slug: 'sossusvlei-tour',
    category: 'tour',
    name: 'Sossusvlei Tour',
    description:
      "Join us to explore Namibia's iconic red dunes and stunning desert landscapes. Join our Sossusvlei Tour to experience towering sand dunes, Deadvlei, and the unique beauty of the Namib Desert.",
    duration: 'Full-day',
    campingUpgrade: {
      text: 'Camp overnight and catch sunrise on the dunes before the crowds — see our 6-Day Spitzkoppe & Sossusvlei Camping Safari.',
      href: '/journeys#6-day-spitzkoppe-sossusvlei-camping-safari',
    },
    included: [
      'Transport',
      'Scenic desert drive',
      'Entrance fees',
      'Bottled water & snacks',
      'Champagne stop',
      'Driver/guide',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1587321174565-73cffc72e10a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    imageCredit: { name: 'Felipe Labate', username: 'felipelabate' },
  },
  {
    slug: 'skeleton-coast-tour',
    category: 'tour',
    name: 'Skeleton Coast Tour',
    description:
      "Are you eager to discover Namibia's most mysterious coastline? Join our Skeleton Coast Tour to explore dramatic shorelines, shipwrecks, seal colonies, and the raw beauty of the Atlantic Ocean.",
    duration: 'Full-day',
    included: [
      'Transport',
      'Scenic desert & coastal drive',
      'Park entrance fees',
      'Bottled water & snacks',
      'Champagne stop',
      'Driver/guide',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1551176968-bf1e434355f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    imageCredit: { name: 'Sam Power', username: 'sampowerphoto' },
  },
  {
    slug: 'sandwich-harbour-full-day',
    category: 'tour',
    name: 'Sandwich Harbour Tour',
    description:
      'This iconic tour is a photographer\'s dream — a 4×4 run past the Salt Pans and into the Namib-Naukluft Park "where ocean and desert meet," finishing at the Sandwich Harbour Lagoon. Guides show off their skills scaling gigantic sand dunes along the way. Choose a morning, afternoon, or sunset departure.',
    duration: '4 hours',
    note: 'Morning, afternoon, or sunset departures available — let us know your preference when booking.',
    included: [
      '4x4 scenic dune drive',
      'Pink Lake',
      'Salt Pans',
      'Flamingos & wetland birds',
      'Marine life animals',
      'Walvis Bay Lagoon & Peninsula',
      'Picnic (food/snacks)',
      'Champagne & other beverages',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1666837147745-1c9dea9908a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    imageCredit: { name: 'Joshua Kettle', username: 'joshuakettle' },
  },
  {
    slug: 'spitzkoppe-tour',
    category: 'tour',
    name: 'Spitzkoppe Tour',
    description:
      "Ready to explore Namibia's stunning granite peaks? Join our Spitzkoppe Tour to experience breathtaking rock formations, ancient rock art, and stunning desert landscapes under wide open skies.",
    duration: 'Full-day',
    campingUpgrade: {
      text: 'Turn this into an overnight — ask about camping under the arches on our 6-Day Spitzkoppe & Sossusvlei Camping Safari.',
      href: '/journeys#6-day-spitzkoppe-sossusvlei-camping-safari',
    },
    included: [
      'Transport',
      'Scenic desert & mountain drive',
      'Entrance fees',
      'Bottled water',
      'Snacks',
      'Champagne stop',
      'Driver/guide',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1711092047480-4382d9626abc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    imageCredit: { name: 'm_oros', username: 'm_oros' },
  },
  {
    slug: 'pelican-point-tour',
    category: 'tour',
    name: 'Pelican Point Tour',
    description:
      "Are you eager to explore Walvis Bay's scenic Pelican Point? Join our Pelican Point Tour to experience Cape fur seals, pelicans, flamingos, and breathtaking views where the desert meets the Atlantic Ocean.",
    duration: 'Full-day',
    note: 'Minimum 4 people',
    included: [
      'Pick-up & drop-off',
      'Pelican Point excursion',
      'Seal colony & pelican spotting',
      'Scenic lagoon & coastline views',
      'Photo opportunities',
      'Optional boat cruise or kayaking',
      'Explore the lagoon up close',
      'Relax & enjoy the pristine beaches',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1705065277882-b0604ec13dca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    imageCredit: { name: 'Colin Watts', username: 'colinwatts' },
  },
  {
    slug: 'moonlandscape-tour',
    category: 'tour',
    name: 'Moonlandscape Tour',
    description:
      'As you venture into the valleys of the Swakop River you will get to a spectacular and unusual moonscape. Learn about the minerals and the plants of the area. A stop will be made to see the variety of lichen in the area and the indigenous Welwitschia plant.',
    duration: '4 hrs',
    included: ['Transfers', 'Water'],
    imageUrl:
      'https://images.unsplash.com/photo-1766470956586-2b969d67b391?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Abhi Verma', username: 'abhiver' },
  },
  {
    slug: 'cape-cross',
    category: 'tour',
    name: 'Cape Cross',
    description:
      'Watch thousands of seals bask in the sun at Cape Cross — excellent photo opportunities and an unforgettable sight. We head north past Henties Bay to the first regional post office, cemetery and the first known railway in the territory. On the way back, we cruise through the lichen fields and on to the Zeila Shipwreck.',
    duration: '4 hrs',
    note: 'Departs at 08h00',
    included: ['Transfers', 'Water', 'Park fees'],
    imageUrl:
      'https://images.unsplash.com/photo-1601870431533-c658027e3d96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Seiji Seiji', username: 'seijiseiji' },
  },
  {
    slug: 'living-desert-tour',
    category: 'tour',
    name: 'Living Desert Tour',
    description:
      'Come explore the Namib Desert on this 4-wheel drive trip and discover its many wonders. The life-giving fog supports a wealth of fauna and flora. Sidewinder snakes, White Lady spiders, Namaqua chameleons, dancing lizards and much more can be seen. Excellent photographic opportunities.',
    duration: '+/-3 hrs',
    note: 'Pick-up from 8h30',
    included: ['Transfers', 'Water'],
    imageUrl:
      'https://images.unsplash.com/photo-1761071149747-db3277fb8615?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Nadine Marfurt', username: 'nadine3' },
  },
  {
    // Recategorized from 'adventure' to 'tour' — this is a proper
    // sightseeing tour departing Walvis Bay harbour like Pelican Point,
    // not a short activity, so it belongs with the other destination
    // tours rather than the Adventures grid.
    slug: 'dolphin-seal-catamaran-cruise',
    category: 'tour',
    name: 'Dolphin & Seal Catamaran Cruise',
    description:
      "Cruise on a luxurious catamaran and have unforgettable encounters with Namibia's marine life. In addition to the rescue seals and pelicans who often join guests on the boat, dolphins, whales, Mola fish, and turtles can be seen on this cruise.",
    duration: '3.5 hours',
    note: 'Pick-up from 07h45, return to hotel around 13h00',
    included: [
      'Sparkling wine',
      'Fresh oysters',
      'Snacks',
      'Variety of drinks',
      'Transfers available at additional cost (subject to availability, please enquire)',
    ],
    imageUrl: '/images/catamaran-cruise.jpg',
  },

  // --- Adventures ---
  {
    slug: 'quad-bike-tour',
    category: 'adventure',
    name: 'Quad Bike Tour',
    description:
      'Our most popular tour! It\'s an adventure the whole family will enjoy. Speed along huge sand dunes on your quad bike. Experience the immensity of the desert and appreciate the breathtaking views. Beginners welcome. No license needed.',
    duration: '30 min / 45 min / 1 hr / 90 min / 2 hrs',
    included: [
      '30/45/60/90 min: safety gear',
      '2 hrs: safety gear, water, transfers',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1769450290445-3daed0c8fe63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Luan Fonseca', username: 'luanfonsecavisuals' },
  },
  {
    slug: 'explorer-tour',
    category: 'adventure',
    name: 'Explorer Tour (quad bike)',
    description:
      'This is a slow-paced quad bike tour but not lacking adventure. We make plenty of stops for an educational experience, as your guide aims to show you all the wonderful plant- and animal-life of the Namib. Interesting encounters with little critters make this trip really fun.',
    duration: '2h30min',
    note: 'Pick-up time 8h30, Sundays 9h30',
    included: ['Transfers', 'Safety gear', 'Water'],
    imageUrl:
      'https://images.unsplash.com/photo-1542762002-45279e010961?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Andre Mouton', username: 'andremouton' },
  },
  {
    slug: 'breakfast-run',
    category: 'adventure',
    name: 'Breakfast Run',
    description:
      'We take a quad bike ride deep into the desert, towards beautiful Rossmund Golf Estate. With an excellent view of the golf course, you can try to spot springbok and possibly other wildlife while you enjoy a hearty breakfast, after which we head back on the quad bikes.',
    duration: '3 hrs',
    note: 'Minimum 2 pax',
    included: ['Transfers', 'Safety gear', 'Breakfast at Rossmund Golf Estate'],
    imageUrl:
      'https://images.unsplash.com/photo-1742237281790-a0f480af2f91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Humphrey M', username: 'good_citizen' },
  },
  {
    slug: 'paragliding',
    category: 'adventure',
    name: 'Paragliding',
    description:
      "With the fresh southwesterly winds and a nice, soft place to land, the dunes around Swakopmund can be considered a fantastic paragliding site. Soar over dunes and watch the Atlantic while you're up there — we doubt you'll get a better view in Namibia!",
    included: ['Transfers', 'All gear'],
    imageUrl:
      'https://images.unsplash.com/photo-1773769730380-ba3b225c27e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Alberto Lung', username: 'albertolung' },
  },
  {
    slug: 'camel-ride',
    category: 'adventure',
    name: 'Camel Ride',
    description:
      'This is such a fun experience and a must-try for the whole family. A great idea for photoshoots too. Our guide will take you through the Swakopmund river, to the start of the Namib Desert, where you can take plenty of pictures, before heading back to our Adventure Centre.',
    duration: '30 min',
    included: ['No equipment needed'],
    imageUrl:
      'https://images.unsplash.com/photo-1547234936-74a4b1ee7f42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Juli Kosolapova', username: 'yuli_superson' },
  },
  {
    slug: 'special-quad-90min',
    category: 'adventure',
    name: 'Special Quad 90min',
    description:
      'We combine an adventure-filled quad bike ride with the beauty of the late afternoon dusk. Follow your guide along huge sand dunes, until he finds the most picturesque location for you to sit and enjoy fresh Namibian oysters and non-alcoholic champagne.',
    duration: '90 min',
    note: 'Minimum 2 pax. Pick-up time from 16h00–16h30. Tour ends by 6pm.',
    included: ['Safety gear', 'Transfers', 'Non-alcoholic champagne', 'Fresh oysters'],
    imageUrl:
      'https://images.unsplash.com/photo-1771148884276-2f101fcadcb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'quentin touvard', username: 'qt_picture' },
  },
  {
    slug: 'sandboarding',
    category: 'adventure',
    name: 'Sandboarding',
    description:
      'Those wanting speed and an adrenaline-filled activity should choose this! We offer lie-down or stand-up sandboarding. No experience needed.',
    note: 'Lie-down or stand-up. Pick-up time from 9h30, tour completed around 13h30. Minimum 4 pax.',
    included: ['Transfers', 'Safety gear', 'All equipment', 'Water', 'Light lunch'],
    imageUrl:
      'https://images.unsplash.com/photo-1715876068166-51cffcbb0405?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Jorge Otero', username: 'oterex' },
  },
  {
    slug: 'township-tour',
    category: 'tour',
    name: 'Township Tour',
    description:
      "Are you eager for a cultural immersion, ready to learn something new? Then try our tour to Swakopmund's Damara, Herero and Ovambo sectors of the township to experience the local Namibian traditional cuisine and culture of these tribes.",
    duration: '3 hrs',
    note: 'Pick-up 10h00 or 15h00',
    included: ['Transfers', 'Traditional meal', 'Drinks'],
    imageUrl:
      'https://images.unsplash.com/photo-1603703182693-51a19941fa59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Ken kahiri', username: 'kahiriken' },
  },
  {
    slug: 'kayaking',
    category: 'adventure',
    name: 'Kayaking',
    description:
      'Kayak amongst hundreds of Cape fur seals at popular Pelican Point. This tour departs from Walvis Bay, and stops are made along the way to the kayaking point. Excellent photo opportunities.',
    duration: '08h00–12h30 (pick-up from 8am, tour completed around 15h00)',
    included: [
      'Light snack & warm beverage',
      'Cold drinks',
      'Oysters',
      'Sparkling wine',
      'All equipment',
      'Transfers at additional cost',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1768116439689-ddbcf440c58c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Tommy Shen', username: 'ghostlikei' },
  },
  {
    slug: 'fat-bike-tour',
    category: 'adventure',
    name: 'Fat Bike Tour',
    description:
      'A unique Namibian cycling experience! Balloon-like tyres on our fat bikes make pedaling through the desert effortless. Enjoy a quiet and adventurous tour, fun for the whole family!',
    note: 'Regular or e-bike',
    included: ['All gear and water'],
    imageUrl:
      'https://images.unsplash.com/photo-1772114010042-9ba2a9e1206c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Karel Delvoije', username: 'velo1901' },
  },
  {
    slug: 'fishing',
    category: 'adventure',
    name: 'Fishing',
    description:
      'Shore or boat options are available to enjoy this fishing experience. Good catches can be expected all year round. The following species can be caught: Kabeljou, Steenbras, Barbel, Galjoen, Garrick and various sharks. Are you feeling lucky?',
    note: 'Boat or shore. Pick-up from 08h15, tour ends around 13h00.',
    included: ['Transfers', 'All equipment and permits', 'Lunch', 'Drinks'],
    imageUrl:
      'https://images.unsplash.com/photo-1622713486130-aa0177e64542?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Paul Einerhand', username: 'pauleinerhand' },
  },
  {
    slug: 'tandem-skydive',
    category: 'adventure',
    name: 'Tandem Skydive',
    description:
      "How's this for a bucket list activity! Sky-dive over the scenic Namib, an experience you'll never forget. A 35-minute scenic flight takes you up to 10,000 feet — exit the plane and spend 30–35 seconds free-falling at 220km/h, then enjoy 5–8 minutes descending to a tiptoe landing.",
    note: 'Video camera available as an add-on. Jumps are weather permitting.',
    included: ['Transfers', 'Safety gear'],
    imageUrl:
      'https://images.unsplash.com/photo-1659901981145-dbc056431a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Kamil Pietrzak', username: 'kamilpphotos' },
  },
  // --- Family Fun ---
  {
    slug: 'go-karting',
    category: 'adventure',
    name: 'Go Karting',
    description:
      "Strap in and race the clock — or each other — on the go-kart track. A short, high-energy burst of fun that works for a mixed group, no experience needed.",
    duration: '20 min',
    included: ['Helmet & safety briefing', 'Track time'],
    imageUrl:
      'https://images.unsplash.com/photo-1640084347692-e8f6b84caa7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Appic', username: 'appic_cc' },
  },
  {
    slug: 'putt-putt-golf',
    category: 'adventure',
    name: 'Putt Putt Golf',
    description:
      "A relaxed round of mini golf for every age and skill level — no itinerary, no rush, just a fun afternoon putting your way around the course with the whole family in tow.",
    duration: '45 min',
    included: ['Putter & ball', 'Scorecard'],
    imageUrl:
      'https://images.unsplash.com/photo-1783305828942-927765b1866c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Compagnons', username: 'sigmund' },
  },
  {
    slug: 'trampoline-park',
    category: 'adventure',
    name: 'Trampoline Park',
    description:
      'Wall-to-wall trampolines and foam pits — the kind of just-bounce-it-out fun that tires out kids (and more than a few adults) in the best way.',
    duration: '1 hour',
    included: ['Jump socks', 'Safety briefing'],
    imageUrl:
      'https://images.unsplash.com/photo-1751235640841-d8d1035a80f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Lawrence Crayton', username: 'lawrencecrayton' },
  },
];

export function toursByCategory(category: Tour['category']): Tour[] {
  return tours.filter((tour) => tour.category === category);
}

export function tourBySlug(slug: string): Tour | undefined {
  return tours.find((tour) => tour.slug === slug);
}
