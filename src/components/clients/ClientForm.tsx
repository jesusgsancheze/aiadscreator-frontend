import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import FileUpload from '../ui/FileUpload';
import type { Client } from '../../types/client';
import { useCreateClient, useUpdateClient } from '../../hooks/useClients';
import { getImageUrl } from '../../lib/utils';
import ClientMetaConnection from '../meta/ClientMetaConnection';

const clientSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
}

export default function ClientForm({ isOpen, onClose, client }: ClientFormProps) {
  const { t } = useTranslation();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  useEffect(() => {
    if (client) {
      reset({ name: client.name, description: client.description });
    } else {
      reset({ name: '', description: '' });
    }
    setLogoFile(null);
  }, [client, reset, isOpen]);

  const onSubmit = (data: ClientFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    if (client) {
      updateClient.mutate(
        { id: client._id, formData },
        { onSuccess: () => onClose() },
      );
    } else {
      createClient.mutate(formData, { onSuccess: () => onClose() });
    }
  };

  const isLoading = createClient.isPending || updateClient.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={client ? t('clients.edit') : t('clients.create')}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label={t('clients.name')}
          placeholder={t('clients.namePlaceholder')}
          error={errors.name?.message}
          {...register('name')}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {t('clients.description')}
          </label>
          <textarea
            placeholder={t('clients.descriptionPlaceholder')}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all duration-200 min-h-[100px] resize-none"
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1.5 text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {t('clients.logo')}
          </label>
          <FileUpload
            onFileSelect={setLogoFile}
            preview={client?.logo ? getImageUrl(client.logo) : null}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" type="button" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={isLoading}>
            {t('common.save')}
          </Button>
        </div>
      </form>

      {client && (
        <ClientMetaConnection clientId={client._id} />
      )}
    </Modal>
  );
}
