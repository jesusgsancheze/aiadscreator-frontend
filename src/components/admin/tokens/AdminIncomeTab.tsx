import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, BarChart3, TrendingUp } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import Card from '../../ui/Card';
import Input from '../../ui/Input';
import Badge from '../../ui/Badge';
import Spinner from '../../ui/Spinner';
import { formatDate } from '../../../lib/utils';
import { useIncomeReport } from '../../../hooks/useTokens';

const COLORS = ['#4EBEA2', '#12B2C1', '#F59E0B', '#EF4444'];

export default function AdminIncomeTab() {
  const { t } = useTranslation();
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split('T')[0];
  const today = now.toISOString().split('T')[0];

  const [dateFrom, setDateFrom] = useState(firstOfMonth);
  const [dateTo, setDateTo] = useState(today);

  const { data: report, isLoading } = useIncomeReport({
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  const avgTransaction =
    report && report.totalTransactions > 0
      ? report.totalIncome / report.totalTransactions
      : 0;

  const pieData =
    report?.byPaymentMethod.map((item) => ({
      name: t(`tokens.${item.method}`),
      value: item.total,
      count: item.count,
    })) ?? [];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4">
          <div className="w-44">
            <Input
              label={t('tokens.date') + ' (from)'}
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="w-44">
            <Input
              label={t('tokens.date') + ' (to)'}
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl gradient-brand">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase">
                {t('tokens.totalIncome')}
              </p>
              <p className="text-2xl font-bold text-slate-900">
                ${report?.totalIncome.toLocaleString() ?? 0}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-brand-secondary/10">
              <BarChart3 className="h-6 w-6 text-brand-secondary" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase">
                {t('tokens.totalTransactions')}
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {report?.totalTransactions ?? 0}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50">
              <TrendingUp className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase">
                Avg
              </p>
              <p className="text-2xl font-bold text-slate-900">
                ${avgTransaction.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pie chart */}
      {pieData.length > 0 && (
        <Card>
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            {t('tokens.paymentMethods')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`$${value}`, '']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Transactions list */}
      {report?.transactions && report.transactions.length > 0 && (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500">
                    {t('tokens.date')}
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">
                    {t('tokens.type')}
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500">
                    {t('tokens.amount')}
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500">
                    Tokens
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">
                    {t('tokens.method')}
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-slate-500">
                    {t('tokens.status')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="border-b border-slate-50 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {t(`tokens.${tx.type}`)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-700">
                      {tx.amountUsd != null ? `$${tx.amountUsd}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-600">
                      {tx.tokens.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {tx.paymentMethod
                        ? t(`tokens.${tx.paymentMethod}`)
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant={
                          tx.status === 'approved'
                            ? 'success'
                            : tx.status === 'pending'
                            ? 'warning'
                            : 'error'
                        }
                      >
                        {t(`tokens.${tx.status}`)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
