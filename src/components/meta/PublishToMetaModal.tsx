import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Send, CheckCircle } from 'lucide-react';
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
  dailyBudget: z.coerce.number().min(1),
  targetCountries: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
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

export default function PublishToMetaModal({ isOpen, onClose, campaign }: PublishToMetaModalProps) {
  const { t } = useTranslation();
  const publishToMeta = usePublishToMeta();
  const [publishedId, setPublishedId] = useState<string | null>(null);

  const clientId = typeof campaign.clientId === 'object'
    ? (campaign.clientId as Client)._id
    : campaign.clientId;

  const { data: connection, isLoading: connectionLoading } = useMetaConnection(clientId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PublishFormData>({
    resolver: zodResolver(publishSchema),
    defaultValues: {
      name: truncate(campaign.campaignDescription, 60),
      objective: 'OUTCOME_ENGAGEMENT',
      dailyBudget: 10,
      targetCountries: 'US',
      startDate: '',
      endDate: '',
    },
  });

  const onSubmit = (data: PublishFormData) => {
    const countries = data.targetCountries.split(',').map((c) => c.trim()).filter(Boolean);
    publishToMeta.mutate(
      {
        campaignId: campaign._id,
        name: data.name,
        objective: data.objective,
        dailyBudget: Math.round(data.dailyBudget * 100),
        targetCountries: countries,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
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
            {...register('dailyBudget')}
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
