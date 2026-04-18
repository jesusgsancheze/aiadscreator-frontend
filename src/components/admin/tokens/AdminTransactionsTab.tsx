import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Check, X } from 'lucide-react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import Select from '../../ui/Select';
import Input from '../../ui/Input';
import Modal from '../../ui/Modal';
import Spinner from '../../ui/Spinner';
import EmptyState from '../../ui/EmptyState';
import { cn } from '../../../lib/utils';
import { formatDate, getImageUrl } from '../../../lib/utils';
import {
  useAdminTransactions,
  useReviewTransaction,
} from '../../../hooks/useTokens';
import type { TokenTransaction, TransactionStatus } from '../../../types/tokens';

export default function AdminTransactionsTab() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reviewTx, setReviewTx] = useState<TokenTransaction | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const { data, isLoading } = useAdminTransactions({
    status: (statusFilter || undefined) as TransactionStatus | undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const review = useReviewTransaction();

  const handleReview = (status: 'approved' | 'rejected') => {
    if (!reviewTx) return;
    review.mutate(
      { id: reviewTx._id, status, adminNote: adminNote || undefined },
      {
        onSuccess: () => {
          setReviewTx(null);
          setAdminNote('');
        },
      },
    );
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'success' as const;
      case 'pending': return 'warning' as const;
      case 'rejected': return 'error' as const;
      default: return 'default' as const;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  const transactions = data?.data ?? [];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4">
          <div className="w-40">
            <Select
              label={t('tokens.status')}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: t('common.all') },
                { value: 'pending', label: t('tokens.pending') },
                { value: 'approved', label: t('tokens.approved') },
                { value: 'rejected', label: t('tokens.rejected') },
              ]}
            />
          </div>
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

      {/* Table */}
      {transactions.length === 0 ? (
        <EmptyState
          icon={<X className="h-8 w-8" />}
          title={t('tokens.noTransactions')}
          description={t('tokens.noTransactions')}
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500">
                    {t('common.name')}
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">
                    {t('tokens.type')}
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500">
                    Tokens
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500">
                    {t('tokens.amount')}
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">
                    {t('tokens.method')}
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-slate-500">
                    {t('tokens.status')}
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">
                    {t('tokens.date')}
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-slate-500">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="border-b border-slate-50 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {tx.user
                        ? `${tx.user.firstName} ${tx.user.lastName}`
                        : tx.userId}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {t(`tokens.${tx.type}`)}
                    </td>
                    <td className={cn(
                      'px-4 py-3 text-right font-semibold',
                      tx.type === 'campaign_spend' ? 'text-red-500' : 'text-emerald-600',
                    )}>
                      {tx.type === 'campaign_spend' ? '-' : '+'}
                      {tx.tokens.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {tx.amountUsd != null ? `$${tx.amountUsd}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {tx.paymentMethod
                        ? t(`tokens.${tx.paymentMethod}`)
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={statusVariant(tx.status)}>
                        {t(`tokens.${tx.status}`)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {tx.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                setReviewTx(tx);
                                setAdminNote('');
                              }}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                              title={t('tokens.reviewTransaction')}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setReviewTx(tx);
                                setAdminNote('');
                                // quick approve
                              }}
                              className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"
                              title={t('tokens.approve')}
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setReviewTx(tx);
                                setAdminNote('');
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                              title={t('tokens.reject')}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={!!reviewTx}
        onClose={() => setReviewTx(null)}
        title={t('tokens.reviewTransaction')}
        maxWidth="max-w-xl"
      >
        {reviewTx && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-400">{t('tokens.type')}:</span>
                <span className="ml-2 font-medium text-slate-700">
                  {t(`tokens.${reviewTx.type}`)}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Tokens:</span>
                <span className="ml-2 font-semibold text-slate-700">
                  {reviewTx.tokens.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400">{t('tokens.amount')}:</span>
                <span className="ml-2 font-medium text-slate-700">
                  {reviewTx.amountUsd != null ? `$${reviewTx.amountUsd}` : '-'}
                </span>
              </div>
              <div>
                <span className="text-slate-400">{t('tokens.method')}:</span>
                <span className="ml-2 font-medium text-slate-700">
                  {reviewTx.paymentMethod
                    ? t(`tokens.${reviewTx.paymentMethod}`)
                    : '-'}
                </span>
              </div>
              {reviewTx.paymentReference && (
                <div className="col-span-2">
                  <span className="text-slate-400">
                    {t('tokens.paymentReference')}:
                  </span>
                  <span className="ml-2 font-mono text-slate-700">
                    {reviewTx.paymentReference}
                  </span>
                </div>
              )}
            </div>

            {reviewTx.paymentProof && (
              <div>
                <p className="text-sm font-medium text-slate-500 mb-2">
                  {t('tokens.paymentProof')}
                </p>
                <img
                  src={getImageUrl(reviewTx.paymentProof)}
                  alt="Payment proof"
                  className="max-h-60 rounded-xl border border-slate-200"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t('tokens.adminNote')}
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all duration-200 resize-none"
                placeholder={t('tokens.adminNote')}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => setReviewTx(null)}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="danger"
                loading={review.isPending}
                onClick={() => handleReview('rejected')}
              >
                <X className="h-4 w-4" />
                {t('tokens.reject')}
              </Button>
              <Button
                loading={review.isPending}
                onClick={() => handleReview('approved')}
              >
                <Check className="h-4 w-4" />
                {t('tokens.approve')}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
