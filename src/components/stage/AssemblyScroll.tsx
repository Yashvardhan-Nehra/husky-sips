import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Recipe } from '@/config/types';
import { getBase, getExtra, getRecipeFruits } from '@/config/selectors';
import { useIsMobile } from '@/lib/hooks';
import { ButtonLink } from '@/components/ui/Button';
import { DraftBadge } from '@/components/ui/Badge';
import { draftsVisible } from '@/config/selectors';
import { StageScene } from './StageScene';
import { stepsFor } from './steps';
import { EXTRA_SLOT, FRUIT_SLOTS, POUR_LEVEL, DISPLACEMENT_PER_FRUIT, EXTRA_DISPLACEMENT, T, liquidOffsetFor } from './stageLayout';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-linked assembly. Normal browser scrolling drives a single GSAP timeline (scrubbed),
 * so it progresses and reverses naturally. The stage is CSS-sticky; nothing hijacks the scroll.
 */
export default function AssemblyScroll({ recipe }: { recipe: Recipe }) {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const isMobile = useIsMobile();
  const base = getBase(recipe.baseId) ?? null;
  const fruits = getRecipeFruits(recipe);
  const extra = getExtra(recipe.extraId) ?? null;
  const steps = stepsFor(recipe, base, fruits, extra);

  useEffect(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;
    if (!section || !svg) return;

    const q = (sel: string) => svg.querySelector<SVGElement>(`[data-layer="${sel}"]`);
    const product = q('product');
    const liquid = q('liquid');
    const wave = q('wave');
    const pour = q('pour');
    const pourTop = q('pour-top');
    const splash = q('splash');
    const droplets = Array.from(svg.querySelectorAll<SVGElement>('[data-layer="droplet"]'));
    const lid = q('lid');
    const glow = q('glow');
    const condensation = q('condensation');
    const contactShadow = q('contact-shadow');
    const fruitEls = fruits.map((f, i) => svg.querySelector<SVGElement>(`[data-layer="fruit:${f.id}"][data-slot="${i}"]`));
    const extraEl = extra ? q(`extra:${extra.id}`) : null;
    if (!product || !liquid || !wave || !pour || !pourTop || !splash || !lid || !glow || !condensation || !contactShadow) return;

    const ctx = gsap.context(() => {
      const level = { value: 0 };
      const applyLevel = () => {
        const y = liquidOffsetFor(level.value);
        gsap.set([liquid, splash], { y });
      };

      // initial state
      gsap.set(product, { y: -36, rotation: -5, opacity: 0, transformOrigin: '50% 100%' });
      gsap.set(contactShadow, { opacity: 0 });
      gsap.set([pour, pourTop], { opacity: 0 });
      gsap.set(splash, { opacity: 0 });
      gsap.set(lid, { y: -90, opacity: 0 });
      gsap.set(glow, { opacity: 0 });
      gsap.set(condensation, { opacity: 0 });
      fruitEls.forEach((el, i) => {
        const slot = FRUIT_SLOTS[i % FRUIT_SLOTS.length]!;
        if (el) gsap.set(el, { x: slot.x, y: -80, rotation: -25, opacity: 0, transformOrigin: '50% 50%' });
      });
      if (extraEl) gsap.set(extraEl, { x: EXTRA_SLOT.x, y: -60, rotation: 20, opacity: 0, transformOrigin: '50% 50%' });
      applyLevel();

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });

      // 0–15%: container floats in, steadies above the pedestal
      tl.to(product, { y: 0, rotation: 0, opacity: 1, duration: T.introEnd - T.introStart, ease: 'power2.out' }, T.introStart);
      tl.to(contactShadow, { opacity: 0.35, duration: 6, ease: 'power1.out' }, T.introEnd - 6);

      // 15–35%: pour
      tl.to([pour, pourTop], { opacity: 0.95, duration: 2, ease: 'power1.out' }, T.pourStart);
      tl.to(level, { value: POUR_LEVEL, duration: T.pourEnd - T.pourStart - 2, ease: 'power1.inOut', onUpdate: applyLevel }, T.pourStart + 1);
      tl.fromTo(wave, { x: -40 }, { x: 0, duration: T.pourEnd - T.pourStart, ease: 'none' }, T.pourStart);
      tl.to(splash, { opacity: 1, duration: 1.5 }, T.pourStart + 2);
      const splashTl = gsap.timeline({ repeat: isMobile ? 2 : 4 });
      droplets.forEach((d, i) => {
        splashTl.fromTo(d, { y: 0, opacity: 0.95, scale: 1 }, { y: -(22 + (i % 3) * 8), x: (i - 2.5) * 3, opacity: 0, scale: 0.6, duration: 2.6, ease: 'power1.out' }, (i % 3) * 0.4);
      });
      tl.add(splashTl, T.pourStart + 2);
      tl.to(splash, { opacity: 0, duration: 1.5 }, T.pourEnd - 2);
      tl.to([pour, pourTop], { opacity: 0, duration: 2, ease: 'power1.in' }, T.pourEnd - 2);

      // 35–65%: fruit pieces enter one at a time, displacing the liquid
      const fruitWindow = T.fruitEnd - T.fruitStart;
      const perFruit = fruitWindow / Math.max(1, fruits.length);
      fruitEls.forEach((el, i) => {
        if (!el) return;
        const slot = FRUIT_SLOTS[i % FRUIT_SLOTS.length]!;
        const start = T.fruitStart + i * perFruit;
        const fall = Math.min(8, perFruit * 0.55);
        tl.to(el, { opacity: 1, duration: 1 }, start);
        tl.to(el, { y: slot.y + 8, rotation: slot.r * 0.6, duration: fall, ease: 'power2.in' }, start);
        tl.to(el, { y: slot.y, rotation: slot.r, duration: 3, ease: 'back.out(2)' }, start + fall);
        tl.to(level, { value: `+=${DISPLACEMENT_PER_FRUIT}`, duration: 2.5, ease: 'power1.out', onUpdate: applyLevel }, start + fall - 0.5);
        tl.fromTo(wave, { x: -24 }, { x: 0, duration: 3, ease: 'power1.out' }, start + fall - 0.5);
      });

      // 65–78%: optional extra (only when the recipe has one)
      if (extraEl) {
        tl.to(extraEl, { opacity: 1, duration: 1 }, T.extraStart + 1);
        tl.to(extraEl, { y: EXTRA_SLOT.y, rotation: EXTRA_SLOT.r, duration: 7, ease: 'power2.out' }, T.extraStart + 1);
        tl.to(level, { value: `+=${EXTRA_DISPLACEMENT}`, duration: 2, ease: 'power1.out', onUpdate: applyLevel }, T.extraStart + 5);
      }

      // 78–90%: lid arrives and seals, container stays upright
      tl.to(lid, { opacity: 1, duration: 1.5 }, T.lidStart);
      tl.to(lid, { y: 3, duration: T.lidEnd - T.lidStart - 4, ease: 'power2.out' }, T.lidStart);
      tl.to(lid, { y: 0, duration: 3, ease: 'power1.out' }, T.lidEnd - 3);
      tl.to(product, { y: 1.5, duration: 1.5, ease: 'power1.out' }, T.lidEnd - 4);
      tl.to(product, { y: 0, duration: 2, ease: 'power1.out' }, T.lidEnd - 2.5);

      // 90–100%: hero pose
      tl.to(product, { scale: 1.04, duration: T.heroEnd - T.heroStart, ease: 'power1.out' }, T.heroStart);
      tl.to(glow, { opacity: 1, duration: T.heroEnd - T.heroStart, ease: 'power1.out' }, T.heroStart);
      tl.to(condensation, { opacity: isMobile ? 0.5 : 0.75, duration: 6, ease: 'power1.out' }, T.heroStart + 2);
      tl.to(contactShadow, { opacity: 0.45, duration: 6 }, T.heroStart);

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        animation: tl,
        invalidateOnRefresh: true,
      });

      // highlight the step currently in view
      const stepEls = Array.from(section.querySelectorAll<HTMLElement>('[data-step]'));
      stepEls.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 60%',
          end: 'bottom 40%',
          onToggle: (self) => el.classList.toggle('is-active', self.isActive),
        });
      });
    }, section);

    return () => ctx.revert();
  }, [recipe.id, fruits.length, extra?.id, isMobile]);

  return (
    <section className="assembly" id="assembly" ref={sectionRef} aria-labelledby="assembly-title">
      <a className="skip-link assembly__skip" href="#after-assembly">
        Skip the animation and go to the menu
      </a>
      <div className="container assembly__grid">
        <div className="assembly__stage-col">
          <div className="assembly__stage">
            <StageScene ref={svgRef} base={base} fruits={fruits} extra={extra} pose="animated" compact={isMobile} />
            <p className="assembly__stage-note">
              <span>{isMobile ? 'Illustrative. Prepared in advance, not mixed to order.' : 'Illustrative assembly. Drinks are prepared in advance and kept chilled, not mixed to order.'}</span>
              {draftsVisible() && recipe.status === 'draft' && <DraftBadge what="recipe" />}
            </p>
          </div>
        </div>
        <div className="assembly__text-col">
          {steps.map((s, i) => (
            <div className="assembly__step" data-step={s.id} key={s.id}>
              <div className="assembly__step-inner">
                <span className="eyebrow">
                  Step {i + 1} of {steps.length}
                </span>
                {i === 0 ? <h2 id="assembly-title">{s.title}</h2> : <h2>{s.title}</h2>}
                <p className="lead">{s.body}</p>
                {s.detail && <p className="muted">{s.detail}</p>}
                {i === steps.length - 1 && (
                  <div className="cluster" style={{ marginTop: 8 }}>
                    <ButtonLink to="/menu" icon="arrow">
                      View this week’s menu
                    </ButtonLink>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
