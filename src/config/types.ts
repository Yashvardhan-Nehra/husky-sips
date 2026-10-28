/**
 * Central content/configuration types for the HuskySips site.
 * Everything a non-developer may need to change lives in site.config.ts and src/content/*.
 *
 * Honesty rules baked into the types:
 *  - Unknown facts are `null`, never guessed.
 *  - Anything customer-facing carries a `status` so drafts are never shown in production.
 */

export type ReviewStatus = 'approved' | 'draft';

export interface ImageAsset {
  /** Base name under /assets/reference, e.g. "pedestal" → pedestal-640.webp, pedestal-1080.jpg … */
  name: string;
  alt: string;
  /** Rendition widths that exist for this image. */
  widths: number[];
  /** Intrinsic aspect ratio as "w/h", used to reserve space and avoid layout shift. */
  aspect: string;
  /** true for AI/3D renders; the UI labels them "illustrative". false for real photographs. */
  illustrative: boolean;
}

export interface Ingredient {
  name: string;
  /** Optional plain-language note, e.g. "cold-pressed", "fresh". */
  note?: string;
  /** Mark declared allergens so they can be surfaced on the menu. */
  allergen?: boolean;
}

export interface Base {
  id: string;
  name: string;
  /** Short taste description shown during the pour and on the menu. */
  tasteNote: string;
  /** Full ingredient list (no proportions). */
  ingredients: Ingredient[];
  /** Colour used by the stage illustration for the liquid. */
  liquidColor: { top: string; bottom: string };
  status: ReviewStatus;
}

export type FruitCut = 'cube' | 'slice' | 'wedge' | 'segment' | 'chunk';

export interface Fruit {
  id: string;
  name: string;
  cut: FruitCut;
  /** Shown on the menu, e.g. "Seedless watermelon cubes". */
  portionLabel: string;
  available: boolean;
  status: ReviewStatus;
}

export interface Extra {
  id: string;
  name: string;
  kind: 'herb' | 'seed' | 'other';
  available: boolean;
  status: ReviewStatus;
}

export type ClaimId = 'no-added-sugar' | 'no-added-preservatives';

export interface ClaimControl {
  id: ClaimId;
  label: string;
  /** Companion line shown with the claim, e.g. "Contains naturally occurring sugars." */
  companion: string | null;
  /** Only true after formulation review. Never enable without substantiation. */
  enabled: boolean;
  approvedOn: string | null;
  approvedBy: string | null;
}

export interface Recipe {
  id: string;
  name: string;
  baseId: string;
  fruitIds: string[];
  extraId: string | null;
  /** Plain-language taste description — crisp, citrus-forward, mellow, fruity … only when true. */
  taste: string;
  tasteTags: string[];
  /** Actual product photograph. null until one exists; a labelled illustration is used meanwhile. */
  photo: ImageAsset | null;
  illustration: ImageAsset | null;
  /** Declared allergens (free text, approved wording). */
  allergens: string[] | null;
  /** Approved storage and consumption instructions. */
  storage: string | null;
  status: ReviewStatus;
}

export interface Collection {
  id: string;
  name: string;
  recipeIds: string[];
}

export type Availability = 'pop-up' | 'preorder' | 'coming-soon' | 'sold-out' | 'unavailable';

export interface Pack {
  /** e.g. "330 ml can". null until the format is final. */
  sizeLabel: string | null;
  /** Price in INR (whole rupees). null until confirmed — never invent. */
  priceInr: number | null;
  availability: Availability;
  note: string | null;
}

export type PopUpStatus = 'confirmed' | 'tentative' | 'completed' | 'cancelled';

export interface PopUp {
  id: string;
  name: string;
  venue: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  status: PopUpStatus;
  /** ISO date (YYYY-MM-DD). */
  date: string | null;
  /** Pickup / selling window, local time "HH:MM". */
  window: { start: string; end: string } | null;
  menuRecipeIds: string[];
  /** Preorder configuration — preordering is only offered when every field is set. */
  preorder: {
    stockAllocated: number | null;
    priceInr: number | null;
    cutoff: string | null; // ISO datetime
    pickupWindow: { start: string; end: string } | null;
  } | null;
  note: string | null;
  lastUpdated: string; // ISO date
}

export type SalesKind = 'pop-up' | 'preorder' | 'bulk';

export interface SalesRecord {
  id: string;
  /** Public city or event location only — never a customer address. */
  locationName: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  date: string; // ISO date
  kind: SalesKind;
  /** Paid units fulfilled (bulk orders counted once by fulfilled quantity). */
  fulfilledUnits: number;
  /** Units refunded after fulfilment. */
  refundedUnits: number;
  /** Only records with verified: true are counted. */
  verified: boolean;
  lastUpdated: string; // ISO date
}

export interface Sales {
  /** null = sales tracking not set up yet (unknown). [] = tracked, nothing sold yet. */
  records: SalesRecord[] | null;
  /** When the records were last verified against payments/refunds. */
  lastVerifiedAt: string | null;
  /** true only when the numbers come from a live system; otherwise they're manual updates. */
  live: boolean;
}

export interface Contact {
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  youtube: string | null;
  /** Home city used in copy like "based in …". */
  baseCity: string | null;
}

export interface Registration {
  legalName: string | null;
  /** FSSAI registration/licence number once issued. Display only when set. */
  fssaiNumber: string | null;
  registeredAddress: string | null;
}

export interface Care {
  preparation: string | null;
  storage: string | null;
  consumeWithin: string | null;
  allergens: string | null;
  batchIdentification: string | null;
  /** Real photographs of preparation standards (never renders). */
  photos: ImageAsset[];
  lastReviewed: string | null;
}

export interface EventOrders {
  /** e.g. "Currently serving events of up to N drinks" — null until decided. */
  capacityNote: string | null;
  /** Cities / areas where chilled delivery is serviceable. Empty = not yet. */
  serviceAreas: string[];
  chilledDeliveryEnabled: boolean;
  staffedCounterEnabled: boolean;
  /** Never invent a minimum order or deposit; leave null until decided. */
  minimumOrderNote: string | null;
  depositNote: string | null;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  summary: string;
  video: { src: string; type: string } | null;
  poster: ImageAsset | null;
  /** Captions are burned into the approved edits; transcript is shown as text for accessibility. */
  captionsBurnedIn: boolean;
  transcript: string[] | null;
  durationSec: number | null;
  status: ReviewStatus;
}

export interface FutureRange {
  id: string;
  name: string;
  blurb: string;
  status: 'in-development';
}

export interface FeatureFlags {
  preorders: boolean;
  customization: boolean;
  bulkBookings: boolean;
  vending: boolean;
  /** Show draft content. 'dev' = only in `vite dev`; true = also in builds (staging). */
  previewDrafts: boolean | 'dev';
}

export interface Brand {
  name: string;
  tagline: string;
  description: string;
  logo: { src: string; width: number; height: number } | null;
  mascot: { src: string; width: number; height: number } | null;
  founderName: string;
}

export interface Goal {
  targetCans: number;
  deadline: string; // ISO date
  label: string;
}

export interface SiteConfig {
  brand: Brand;
  goal: Goal;
  flags: FeatureFlags;
  catalog: {
    bases: Base[];
    fruits: Fruit[];
    extras: Extra[];
    /** Fixed portion rules for the builder. */
    portions: { maxFruits: number; maxExtras: number };
  };
  recipes: Recipe[];
  collections: Collection[];
  activeCollectionId: string;
  pack: Pack;
  claims: ClaimControl[];
  popUps: PopUp[];
  sales: Sales;
  contact: Contact;
  registration: Registration;
  care: Care;
  eventOrders: EventOrders;
  episodes: Episode[];
  futureRanges: FutureRange[];
  /** Approximate map centre & label for the brand's home base (public city only). */
  homeBase: { city: string; state: string; lat: number; lng: number } | null;
}
