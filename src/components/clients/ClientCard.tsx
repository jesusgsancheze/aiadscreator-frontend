import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Building2 } from 'lucide-react';
import Card from '../ui/Card';
import type { Client } from '../../types/client';
import { getImageUrl, truncate } from '../../lib/utils';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

export default function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <Card className="relative group">
        <div className="flex items-start gap-4">
          {client.logo ? (
            <img
              src={getImageUrl(client.logo)}
              alt={client.name}
              className="h-14 w-14 rounded-xl object-cover border border-slate-100"
            />
          ) : (
            <div className="h-14 w-14 rounded-xl gradient-brand flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-900 truncate">{client.name}</h3>
            <p className="text-sm text-slate-500 mt-1">{truncate(client.description, 80)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
          <button
            onClick={() => onEdit(client)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
          >
            <Pencil className="h-3.5 w-3.5" />
            {t('common.edit')}
          </button>
          <button
            onClick={() => onDelete(client._id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t('common.delete')}
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
