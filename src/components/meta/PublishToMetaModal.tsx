import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Send, CheckCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { usePublishToMeta, useMetaConnection } from '../../hooks/useMeta';
import { truncate } from '../../lib/utils';
import type { Campaign } from '../../types/campaign';
import type { Client } from '../../types/client';

const publishSchema = z.object({
  name: z.string().min(1),
  objective: z.string().min(1),
  dailyBudget: z.number().min(1),
  targetCountries: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  optimizationGoal: z.string().min(1),
  billingEvent: z.string().min(1),
  ageMin: z.number().int().min(13).max(65),
  ageMax: z.number().int().min(13).max(65),
  gender: z.enum(['all', 'male', 'female']),
  advantageAudience: z.boolean(),
  interests: z.string().optional(),
  useAdvantagePlacements: z.boolean(),
  platformFacebook: z.boolean(),
  platformInstagram: z.boolean(),
  platformMessenger: z.boolean(),
  platformAudienceNetwork: z.boolean(),
});

type PublishFormData = z.infer<typeof publishSchema>;

interface PublishToMetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
}

const objectiveOptions = [
  { value: 'OUTCOME_ENGAGEMENT', label: 'Engagement' },
  { value: 'OUTCOME_TRAFFIC', label: 'Traffic' },
  { value: 'OUTCOME_AWARENESS', label: 'Awareness' },
  { value: 'OUTCOME_LEADS', label: 'Leads' },
  { value: 'OUTCOME_SALES', label: 'Sales' },
];

const optimizationGoalOptions = [
  { value: 'REACH', label: 'Reach' },
  { value: 'IMPRESSIONS', label: 'Impressions' },
  { value: 'LINK_CLICKS', label: 'Link clicks' },
  { value: 'LANDING_PAGE_VIEWS', label: 'Landing page views' },
  { value: 'POST_ENGAGEMENT', label: 'Post engagement' },
  { value: 'OFFSITE_CONVERSIONS', label: 'Conversions' },
  { value: 'LEAD_GENERATION', label: 'Lead generation' },
];

const billingEventOptions = [
  { value: 'IMPRESSIONS', label: 'Impressions' },
  { value: 'LINK_CLICKS', label: 'Link clicks' },
];

function gendersToForm(genders: number[] | undefined): 'all' | 'male' | 'female' {
  if (!genders || genders.length === 0 || genders.length === 2) return 'all';
  if (genders[0] === 1) return 'male';
  if (genders[0] === 2) return 'female';
  return 'all';
}

function gendersToPayload(g: 'all' | 'male' | 'female'): number[] {
  if (g === 'male') return [1];
  if (g === 'female') return [2];
  return [];
}

export default function PublishToMetaModal({ isOpen, onClose, campaign }: PublishToMetaModalProps) {
  const { t } = useTranslation();
  const publishToMeta = usePublishToMeta();
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const clientId = typeof campaign.clientId === 'object'
    ? (campaign.clientId as Client)._id
    : campaign.clientId;

  const { data: connection, isLoading: connectionLoading } = useMetaConnection(clientId);

  const suggestion = campaign.suggestion;
  const suggestedTargeting = suggestion?.targeting;
  const suggestedPlacements = suggestion?.placements;
  const isMetaFull = campaign.socialMedia === 'meta_full';
  const hasPlatform = (p: string) =>
    suggestedPlacements?.publisherPlatforms.includes(p) ?? false;

  const genderOptions = [
    { value: 'all', label: t('meta.suggestion.genderAll') },
    { value: 'male', label: t('meta.suggestion.genderMale') },
    { value: 'female', label: t('meta.suggestion.genderFemale') },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PublishFormData>({
    resolver: zodResolver(publishSchema),
    defaultValues: {
      name: truncate(campaign.campaignDescription, 60),
      objective: suggestion?.objective || 'OUTCOME_ENGAGEMENT',
      dailyBudget: suggestion?.dailyBudget ?? 10,
      targetCountries: suggestedTargeting?.countries.join(', ') || 'US',
      startDate: '',
      endDate: '',
      optimizationGoal: suggestion?.optimizationGoal || 'REACH',
      billingEvent: suggestion?.billingEvent || 'IMPRESSIONS',
      ageMin: suggestedTargeting?.ageMin ?? 18,
      ageMax: suggestedTargeting?.ageMax ?? 65,
      gender: gendersToForm(suggestedTargeting?.genders),
      advantageAudience: suggestedTargeting?.advantageAudience ?? true,
      interests: suggestedTargeting?.interests?.join(', ') ?? '',
      useAdvantagePlacements: suggestedPlacements?.useAdvantagePlacements ?? true,
      platformFacebook: isMetaFull ? hasPlatform('facebook') || !suggestedPlacements : false,
      platformInstagram: isMetaFull ? hasPlatform('instagram') || !suggestedPlacements : false,
      platformMessenger: isMetaFull ? hasPlatform('messenger') : false,
      platformAudienceNetwork: isMetaFull ? hasPlatform('audience_network') : false,
    },
  });

  const onSubmit = (data: PublishFormData) => {
    const countries = data.targetCountries.split(',').map((c) => c.trim()).filter(Boolean);
    const interests = (data.interests ?? '')
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    const publisherPlatforms: string[] = [];
    if (data.platformFacebook) publisherPlatforms.push('facebook');
    if (data.platformInstagram) publisherPlatforms.push('instagram');
    if (data.platformMessenger) publisherPlatforms.push('messenger');
    if (data.platformAudienceNetwork) publisherPlatforms.push('audience_network');

    publishToMeta.mutate(
      {
        campaignId: campaign._id,
        name: data.name,
        objective: data.objective,
        dailyBudget: Math.round(data.dailyBudget * 100),
        targetCountries: countries,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        optimizationGoal: data.optimizationGoal,
        billingEvent: data.billingEvent,
        ageMin: data.ageMin,
        ageMax: data.ageMax,
        genders: gendersToPayload(data.gender),
        advantageAudience: data.advantageAudience,
        interests,
        ...(isMetaFull && {
          publisherPlatforms,
          useAdvantagePlacements: data.useAdvantagePlacements,
          facebookPositions: suggestedPlacements?.facebookPositions,
          instagramPositions: suggestedPlacements?.instagramPositions,
          messengerPositions: suggestedPlacements?.messengerPositions,
          audienceNetworkPositions: suggestedPlacements?.audienceNetworkPositions,
        }),
      },
      {
        onSuccess: (result) => {
          setPublishedId(result.metaCampaignId);
        },
      },
    );
  };

  const handleClose = () => {
    setPublishedId(null);
    setShowAdvanced(false);
    onClose();
  };

  const noConnection = !connectionLoading && !connection;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('meta.publishToMeta')} maxWidth="max-w-xl">
      {publishedId ? (
        <div className="text-center py-6">
          <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('meta.publishSuccess')}</h3>
          <p className="text-sm text-slate-500 mb-4">
            Meta Campaign ID: <span className="font-mono text-slate-700">{publishedId}</span>
          </p>
          <Button onClick={handleClose}>{t('common.back')}</Button>
        </div>
      ) : noConnection ? (
        <div className="text-center py-6">
          <p className="text-sm text-slate-600 mb-2">{t('meta.noConnection')}</p>
          <p className="text-xs text-slate-400">{t('meta.noConnectionHint')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info">{campaign.socialMedia}</Badge>
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
              <p className="text-xs text-slate-600 mb-1.5">{t('meta.suggestion.applied')}</p>
              {suggestion.rationale && (
                <p className="text-xs text-slate-500 italic">"{suggestion.rationale}"</p>
              )}
            </div>
          )}

          {isMetaFull && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {t('meta.suggestion.placements')}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('meta.suggestion.placementsHint')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 cursor-pointer hover:border-slate-300 transition-colors">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary/30"
                    {...register('platformFacebook')}
                  />
                  <span className="text-sm text-slate-700">
                    {t('meta.suggestion.platformFacebook')}
                  </span>
                </label>
                <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 cursor-pointer hover:border-slate-300 transition-colors">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary/30"
                    {...register('platformInstagram')}
                  />
                  <span className="text-sm text-slate-700">
                    {t('meta.suggestion.platformInstagram')}
                  </span>
                </label>
                <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 cursor-pointer hover:border-slate-300 transition-colors">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary/30"
                    {...register('platformMessenger')}
                  />
                  <span className="text-sm text-slate-700">
                    {t('meta.suggestion.platformMessenger')}
                  </span>
                </label>
                <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 cursor-pointer hover:border-slate-300 transition-colors">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary/30"
                    {...register('platformAudienceNetwork')}
                  />
                  <span className="text-sm text-slate-700">
                    {t('meta.suggestion.platformAudienceNetwork')}
                  </span>
                </label>
              </div>
              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary/30"
                  {...register('useAdvantagePlacements')}
                />
                <span className="text-sm text-slate-700">
                  {t('meta.suggestion.useAdvantagePlacements')}
                  <span className="block text-xs text-slate-500 mt-0.5">
                    {t('meta.suggestion.useAdvantagePlacementsHint')}
                  </span>
                </span>
              </label>
            </div>
          )}

          <Input
            label={t('meta.campaignName')}
            error={errors.name?.message}
            {...register('name')}
          />

          <Select
            label={t('meta.objective')}
            options={objectiveOptions}
            error={errors.objective?.message}
            {...register('objective')}
          />

          <Input
            label={t('meta.dailyBudget')}
            type="number"
            min="1"
            step="0.01"
            error={errors.dailyBudget?.message}
            {...register('dailyBudget', { valueAsNumber: true })}
          />

          <Input
            label={t('meta.targetCountries')}
            placeholder="US, CA, GB"
            error={errors.targetCountries?.message}
            {...register('targetCountries')}
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

          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
              aria-expanded={showAdvanced}
            >
              <span className="text-sm font-medium text-slate-700">
                {t('meta.suggestion.advanced')}
              </span>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4 text-slate-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-500" />
              )}
            </button>
            {showAdvanced && (
              <div className="px-4 pb-4 pt-1 space-y-4 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-4 pt-3">
                  <Select
                    label={t('meta.suggestion.optimizationGoal')}
                    options={optimizationGoalOptions}
                    error={errors.optimizationGoal?.message}
                    {...register('optimizationGoal')}
                  />
                  <Select
                    label={t('meta.suggestion.billingEvent')}
                    options={billingEventOptions}
                    error={errors.billingEvent?.message}
                    {...register('billingEvent')}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label={t('meta.suggestion.ageMin')}
                    type="number"
                    min="13"
                    max="65"
                    error={errors.ageMin?.message}
                    {...register('ageMin', { valueAsNumber: true })}
                  />
                  <Input
                    label={t('meta.suggestion.ageMax')}
                    type="number"
                    min="13"
                    max="65"
                    error={errors.ageMax?.message}
                    {...register('ageMax', { valueAsNumber: true })}
                  />
                  <Select
                    label={t('meta.suggestion.gender')}
                    options={genderOptions}
                    error={errors.gender?.message}
                    {...register('gender')}
                  />
                </div>

                <div>
                  <Input
                    label={t('meta.suggestion.interests')}
                    placeholder="Soccer, Running, Marathon"
                    error={errors.interests?.message}
                    {...register('interests')}
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    {t('meta.suggestion.interestsHint')}
                  </p>
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary/30"
                    {...register('advantageAudience')}
                  />
                  <span className="text-sm text-slate-700">
                    {t('meta.suggestion.advantageAudience')}
                    <span className="block text-xs text-slate-500 mt-0.5">
                      {t('meta.suggestion.advantageAudienceHint')}
                    </span>
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" loading={publishToMeta.isPending}>
              <Send className="h-4 w-4" />
              {t('meta.publish')}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
