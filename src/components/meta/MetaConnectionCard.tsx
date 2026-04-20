import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShieldCheck, Pencil, Trash2, RefreshCw } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';
import { formatDate } from '../../lib/utils';
import { useVerifyMetaConnection } from '../../hooks/useMeta';
import type { MetaConnection } from '../../types/meta';

interface MetaConnectionCardProps {
  connection: MetaConnection;
  onEdit: (connection: MetaConnection) => void;
  onDelete: (id: string) => void;
}

function getStatusColor(connection: MetaConnection): 'green' | 'yellow' | 'red' {
  if (!connection.isActive) return 'red';
  if (!connection.lastVerified) return 'yellow';
  const lastVerifiedDate = new Date(connection.lastVerified);
  const daysSinceVerified = (Date.now() - lastVerifiedDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceVerified > 7) return 'yellow';
  return 'green';
}

const dotColors = {
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  red: 'bg-red-500',
};

export default function MetaConnectionCard({ connection, onEdit, onDelete }: MetaConnectionCardProps) {
  const { t } = useTranslation();
  const verifyConnection = useVerifyMetaConnection();
  const statusColor = getStatusColor(connection);

  const handleVerify = () => {
    verifyConnection.mutate(connection._id);
  };

  const handleDelete = () => {
    if (window.confirm(t('common.confirm'))) {
      onDelete(connection._id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gradient-brand">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-slate-900">
                  {t('meta.connection')}
                </h4>
                <span className={cn('h-2.5 w-2.5 rounded-full', dotColors[statusColor])} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('meta.adAccountId')}: {connection.adAccountId}
              </p>
              <p className="text-xs text-slate-500">
                {t('meta.pageId')}: {connection.pageId}
              </p>
            </div>
          </div>
        </div>

        {connection.lastVerified && (
          <p className="text-xs text-slate-400 mt-3">
            {t('meta.lastVerified')}: {formatDate(connection.lastVerified)}
          </p>
        )}

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={handleVerify}
            loading={verifyConnection.isPending}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {t('meta.verify')}
          </Button>
          <button
            type="button"
            onClick={() => onEdit(connection)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
          >
            <Pencil className="h-3.5 w-3.5" />
            {t('common.edit')}
          </button>
          <button
            type="button"
            onClick={handleDelete}
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
