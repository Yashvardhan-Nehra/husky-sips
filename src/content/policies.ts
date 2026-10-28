/**
 * Editable policy content. Everything inside [[double brackets]] is a placeholder the business
 * must confirm. While `reviewed` is false the page shows a "draft — under business review" banner
 * (in production too — the honest state).
 */
export interface PolicySection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}
export interface Policy {
  id: string;
  title: string;
  intro: string;
  reviewed: boolean;
  lastUpdated: string | null;
  sections: PolicySection[];
}

export const privacyPolicy: Policy = {
  id: 'privacy',
  title: 'Privacy',
  intro: 'What we collect when you use this site, why, and how to reach us about it.',
  reviewed: false,
  lastUpdated: null,
  sections: [
    {
      heading: 'What we collect',
      paragraphs: ['We only collect what you type into our forms: your name, the contact method you give us, and the details of your enquiry, request or interest.'],
      bullets: [
        'Event enquiries: name, contact method, event details, personalisation text and any artwork you choose to attach.',
        'Community requests: city, venue idea and an optional contact method.',
        'Launch updates and future-range interest: your email or phone number.',
      ],
    },
    {
      heading: 'How we use it',
      paragraphs: [
        'We use enquiry details only to reply to that enquiry. We send marketing messages only if you tick the separate marketing box, and you can opt out at any time by replying or writing to [[contact email]].',
      ],
    },
    {
      heading: 'Where it goes',
      paragraphs: ['Form submissions are delivered to [[form service / inbox — confirm provider]] and kept for [[retention period]]. We do not sell personal information.'],
    },
    {
      heading: 'Analytics',
      paragraphs: ['We record anonymous usage events (for example, that the menu was viewed) to understand what helps visitors. [[Confirm analytics provider, or state that none is used.]]'],
    },
    {
      heading: 'Your choices',
      paragraphs: ['Write to [[contact email]] to ask what we hold about you, to correct it, or to have it deleted.'],
    },
  ],
};

export const termsPolicy: Policy = {
  id: 'terms',
  title: 'Terms',
  intro: 'Plain-language terms for using this website and buying at our pop-ups.',
  reviewed: false,
  lastUpdated: null,
  sections: [
    {
      heading: 'Who we are',
      paragraphs: ['HuskySips is operated by [[legal entity name]], [[registered address]]. [[FSSAI registration number, once issued.]]'],
    },
    {
      heading: 'Products and availability',
      paragraphs: [
        'Products are sold at the pop-ups and events listed on this site while stock lasts. Prices, pack sizes and menus shown on the site are confirmed per event and may change between events.',
        'Product images marked “illustrative” are design references. The drink you receive is described in words on the menu card and the label.',
      ],
    },
    {
      heading: 'Enquiries are not bookings',
      paragraphs: ['Submitting an event enquiry or reservation request does not create a booking or a contract. We confirm availability, pricing and terms separately in writing.'],
    },
    {
      heading: 'Your content',
      paragraphs: ['If you upload a logo or artwork for a personalised label you confirm you have the right to use it. We use it only to produce your labels.'],
    },
    {
      heading: 'Liability and law',
      paragraphs: ['[[Liability wording and governing law / jurisdiction — to be confirmed with an adviser.]]'],
    },
  ],
};

export const pickupPolicy: Policy = {
  id: 'pickup-delivery-cancellation',
  title: 'Pickup, Delivery and Cancellation Information',
  intro: 'How collection works at pop-ups, when delivery is available, and what happens if plans change.',
  reviewed: false,
  lastUpdated: null,
  sections: [
    {
      heading: 'Pickup at pop-ups',
      paragraphs: ['Each pop-up listing shows its venue, date and selling window. Reserved drinks, where reservations are offered, are held until [[hold time]] within that window.'],
    },
    {
      heading: 'Delivery',
      paragraphs: ['Chilled delivery is offered only for events in listed service areas and only when confirmed in writing. [[Delivery terms, lead time and any charges — to be confirmed.]]'],
    },
    {
      heading: 'Changes and cancellations',
      paragraphs: ['[[Cancellation and refund terms for reservations and event orders — to be confirmed. Do not publish before review.]]'],
    },
    {
      heading: 'Keeping the drink at its best',
      paragraphs: ['HuskySips is a chilled drink with fresh fruit. Keep it refrigerated and follow the storage guidance on the Ingredients & Care page and on your label.'],
    },
  ],
};

export const policies: Policy[] = [privacyPolicy, termsPolicy, pickupPolicy];
