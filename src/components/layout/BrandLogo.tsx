import { Link } from 'react-router-dom';
import { siteConfig } from '@/config/site.config';

/** Renders the supplied logo untouched when present; otherwise a plain text wordmark. */
export function BrandLogo({ to = '/' }: { to?: string }) {
  const logo = siteConfig.brand.logo;
  return (
    <Link to={to} className="brand" aria-label="HuskySips home">
      {logo ? (
        <img src={logo.src} width={logo.width} height={logo.height} alt="HuskySips" />
      ) : (
        <span className="wordmark" aria-hidden="true">
          Husky<em>Sips</em>
        </span>
      )}
    </Link>
  );
}
