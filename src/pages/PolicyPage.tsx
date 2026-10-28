import { policies } from '@/content/policies';
import { usePageMeta } from '@/lib/hooks';
import { ReviewBanner } from '@/components/layout/ReviewBanner';
import NotFound from './NotFound';

/** Renders [[placeholder]] markers as highlighted spans. */
function renderWithPlaceholders(text: string) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return parts.map((part, i) =>
    part.startsWith('[[') ? (
      <span className="placeholder" key={i} title="Placeholder — to be confirmed by the business">
        {part.slice(2, -2)}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function PolicyPage({ policyId }: { policyId: string }) {
  const policy = policies.find((p) => p.id === policyId);
  usePageMeta(policy?.title ?? 'Policy', policy?.intro);
  if (!policy) return <NotFound />;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Good to know</span>
          <h1>{policy.title}</h1>
          <p className="lead">{policy.intro}</p>
        </div>
      </section>
      <section className="section section--tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="prose">
          <ReviewBanner reviewed={policy.reviewed} lastUpdated={policy.lastUpdated} />
          {policy.sections.map((s) => (
            <div key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i}>{renderWithPlaceholders(p)}</p>
              ))}
              {s.bullets && (
                <ul>
                  {s.bullets.map((b, i) => (
                    <li key={i}>{renderWithPlaceholders(b)}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          </div>
        </div>
      </section>
    </>
  );
}
