import { useState } from 'react'
import { Play, Film } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage.js'

/*
 * VideoCard — a clean placeholder for a short lesson video / animated
 * explainer. If `src` (a video URL) is provided it plays inline; otherwise it
 * shows a professional placeholder so real videos can be dropped in later by
 * adding a `src` to the level's `video` data.
 */
export default function VideoCard({ title, description, duration, src }) {
  const { t } = useLanguage()
  const [playing, setPlaying] = useState(false)

  return (
    <div className="video-card">
      {src && playing ? (
        <div className="video-card__frame">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video src={src} controls autoPlay className="video-card__video" />
        </div>
      ) : (
        <button
          className="video-card__frame"
          onClick={() => setPlaying(true)}
          aria-label={`${t('video.playLabel.pre')}${title}`}
        >
          <span className="video-card__badge">
            <Film size={14} /> {t('video.badge')}
          </span>
          {duration && <span className="video-card__duration">{duration}</span>}
          <span className="video-card__play" aria-hidden="true">
            <Play size={22} fill="currentColor" />
          </span>
        </button>
      )}

      <div className="video-card__meta">
        <div className="video-card__title">{title}</div>
        <p className="video-card__desc">{description}</p>
        {!src && playing && (
          <p className="video-card__note">
            This is a placeholder. Add a video URL to this lesson’s <code>video.src</code> in
            <code> levels.js</code> to enable playback.
          </p>
        )}
      </div>
    </div>
  )
}
