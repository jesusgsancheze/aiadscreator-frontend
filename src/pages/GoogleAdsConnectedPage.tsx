import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { GoogleAdsPopupMessage } from '../types/google-ads';

/**
 * Landing page for the Google Ads OAuth popup.
 *
 * The backend callback redirects the popup here with
 *   ?status=picker|done|error&connectionId=<id>&message=<err>
 *
 * We post the result back to the opener window so it can close the popup
 * and pick up from there (either showing the customer-picker or the
 * success state). If the page is somehow loaded without an opener (e.g.
 * full-page navigation), we show a readable status screen with a
 * "close this window" button so the user isn't stranded.
 */
export default function GoogleAdsConnectedPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const status = (params.get('status') || 'error') as
    | 'picker'
    | 'done'
    | 'error';
  const connectionId = params.get('connectionId') || undefined;
  const message = params.get('message') || undefined;

  useEffect(() => {
    if (window.opener && !window.opener.closed) {
      const payload: GoogleAdsPopupMessage = {
        type: 'google-ads-connection',
        status,
        connectionId,
        message,
      };
      try {
        window.opener.postMessage(payload, window.location.origin);
      } catch {
        // Cross-origin postMessage can fail if the opener is on a different
        // origin — not an issue in practice since the opener is our own app.
      }
      // Give the parent a moment to process before closing.
      const timer = setTimeout(() => window.close(), 400);
      return () => clearTimeout(timer);
    }
  }, [status, connectionId, message]);

  const icon =
    status === 'done' ? (
      <CheckCircle className="h-12 w-12 text-emerald-500" />
    ) : status === 'picker' ? (
      <Loader2 className="h-12 w-12 text-brand-primary animate-spin" />
    ) : (
      <AlertCircle className="h-12 w-12 text-red-500" />
    );

  const heading =
    status === 'done'
      ? t('googleAds.callbackDoneTitle')
      : status === 'picker'
        ? t('googleAds.callbackPickerTitle')
        : t('googleAds.callbackErrorTitle');

  const subtitle =
    status === 'error'
      ? message || t('googleAds.callbackErrorFallback')
      : t('googleAds.callbackCanClose');

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full rounded-2xl bg-white shadow-sm border border-slate-100 p-8 text-center">
        <div className="flex justify-center mb-4">{icon}</div>
        <h1 className="text-xl font-semibold text-slate-900 mb-2">{heading}</h1>
        <p className="text-sm text-slate-500 mb-6">{subtitle}</p>
        <button
          onClick={() => window.close()}
          className="text-sm font-medium text-brand-primary hover:underline"
        >
          {t('googleAds.closeWindow')}
        </button>
      </div>
    </div>
  );
}
