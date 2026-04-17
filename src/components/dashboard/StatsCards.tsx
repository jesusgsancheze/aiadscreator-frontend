import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Megaphone, Zap, TrendingUp, Users } from 'lucide-react';
import Card from '../ui/Card';

interface StatsCardsProps {
  stats: {
    totalCampaigns: number;
    activeCampaigns: number;
    avgPerformance: number;
    totalClients: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const { t } = useTranslation();

  const cards = [
    {
      label: t('dashboard.totalCampaigns'),
      value: stats.totalCampaigns,
      icon: Megaphone,
      color: 'from-brand-primary to-brand-secondary',
    },
    {
      label: t('dashboard.activeCampaigns'),
      value: stats.activeCampaigns,
      icon: Zap,
      color: 'from-amber-400 to-orange-500',
    },
    {
      label: t('dashboard.avgPerformance'),
      value: `${stats.avgPerformance.toFixed(0)}%`,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: t('dashboard.totalClients'),
      value: stats.totalClients,
      icon: Users,
      color: 'from-blue-500 to-indigo-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color}`}>
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
