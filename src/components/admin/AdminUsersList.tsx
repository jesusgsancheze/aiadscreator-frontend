import { useTranslation } from 'react-i18next';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import { useAdminUsers } from '../../hooks/useAdmin';
import { formatDate } from '../../lib/utils';

export default function AdminUsersList() {
  const { t } = useTranslation();
  const { data: users, isLoading } = useAdminUsers();

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
                {t('common.name')}
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('common.email')}
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('common.role')}
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('common.status')}
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('common.date')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users?.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-semibold">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <span className="font-medium text-slate-900">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500">{user.email}</td>
                <td className="px-6 py-4">
                  <Badge variant={user.role === 'superadmin' ? 'info' : 'default'}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={user.isEmailVerified ? 'success' : 'warning'}>
                    {user.isEmailVerified ? t('common.verified') : t('common.notVerified')}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-slate-400">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
