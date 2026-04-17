import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Card from '../ui/Card';
import type { CampaignAnalytics } from '../../types/campaign';

interface PerformanceChartProps {
  analytics: CampaignAnalytics;
}

export default function PerformanceChart({ analytics }: PerformanceChartProps) {
  const { t } = useTranslation();

  const data = [
    { name: 'Impressions', value: analytics.impressions || 0 },
    { name: 'Clicks', value: analytics.clicks || 0 },
    { name: 'Conversions', value: analytics.conversions || 0 },
    { name: 'Reach', value: analytics.reach || 0 },
  ];

  return (
    <Card>
      <h3 className="text-base font-semibold text-slate-900 mb-4">
        {t('campaigns.analytics')}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              }}
            />
            <Bar dataKey="value" fill="#4EBEA2" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-50">
        <div>
          <p className="text-xs text-slate-400">CTR</p>
          <p className="text-sm font-semibold text-slate-900">{analytics.ctr?.toFixed(2) || 0}%</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Engagement</p>
          <p className="text-sm font-semibold text-slate-900">{analytics.engagement || 0}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Spent</p>
          <p className="text-sm font-semibold text-slate-900">${analytics.spent?.toFixed(2) || 0}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Conversions</p>
          <p className="text-sm font-semibold text-slate-900">{analytics.conversions || 0}</p>
        </div>
      </div>
    </Card>
  );
}
