import { siteConfig } from '@/config/site.config';
import { hasAnyContact } from '@/config/selectors';
import { usePageMeta } from '@/lib/hooks';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { UpdatesForm } from '@/components/forms/UpdatesForm';

export default function Contact() {
  usePageMeta('Contact', 'How to reach HuskySips.');
  const c = siteConfig.contact;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Say hello</span>
          <h1>Contact</h1>
          <p className="lead">For event enquiries use the Events & Bulk page — it asks the right questions. For everything else, reach us here.</p>
        </div>
      </section>
      <section className="section section--tight" style={{ paddingTop: 0 }}>
        <div className="container contact-grid">
          <div className="card">
            <h3>Reach us directly</h3>
            {hasAnyContact() ? (
              <ul className="contact-list">
                {c.email && (
                  <li>
                    <a href={`mailto:${c.email}`}>
                      <Icon name="mail" /> {c.email}
                    </a>
                  </li>
                )}
                {c.whatsapp && (
                  <li>
                    <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                      <Icon name="external" /> WhatsApp
                    </a>
                  </li>
                )}
                {c.phone && (
                  <li>
                    <a href={`tel:${c.phone}`}>
                      <Icon name="external" /> {c.phone}
                    </a>
                  </li>
                )}
                {c.instagram && (
                  <li>
                    <a href={`https://instagram.com/${c.instagram.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer">
                      <Icon name="external" /> Instagram {c.instagram}
                    </a>
                  </li>
                )}
                {c.youtube && (
                  <li>
                    <a href={c.youtube} target="_blank" rel="noopener noreferrer">
                      <Icon name="external" /> YouTube
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <EmptyState title="Contact details are being set up." body="Email, WhatsApp and social accounts will appear here once they’re live. Meanwhile, the forms below reach us directly." mascot={false} />
            )}
            {c.baseCity && <p className="fine">Based in {c.baseCity}.</p>}
            <div className="cluster" style={{ marginTop: 16 }}>
              <ButtonLink to="/events" variant="secondary" icon="arrow">
                Event enquiry
              </ButtonLink>
              <ButtonLink to="/find-us#community" variant="ghost">
                Bring HuskySips to my community
              </ButtonLink>
            </div>
          </div>
          <UpdatesForm />
        </div>
      </section>
    </>
  );
}
