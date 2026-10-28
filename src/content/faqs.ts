export interface Faq {
  q: string;
  a: string;
}

/** Answers only state what is true today. Update as facts are confirmed. */
export const faqs: Faq[] = [
  {
    q: 'What is HuskySips?',
    a: 'A chilled fruit drink with real fruit pieces inside the can. You sip the drink, then eat the fruit.',
  },
  {
    q: 'Where can I buy it?',
    a: 'At selected local pop-ups. Confirmed dates and venues are listed on the Find Us page as soon as they are fixed. We do not ship nationwide and there is no vending yet.',
  },
  {
    q: 'Can I choose my own fruits?',
    a: 'Not yet. The launch menu is one or two signature combinations so we can get them right. A choose-your-own builder is being prepared and is shown as a preview on the menu page.',
  },
  {
    q: 'Is it made fresh at the stall?',
    a: 'Drinks are prepared in advance under the standards described on the Ingredients & Care page and kept chilled until you collect them. They are not mixed to order at the pop-up.',
  },
  {
    q: 'How long does it keep?',
    a: 'It is a fresh, chilled product. Keep it refrigerated and follow the consume-by guidance printed on your label. We will publish the confirmed guidance on the Ingredients & Care page.',
  },
  {
    q: 'Does it contain added sugar?',
    a: 'We will state this clearly once formulation review is complete. Any claim shown on the menu has been checked first; fruit naturally contains sugars.',
  },
  {
    q: 'Can you supply my event or office?',
    a: 'Yes, as an enquiry. Tell us about the occasion on the Events & Bulk page and we will confirm what we can do. An enquiry is not a confirmed booking.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. You can view the menu, find pop-ups and send an enquiry without creating an account.',
  },
];
