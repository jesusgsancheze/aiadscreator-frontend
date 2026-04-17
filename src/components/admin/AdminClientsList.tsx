import { useTranslation } from 'react-i18next';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import { useAdminClients } from '../../hooks/useAdmin';
import { getImageUrl, formatDate } from '../../lib/utils';
import { Building2 } from 'lucide-react';

export default function AdminClientsList() {
  const { t } = useTranslation();
  const { data: clients, isLoading } = useAdminClients();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Card padding="none">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('clients.name')}
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('clients.description')}
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('common.date')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {clients?.map((client) => (
              <tr key={client._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {client.logo ? (
                      <img
                        src={getImageUrl(client.logo)}
                        alt={client.name}
                        className="h-8 w-8 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-lg gradient-brand flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <span className="font-medium text-slate-900">{client.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                  {client.description}
                </td>
                <td className="px-6 py-4 text-slate-400">{formatDate(client.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
