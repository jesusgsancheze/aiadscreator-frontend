import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import ClientCard from './ClientCard';
import EmptyState from '../ui/EmptyState';
import Spinner from '../ui/Spinner';
import Input from '../ui/Input';
import type { Client } from '../../types/client';
import { useClients, useDeleteClient } from '../../hooks/useClients';
import toast from 'react-hot-toast';

interface ClientListProps {
  onEdit: (client: Client) => void;
  onCreate: () => void;
}

export default function ClientList({ onEdit, onCreate }: ClientListProps) {
  const { t } = useTranslation();
  const { data: clients, isLoading } = useClients();
  const deleteClient = useDeleteClient();
  const [search, setSearch] = useState('');

  const filtered = clients?.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id: string) => {
    if (window.confirm(t('common.confirm'))) {
      deleteClient.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Input
          placeholder={t('common.search')}
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {!filtered || filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-8 w-8" />}
          title={t('clients.noClients')}
          description={t('clients.noClients')}
          actionLabel={t('clients.create')}
          onAction={onCreate}
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {filtered.map((client) => (
            <ClientCard
              key={client._id}
              client={client}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
