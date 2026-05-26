import { useTranslation } from 'react-i18next';
import { Plug } from 'lucide-react';
import ClientMetaConnection from '../meta/ClientMetaConnection';
import ClientGoogleAdsConnection from '../google-ads/ClientGoogleAdsConnection';

interface ClientConnectionsProps {
  clientId: string;
}

/**
 * Prominent "Integrations" area surfacing this brand's ad-platform connections
 * (Meta + Google Ads) in one place, so they can be set up from client settings
 * rather than only mid-campaign.
 */
export default function ClientConnections({ clientId }: ClientConnectionsProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-brand-primary/10">
          <Plug className="h-4 w-4 text-brand-primary" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">
          {t('clients.connections')}
        </h3>
      </div>
      <p className="text-xs text-slate-500 mt-1">
        {t('clients.connectionsDesc')}
      </p>

      <div className="mt-2 divide-y divide-slate-200">
        <ClientMetaConnection clientId={clientId} />
        <ClientGoogleAdsConnection clientId={clientId} />
      </div>
    </div>
  );
}
