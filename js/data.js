/* ==========================================================================
   SITE SETTINGS AND LISTINGS
   Edit this file to change contact details and properties.
   No other file needs to change for normal updates.
   ========================================================================== */

const SITE = {
  brand: "Ohk Properties",
  tagline: "Properties and Rentals",
  // WhatsApp number in international format, digits only (no + or spaces)
  whatsapp: "+233 592 354 383",
  // Phone number used for tel: links
  phone: "+233 243 407 785",
  // Phone number as shown on the page
  phoneDisplay: "+233 592 354 383",
  email: "kojomike777@gmail.com",
  address: "Kwabenya - School Junction, Accra, Ghana",
  hours: "9:00 AM - 6:00 PM",
  currency: "GH₵",

  // ---- Search engine (SEO) settings, used by build.js ----
  // IMPORTANT: replace with your real website address, with no trailing slash.
  url: "https://www.your-domain.com",
  streetAddress: "Kwabenya - School Junction",
  locality: "Accra",
  region: "Greater Accra",
  countryCode: "GH"
};

/* --------------------------------------------------------------------------
   LISTINGS
   type:    "sale" | "rent" | "land"  (land listings need no beds/baths)
   price:   a number, or null to show "Price on request"
   period:  text shown after the price, e.g. "per month" or "per year" (optional)
   status:  "Available" | "Under offer" | "Let" | "Sold"
   images:  first image is the main photo; add as many as you like
   seoTitle / seoDescription (optional): override the text Google may show in results.
   After any change to this file, run  node build.js  to refresh the search pages.
   -------------------------------------------------------------------------- */

const IMG = (id) => "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=1200&q=75";

const LISTINGS = [
  {
    id: "3-bedroom-house-lakeside-estates",
    type: "rent",
    title: "3-Bedroom House, Lakeside Estates",
    area: "Lakeside Estates",
    price: 4000,
    period: "per Month",
    status: "Available",
    beds: 3, baths: 3, size: "872 sqm",
    // Extra rows shown in the "Details" grid on the property page
    extra: [
      ["Address", "Lakeside Estates c5"],
      ["Condition", "Newly built"],
      ["Furnishing", "Semi-furnished"],
      ["Self contained", "Yes"],
      ["Minimum rental period", "12 months"],
      ["Agency fee", "10"],
      ["Caution fee", "200"]
    ],
    features: ["Pre-paid meter", "24-hour electricity", "Backup generator", "Hot water", "Wi-Fi", "Balcony", "Dining area", "Appliances", "Wardrobes", "En-suite bathroom", "Gym", "BBQ area", "Emergency exits", "Firefighting equipment"],
    description: "A newly built, semi-furnished, self-contained 3-bedroom house in Lakeside Estates with three toilets, an en-suite bathroom, a balcony and a dining area. The estate has 24-hour electricity, a backup generator, hot water, Wi-Fi, a gym and a BBQ area. Minimum rental period is 12 months.",
    images: [
      "images/new-listing/living-room-1.webp",
      "images/new-listing/living-room-2.webp",
      "images/new-listing/living-room-3.webp",
      "images/new-listing/room-black-marble.webp",
      "images/new-listing/kitchen-1.webp",
      "images/new-listing/kitchen-2.webp",
      "images/new-listing/bedroom.webp",
      "images/new-listing/bathroom.webp",
      "images/new-listing/entrance-hall.webp"
    ]
  },
  {
    id: "3-bedroom-house-kwabenya",
    type: "rent",
    title: "3-Bedroom House in Kwabenya",
    area: "Kwabenya",
    price: 3500,
    period: "per Month",
    status: "Available",
    beds: 3, baths: 1, size: "150 sqm",   // listing said 15 sqm, which looks like a typo for a 3-bedroom house
    extra: [
      ["Address", "Kwabenya, near Jordan Hotel"],
      ["District", "Ga East Municipal, Greater Accra"],
      ["Condition", "Fairly used"],
      ["Furnishing", "Unfurnished"],
      ["Self contained", "Yes"]
    ],
    features: ["Pre-paid meter", "24-hour electricity", "Tiled floors", "Fitted kitchen"],
    description: "A self-contained, unfurnished 3-bedroom house in Kwabenya, Ga East Municipal, with tiled floors, a fitted kitchen, a pre-paid meter and 24-hour electricity.",
    images: [
      "images/kwabenya/exterior.webp",
      "images/kwabenya/living-room-1.webp",
      "images/kwabenya/living-room-2.webp",
      "images/kwabenya/kitchen-1.webp",
      "images/kwabenya/kitchen-2.webp",
      "images/kwabenya/bedroom.webp",
      "images/kwabenya/bathroom-1.webp",
      "images/kwabenya/bathroom-2.webp"
    ]
  },
  {
    id: "2-bedroom-furnished-apartment-tantra-hills",
    type: "rent",
    title: "2-Bedroom Furnished Apartment",
    area: "Tantra Hills",
    price: 8000,
    period: "per Month",
    status: "Available",
    beds: 2, baths: 2, size: "16 sqm",   // listing said 16 sqm, which looks like a typo for a 2-bedroom apartment
    extra: [
      ["Address", "Near the main road, 2 minutes' drive from Mile 7 Park"],
      ["Estate", "Madev Realty"],
      ["Condition", "Fairly used"],
      ["Furnishing", "Furnished"],
      ["Self contained", "Yes"]
    ],
    features: ["Pre-paid meter", "24-hour electricity", "Backup generator", "Air conditioning", "Balcony", "CCTV", "Dining area", "Fitted kitchen", "En-suite bathroom", "Hot water", "Wardrobes", "TV", "Wi-Fi", "Firefighting equipment"],
    description: "A furnished, self-contained 2-bedroom apartment in Tantra Hills, near the main road and about 2 minutes' drive from Mile 7 Park. It has air conditioning, a fitted kitchen, an en-suite bathroom, hot water, built-in wardrobes, a TV, Wi-Fi, a balcony and CCTV, with 24-hour electricity and a backup generator.",
    images: [
      "images/tantra-hills/living-room-wide.webp",
      "images/tantra-hills/master-bedroom.webp",
      "images/tantra-hills/living-room-ceiling.webp",
      "images/tantra-hills/kitchen.webp",
      "images/tantra-hills/bedroom-1.webp",
      "images/tantra-hills/bedroom-2.webp",
      "images/tantra-hills/wardrobe.webp",
      "images/tantra-hills/bathroom-1.webp",
      "images/tantra-hills/bathroom-2.webp",
      "images/tantra-hills/water-heater.webp",
      "images/tantra-hills/hallway-fridge.webp"
    ]
  },
  {
    id: "4-bedroom-detached-house-east-legon",
    type: "rent",           // not stated in the details: change to "sale" if it is for sale
    title: "4-Bedroom Detached House, East Legon",
    area: "East Legon",
    price: 15000,
    period: "per Month",
    status: "Available",
    beds: 4, baths: 4, size: "100 sqm",   // listing said 100 sqm, which looks too small for a 4-bedroom detached house
    extra: [
      ["Address", "East Legon"],
      ["Property type", "Detached house"],
      ["Condition", "Newly built"],
      ["Self contained", "Yes"]
    ],
    features: ["24-hour electricity", "Pre-paid meter", "Air conditioning", "Hot water", "Balcony", "Dining area", "Kitchen cabinets", "Kitchen shelf", "Refrigerator", "Microwave", "Dishwasher", "Wardrobes", "TV", "Wi-Fi", "Chandelier", "POP ceiling", "Tiled floors"],
    description: "A newly built, self-contained 4-bedroom detached house in East Legon with four bathrooms, a balcony and a dining area. The kitchen has fitted cabinets, a refrigerator, a microwave and a dishwasher, and the house has air conditioning, hot water, POP ceilings, tiled floors, a TV and Wi-Fi, with 24-hour electricity.",
    images: [
      "images/east-legon/exterior.webp",
      "images/east-legon/living-room-1.webp",
      "images/east-legon/living-room-2.webp",
      "images/east-legon/kitchen-1.webp",
      "images/east-legon/kitchen-2.webp",
      "images/east-legon/dining-room.webp",
      "images/east-legon/bedroom-1.webp",
      "images/east-legon/bedroom-2.webp",
      "images/east-legon/bedroom-3.webp",
      "images/east-legon/bathroom-1.webp",
      "images/east-legon/bathroom-2.webp"
    ]
  },
  {
    id: "5-bedroom-house-klagon",
    type: "sale",
    title: "5-Bedroom House with Swimming Pool, Klagon",
    area: "Klagon",
    city: "Tema",           // shown after the area; defaults to "Accra" when left out
    price: 1850000,
    period: "",
    status: "Available",
    beds: 5, baths: 5, size: "358 sqm",
    extra: [
      ["Location", "Klagon, Tema Metropolitan, Greater Accra"],
      ["Condition", "Newly built"],
      ["Furnishing", "Semi-furnished"],
      ["Toilets", "6"]
    ],
    // The amenities list was not in the screenshot, so these come from the photos only. Add the rest.
    features: ["Swimming pool", "Carport", "Balcony", "Fitted kitchen", "Washing machine", "Home bar"],
    description: "A newly built, semi-furnished 5-bedroom house for sale in Klagon, Tema Metropolitan, with five bathrooms and six toilets. It has a private swimming pool, a carport, a glass-fronted balcony, a fitted kitchen and a built-in home bar under the staircase.",
    images: [
      "images/klagon/exterior-front.webp",
      "images/klagon/exterior-entrance.webp",
      "images/klagon/exterior-side.webp",
      "images/klagon/swimming-pool.webp",
      "images/klagon/living-room.webp",
      "images/klagon/staircase-bar.webp",
      "images/klagon/kitchen-1.webp",
      "images/klagon/kitchen-2.webp"
    ]
  },
  {
    id: "newly-built-house-east-legon-hills",
    type: "sale",
    title: "Newly Built House, East Legon Hills",
    area: "East Legon Hills",
    price: 2500000,
    period: "",
    status: "Available",
    beds: null, baths: null, // not in the listing details; add the numbers (for example beds: 4) once confirmed
    size: "5000 sqm",       // check this against the original listing, it looks large for a house
    extra: [
      ["Condition", "Newly built"],
      ["Furnishing", "Unfurnished"],
      ["Estate", "Royal Footprints Properties"]
    ],
    features: ["Kitchen cabinets", "Dining area", "POP ceiling", "Air conditioning", "Chandelier", "Hot water", "Microwave", "Tiled floor", "24-hour electricity", "Balcony", "En suite", "Kitchen shelf", "Pre-paid meter"],
    description: "A newly built, unfurnished house for sale in East Legon Hills. It has kitchen cabinets, a dining area, POP ceiling, air conditioning, a chandelier, hot water, a balcony, en suite rooms and a pre-paid meter, with 24-hour electricity.",
    images: [
      "images/east-legon-hills/exterior.webp"
    ]
  },
  {
    id: "3-bedroom-house-kokrobite",
    type: "sale",
    title: "3-Bedroom House, Kokrobite",
    area: "Kokrobite",
    city: "Ga South",       // shown after the area; defaults to "Accra" when left out
    price: 1300000,
    period: "",
    status: "Available",
    beds: 3, baths: 3, size: "180 sqm",
    extra: [
      ["Location", "Kokrobite, Ga South Municipal, Greater Accra"],
      ["Condition", "Newly built"],
      ["Furnishing", "Unfurnished"],
      ["Toilets", "3"]
    ],
    // The screenshot cut off after four amenities, so add the rest from the original listing.
    features: ["24-hour electricity", "Air conditioning", "Balcony", "Chandelier", "Fitted kitchen"],
    description: "A newly built, unfurnished 3-bedroom house for sale in Kokrobite, Ga South Municipal, with three bathrooms and three toilets. It has air conditioning, a balcony, a chandelier, a fitted kitchen and a glass-railed staircase, with 24-hour electricity.",
    images: [
      "images/kokrobite/exterior.webp",
      "images/kokrobite/living-room.webp",
      "images/kokrobite/staircase.webp",
      "images/kokrobite/kitchen.webp",
      "images/kokrobite/room-with-ac.webp",
      "images/kokrobite/bathroom.webp"
    ]
  },
  {
    id: "half-plot-kwabenya",
    type: "land",
    title: "Half Plot of Land, Kwabenya",
    area: "Kwabenya",
    price: null,           // add a number to show a price
    status: "Available",
    size: "Half plot",
    features: [],
    description: "A half plot of land at Kwabenya. Contact us for the price, location details and to arrange a site visit.",
    images: ["images/land/kwabenya-half-plot.webp"]
  },
  {
    id: "full-plot-kwabenya",
    type: "land",
    title: "Full Plot of Land, Kwabenya",
    area: "Kwabenya",
    price: null,           // add a number to show a price
    status: "Available",
    size: "1 plot",
    features: [],
    description: "A full plot of land at Kwabenya with a view over the surrounding area. Contact us for the price, location details and to arrange a site visit.",
    images: ["images/land/kwabenya-full-plot.webp"]
  },
  {
    id: "2-plots-kwabenya-comet",
    type: "land",
    title: "2 Plots of Land, Kwabenya Comet",
    area: "Kwabenya Comet",
    price: null,           // add a number to show a price
    status: "Available",
    size: "2 plots",
    features: [],
    description: "Two plots of land at Kwabenya Comet. Contact us for the price, location details and to arrange a site visit.",
    images: ["images/land/kwabenya-comet-2-plots.webp"]
  },
  {
    id: "1-plot-kwabenya-acp",
    type: "land",
    title: "1 Plot of Land, Kwabenya ACP",
    area: "Kwabenya ACP",
    price: null,           // add a number to show a price
    status: "Available",
    size: "1 plot",
    features: [],
    description: "One plot of land at Kwabenya ACP. Contact us for the price, location details and to arrange a site visit.",
    images: ["images/land/kwabenya-acp-plot.webp"]
  }
];
