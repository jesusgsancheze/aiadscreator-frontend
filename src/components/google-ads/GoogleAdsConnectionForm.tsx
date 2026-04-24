import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CheckCircle, ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { GoogleAdsIcon } from '../icons/SocialIcons';
import {
  useStartGoogleAdsOAuth,
  useGoogleAdsConnectionById,
  useSelectGoogleAdsCustomer,
} from '../../hooks/useGoogleAds';
import type { GoogleAdsPopupMessage } from '../../types/google-ads';

interface GoogleAdsConnectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
}

/**
 * Opens the Google OAuth popup, listens for its postMessage callback, then
 * either shows the customer picker (when multiple customers are accessible)
 * or goes straight to a success state (when only one was found and the
 * backend auto-activated the connection).
 */
export default function GoogleAdsConnectionForm({
  isOpen,
  onClose,
  clientId,
}: GoogleAdsConnectionFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const startOAuth = useStartGoogleAdsOAuth();
  const selectCustomer = useSelectGoogleAdsCustomer();

  const [popupConnectionId, setPopupConnectionId] = useState<string | null>(null);
  const [popupStatus, setPopupStatus] = useState<
    'idle' | 'opening' | 'awaiting' | 'picker' | 'done' | 'error'
  >('idle');
  const [popupError, setPopupError] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [loginCustomerId, setLoginCustomerId] = useState<string>('');

  const { data: connection, refetch } = useGoogleAdsConnectionById(
    popupConnectionId || '',
  );

  // Reset state whenever the modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setPopupConnectionId(null);
      setPopupStatus('idle');
      setPopupError(null);
      setSelectedCustomerId(null);
      setLoginCustomerId('');
    }
  }, [isOpen]);

  // Listen for the popup's postMessage
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as GoogleAdsPopupMessage;
      if (!data || data.type !== 'google-ads-connection') return;

      if (data.status === 'error') {
        setPopupStatus('error');
        setPopupError(data.message || 'connection_failed');
        return;
      }
      if (data.connectionId) {
        setPopupConnectionId(data.connectionId);
        setPopupStatus(data.status === 'done' ? 'done' : 'picker');
        queryClient.invalidateQueries({ queryKey: ['google-ads-connections'] });
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [queryClient]);

  const handleConnect = useCallback(async () => {
    setPopupStatus('opening');
    setPopupError(null);
    try {
      const result = await startOAuth.mutateAsync(clientId);
      const popup = window.open(
        result.authUrl,
        'google-ads-oauth',
        'width=600,height=720,popup=yes',
      );
      if (!popup) {
        setPopupStatus('error');
        setPopupError('popup_blocked');
        return;
      }
      setPopupStatus('awaiting');
      // Detect popup close without completion as a best-effort UX signal.
      const timer = window.setInterval(() => {
        if (popup.closed) {
          window.clearInterval(timer);
          setPopupStatus((prev) =>
            prev === 'awaiting' ? 'error' : prev,
          );
          setPopupError((prev) => prev ?? 'popup_closed');
        }
      }, 700);
    } catch (err: any) {
      setPopupStatus('error');
      setPopupError(err?.response?.data?.message || err.message);
    }
  }, [clientId, startOAuth]);

  const handleSelectCustomer = useCallback(() => {
    if (!popupConnectionId || !selectedCustomerId) return;
    selectCustomer.mutate(
      {
        id: popupConnectionId,
        payload: {
          customerId: selectedCustomerId,
          loginCustomerId: loginCustomerId.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          setPopupStatus('done');
          refetch();
          if (!connection?.conversionTrackingReady) {
            toast(t('googleAds.conversionTrackingWarning'), { icon: '⚠️' });
          }
        },
      },
    );
  }, [
    popupConnectionId,
    selectedCustomerId,
    loginCustomerId,
    selectCustomer,
    refetch,
    connection?.conversionTrackingReady,
    t,
  ]);

  const accessibleCustomers = connection?.accessibleCustomers ?? [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('googleAds.connectTitle')}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Intro + tutorial — shown while idle */}
        {popupStatus === 'idle' && (
          <>
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="shrink-0 h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm border border-slate-100">
                <GoogleAdsIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 mb-1">
                  {t('googleAds.connectHeadline')}
                </p>
                <p className="text-xs text-slate-500">
                  {t('googleAds.connectBody')}
                </p>
              </div>
            </div>

            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>{t('googleAds.tutorialBullet1')}</li>
              <li>{t('googleAds.tutorialBullet2')}</li>
              <li>{t('googleAds.tutorialBullet3')}</li>
            </ul>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" type="button" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button
                type="button"
                onClick={handleConnect}
                loading={startOAuth.isPending}
              >
                <ExternalLink className="h-4 w-4" />
                {t('googleAds.connectCta')}
              </Button>
            </div>
          </>
        )}

        {/* Waiting for popup flow to complete */}
        {(popupStatus === 'opening' || popupStatus === 'awaiting') && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Loader2 className="h-8 w-8 text-brand-primary animate-spin" />
            <p className="text-sm text-slate-700 font-medium">
              {t('googleAds.awaitingConsent')}
            </p>
            <p className="text-xs text-slate-500 max-w-sm">
              {t('googleAds.awaitingConsentHint')}
            </p>
          </div>
        )}

        {/* Customer picker — multiple accessible customers */}
        {popupStatus === 'picker' && connection && (
          <div className="space-y-3">
            <div className="rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-3">
              <p className="text-xs text-brand-primary font-medium mb-0.5">
                {t('googleAds.pickerTitle')}
              </p>
              <p className="text-xs text-slate-600">
                {t('googleAds.pickerHint')}
              </p>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {accessibleCustomers.map((custId) => (
                <label
                  key={custId}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                    selectedCustomerId === custId
                      ? 'border-brand-primary bg-brand-primary/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="customer"
                    value={custId}
                    checked={selectedCustomerId === custId}
                    onChange={() => setSelectedCustomerId(custId)}
                    className="h-4 w-4 text-brand-primary focus:ring-brand-primary/30"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-mono text-slate-900">
                      {formatCustomerId(custId)}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {t('googleAds.customerIdLabel')}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                {t('googleAds.loginCustomerIdLabel')}
                <span className="text-slate-400 font-normal ml-1">
                  ({t('common.optional') || 'optional'})
                </span>
              </label>
              <input
                type="text"
                value={loginCustomerId}
                onChange={(e) =>
                  setLoginCustomerId(e.target.value.replace(/\D/g, ''))
                }
                placeholder="1234567890"
                maxLength={10}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                {t('googleAds.loginCustomerIdHint')}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" type="button" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button
                type="button"
                disabled={!selectedCustomerId}
                loading={selectCustomer.isPending}
                onClick={handleSelectCustomer}
              >
                {t('googleAds.confirmPick')}
              </Button>
            </div>
          </div>
        )}

        {/* Success */}
        {popupStatus === 'done' && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-500" />
            <p className="text-base font-semibold text-slate-900">
              {t('googleAds.connectedTitle')}
            </p>
            {connection?.customerId && (
              <p className="text-xs text-slate-500 font-mono">
                {formatCustomerId(connection.customerId)}
              </p>
            )}
            {connection && !connection.conversionTrackingReady && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 max-w-sm">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{t('googleAds.conversionTrackingWarning')}</span>
              </div>
            )}
            <Button onClick={onClose}>{t('common.back')}</Button>
          </div>
        )}

        {/* Error */}
        {popupStatus === 'error' && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <p className="text-base font-semibold text-slate-900">
              {t('googleAds.errorTitle')}
            </p>
            <p className="text-xs text-slate-500 max-w-sm">
              {popupError && mapErrorKey(popupError, t)}
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleConnect}>
                {t('googleAds.retry')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function formatCustomerId(id: string): string {
  // Google conventionally renders as XXX-XXX-XXXX.
  if (!/^\d{10}$/.test(id)) return id;
  return `${id.slice(0, 3)}-${id.slice(3, 6)}-${id.slice(6)}`;
}

function mapErrorKey(key: string, t: (k: string) => string): string {
  if (key === 'popup_blocked') return t('googleAds.errorPopupBlocked');
  if (key === 'popup_closed') return t('googleAds.errorPopupClosed');
  if (key === 'missing_code_or_state')
    return t('googleAds.errorMissingCode');
  return key;
}
