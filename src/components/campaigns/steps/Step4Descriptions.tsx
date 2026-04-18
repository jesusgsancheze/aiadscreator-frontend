import { useTranslation } from 'react-i18next';
import { Images, Coins, Info } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useCampaignCost } from '../../../hooks/useTokens';

interface Step4Props {
  campaignDescription: string;
  imageDescription: string;
  imageCount: number;
  onChange: (campaignDesc: string, imageDesc: string, imageCount: number) => void;
}

export default function Step4Descriptions({
  campaignDescription,
  imageDescription,
  imageCount,
  onChange,
}: Step4Props) {
  const { t } = useTranslation();
  const { data: costData } = useCampaignCost(imageCount);

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">{t('campaigns.step4Title')}</h2>
        <p className="text-sm text-slate-500 mt-2">{t('campaigns.step4Desc')}</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {t('campaigns.campaignDescription')}
          </label>
          <textarea
            value={campaignDescription}
            onChange={(e) => onChange(e.target.value, imageDescription, imageCount)}
            placeholder={t('campaigns.campaignDescPlaceholder')}
            rows={5}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all duration-200 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {t('campaigns.imageDescription')}
          </label>
          <textarea
            value={imageDescription}
            onChange={(e) => onChange(campaignDescription, e.target.value, imageCount)}
            placeholder={t('campaigns.imageDescPlaceholder')}
            rows={5}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all duration-200 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            <span className="flex items-center gap-2">
              <Images className="h-4 w-4 text-brand-primary" />
              {t('campaigns.imageCount')}
            </span>
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={10}
              value={imageCount}
              onChange={(e) => onChange(campaignDescription, imageDescription, parseInt(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-brand-primary bg-slate-200"
            />
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => onChange(campaignDescription, imageDescription, i + 1)}
                    className={cn(
                      'h-8 w-8 rounded-lg text-xs font-semibold transition-all duration-200',
                      i + 1 === imageCount
                        ? 'gradient-brand text-white shadow-md shadow-brand-primary/20'
                        : i + 1 <= imageCount
                        ? 'bg-brand-primary/10 text-brand-primary'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200',
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {t('campaigns.imageCountHint', { count: imageCount })}
          </p>
        </div>

        {/* Token cost preview */}
        {costData && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-primary/5 border border-brand-primary/10">
            <Coins className="h-4 w-4 text-brand-primary flex-shrink-0" />
            <span className="text-sm font-medium text-slate-700">
              {t('tokens.estimatedCost')}:
            </span>
            <span className="text-sm font-bold gradient-brand-text">
              {costData.total} tokens
            </span>
            <div className="relative group ml-1">
              <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-white text-xs rounded-lg shadow-lg z-10">
                <p>{t('tokens.copyCaption')}: {costData.copyCaption} tokens</p>
                <p>{t('tokens.perImage')} ({imageCount}): {costData.images} tokens</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
