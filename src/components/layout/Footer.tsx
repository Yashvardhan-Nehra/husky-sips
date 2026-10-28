import { Link } from 'react-router-dom';
import { siteConfig } from '@/config/site.config';
import { hasAnyContact } from '@/config/selectors';
import { MAIN_ROUTES } from './Header';

const FOOTER_ROUTES = [
  { to: '/ingredients-and-care', label: 'Ingredients & Care' },
  { to: '/faqs', label: 'FAQs' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/pickup-delivery-cancellation', label: 'Pickup, Delivery & Cancellation' },
];

export function Footer() {
  const { brand, contact, registration } = siteConfig;
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <span className="wordmark" aria-hidden="true">
              Husky<em>Sips</em>
            </span>
            <p style={{ marginTop: 12 }}>{brand.tagline}</p>
            <p className="small">{brand.description} A small Indian fruit-drink brand, launching at selected local pop-ups.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              {MAIN_ROUTES.map((r) => (
                <li key={r.to}>
                  <Link to={r.to}>{r.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Good to know</h4>
            <ul>
              {FOOTER_ROUTES.map((r) => (
                <li key={r.to}>
                  <Link to={r.to}>{r.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Say hello</h4>
            {hasAnyContact() ? (
              <ul>
                {contact.email && (
                  <li>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </li>
                )}
                {contact.whatsapp && (
                  <li>
                    <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`} rel="noopener noreferrer" target="_blank">
                      WhatsApp
                    </a>
                  </li>
                )}
                {contact.phone && (
                  <li>
                    <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                  </li>
                )}
                {contact.instagram && (
                  <li>
                    <a href={`https://instagram.com/${contact.instagram.replace(/^@/, '')}`} rel="noopener noreferrer" target="_blank">
                      Instagram
                    </a>
                  </li>
                )}
                {contact.youtube && (
                  <li>
                    <a href={contact.youtube} rel="noopener noreferrer" target="_blank">
                      YouTube
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <p className="small">Contact details are being set up. For now, use the forms on the Events and Find Us pages.</p>
            )}
          </div>
        </div>
        <div className="footer__bottom">
          <span>
            © {year} {registration.legalName ?? 'HuskySips'}
            {registration.fssaiNumber ? ` · FSSAI ${registration.fssaiNumber}` : ''}
          </span>
          <span>Made in India, one can at a time.</span>
        </div>
      </div>
    </footer>
  );
}
