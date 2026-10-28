/**
 * Founder story content. Transcripts are taken from the approved caption files so the videos
 * stay accessible without a duplicate subtitle track (captions are burned in).
 */
export const transcripts: Record<string, string[]> = {
  ep1: [
    'I have 85 days to build a food brand from scratch and sell a thousand cans.',
    "I'm 25. And lately, 25 has started hitting a little differently. The world is moving ridiculously fast. AI is changing the way we work. Industries are changing. People are building things faster than ever.",
    "And somewhere between my 9–6, work, gym, and everything else… I'm Tarun. I'm an engineer from one of the top engineering institutes of India.",
    "For the last couple of weeks, I've been unknowingly researching something. And I found a beverage concept that's already getting attention in other markets.",
    "Because here's something I've been thinking about. We know we should eat more fruit. But who actually wants to come home after work, wash it, peel it, chop it, and eat five different fruits every day?",
    "And then I started thinking… What if you didn't have to choose between convenience and real fruit? What if one drink could give you the drink… and the fruit itself?",
    "So I'm building a fresh fruit beverage brand from scratch. No added sugar. Real fruit. And I'm starting from my own kitchen.",
    "I don't know if I can sell a thousand cans in 85 days. But I'm going to find out. This is day one. Follow the journey.",
  ],
  ep2: [
    'I was excited. But when I tasted it… it was bad.',
    'I stopped researching and actually started. For the first time, I went to a proper fruit market to buy everything I needed for the recipe. And honestly, even that felt like a step. Because ideas feel exciting in your head… but very different when you take them into real life.',
    'I picked up the fruits, came back home, laid everything out. And finally tried making one of my first proper HuskySips tests.',
    "I was excited. I thought maybe this would be the moment it starts feeling real. But when I tasted it… it was bad. Not a little bad. The kind of bad that immediately tells you: this version is not it.",
    "And weirdly, that was a good thing. Because now it's no longer just an idea I'm imagining. It's something I'm testing for real.",
    "This is probably the part people don't show enough. The messy first attempts, the misses, and the things that don't work. But that's the point. I'm not here to prove the first version is perfect. I'm here to make it better.",
    "So, Episode two: first market trip, first real recipe test, first failure. Now back to the kitchen. Let's improve it.",
  ],
};

export interface Milestone {
  title: string;
  detail: string;
  /** ISO date when known; null when the exact date is not on record. */
  date: string | null;
  /** Only verified milestones are shown as done. */
  verified: boolean;
}

/** Keep this list to things that have actually happened. */
export const milestones: Milestone[] = [
  { title: 'Day one', detail: 'The 85-day challenge begins: build a fruit-drink brand from scratch and sell 1,000 cans.', date: null, verified: true },
  { title: 'First market trip', detail: 'First proper fruit-market run and the first real recipe test. It was not it — and that was the point.', date: null, verified: true },
  { title: 'Back to the kitchen', detail: 'Iterating the base and the fruit cuts, and collecting feedback from tasters.', date: null, verified: true },
  { title: 'First pop-up', detail: 'The first paid cans, sold in person.', date: null, verified: false },
  { title: '1,000 paid cans', detail: 'The goal, before 31 December 2026.', date: '2026-12-31', verified: false },
];

export const storyIntro = {
  headline: 'Starting small, on purpose.',
  paragraphs: [
    'HuskySips began as a question: why choose between convenience and real fruit? Tarun is an engineer with a day job, a kitchen, and 85 days to find out whether a chilled drink with fruit you can eat is something people actually want.',
    'This page is the honest version. Recipes that failed, feedback that stung, and the numbers as they really are. Nothing here is a milestone until it has happened.',
  ],
};

export const vendingAmbition = {
  title: 'Vending, one day',
  body: 'The long-term idea is a chilled HuskySips machine where you pick a base, choose your fruit and watch it come together. It is an ambition, not a product: there are no machines deployed, nothing to franchise, and nothing open for investment.',
};
