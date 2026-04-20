import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Check, X, Sparkles, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useRefineCopy, useRefineCaption } from '../../hooks/useCampaigns';
import { useTokenBalance } from '../../hooks/useTokens';

type EditMode = 'view' | 'manual-edit' | 'ai-edit' | 'ai-loading';

interface AIEditableFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  field: 'copy' | 'caption';
  campaignId: string;
  onUpdate: (value: string) => void;
  saving?: boolean;
}

const AI_EDIT_COST = 50;

export default function AIEditableField({
  label,
  value,
  icon,
  field,
  campaignId,
  onUpdate,
  saving,
}: AIEditableFieldProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<EditMode>('view');
  const [draft, setDraft] = useState(value);
  const [instructions, setInstructions] = useState('');

  const refineCopy = useRefineCopy();
  const refineCaption = useRefineCaption();
  const { data: balanceData } = useTokenBalance();

  const balance = balanceData?.balance ?? 0;
  const hasEnoughTokens = balance >= AI_EDIT_COST;

  const handleManualSave = () => {
    onUpdate(draft);
    setMode('view');
  };

  const handleCancel = () => {
    setDraft(value);
    setInstructions('');
    setMode('view');
  };

  const handleAIApply = () => {
    if (!instructions.trim()) return;
    setMode('ai-loading');

    const mutation = field === 'copy' ? refineCopy : refineCaption;
    mutation.mutate(
      { id: campaignId, instructions: instructions.trim() },
      {
        onSuccess: () => {
          setInstructions('');
          setMode('view');
        },
        onError: () => {
          setMode('ai-edit');
        },
      },
    );
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-base font-semibold text-slate-900">{label}</h3>
        </div>
        {mode === 'view' && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setDraft(value);
                setMode('manual-edit');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
            >
              <Pencil className="h-3.5 w-3.5" />
              {t('common.edit')}
            </button>
            <button
              onClick={() => {
                setInstructions('');
                setMode('ai-edit');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-brand-secondary hover:bg-brand-secondary/5 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t('campaigns.editWithAI')}
            </button>
          </div>
        )}
        {mode === 'manual-edit' && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleManualSave}
              disabled={saving}
              className="p-1.5 rounded-lg text-brand-primary hover:bg-brand-primary/10 transition-all"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* View mode */}
      {mode === 'view' && (
        <p className="text-sm text-slate-600 whitespace-pre-wrap">{value}</p>
      )}

      {/* Manual edit mode */}
      {mode === 'manual-edit' && (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={6}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all duration-200 resize-none"
        />
      )}

      {/* AI edit mode */}
      <AnimatePresence>
        {(mode === 'ai-edit' || mode === 'ai-loading') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {/* Current text preview */}
            <div className="mb-4 rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{value}</p>
            </div>

            {mode === 'ai-loading' ? (
              <div className="flex items-center justify-center gap-3 py-6">
                <Loader2 className="h-5 w-5 animate-spin text-brand-secondary" />
                <span className="text-sm font-medium text-slate-600">
                  {field === 'copy'
                    ? t('campaigns.refiningCopy')
                    : t('campaigns.refiningCaption')}
                </span>
              </div>
            ) : (
              <>
                {/* Instructions textarea */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('campaigns.aiInstructions')}
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={3}
                    placeholder={t('campaigns.aiInstructionsPlaceholder')}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary transition-all duration-200 resize-none"
                  />
                </div>

                {/* Token cost info */}
                <div className="mb-4 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span className="text-xs text-slate-500">
                    {t('campaigns.aiEditCost', { cost: AI_EDIT_COST })}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      hasEnoughTokens ? 'text-brand-primary' : 'text-red-500'
                    }`}
                  >
                    {t('tokens.balance')}: {balance}
                  </span>
                </div>

                {!hasEnoughTokens && (
                  <div className="mb-4 rounded-lg bg-red-50 px-3 py-2">
                    <p className="text-xs text-red-600">
                      {t('tokens.insufficientTokens')}.{' '}
                      <Link
                        to="/tokens"
                        className="font-semibold underline hover:text-red-700"
                      >
                        {t('tokens.buyTokens')}
                      </Link>
                    </p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleAIApply}
                    disabled={!hasEnoughTokens || !instructions.trim()}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {t('campaigns.applyAIChanges')}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    {t('common.cancel')}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
