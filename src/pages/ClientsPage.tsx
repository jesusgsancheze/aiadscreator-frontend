import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import ClientList from '../components/clients/ClientList';
import ClientForm from '../components/clients/ClientForm';
import Button from '../components/ui/Button';
import type { Client } from '../types/client';

export default function ClientsPage() {
  const { t } = useTranslation();
  const [formOpen, setFormOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);

  const handleEdit = (client: Client) => {
    setEditClient(client);
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditClient(null);
  };

  return (
    <AppLayout title={t('clients.title')}>
      <div className="flex justify-end mb-6">
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" />
          {t('clients.create')}
        </Button>
      </div>

      <ClientList onEdit={handleEdit} onCreate={() => setFormOpen(true)} />

      <ClientForm
        isOpen={formOpen}
        onClose={handleClose}
        client={editClient}
      />
    </AppLayout>
  );
}
