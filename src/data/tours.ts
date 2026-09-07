// Real offering content, transcribed from Salt & Sun Tours' 2026 rate sheet
// (pricing intentionally omitted until confirmed — see company notes).
// Skeleton Coast and Spitzkoppe each had two write-ups in the source with
// no price difference driving it; Version A was kept for both per the
// client's call. Sandwich Harbour's two versions are genuinely distinct
// products (full-day vs half-day), so both are kept.

export interface Tour {
  slug: string;
  category: 'tour' | 'adventure' | 'combo';
  name: string;
  description: string;
  duration?: string;
  note?: string;
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
    description: 'Shorter, activity-based excursions around Swakopmund and Walvis Bay.',
  },
  combo: {
    label: 'Combo deals',
    description: 'Pair two experiences together, on the same day or across different days.',
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
      'https://images.unsplash.com/photo-1636099487113-ce0a5565b578?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    imageCredit: { name: 'Chris Stenger', username: 'chrisstenger' },
  },
  {
    slug: 'sossusvlei-tour',
    category: 'tour',
    name: 'Sossusvlei Tour',
    description:
      "Join us to explore Namibia's iconic red dunes and stunning desert landscapes. Join our Sossusvlei Tour to experience towering sand dunes, Deadvlei, and the unique beauty of the Namib Desert.",
    included: [
      'Transport',
      'Scenic desert drive',
      'Entrance fees',
      'Bottled water & snacks',
      'Champagne stop',
      'Driver/guide',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1707470121585-23ecf4671684?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    imageCredit: { name: 'm_oros', username: 'm_oros' },
  },
  {
    slug: 'skeleton-coast-tour',
    category: 'tour',
    name: 'Skeleton Coast Tour',
    description:
      "Are you eager to discover Namibia's most mysterious coastline? Join our Skeleton Coast Tour to explore dramatic shorelines, shipwrecks, seal colonies, and the raw beauty of the Atlantic Ocean.",
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
    name: 'Sandwich Harbour Tour (Full-day)',
    description:
      'This iconic tour is a photographer\'s dream. This is a 4×4 tour past the Salt Pans and into the Namib-Naukluft Park "where ocean and desert meet." Our last stop is the Sandwich Harbour Lagoon. This is an exciting tour where guides will show off their skills while scaling gigantic sand dunes.',
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
      'Those wanting speed and an adrenaline-filled activity should choose this! We offer lie-down or stand-up sandboarding. No experience needed. Check out our combo deals for more sandboarding options.',
    note: 'Lie-down or stand-up. Pick-up time from 9h30, tour completed around 13h30. Minimum 4 pax.',
    included: ['Transfers', 'Safety gear', 'All equipment', 'Water', 'Light lunch'],
    imageUrl:
      'https://images.unsplash.com/photo-1715876068166-51cffcbb0405?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Jorge Otero', username: 'oterex' },
  },
  {
    slug: 'living-desert-tour',
    category: 'adventure',
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
    slug: 'township-tour',
    category: 'adventure',
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
    slug: 'dolphin-seal-catamaran-cruise',
    category: 'adventure',
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
    imageUrl:
      'https://images.unsplash.com/photo-1440020143730-090579c4d53c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Talia Cohen', username: 'taliacohen' },
  },
  {
    slug: 'sandwich-harbour-half-day',
    category: 'adventure',
    name: 'Sandwich Harbour Tour (Half-day)',
    description:
      'This iconic tour is a photographer\'s dream. This is a 4×4 tour past the Salt Pans and into the Namib-Naukluft Park "where ocean and desert meet." Our last stop is the Sandwich Harbour Lagoon. This is an exciting tour where guides will show off their skills while scaling gigantic sand dunes.',
    note: 'Half-day tour',
    included: [
      'Light lunch',
      'Drinks',
      'Transfers available at additional cost (subject to availability, please enquire)',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1667666670938-4e89397d7c06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Florian Delée', username: 'florian_delee' },
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
      'https://images.unsplash.com/photo-1782110112270-9f19439ad5dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Erwan Hesry', username: 'erwanhesry' },
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
  {
    slug: 'moonlandscape-tour',
    category: 'adventure',
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
    category: 'adventure',
    name: 'Cape Cross',
    description:
      'Watch thousands of seals bask in the sun at Cape Cross — excellent photo opportunities and an unforgettable sight. We head north past Henties Bay to the first regional post office, cemetery and the first known railway in the territory. On the way back, we cruise through the lichen fields and on to the Zeila Shipwreck.',
    duration: '4 hrs',
    note: 'Departs at 08h00',
    included: ['Transfers', 'Water', 'Park fees'],
    imageUrl:
      'https://images.unsplash.com/photo-1782841027397-1ffc35ea9eef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Trenton Alarcon', username: 'tatertots4robots' },
  },

  // --- Combo deals ---
  {
    slug: 'explorer-combo',
    category: 'combo',
    name: 'Explorer Combo',
    description:
      'Wow — the ultimate combo! Experience an adrenaline-filled quad bike ride, along with some action-packed lie-down sandboarding, with a third part of the tour being a more relaxed quad bike ride where you get to see animals and plant life of the desert.',
    duration: '3h30min',
    note: 'Pick-up time 8h30, Sundays 9h30',
    included: ['Transfers', 'Safety gear', 'Water'],
    imageUrl:
      'https://images.unsplash.com/photo-1765416320238-910536a59da3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Margaret Szarzynski', username: 'margoszar' },
  },
  {
    slug: 'unity-combo',
    category: 'combo',
    name: 'Unity Combo',
    description:
      'Experience a catamaran cruise in Walvis Bay and an adrenaline-filled quad bike ride in the desert in Swakopmund. These trips can be done on the same day, or on different days. A fantastic combo where you can experience the best Namibia has to offer.',
    note: 'Combines a 1 hour quad bike ride with a 3h30min catamaran cruise',
    included: [
      'Drinks',
      'Oysters',
      'Light lunch',
      'Sparkling wine',
      'Transfers at additional cost (subject to availability)',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1593536284003-ef3103cff953?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Alix Greenman', username: 'alixgreenman' },
  },
  {
    slug: 'freedom-combo',
    category: 'combo',
    name: 'Freedom Combo',
    description:
      'Enjoy a catamaran cruise in Walvis Bay and a relaxing camel ride in the desert in Swakopmund. These trips can be done on the same day, or on different days. A fun combo for the whole family to enjoy.',
    note: 'Combines a 30 min camel ride with a 3h30min catamaran cruise',
    included: [
      'Drinks',
      'Oysters',
      'Light lunch',
      'Sparkling wine',
      'Transfers at additional cost (subject to availability)',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1535190823090-3c159ed10a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Y K', username: 'yokeboy' },
  },
  {
    slug: 'quad-bike-sandboarding-combo',
    category: 'combo',
    name: 'Quad Bike / Sandboarding Combo',
    description:
      'Want to get the ultimate desert experience while in Namibia? Try our combo deal! You can choose between a 2 or 3 hour excursion. Both options offer 1hr lie-down sandboarding, and the rest of the time is for you to enjoy on your quad bike!',
    duration: '2 hrs or 3 hrs',
    included: ['Transfers', 'Safety gear', 'All equipment', 'Water'],
    imageUrl:
      'https://images.unsplash.com/photo-1742237281789-c37c5b38e0a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Humphrey M', username: 'good_citizen' },
  },
  {
    slug: 'surf-and-turf',
    category: 'combo',
    name: 'Surf & Turf',
    description:
      'This combo package takes you from the towering dunes of the Namib to the refreshing ocean breeze of the Atlantic. Guests are transferred to Walvis Bay to enjoy an unforgettable catamaran cruise in the morning, then finish the day with an adrenaline-packed quad bike ride in Swakopmund!',
    note: 'Combines a 90 min quad bike ride with a 3h30min catamaran cruise',
    included: [
      'Drinks',
      'Oysters',
      'Light lunch',
      'Sparkling wine',
      'Transfers at additional cost (subject to availability)',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1504813205186-380b1235a5d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Matthias Jordan', username: 'iammatthias' },
  },
  {
    slug: 'kayak-catamaran-combo',
    category: 'combo',
    name: 'Kayak / Catamaran Combo',
    description:
      "Enjoy a half day kayaking experience at the Pelican Point seal colonies and a catamaran dolphin cruise. Tours can be done on the same day (PM catamaran cruise) or on different days. A great combo if you're a sea-lover and want to experience what Namibia's coast has to offer.",
    note: 'No kayaking for kids under 4',
    included: [
      'Kayak: sandwich and hot/cold beverages',
      'Catamaran: snacks, oysters, hot/cold beverages, sparkling wine',
      'Transfers at additional cost (subject to availability)',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1778379591293-36b4cb24324f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Amanda Swanepoel', username: 'amandaswanepoel' },
  },
  {
    slug: 'kayak-sandwich-harbour-combo',
    category: 'combo',
    name: 'Kayak / Sandwich Harbour Combo',
    description:
      'From an ocean experience to the towering sand dunes of the Namib — best of both worlds. Enjoy a kayaking experience in the morning at Pelican Point followed by a half-day Sandwich Harbour 4x4 tour.',
    note: 'Minimum 3 pax. No kayaking for kids under 4.',
    included: [
      'Kayak: sandwich and hot/cold beverages',
      'Sandwich Harbour: refreshments',
      'Transfers at additional cost (subject to availability)',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1762947240379-150d9a6ee659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Jan Suchánek', username: 'johnny_slav' },
  },
  {
    slug: 'catamaran-sandwich-harbour-combo',
    category: 'combo',
    name: 'Catamaran / Sandwich Harbour Combo',
    description:
      'From an ocean experience to the towering sand dunes of the Namib — best of both worlds. Enjoy a catamaran experience in the morning departing from Walvis Bay followed by a half-day Sandwich Harbour 4x4 tour.',
    note: 'Minimum 3 pax',
    included: [
      'Sandwich Harbour: refreshments',
      'Catamaran: snacks, oysters, hot/cold beverages, sparkling wine',
      'Transfers at additional cost (subject to availability)',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1717054373388-b405bfd27707?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    imageCredit: { name: 'Jay Alexander', username: 'jasont378' },
  },
];

export function toursByCategory(category: Tour['category']): Tour[] {
  return tours.filter((tour) => tour.category === category);
}
