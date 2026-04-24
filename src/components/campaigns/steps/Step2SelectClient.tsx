import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Building2, Plus, Check, Sparkles } from 'lucide-react';
import { cn } from '../../../lib/utils';
import Spinner from '../../ui/Spinner';
import Button from '../../ui/Button';
import ClientForm from '../../clients/ClientForm';
import MetaConnectionForm from '../../meta/MetaConnectionForm';
import GoogleAdsConnectionForm from '../../google-ads/GoogleAdsConnectionForm';
import { useClients } from '../../../hooks/useClients';
import { useMetaConnection } from '../../../hooks/useMeta';
import { useGoogleAdsConnection } from '../../../hooks/useGoogleAds';
import { getImageUrl } from '../../../lib/utils';

interface Step2Props {
  selected: string | null;
  onSelect: (id: string, name: string) => void;
}

export default function Step2SelectClient({ selected, onSelect }: Step2Props) {
  const { t } = useTranslation();
  const { data: clients, isLoading } = useClients();
  const [showForm, setShowForm] = useState(false);
  const [showMetaForm, setShowMetaForm] = useState(false);
  const [showGoogleAdsForm, setShowGoogleAdsForm] = useState(false);

  const {
    data: metaConnection,
    isLoading: metaLoading,
    isFetched: metaFetched,
  } = useMetaConnection(selected || '');
  const showMetaNudge =
    !!selected && metaFetched && !metaLoading && !metaConnection;

  const {
    data: googleAdsConnection,
    isLoading: googleAdsLoading,
    isFetched: googleAdsFetched,
  } = useGoogleAdsConnection(selected || '');
  const showGoogleAdsNudge =
    !!selected &&
    googleAdsFetched &&
    !googleAdsLoading &&
    (!googleAdsConnection || !googleAdsConnection.isActive);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">{t('campaigns.step2Title')}</h2>
        <p className="text-sm text-slate-500 mt-2">{t('campaigns.step2Desc')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Create New Client */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-brand-primary hover:bg-brand-primary/5 transition-all cursor-pointer min-h-[140px]"
        >
          <div className="p-3 rounded-xl bg-brand-primary/10">
            <Plus className="h-6 w-6 text-brand-primary" />
          </div>
          <span className="text-sm font-medium text-slate-600">
            {t('campaigns.createNewClient')}
          </span>
        </motion.button>

        {clients?.map((client) => {
          const isSelected = selected === client._id;

          return (
            <motion.button
              key={client._id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(client._id, client.name)}
              className={cn(
                'relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all cursor-pointer min-h-[140px]',
                isSelected
                  ? 'border-brand-primary bg-brand-primary/5 shadow-lg shadow-brand-primary/10'
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md',
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 h-6 w-6 gradient-brand rounded-full flex items-center justify-center"
                >
                  <Check className="h-3.5 w-3.5 text-white" />
                </motion.div>
              )}

              {client.logo ? (
                <img
                  src={getImageUrl(client.logo)}
                  alt={client.name}
                  className="h-12 w-12 rounded-xl object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-xl gradient-brand flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
              )}
              <span className="text-sm font-semibold text-slate-900 truncate max-w-full">
                {client.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      {showMetaNudge && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-5"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-brand-primary/10 shrink-0">
              <Sparkles className="h-5 w-5 text-brand-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                {t('meta.suggestion.nudgeTitle')}
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                {t('meta.suggestion.nudgeBody')}
              </p>
              <Button size="sm" onClick={() => setShowMetaForm(true)}>
                {t('meta.suggestion.nudgeCta')}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {showGoogleAdsNudge && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-5"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 shrink-0">
              <Sparkles className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                {t('googleAds.nudgeTitle')}
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                {t('googleAds.nudgeBody')}
              </p>
              <Button size="sm" onClick={() => setShowGoogleAdsForm(true)}>
                {t('googleAds.nudgeCta')}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <ClientForm isOpen={showForm} onClose={() => setShowForm(false)} />
      {selected && (
        <>
          <MetaConnectionForm
            isOpen={showMetaForm}
            onClose={() => setShowMetaForm(false)}
            clientId={selected}
          />
          <GoogleAdsConnectionForm
            isOpen={showGoogleAdsForm}
            onClose={() => setShowGoogleAdsForm(false)}
            clientId={selected}
          />
        </>
      )}
    </div>
  );
}
