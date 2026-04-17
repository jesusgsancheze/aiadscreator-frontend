import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Camera, Music, Share, MessageCircle, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import type { Campaign, SocialMedia, CampaignStatus } from '../../types/campaign';
import type { Client } from '../../types/client';
import { formatDate, truncate } from '../../lib/utils';

const socialIcons: Record<SocialMedia, React.ReactNode> = {
  instagram: <Camera className="h-3.5 w-3.5" />,
  tiktok: <Music className="h-3.5 w-3.5" />,
  facebook: <Share className="h-3.5 w-3.5" />,
  whatsapp: <MessageCircle className="h-3.5 w-3.5" />,
};

const statusVariant: Record<CampaignStatus, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  draft: 'default',
  generating: 'warning',
  ready: 'info',
  published: 'success',
  failed: 'error',
};

interface RecentCampaignsProps {
  campaigns: Campaign[];
}

export default function RecentCampaigns({ campaigns }: RecentCampaignsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">
          {t('dashboard.recentCampaigns')}
        </h3>
        <button
          onClick={() => navigate('/campaigns')}
          className="text-sm text-brand-primary hover:text-brand-primary-dark flex items-center gap-1 transition-colors"
        >
          {t('common.all')}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-50">
        {campaigns.length === 0 ? (
          <p className="text-sm text-slate-400 py-8 text-center">{t('common.noResults')}</p>
        ) : (
          campaigns.slice(0, 5).map((campaign) => {
            const clientName =
              typeof campaign.clientId === 'object'
                ? (campaign.clientId as Client).name
                : '';

            return (
              <div
                key={campaign._id}
                onClick={() => navigate(`/campaigns/${campaign._id}`)}
                className="flex items-center justify-between py-3 cursor-pointer hover:bg-slate-50 -mx-6 px-6 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                    {socialIcons[campaign.socialMedia]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {truncate(campaign.campaignDescription, 40)}
                    </p>
                    {clientName && (
                      <p className="text-xs text-slate-400">{clientName}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariant[campaign.status]}>{campaign.status}</Badge>
                  <span className="text-xs text-slate-400 hidden sm:block">
                    {formatDate(campaign.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
