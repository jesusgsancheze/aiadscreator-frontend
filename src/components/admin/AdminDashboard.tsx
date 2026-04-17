import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Users, Building2, Megaphone, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import { useAdminDashboard } from '../../hooks/useAdmin';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { data, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { label: t('admin.users'), value: data.totalUsers, icon: Users, color: 'from-blue-500 to-indigo-500' },
    { label: t('admin.clients'), value: data.totalClients, icon: Building2, color: 'from-brand-primary to-brand-secondary' },
    { label: t('admin.campaigns'), value: data.totalCampaigns, icon: Megaphone, color: 'from-amber-400 to-orange-500' },
    {
      label: t('dashboard.avgPerformance'),
      value: `${data.avgPerformance?.toFixed(0) || 0}%`,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
