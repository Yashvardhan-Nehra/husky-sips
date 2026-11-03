import type { Recipe } from '@/config/types';
import { getBase, getExtra, getRecipeFruits } from '@/config/selectors';
import { ButtonLink } from '@/components/ui/Button';
import { Picture } from '@/components/ui/Picture';
import { StageScene } from './StageScene';
import { stepsFor } from './steps';
import { getRecipePalette, paletteVars } from '@/config/palette';

/** Reduced-motion / no-JS-animation version: poster + ordered steps. */
export function StaticAssembly({ recipe }: { recipe: Recipe }) {
  const base = getBase(recipe.baseId) ?? null;
  const fruits = getRecipeFruits(recipe);
  const extra = getExtra(recipe.extraId) ?? null;
  const steps = stepsFor(recipe, base, fruits, extra);
  const poster = recipe.photo ?? recipe.illustration;
  const palette = getRecipePalette(recipe);
  return (
    <section className="assembly assembly--static" id="assembly" style={paletteVars(palette)} aria-labelledby="assembly-title">
      <div className="container">
        <div className="assembly__static-grid">
          <div className="assembly__poster">
            {poster ? <Picture image={poster} sizes="(max-width: 767px) 100vw, 45vw" /> : <StageScene base={base} fruits={fruits} extra={extra} pose="final" />}
          </div>
          <div>
            <span className="eyebrow">How it comes together</span>
            <h2 id="assembly-title">Sip the drink. Eat the fruit.</h2>
            <ol className="steps">
              {steps.map((s) => (
                <li key={s.id}>
                  <div>
                    <h4>{s.title}</h4>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="fine" style={{ marginTop: 24 }}>
              Illustration of how every HuskySips is assembled. Drinks are prepared in advance and kept chilled, not mixed to order.
            </p>
            <ButtonLink to="/menu" icon="arrow">
              View this week’s menu
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
