import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useCreateMetaConnection, useUpdateMetaConnection } from '../../hooks/useMeta';
import type { MetaConnection } from '../../types/meta';

const metaConnectionSchema = z.object({
  accessToken: z.string().min(1),
  adAccountId: z.string().min(1),
  pageId: z.string().min(1),
  instagramAccountId: z.string().optional(),
});

type MetaConnectionFormData = z.infer<typeof metaConnectionSchema>;

interface MetaConnectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  connection?: MetaConnection | null;
}

export default function MetaConnectionForm({
  isOpen,
  onClose,
  clientId,
  connection,
}: MetaConnectionFormProps) {
  const { t } = useTranslation();
  const createConnection = useCreateMetaConnection();
  const updateConnection = useUpdateMetaConnection();
  const [showToken, setShowToken] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MetaConnectionFormData>({
    resolver: zodResolver(metaConnectionSchema),
  });

  useEffect(() => {
    if (connection) {
      reset({
        accessToken: connection.accessToken,
        adAccountId: connection.adAccountId,
        pageId: connection.pageId,
        instagramAccountId: connection.instagramAccountId || '',
      });
    } else {
      reset({
        accessToken: '',
        adAccountId: '',
        pageId: '',
        instagramAccountId: '',
      });
    }
    setShowToken(false);
  }, [connection, reset, isOpen]);

  const onSubmit = (data: MetaConnectionFormData) => {
    const payload = {
      ...data,
      instagramAccountId: data.instagramAccountId || undefined,
    };

    if (connection) {
      updateConnection.mutate(
        { id: connection._id, payload },
        { onSuccess: () => onClose() },
      );
    } else {
      createConnection.mutate(
        { ...payload, clientId },
        { onSuccess: () => onClose() },
      );
    }
  };

  const isLoading = createConnection.isPending || updateConnection.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={connection ? t('common.edit') : t('meta.connectToMeta')}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="w-full">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {t('meta.accessToken')}
          </label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all duration-200 pr-10"
              placeholder="EAAxxxxxxx..."
              {...register('accessToken')}
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.accessToken && (
            <p className="mt-1.5 text-xs text-red-500">{errors.accessToken.message}</p>
          )}
        </div>

        <Input
          label={t('meta.adAccountId')}
          placeholder="act_123456789"
          error={errors.adAccountId?.message}
          {...register('adAccountId')}
        />

        <Input
          label={t('meta.pageId')}
          placeholder="123456789012345"
          error={errors.pageId?.message}
          {...register('pageId')}
        />

        <Input
          label={t('meta.instagramAccountId')}
          placeholder="17841400000000000"
          error={errors.instagramAccountId?.message}
          {...register('instagramAccountId')}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" type="button" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={isLoading}>
            {t('common.save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
