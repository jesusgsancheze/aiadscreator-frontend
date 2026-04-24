import { useTranslation } from 'react-i18next';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Card from '../ui/Card';

interface PerformanceOverviewProps {
  data: { date: string; performance: number; campaigns: number }[];
}

export default function PerformanceOverview({ data }: PerformanceOverviewProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <h3 className="text-base font-semibold text-slate-900 mb-4">
        {t('dashboard.performanceOverview')}
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c185d" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#7c185d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="performance"
              stroke="#7c185d"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPerf)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
