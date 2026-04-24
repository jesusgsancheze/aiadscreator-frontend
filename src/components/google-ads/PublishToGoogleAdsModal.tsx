import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Send, CheckCircle, Sparkles, AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import {
  usePublishToGoogleAds,
  useGoogleAdsConnection,
} from '../../hooks/useGoogleAds';
import { truncate } from '../../lib/utils';
import type { Campaign } from '../../types/campaign';
import type { Client } from '../../types/client';

const publishSchema = z.object({
  name: z.string().min(1),
  biddingStrategy: z.string().min(1),
  dailyBudget: z.number().min(1),
  targetCpa: z.number().min(0).optional(),
  targetRoas: z.number().min(0).optional(),
  countries: z.string().min(1),
  languages: z.string().min(1),
  finalUrl: z.string().url(),
  callToAction: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type PublishFormData = z.infer<typeof publishSchema>;

interface PublishToGoogleAdsModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
}

const biddingOptions = [
  { value: 'MAXIMIZE_CONVERSIONS', label: 'Maximize Conversions' },
  { value: 'MAXIMIZE_CONVERSION_VALUE', label: 'Maximize Conversion Value' },
  { value: 'TARGET_CPA', label: 'Target CPA' },
  { value: 'TARGET_ROAS', label: 'Target ROAS' },
];

const ctaOptions = [
  { value: '', label: '— (none)' },
  { value: 'LEARN_MORE', label: 'Learn More' },
  { value: 'SHOP_NOW', label: 'Shop Now' },
  { value: 'SIGN_UP', label: 'Sign Up' },
  { value: 'GET_QUOTE', label: 'Get Quote' },
  { value: 'CONTACT_US', label: 'Contact Us' },
  { value: 'DOWNLOAD', label: 'Download' },
  { value: 'BOOK_NOW', label: 'Book Now' },
];

export default function PublishToGoogleAdsModal({
  isOpen,
  onClose,
  campaign,
}: PublishToGoogleAdsModalProps) {
  const { t } = useTranslation();
  const publishToGoogleAds = usePublishToGoogleAds();
  const [publishedId, setPublishedId] = useState<string | null>(null);

  const clientId =
    typeof campaign.clientId === 'object'
      ? (campaign.clientId as Client)._id
      : campaign.clientId;

  const { data: connection, isLoading: connectionLoading } =
    useGoogleAdsConnection(clientId);

  const suggestion = campaign.googleAdsSuggestion;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PublishFormData>({
    resolver: zodResolver(publishSchema),
    defaultValues: {
      name: truncate(campaign.title || campaign.campaignDescription, 60),
      biddingStrategy: suggestion?.biddingStrategy || 'MAXIMIZE_CONVERSIONS',
      dailyBudget: suggestion?.dailyBudget ?? 20,
      targetCpa: suggestion?.targetCpa ?? undefined,
      targetRoas: suggestion?.targetRoas ?? undefined,
      countries: (suggestion?.geo.countries ?? ['US']).join(', '),
      languages: (suggestion?.languages ?? ['en']).join(', '),
      finalUrl:
        suggestion?.finalUrls[0] || campaign.socialMediaLink || '',
      callToAction: suggestion?.callToAction || '',
      startDate: '',
      endDate: '',
    },
  });

  const biddingStrategy = watch('biddingStrategy');

  const onSubmit = (data: PublishFormData) => {
    const countries = data.countries
      .split(',')
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);
    const languages = data.languages
      .split(',')
      .map((l) => l.trim().toLowerCase())
      .filter(Boolean);

    publishToGoogleAds.mutate(
      {
        campaignId: campaign._id,
        name: data.name,
        biddingStrategy: data.biddingStrategy,
        dailyBudget: data.dailyBudget,
        targetCpa:
          data.biddingStrategy === 'TARGET_CPA' ? data.targetCpa : undefined,
        targetRoas:
          data.biddingStrategy === 'TARGET_ROAS' ? data.targetRoas : undefined,
        countries,
        languages,
        finalUrls: [data.finalUrl],
        callToAction: data.callToAction || undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
      },
      {
        onSuccess: (result) => setPublishedId(result.googleAdsCampaignId),
      },
    );
  };

  const handleClose = () => {
    setPublishedId(null);
    onClose();
  };

  const noConnection =
    !connectionLoading && (!connection || !connection.isActive);
  const conversionTrackingMissing =
    !!connection && !connection.conversionTrackingReady;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('googleAds.publishTitle')}
      maxWidth="max-w-xl"
    >
      {publishedId ? (
        <div className="text-center py-6">
          <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {t('googleAds.publishSuccess')}
          </h3>
          <p className="text-sm text-slate-500 mb-1">
            {t('googleAds.publishCampaignId')}:{' '}
            <span className="font-mono text-slate-700">{publishedId}</span>
          </p>
          <p className="text-xs text-slate-400 mb-4">
            {t('googleAds.publishPausedNotice')}
          </p>
          <Button onClick={handleClose}>{t('common.back')}</Button>
        </div>
      ) : noConnection ? (
        <div className="text-center py-6">
          <p className="text-sm text-slate-600 mb-2">
            {t('googleAds.noConnection')}
          </p>
          <p className="text-xs text-slate-400">
            {t('googleAds.noConnectionHint')}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info">Google PMax</Badge>
            <span className="text-sm text-slate-500">
              {truncate(campaign.campaignDescription, 80)}
            </span>
          </div>

          {suggestion && (
            <div className="rounded-xl border border-brand-primary/20 bg-brand-primary/5 px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-brand-primary" />
                <span className="text-sm font-medium text-brand-primary">
                  {t('meta.suggestion.banner')}
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-1.5">
                {t('meta.suggestion.applied')}
              </p>
              {suggestion.rationale && (
                <p className="text-xs text-slate-500 italic">
                  "{suggestion.rationale}"
                </p>
              )}
            </div>
          )}

          {conversionTrackingMissing && (
            <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{t('googleAds.conversionTrackingWarning')}</span>
            </div>
          )}

          <Input
            label={t('meta.campaignName')}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label={t('googleAds.finalUrlLabel')}
            placeholder="https://your-landing-page.com"
            error={errors.finalUrl?.message}
            {...register('finalUrl')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label={t('campaigns.biddingStrategy')}
              options={biddingOptions}
              error={errors.biddingStrategy?.message}
              {...register('biddingStrategy')}
            />
            <Input
              label={t('meta.dailyBudget')}
              type="number"
              min="1"
              step="1"
              error={errors.dailyBudget?.message}
              {...register('dailyBudget', { valueAsNumber: true })}
            />
          </div>

          {biddingStrategy === 'TARGET_CPA' && (
            <Input
              label={t('campaigns.targetCpa')}
              type="number"
              min="1"
              step="0.01"
              error={errors.targetCpa?.message}
              {...register('targetCpa', { valueAsNumber: true })}
            />
          )}
          {biddingStrategy === 'TARGET_ROAS' && (
            <Input
              label={t('campaigns.targetRoas')}
              type="number"
              min="0.1"
              step="0.1"
              error={errors.targetRoas?.message}
              {...register('targetRoas', { valueAsNumber: true })}
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t('campaigns.countries')}
              placeholder="US, CA, GB"
              error={errors.countries?.message}
              {...register('countries')}
            />
            <Input
              label={t('campaigns.languages')}
              placeholder="en, es"
              error={errors.languages?.message}
              {...register('languages')}
            />
          </div>

          <Select
            label={t('campaigns.callToAction')}
            options={ctaOptions}
            error={errors.callToAction?.message}
            {...register('callToAction')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t('meta.startDate')}
              type="date"
              error={errors.startDate?.message}
              {...register('startDate')}
            />
            <Input
              label={t('meta.endDate')}
              type="date"
              error={errors.endDate?.message}
              {...register('endDate')}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" loading={publishToGoogleAds.isPending}>
              <Send className="h-4 w-4" />
              {t('googleAds.publishCta')}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
