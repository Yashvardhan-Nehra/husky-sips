import { useState } from 'react';
import type { Episode } from '@/config/types';
import { track, EVENTS } from '@/lib/analytics';
import { Icon } from '@/components/ui/Icon';
import { Badge, DraftBadge } from '@/components/ui/Badge';
import { draftsVisible } from '@/config/selectors';
import { Mascot } from '@/components/ui/Mascot';

/** Click-to-load video: poster first, media only when the viewer asks for it. No autoplay audio. */
export function EpisodePlayer({ episode, transcript }: { episode: Episode; transcript: string[] | null }) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const poster = episode.poster;
  const posterSrc = poster ? `/assets/reference/${poster.name}-${Math.max(...poster.widths)}.jpg` : undefined;
  const posterSet = poster ? poster.widths.map((w) => `/assets/reference/${poster.name}-${w}.webp ${w}w`).join(', ') : undefined;

  function start() {
    setPlaying(true);
    track(EVENTS.EPISODE_PLAYED, { episode: episode.id });
  }

  return (
    <article className="episode" aria-labelledby={`ep-${episode.id}`}>
      <div className="episode__player">
        {episode.video && !failed ? (
          playing ? (
            <video controls autoPlay playsInline preload="metadata" poster={posterSrc} onError={() => setFailed(true)} aria-label={`Episode ${episode.number}: ${episode.title}`}>
              <source src={episode.video.src} type={episode.video.type} />
            </video>
          ) : (
            <>
              {poster && (
                <picture>
                  <source type="image/webp" srcSet={posterSet} sizes="(max-width: 799px) 90vw, 360px" />
                  <img src={posterSrc} alt={poster.alt} width={720} height={1280} loading="lazy" decoding="async" />
                </picture>
              )}
              <button type="button" className="episode__play" onClick={start} aria-label={`Play episode ${episode.number}: ${episode.title}`}>
                <span className="episode__play-btn">
                  <Icon name="play" /> Play episode {episode.number}
                </span>
              </button>
            </>
          )
        ) : (
          <div className="episode__unavailable">
            <div className="stack" style={{ justifyItems: 'center' }}>
              <Mascot label="Puppy waiting" />
              <p style={{ margin: 0 }}>{failed ? 'This video could not be loaded right now.' : 'This episode is coming soon.'}</p>
            </div>
          </div>
        )}
      </div>
      <div>
        <div className="episode__meta">
          <Badge variant="citrus">Episode {episode.number}</Badge>
          {episode.durationSec && <span className="small muted">{Math.round(episode.durationSec / 60)} min</span>}
          {episode.captionsBurnedIn && <span className="small muted">Captions on screen</span>}
          {draftsVisible() && episode.status === 'draft' && <DraftBadge what="episode cut" />}
        </div>
        <h3 id={`ep-${episode.id}`} style={{ marginTop: 8 }}>
          {episode.title}
        </h3>
        <p className="muted">{episode.summary}</p>
        {transcript && (
          <details className="transcript">
            <summary>Read the transcript</summary>
            <div>
              {transcript.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </details>
        )}
      </div>
    </article>
  );
}
