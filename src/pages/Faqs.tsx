import { faqs } from '@/content/faqs';
import { usePageMeta } from '@/lib/hooks';
import { ButtonLink } from '@/components/ui/Button';

export default function Faqs() {
  usePageMeta('FAQs', 'Answers about HuskySips: what it is, where to buy it, storage and events.');
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Questions</span>
          <h1>Frequently asked</h1>
          <p className="lead">Short, honest answers. If yours is not here, send it through the Contact page.</p>
        </div>
      </section>
      <section className="section section--tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ maxWidth: 820 }}>
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <div className="faq__body">{f.a}</div>
              </details>
            ))}
          </div>
          <div className="cluster" style={{ marginTop: 32 }}>
            <ButtonLink to="/contact" variant="secondary" icon="arrow">
              Ask something else
            </ButtonLink>
          </div>
          </div>
        </div>
      </section>
    </>
  );
}
