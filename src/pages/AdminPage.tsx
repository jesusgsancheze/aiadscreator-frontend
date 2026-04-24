import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Building2, Megaphone, Coins, ToggleLeft } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminUsersList from '../components/admin/AdminUsersList';
import AdminClientsList from '../components/admin/AdminClientsList';
import AdminCampaignsList from '../components/admin/AdminCampaignsList';
import AdminTokensPanel from '../components/admin/AdminTokensPanel';
import AdminPlatformsTab from '../components/admin/AdminPlatformsTab';
import { cn } from '../lib/utils';

type Tab = 'dashboard' | 'users' | 'clients' | 'campaigns' | 'tokens' | 'platforms';

const tabs: { key: Tab; icon: React.ElementType }[] = [
  { key: 'dashboard', icon: LayoutDashboard },
  { key: 'users', icon: Users },
  { key: 'clients', icon: Building2 },
  { key: 'campaigns', icon: Megaphone },
  { key: 'tokens', icon: Coins },
  { key: 'platforms', icon: ToggleLeft },
];

export default function AdminPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <AppLayout title={t('admin.title')}>
      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-slate-100 p-1 mb-6 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'gradient-brand text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50',
              )}
            >
              <Icon className="h-4 w-4" />
              {t(`admin.${tab.key}`)}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'users' && <AdminUsersList />}
        {activeTab === 'clients' && <AdminClientsList />}
        {activeTab === 'campaigns' && <AdminCampaignsList />}
        {activeTab === 'tokens' && <AdminTokensPanel />}
        {activeTab === 'platforms' && <AdminPlatformsTab />}
      </motion.div>
    </AppLayout>
  );
}
