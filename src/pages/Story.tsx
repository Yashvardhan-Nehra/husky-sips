import { siteConfig } from '@/config/site.config';
import { isVisible } from '@/config/selectors';
import { milestones, storyIntro, transcripts, vendingAmbition } from '@/content/story';
import { usePageMeta } from '@/lib/hooks';
import { Section } from '@/components/ui/Section';
import { Picture } from '@/components/ui/Picture';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { EpisodePlayer } from '@/components/story/EpisodePlayer';
import { ProgressTracker } from '@/components/story/ProgressTracker';
import { InterestForm } from '@/components/forms/InterestForm';
import type { ImageAsset } from '@/config/types';
import { formatDateShort } from '@/lib/format';

const STORY_ART: ImageAsset = { name: 'impossible-angle', alt: 'Illustration of a HuskySips can tilted mid-air against a dark green background', widths: [640, 1080], aspect: '3/4', illustrative: true };

export default function Story() {
  usePageMeta('Our Story', 'Tarun is building HuskySips from scratch: recipe tests, feedback, and the road to 1,000 paid cans.');
  const episodes = siteConfig.episodes.filter((e) => isVisible(e.status));

  return (
    <>
      <section className="story-hero">
        <div className="container page-hero--with-art">
          <div>
            <span className="eyebrow">Our Story</span>
            <h1>{storyIntro.headline}</h1>
            {storyIntro.paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? 'lead' : undefined}>
                {p}
              </p>
            ))}
            <p className="fine">Founder imagery stays faceless until approved photographs are available.</p>
          </div>
          <Picture image={STORY_ART} sizes="(max-width: 899px) 70vw, 360px" />
        </div>
      </section>

      <Section eyebrow="Episodes" title="The process, as it happens." intro="Short episodes from Tarun’s kitchen and the market. Captions are on screen; transcripts are below each video.">
        {episodes.length ? (
          <div className="episodes">
            {episodes.map((ep) => (
              <EpisodePlayer key={ep.id} episode={ep} transcript={ep.transcript ?? transcripts[ep.id] ?? null} />
            ))}
          </div>
        ) : (
          <EmptyState title="Episode 1 is on its way." body="The first episode will appear here once the final cut is approved." />
        )}
      </Section>

      <Section tone="forest" eyebrow="Progress" title={siteConfig.goal.label}>
        <div className="grid grid--2">
          <ProgressTracker />
          <ol className="timeline" aria-label="Milestones">
            {milestones.map((m) => (
              <li key={m.title} className={m.verified ? 'is-done' : ''}>
                <h4 style={{ color: 'var(--cream)' }}>
                  {m.title} {m.verified ? '' : <Badge variant="outline">Ahead</Badge>}
                </h4>
                <p style={{ color: 'var(--on-forest-muted)' }}>
                  {m.detail}
                  {m.date ? ` (${formatDateShort(m.date)})` : ''}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section eyebrow="What’s next" title="Future ranges" intro="Three directions we are exploring after the signature Fruit Refreshers. All in development — no dates, no orders.">
        <div className="grid grid--3" style={{ marginBottom: 32 }}>
          {siteConfig.futureRanges.map((r) => (
            <div className="range-card" key={r.id}>
              <Badge variant="draft">In development</Badge>
              <h3>{r.name}</h3>
              <p className="muted" style={{ margin: 0 }}>
                {r.blurb}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid--2">
          <InterestForm ranges={siteConfig.futureRanges} />
          <div className="card card--flat">
            <Badge variant="outline">Ambition, not a product</Badge>
            <h3 style={{ marginTop: 12 }}>{vendingAmbition.title}</h3>
            <p className="muted" style={{ margin: 0 }}>
              {vendingAmbition.body}
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
