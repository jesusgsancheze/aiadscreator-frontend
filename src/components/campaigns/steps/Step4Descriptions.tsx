import { useTranslation } from 'react-i18next';

interface Step4Props {
  campaignDescription: string;
  imageDescription: string;
  onChange: (campaignDesc: string, imageDesc: string) => void;
}

export default function Step4Descriptions({
  campaignDescription,
  imageDescription,
  onChange,
}: Step4Props) {
  const { t } = useTranslation();

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
            onChange={(e) => onChange(e.target.value, imageDescription)}
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
            onChange={(e) => onChange(campaignDescription, e.target.value)}
            placeholder={t('campaigns.imageDescPlaceholder')}
            rows={5}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all duration-200 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
