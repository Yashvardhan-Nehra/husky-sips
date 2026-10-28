import type { ImageAsset } from '@/config/types';
import { IllustrativeBadge } from './Badge';

interface Props {
  image: ImageAsset;
  sizes?: string;
  priority?: boolean;
  className?: string;
  showLabel?: boolean;
  radius?: boolean;
}

/** Responsive <picture> from the generated renditions; reserves space to avoid layout shift. */
export function Picture({ image, sizes = '(max-width: 767px) 100vw, 50vw', priority = false, className, showLabel = true, radius = true }: Props) {
  const widest = Math.max(...image.widths);
  const srcSet = (ext: string) => image.widths.map((w) => `/assets/reference/${image.name}-${w}.${ext} ${w}w`).join(', ');
  const [aw, ah] = image.aspect.split('/').map(Number);
  const height = Math.round((widest * (ah ?? 1)) / (aw ?? 1));
  return (
    <figure className={['picture', className ?? ''].join(' ').trim()} style={{ aspectRatio: image.aspect, borderRadius: radius ? undefined : 0 }}>
      <picture>
        <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
        <img
          src={`/assets/reference/${image.name}-${widest}.jpg`}
          srcSet={srcSet('jpg')}
          sizes={sizes}
          width={widest}
          height={height}
          alt={image.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </picture>
      {showLabel && image.illustrative && (
        <figcaption className="picture__caption">
          <IllustrativeBadge />
        </figcaption>
      )}
    </figure>
  );
}
