import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import type { SocialMedia } from '../../../types/campaign';
import { SOCIAL_MEDIA_PLATFORMS } from '../../../constants/socialMedia';
import { usePlatformAvailability } from '../../../hooks/useCampaigns';

interface Step1Props {
  selected: SocialMedia | null;
  onSelect: (sm: SocialMedia) => void;
}

export default function Step1SocialMedia({ selected, onSelect }: Step1Props) {
  const { t } = useTranslation();
  const { data: availability } = usePlatformAvailability();

  const visible = SOCIAL_MEDIA_PLATFORMS.filter((p) => {
    const state = availability?.[p.id] ?? 'enabled';
    return state !== 'hidden';
  });

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">{t('campaigns.step1Title')}</h2>
        <p className="text-sm text-slate-500 mt-2">{t('campaigns.step1Desc')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {visible.map((platform) => {
          const Icon = platform.icon;
          const isSelected = selected === platform.id;
          const state = availability?.[platform.id] ?? 'enabled';
          const isDisabled = state === 'disabled';

          return (
            <motion.button
              key={platform.id}
              whileHover={isDisabled ? undefined : { scale: 1.03 }}
              whileTap={isDisabled ? undefined : { scale: 0.97 }}
              onClick={() => {
                if (isDisabled) return;
                onSelect(platform.id);
              }}
              disabled={isDisabled}
              aria-disabled={isDisabled}
              title={isDisabled ? t('campaigns.platformUnavailable') : undefined}
              className={cn(
                'flex flex-col items-center gap-4 p-8 rounded-2xl border-2 transition-all duration-200',
                isDisabled
                  ? 'border-slate-100 bg-slate-50 opacity-60 grayscale cursor-not-allowed'
                  : isSelected
                  ? 'border-brand-primary bg-brand-primary/5 shadow-lg shadow-brand-primary/10 cursor-pointer'
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md cursor-pointer',
              )}
            >
              <div className={cn('p-4 rounded-2xl text-white', platform.bg)}>
                <Icon className="h-8 w-8" />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-sm font-semibold text-slate-900">
                  {platform.label}
                </span>
                {isDisabled ? (
                  <span className="text-[11px] font-medium text-slate-500 leading-tight text-center uppercase tracking-wide">
                    {t('campaigns.platformUnavailable')}
                  </span>
                ) : (
                  platform.hint && (
                    <span className="text-[11px] text-slate-500 leading-tight text-center">
                      {platform.hint}
                    </span>
                  )
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
