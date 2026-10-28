import type { Base, Extra, Fruit, Recipe } from '@/config/types';
import { siteConfig } from '@/config/site.config';

export interface AssemblyStep {
  id: string;
  title: string;
  body: string;
  detail?: string;
}

export function stepsFor(recipe: Recipe, base: Base | null, fruits: Fruit[], extra: Extra | null): AssemblyStep[] {
  const fruitList = fruits.map((f) => f.portionLabel.toLowerCase()).join(' and ');
  return [
    {
      id: 'base',
      title: 'Start with the base.',
      body: 'A clean, transparent can on a cool stone pedestal. Everything begins empty.',
    },
    {
      id: 'pour',
      title: base ? `Pour in the ${base.name.toLowerCase()}.` : 'Pour in the base.',
      body: base?.tasteNote ?? 'The base name and taste notes will appear here once formulation is approved.',
      detail: base && base.ingredients.length ? `Ingredients: ${base.ingredients.map((i) => i.name).join(', ')}.` : 'Full ingredient list coming on the Ingredients & Care page.',
    },
    {
      id: 'fruit',
      title: 'Add the fruit you love.',
      body: fruits.length ? `${recipe.name} brings ${fruitList}: real, edible pieces, cut small enough to enjoy from the can.` : 'Edible fruit pieces, cut small enough to enjoy from the can.',
    },
    {
      id: 'extra',
      title: 'Finish your way.',
      body: extra ? `${recipe.name} is finished with ${extra.name.toLowerCase()}.` : siteConfig.flags.customization ? 'Choose an optional extra, or keep it simple.' : 'Optional extras are a future customization feature. The launch recipe keeps it simple.',
    },
    {
      id: 'seal',
      title: 'Sealed and chilled.',
      body: 'The lid goes on gently and the can stays upright and cold until it reaches you.',
    },
    {
      id: 'enjoy',
      title: 'Sip the drink. Eat the fruit.',
      body: 'That is the whole idea. Finish the drink, then enjoy every piece of fruit.',
    },
  ];
}
