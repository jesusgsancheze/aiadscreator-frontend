import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Trash2, RefreshCw, RotateCw, AlertTriangle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { GoogleAdsIcon } from '../icons/SocialIcons';
import GoogleAdsConnectionForm from './GoogleAdsConnectionForm';
import {
  useGoogleAdsConnection,
  useDeleteGoogleAdsConnection,
  useVerifyGoogleAdsConnection,
} from '../../hooks/useGoogleAds';
import { cn, formatDate } from '../../lib/utils';
import type { GoogleAdsConnection } from '../../types/google-ads';

interface ClientGoogleAdsConnectionProps {
  clientId: string;
}

const dotColors = {
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  red: 'bg-red-500',
};

function getStatusColor(
  connection: GoogleAdsConnection,
): 'green' | 'yellow' | 'red' {
  if (!connection.isActive) return 'red';
  if (!connection.lastVerified) return 'yellow';
  const daysSinceVerified =
    (Date.now() - new Date(connection.lastVerified).getTime()) /
    (1000 * 60 * 60 * 24);
  if (daysSinceVerified > 7) return 'yellow';
  return 'green';
}

function formatCustomerId(id: string): string {
  // Google conventionally renders as XXX-XXX-XXXX.
  if (!/^\d{10}$/.test(id)) return id;
  return `${id.slice(0, 3)}-${id.slice(3, 6)}-${id.slice(6)}`;
}

export default function ClientGoogleAdsConnection({
  clientId,
}: ClientGoogleAdsConnectionProps) {
  const { t } = useTranslation();
  const { data: connection, isLoading } = useGoogleAdsConnection(clientId);
  const deleteConnection = useDeleteGoogleAdsConnection();
  const verifyConnection = useVerifyGoogleAdsConnection();
  const [formOpen, setFormOpen] = useState(false);

  const isConnected = !!connection && connection.isActive;

  const handleDelete = () => {
    if (connection && window.confirm(t('common.confirm'))) {
      deleteConnection.mutate(connection._id);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-slate-700 mb-3">
        {t('googleAds.connection')}
      </h4>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Spinner size="sm" />
        </div>
      ) : isConnected ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-sm shrink-0">
                <GoogleAdsIcon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-900">
                    {t('googleAds.connectedTitle')}
                  </h4>
                  <span
                    className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      dotColors[getStatusColor(connection)],
                    )}
                  />
                </div>
                {connection.customerId && (
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">
                    {t('googleAds.customerIdLabel')}:{' '}
                    {formatCustomerId(connection.customerId)}
                  </p>
                )}
              </div>
            </div>

            {!connection.conversionTrackingReady && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 mt-3">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{t('googleAds.conversionTrackingWarning')}</span>
              </div>
            )}

            {connection.lastVerified && (
              <p className="text-xs text-slate-400 mt-3">
                {t('meta.lastVerified')}: {formatDate(connection.lastVerified)}
              </p>
            )}

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => verifyConnection.mutate(connection._id)}
                loading={verifyConnection.isPending}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {t('googleAds.verify')}
              </Button>
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
              >
                <RotateCw className="h-3.5 w-3.5" />
                {t('googleAds.reconnect')}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t('common.delete')}
              </button>
            </div>
          </Card>
        </motion.div>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setFormOpen(true);
          }}
        >
          <GoogleAdsIcon className="h-4 w-4" />
          {t('googleAds.nudgeCta')}
        </Button>
      )}

      <GoogleAdsConnectionForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        clientId={clientId}
      />
    </div>
  );
}
