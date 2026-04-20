import { useTranslation } from 'react-i18next';
import { Images, Coins, Info, Bot } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useCampaignCost } from '../../../hooks/useTokens';
import type { TextAgent, ImageAgent } from '../../../types/campaign';

const textAgents: { id: TextAgent; label: string; desc: string }[] = [
  { id: 'claude', label: 'Claude', desc: 'Anthropic' },
  { id: 'grok', label: 'Grok', desc: 'xAI' },
];

const imageAgents: { id: ImageAgent; label: string; desc: string }[] = [
  { id: 'gemini', label: 'Gemini', desc: 'Google' },
  { id: 'flux', label: 'Flux', desc: 'Black Forest Labs' },
];

interface Step4Props {
  campaignDescription: string;
  imageDescription: string;
  imageCount: number;
  textAgent: TextAgent;
  imagePromptAgent: TextAgent;
  imageAgent: ImageAgent;
  onChange: (
    campaignDesc: string,
    imageDesc: string,
    imageCount: number,
    textAgent: TextAgent,
    imagePromptAgent: TextAgent,
    imageAgent: ImageAgent,
  ) => void;
}

export default function Step4Descriptions({
  campaignDescription,
  imageDescription,
  imageCount,
  textAgent,
  imagePromptAgent,
  imageAgent,
  onChange,
}: Step4Props) {
  const { t } = useTranslation();
  const { data: costData } = useCampaignCost(imageCount);

  const update = (partial: Partial<{
    cd: string; id: string; ic: number;
    ta: TextAgent; ipa: TextAgent; ia: ImageAgent;
  }>) => {
    onChange(
      partial.cd ?? campaignDescription,
      partial.id ?? imageDescription,
      partial.ic ?? imageCount,
      partial.ta ?? textAgent,
      partial.ipa ?? imagePromptAgent,
      partial.ia ?? imageAgent,
    );
  };

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
            onChange={(e) => update({ cd: e.target.value })}
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
            onChange={(e) => update({ id: e.target.value })}
            placeholder={t('campaigns.imageDescPlaceholder')}
            rows={5}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all duration-200 resize-none"
          />
        </div>

        {/* AI Agent Selection */}
        <div className="space-y-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <Bot className="h-4 w-4 text-brand-primary" />
            <h4 className="text-sm font-semibold text-slate-900">{t('campaigns.aiAgents')}</h4>
          </div>

          {/* Copy & Caption Agent */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">
              {t('campaigns.textAgent')}
            </label>
            <div className="flex gap-2">
              {textAgents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => update({ ta: agent.id })}
                  className={cn(
                    'flex-1 px-3 py-2.5 rounded-xl border-2 text-left transition-all duration-200',
                    textAgent === agent.id
                      ? 'border-brand-primary bg-brand-primary/5'
                      : 'border-slate-200 bg-white hover:border-slate-300',
                  )}
                >
                  <span className="text-sm font-semibold text-slate-900">{agent.label}</span>
                  <span className="block text-xs text-slate-400">{agent.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Image Prompt Agent */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">
              {t('campaigns.imagePromptAgent')}
            </label>
            <div className="flex gap-2">
              {textAgents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => update({ ipa: agent.id })}
                  className={cn(
                    'flex-1 px-3 py-2.5 rounded-xl border-2 text-left transition-all duration-200',
                    imagePromptAgent === agent.id
                      ? 'border-brand-secondary bg-brand-secondary/5'
                      : 'border-slate-200 bg-white hover:border-slate-300',
                  )}
                >
                  <span className="text-sm font-semibold text-slate-900">{agent.label}</span>
                  <span className="block text-xs text-slate-400">{agent.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Image Generation Agent */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">
              {t('campaigns.imageGenAgent')}
            </label>
            <div className="flex gap-2">
              {imageAgents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => update({ ia: agent.id })}
                  className={cn(
                    'flex-1 px-3 py-2.5 rounded-xl border-2 text-left transition-all duration-200',
                    imageAgent === agent.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 bg-white hover:border-slate-300',
                  )}
                >
                  <span className="text-sm font-semibold text-slate-900">{agent.label}</span>
                  <span className="block text-xs text-slate-400">{agent.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Image Count */}
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
              onChange={(e) => update({ ic: parseInt(e.target.value) })}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-brand-primary bg-slate-200"
            />
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => update({ ic: i + 1 })}
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
