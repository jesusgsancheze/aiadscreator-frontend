import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowLeftRight,
  Gift,
  CreditCard,
  Settings,
  BarChart3,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import AdminTransactionsTab from './tokens/AdminTransactionsTab';
import AdminGrantTab from './tokens/AdminGrantTab';
import AdminPaymentMethodsTab from './tokens/AdminPaymentMethodsTab';
import AdminSettingsTab from './tokens/AdminSettingsTab';
import AdminIncomeTab from './tokens/AdminIncomeTab';

type TokenTab = 'transactions' | 'grant' | 'paymentMethods' | 'settings' | 'income';

const tokenTabs: { key: TokenTab; icon: React.ElementType }[] = [
  { key: 'transactions', icon: ArrowLeftRight },
  { key: 'grant', icon: Gift },
  { key: 'paymentMethods', icon: CreditCard },
  { key: 'settings', icon: Settings },
  { key: 'income', icon: BarChart3 },
];

export default function AdminTokensPanel() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TokenTab>('transactions');

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-1 bg-slate-50 rounded-xl p-1 mb-6 w-fit flex-wrap">
        {tokenTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                isActive
                  ? 'gradient-brand text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {t(`tokens.${tab.key}`)}
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
        {activeTab === 'transactions' && <AdminTransactionsTab />}
        {activeTab === 'grant' && <AdminGrantTab />}
        {activeTab === 'paymentMethods' && <AdminPaymentMethodsTab />}
        {activeTab === 'settings' && <AdminSettingsTab />}
        {activeTab === 'income' && <AdminIncomeTab />}
      </motion.div>
    </div>
  );
}
