import { AlertCircle, RotateCcw } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage.js'

/*
 * HomeError — a quiet inline banner shown on the marketing home ONLY when a
 * signed-in, locally-empty user's cloud progress failed to load (Decision A in
 * the IA-merge spec). It does not block the page; it offers a single Retry that
 * re-triggers the cloud merge (progress.retrySync). When the fetch succeeds the
 * home re-resolves to the dashboard automatically.
 */
export default function HomeError({ onRetry }) {
  const { t } = useLanguage()
  return (
    <div className="home-error" role="status">
      <AlertCircle size={16} aria-hidden="true" />
      <span className="home-error__msg">{t('home.retry.message')}</span>
      <button className="home-error__retry" onClick={onRetry} aria-label={t('home.retry.aria')}>
        <RotateCcw size={14} aria-hidden="true" /> {t('home.retry.action')}
      </button>
    </div>
  )
}
