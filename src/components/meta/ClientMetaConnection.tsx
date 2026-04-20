import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Share } from 'lucide-react';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import MetaConnectionCard from './MetaConnectionCard';
import MetaConnectionForm from './MetaConnectionForm';
import { useMetaConnection, useDeleteMetaConnection } from '../../hooks/useMeta';
import type { MetaConnection } from '../../types/meta';

interface ClientMetaConnectionProps {
  clientId: string;
}

export default function ClientMetaConnection({ clientId }: ClientMetaConnectionProps) {
  const { t } = useTranslation();
  const { data: connection, isLoading } = useMetaConnection(clientId);
  const deleteConnection = useDeleteMetaConnection();
  const [formOpen, setFormOpen] = useState(false);
  const [editConnection, setEditConnection] = useState<MetaConnection | null>(null);

  const handleEdit = (conn: MetaConnection) => {
    setEditConnection(conn);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteConnection.mutate(id);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditConnection(null);
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-slate-700 mb-3">Meta</h4>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Spinner size="sm" />
        </div>
      ) : connection ? (
        <MetaConnectionCard
          connection={connection}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
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
          <Share className="h-4 w-4" />
          {t('meta.connectToMeta')}
        </Button>
      )}

      <MetaConnectionForm
        isOpen={formOpen}
        onClose={handleClose}
        clientId={clientId}
        connection={editConnection}
      />
    </div>
  );
}
