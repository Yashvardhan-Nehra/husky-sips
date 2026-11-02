import type { SiteConfig } from './types';

/**
 * ============================================================
 *  HUSKYSIPS SITE CONFIGURATION — the single place to update
 * ============================================================
 *
 *  • Anything `null` or `[]` is UNKNOWN and renders an honest empty state.
 *  • `status: 'draft'` items are visible only in development (or staging with
 *    VITE_PREVIEW_DRAFTS=true) and always carry a "Draft" badge.
 *  • Before launch, work through docs/LAUNCH_INFO_REQUIRED.md.
 *
 *  Draft placeholders below are marked "DRAFT —" and must be replaced with approved facts.
 */
export const siteConfig: SiteConfig = {
  brand: {
    name: 'HuskySips',
    tagline: 'Sip the drink. Eat the fruit.',
    description: 'A refreshing drink with fruit pieces you can enjoy, too.',
    // Approved puppy logo (artwork unchanged, white background removed). The mascot is a head-only
    // crop of the same artwork, used small in loading, empty and confirmation states.
    logo: { src: '/assets/brand/huskysips-logo.png', width: 512, height: 582 },
    mascot: { src: '/assets/brand/huskysips-mascot.png', width: 400, height: 400 },
    founderName: 'Tarun',
  },

  goal: {
    targetCans: 1000,
    deadline: '2026-12-31',
    label: '1,000 paid cans before 31 December 2026',
  },

  flags: {
    preorders: false,
    customization: false, // builder shows as "Preview the experience" and takes no orders
    bulkBookings: true, // enquiry-only; nothing is booked automatically
    vending: false, // future ambition only — never shown as deployed
    previewDrafts: 'dev',
  },

  catalog: {
    bases: [
      {
        id: 'signature-base',
        // DRAFT — replace with the approved base name once formulation is signed off.
        name: 'Signature base',
        tasteNote: 'Light, clean and gently fruity, with just enough body to carry the fruit.',
        // DRAFT — full approved ingredient list (no proportions) goes here.
        ingredients: [],
        liquidColor: { top: '#f6d98a', bottom: '#eeb06a' },
        status: 'draft',
      },
    ],
    fruits: [
      { id: 'watermelon', name: 'Watermelon', cut: 'cube', portionLabel: 'Watermelon cubes', available: true, status: 'draft' },
      { id: 'kiwi', name: 'Kiwi', cut: 'slice', portionLabel: 'Kiwi slices', available: true, status: 'draft' },
      { id: 'pineapple', name: 'Pineapple', cut: 'wedge', portionLabel: 'Pineapple wedges', available: false, status: 'draft' },
      { id: 'orange', name: 'Orange', cut: 'segment', portionLabel: 'Orange segments', available: false, status: 'draft' },
      { id: 'coconut', name: 'Tender coconut', cut: 'chunk', portionLabel: 'Tender coconut pieces', available: false, status: 'draft' },
    ],
    extras: [
      { id: 'mint', name: 'Fresh mint', kind: 'herb', available: false, status: 'draft' },
      { id: 'chia', name: 'Chia seeds', kind: 'seed', available: false, status: 'draft' },
    ],
    portions: { maxFruits: 2, maxExtras: 1 },
  },

  recipes: [
    {
      id: 'watermelon-kiwi',
      // DRAFT — the first signature combination; rename/replace after tasting approval.
      name: 'Watermelon Kiwi Refresher',
      baseId: 'signature-base',
      fruitIds: ['watermelon', 'kiwi'],
      extraId: null,
      taste: 'Crisp and fruity: juicy watermelon up front, a soft tang of kiwi behind it.',
      tasteTags: ['crisp', 'fruity'],
      photo: null, // actual product photograph required before launch
      illustration: {
        name: 'pedestal',
        alt: 'Illustration of a clear HuskySips can filled with watermelon and kiwi pieces on a dark green stone pedestal',
        widths: [640, 1080],
        aspect: '3/4',
        illustrative: true,
      },
      allergens: null,
      storage: null,
      status: 'draft',
    },
  ],

  collections: [{ id: 'fruit-refreshers', name: 'Fruit Refreshers', recipeIds: ['watermelon-kiwi'] }],
  activeCollectionId: 'fruit-refreshers',

  pack: {
    sizeLabel: null, // e.g. "330 ml can" — confirm the final format
    priceInr: null, // never invent; set once confirmed
    availability: 'coming-soon',
    note: null,
  },

  claims: [
    {
      id: 'no-added-sugar',
      label: 'No added sugar',
      companion: 'Contains naturally occurring sugars.',
      enabled: false, // enable only after formulation review
      approvedOn: null,
      approvedBy: null,
    },
    {
      id: 'no-added-preservatives',
      label: 'No added preservatives',
      companion: null,
      enabled: false,
      approvedOn: null,
      approvedBy: null,
    },
  ],

  // Confirmed pop-ups only. Example shape (delete when adding real ones):
  // {
  //   id: 'blr-2026-11-15', name: 'Sunday Market', venue: 'Venue name', city: 'Bengaluru', state: 'Karnataka',
  //   lat: 12.9716, lng: 77.5946, status: 'confirmed', date: '2026-11-15',
  //   window: { start: '10:00', end: '14:00' }, menuRecipeIds: ['watermelon-kiwi'], preorder: null,
  //   note: null, lastUpdated: '2026-11-01',
  // }
  popUps: [],

  sales: {
    records: null, // null = tracking not set up yet; [] = tracked, no sales yet
    lastVerifiedAt: null,
    live: false,
  },

  contact: {
    email: null,
    phone: null,
    whatsapp: null,
    instagram: null,
    youtube: null,
    baseCity: null,
  },

  registration: {
    legalName: null,
    fssaiNumber: null,
    registeredAddress: null,
  },

  care: {
    preparation: null,
    storage: null,
    consumeWithin: null,
    allergens: null,
    batchIdentification: null,
    photos: [],
    lastReviewed: null,
  },

  eventOrders: {
    capacityNote: null,
    serviceAreas: [],
    chilledDeliveryEnabled: false,
    staffedCounterEnabled: false,
    minimumOrderNote: null,
    depositNote: null,
  },

  episodes: [
    {
      id: 'ep1',
      number: 1,
      title: 'How it started',
      summary: '85 days to build a fruit-drink brand from scratch and sell a thousand cans. Day one.',
      video: { src: '/media/episode-01-540p.mp4', type: 'video/mp4' },
      poster: {
        name: 'episode-01-poster',
        alt: 'Tarun seen from behind at a desk with two monitors, lit in blue and red',
        widths: [640, 960],
        aspect: '9/16',
        illustrative: false,
      },
      captionsBurnedIn: true,
      transcript: null, // filled from src/content/story.ts
      durationSec: null,
      status: 'draft', // mark 'approved' once the final cut is confirmed
    },
    {
      id: 'ep2',
      number: 2,
      title: 'First market trip, first failure',
      summary: 'First real fruit-market run, first proper recipe test — and a version that was not it.',
      video: { src: '/media/episode-02-540p.mp4', type: 'video/mp4' },
      poster: {
        name: 'episode-02-poster',
        alt: 'A wholesale fruit market with a loaded pickup truck and crates of produce',
        widths: [640, 960],
        aspect: '9/16',
        illustrative: false,
      },
      captionsBurnedIn: true,
      transcript: null,
      durationSec: 79,
      status: 'draft',
    },
  ],

  futureRanges: [
    { id: 'morning-rituals', name: 'Morning Rituals', blurb: 'Gentle, bright starts to the day.', status: 'in-development' },
    { id: 'botanical-blends', name: 'Botanical Blends', blurb: 'Herbs and florals alongside the fruit.', status: 'in-development' },
    { id: 'seasonal-editions', name: 'Seasonal Editions', blurb: 'Short runs built around what is in season.', status: 'in-development' },
  ],

  homeBase: null,
};
