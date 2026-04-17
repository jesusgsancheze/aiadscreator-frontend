import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import StatsCards from '../components/dashboard/StatsCards';
import RecentCampaigns from '../components/dashboard/RecentCampaigns';
import PerformanceOverview from '../components/dashboard/PerformanceOverview';
import Spinner from '../components/ui/Spinner';
import { useCampaigns } from '../hooks/useCampaigns';
import { useClients } from '../hooks/useClients';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data: campaignsData, isLoading: campaignsLoading } = useCampaigns({ limit: 100 });
  const { data: clients, isLoading: clientsLoading } = useClients();

  const isLoading = campaignsLoading || clientsLoading;

  const campaigns = campaignsData?.data || [];
  const activeCampaigns = campaigns.filter(
    (c) => c.status === 'ready' || c.status === 'published',
  );
  const avgPerformance =
    campaigns.length > 0
      ? campaigns.reduce((sum, c) => sum + (c.performanceScore || 0), 0) / campaigns.length
      : 0;

  // Build timeline data from campaigns
  const timelineMap = new Map<string, { performance: number; count: number }>();
  campaigns.forEach((c) => {
    const date = new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existing = timelineMap.get(date) || { performance: 0, count: 0 };
    timelineMap.set(date, {
      performance: existing.performance + (c.performanceScore || 0),
      count: existing.count + 1,
    });
  });

  const timeline = Array.from(timelineMap.entries())
    .map(([date, val]) => ({
      date,
      performance: val.count > 0 ? Math.round(val.performance / val.count) : 0,
      campaigns: val.count,
    }))
    .slice(-10);

  return (
    <AppLayout title={t('dashboard.title')}>
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <StatsCards
            stats={{
              totalCampaigns: campaigns.length,
              activeCampaigns: activeCampaigns.length,
              avgPerformance,
              totalClients: clients?.length || 0,
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentCampaigns campaigns={campaigns} />
            <PerformanceOverview data={timeline} />
          </div>
        </motion.div>
      )}
    </AppLayout>
  );
}
