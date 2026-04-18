import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins,
  Check,
  Upload,
  CreditCard,
  ArrowRight,
  Info,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import FileUpload from '../components/ui/FileUpload';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { cn } from '../lib/utils';
import { formatDate, getImageUrl } from '../lib/utils';
import {
  useTokenBalance,
  useCreatePurchase,
  useUploadPaymentProof,
  useUserTransactions,
  usePaymentMethods,
} from '../hooks/useTokens';
import type { TokenPackage, PaymentMethodType } from '../types/tokens';

const TOKEN_PACKAGES: TokenPackage[] = [
  { id: 'pkg_50', tokens: 5500, price: 50, label: '$50', bonus: '10%' },
  { id: 'pkg_100', tokens: 11000, price: 100, label: '$100', bonus: '10%' },
  { id: 'pkg_200', tokens: 22500, price: 200, label: '$200', bonus: '12.5%' },
];

type PurchaseStep = 'package' | 'payment' | 'confirm';

export default function TokensPage() {
  const { t } = useTranslation();
  const { data: balanceData, isLoading: balanceLoading } = useTokenBalance();
  const { data: transactions, isLoading: txLoading } = useUserTransactions();
  const { data: paymentMethods } = usePaymentMethods();
  const createPurchase = useCreatePurchase();
  const uploadProof = useUploadPaymentProof();

  const [step, setStep] = useState<PurchaseStep>('package');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>(null);
  const [paymentRef, setPaymentRef] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const activePackage = TOKEN_PACKAGES.find((p) => p.id === selectedPackage);
  const isCustom = selectedPackage === 'custom';
  const customDollar = parseFloat(customAmount) || 0;
  const customTokens = customDollar * 100;

  const purchaseTokens = isCustom ? customTokens : (activePackage?.tokens ?? 0);
  const purchasePrice = isCustom ? customDollar : (activePackage?.price ?? 0);

  const canProceedToPayment = purchaseTokens > 0 && purchasePrice > 0;

  const handleSelectPackage = (id: string) => {
    setSelectedPackage(id);
    if (id !== 'custom') setCustomAmount('');
    setStep('payment');
    setSelectedMethod(null);
  };

  const handleSelectMethod = (method: PaymentMethodType) => {
    setSelectedMethod(method);
    setStep('confirm');
  };

  const handleSubmit = async () => {
    if (!selectedMethod || !paymentRef) return;
    try {
      const result = await createPurchase.mutateAsync({
        packageId: isCustom ? undefined : selectedPackage!,
        tokens: purchaseTokens,
        amountUsd: purchasePrice,
        paymentMethod: selectedMethod,
        paymentReference: paymentRef,
      });

      if (proofFile) {
        await uploadProof.mutateAsync({ id: result._id, file: proofFile });
      }

      setSubmitted(true);
      setStep('package');
      setSelectedPackage(null);
      setCustomAmount('');
      setSelectedMethod(null);
      setPaymentRef('');
      setProofFile(null);
    } catch {
      // errors handled by hook
    }
  };

  const resetFlow = () => {
    setStep('package');
    setSelectedPackage(null);
    setCustomAmount('');
    setSelectedMethod(null);
    setPaymentRef('');
    setProofFile(null);
    setSubmitted(false);
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const activeMethods = useMemo(
    () => paymentMethods?.filter((m) => m.isActive) ?? [],
    [paymentMethods],
  );

  return (
    <AppLayout title={t('tokens.buyTokens')}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Section 1: Current Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden">
            <div className="flex items-center gap-6 p-2">
              <div className="p-4 rounded-2xl gradient-brand">
                <Coins className="h-10 w-10 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {t('tokens.currentBalance')}
                </p>
                {balanceLoading ? (
                  <div className="h-10 w-32 bg-slate-200 rounded animate-pulse mt-1" />
                ) : (
                  <motion.p
                    key={balanceData?.balance}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-bold gradient-brand-text"
                  >
                    {balanceData?.balance?.toLocaleString() ?? 0}
                  </motion.p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  {t('tokens.tokensPerDollar')}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Success message */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="border-emerald-200 bg-emerald-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-emerald-500">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">
                      {t('tokens.paymentSubmitted')}
                    </p>
                    <p className="text-xs text-emerald-600">
                      {t('tokens.paymentSubmittedHint')}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section 2: Token Packages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            {t('tokens.packages')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOKEN_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handleSelectPackage(pkg.id)}
                className={cn(
                  'relative p-6 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-lg',
                  selectedPackage === pkg.id
                    ? 'border-brand-primary bg-brand-primary/5 shadow-md shadow-brand-primary/10'
                    : 'border-slate-200 bg-white hover:border-brand-primary/40',
                )}
              >
                {pkg.bonus && (
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold gradient-brand text-white">
                    +{pkg.bonus} {t('tokens.bonus')}
                  </span>
                )}
                <p className="text-2xl font-bold text-slate-900">{pkg.label}</p>
                <p className="text-3xl font-extrabold gradient-brand-text mt-2">
                  {pkg.tokens.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-1">tokens</p>
              </button>
            ))}

            {/* Custom Amount */}
            <div
              className={cn(
                'p-6 rounded-2xl border-2 transition-all duration-200',
                isCustom
                  ? 'border-brand-primary bg-brand-primary/5'
                  : 'border-slate-200 bg-white',
              )}
            >
              <p className="text-sm font-semibold text-slate-700 mb-3">
                {t('tokens.customAmount')}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">$</span>
                <input
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedPackage('custom');
                  }}
                  placeholder="0"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                />
              </div>
              {isCustom && customTokens > 0 && (
                <p className="text-sm font-bold gradient-brand-text mt-2">
                  = {customTokens.toLocaleString()} tokens
                </p>
              )}
              {isCustom && customTokens > 0 && (
                <Button
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => handleSelectPackage('custom')}
                >
                  {t('tokens.selectPackage')}
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Section 3: Payment Method Selection */}
        <AnimatePresence>
          {(step === 'payment' || step === 'confirm') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                {t('tokens.selectPayment')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(['binance', 'zelle', 'pago_movil'] as PaymentMethodType[]).map(
                  (method) => {
                    const config = paymentMethods?.find((m) => m.type === method);
                    const isActive = config?.isActive ?? false;
                    const isSelected = selectedMethod === method;

                    return (
                      <button
                        key={method}
                        disabled={!isActive}
                        onClick={() => isActive && handleSelectMethod(method)}
                        className={cn(
                          'p-5 rounded-2xl border-2 text-left transition-all duration-200',
                          !isActive && 'opacity-40 cursor-not-allowed bg-slate-50',
                          isSelected
                            ? 'border-brand-primary bg-brand-primary/5 shadow-md'
                            : isActive
                            ? 'border-slate-200 bg-white hover:border-brand-primary/40 hover:shadow-md'
                            : 'border-slate-200',
                        )}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <CreditCard className="h-5 w-5 text-brand-primary" />
                          <span className="font-semibold text-slate-900">
                            {t(`tokens.${method}`)}
                          </span>
                          {isSelected && (
                            <Check className="h-4 w-4 text-brand-primary ml-auto" />
                          )}
                        </div>
                        {isActive && config?.config && (
                          <div className="text-xs text-slate-500 space-y-1">
                            {method === 'binance' && (
                              <>
                                {config.config.email && (
                                  <p>Email: {config.config.email}</p>
                                )}
                                {config.config.qrCode && (
                                  <img
                                    src={getImageUrl(config.config.qrCode)}
                                    alt="QR"
                                    className="w-20 h-20 mt-2 rounded-lg border border-slate-200"
                                  />
                                )}
                              </>
                            )}
                            {method === 'zelle' && config.config.email && (
                              <p>Email: {config.config.email}</p>
                            )}
                            {method === 'pago_movil' && (
                              <>
                                {config.config.phone && (
                                  <p>Tel: {config.config.phone}</p>
                                )}
                                {config.config.cedula && (
                                  <p>CI: {config.config.cedula}</p>
                                )}
                                {config.config.bank && (
                                  <p>Banco: {config.config.bank}</p>
                                )}
                                {config.config.bcvRate && (
                                  <p className="font-medium text-brand-primary mt-1">
                                    {t('tokens.pagoMovilAmount')}:{' '}
                                    {(
                                      purchasePrice *
                                      parseFloat(config.config.bcvRate)
                                    ).toFixed(2)}{' '}
                                    Bs
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section 4: Payment Confirmation */}
        <AnimatePresence>
          {step === 'confirm' && selectedMethod && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  {t('tokens.submitPayment')}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">{purchaseTokens.toLocaleString()}</span>{' '}
                      tokens &mdash;{' '}
                      <span className="font-medium">${purchasePrice}</span> USD
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-brand-primary">
                      {t(`tokens.${selectedMethod}`)}
                    </span>
                  </div>

                  <Input
                    label={t('tokens.paymentReference')}
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="e.g. TXN123456"
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      {t('tokens.paymentProof')}
                    </label>
                    <FileUpload
                      onFileSelect={(file) => setProofFile(file)}
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" onClick={resetFlow}>
                      {t('common.cancel')}
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      loading={createPurchase.isPending || uploadProof.isPending}
                      disabled={!paymentRef}
                    >
                      <Upload className="h-4 w-4" />
                      {t('tokens.submitPayment')}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section 5: Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            {t('tokens.transactionHistory')}
          </h2>
          {txLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : !transactions || transactions.length === 0 ? (
            <EmptyState
              icon={<Coins className="h-8 w-8" />}
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
                        {t('tokens.date')}
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
                      <th className="text-center px-4 py-3 font-medium text-slate-500">
                        {t('tokens.status')}
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-slate-500">
                        {t('tokens.method')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr
                        key={tx._id}
                        className="border-b border-slate-50 hover:bg-slate-50/50"
                      >
                        <td className="px-4 py-3 text-slate-600">
                          {formatDate(tx.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-slate-700 font-medium">
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
                        <td className="px-4 py-3 text-center">
                          <Badge variant={statusVariant(tx.status)}>
                            {t(`tokens.${tx.status}`)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {tx.paymentMethod
                            ? t(`tokens.${tx.paymentMethod}`)
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
