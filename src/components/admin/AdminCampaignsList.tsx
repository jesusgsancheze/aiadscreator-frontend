import { useTranslation } from 'react-i18next';
import { InstagramIcon, TikTokIcon, FacebookIcon, WhatsAppIcon, GoogleAdsIcon, MetaIcon } from '../icons/SocialIcons';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import { useAdminCampaigns } from '../../hooks/useAdmin';
import { formatDate, truncate } from '../../lib/utils';
import type { SocialMedia, CampaignStatus } from '../../types/campaign';

const socialIcons: Record<SocialMedia, React.ReactNode> = {
  instagram: <InstagramIcon className="h-3.5 w-3.5" />,
  tiktok: <TikTokIcon className="h-3.5 w-3.5" />,
  facebook: <FacebookIcon className="h-3.5 w-3.5" />,
  whatsapp: <WhatsAppIcon className="h-3.5 w-3.5" />,
  google_ads: <GoogleAdsIcon className="h-3.5 w-3.5" />,
  meta_full: <MetaIcon className="h-3.5 w-3.5" />,
  google_pmax: <GoogleAdsIcon className="h-3.5 w-3.5" />,
};

const statusVariant: Record<CampaignStatus, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  draft: 'default',
  generating: 'warning',
  ready: 'info',
  published: 'success',
  failed: 'error',
};

export default function AdminCampaignsList() {
  const { t } = useTranslation();
  const { data: campaigns, isLoading } = useAdminCampaigns();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Card padding="none">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('campaigns.socialMedia')}
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('campaigns.campaignDescription')}
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('common.status')}
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('campaigns.performance')}
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('common.date')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {campaigns?.map((campaign) => (
              <tr key={campaign._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                      {socialIcons[campaign.socialMedia]}
                    </span>
                    <span className="capitalize">{campaign.socialMedia}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 max-w-xs">
                  {truncate(campaign.campaignDescription, 50)}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={statusVariant[campaign.status]}>{campaign.status}</Badge>
                </td>
                <td className="px-6 py-4">
                  {campaign.performanceScore !== null ? (
                    <span className="font-semibold text-brand-primary">
                      {campaign.performanceScore}%
                    </span>
                  ) : (
                    <span className="text-slate-300">--</span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-400">{formatDate(campaign.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
