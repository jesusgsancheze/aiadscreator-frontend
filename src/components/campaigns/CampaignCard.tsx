import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calendar, Pencil, Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import type { Campaign, CampaignStatus, SocialMedia } from '../../types/campaign';
import type { Client } from '../../types/client';
import { truncate, formatDate } from '../../lib/utils';
import { useDeleteCampaign } from '../../hooks/useCampaigns';
import { InstagramIcon, TikTokIcon, FacebookIcon, WhatsAppIcon, GoogleAdsIcon, MetaIcon } from '../icons/SocialIcons';

const socialIcons: Record<SocialMedia, React.ReactNode> = {
  instagram: <InstagramIcon className="h-4 w-4" />,
  tiktok: <TikTokIcon className="h-4 w-4" />,
  facebook: <FacebookIcon className="h-4 w-4" />,
  whatsapp: <WhatsAppIcon className="h-4 w-4" />,
  google_ads: <GoogleAdsIcon className="h-4 w-4" />,
  meta_full: <MetaIcon className="h-4 w-4" />,
  google_pmax: <GoogleAdsIcon className="h-4 w-4" />,
};

const socialColors: Record<SocialMedia, string> = {
  instagram: 'bg-pink-50 text-pink-600',
  tiktok: 'bg-slate-900 text-white',
  facebook: 'bg-blue-50 text-blue-600',
  whatsapp: 'bg-green-50 text-green-600',
  google_ads: 'bg-yellow-50 text-yellow-600',
  meta_full: 'bg-gradient-to-br from-blue-50 to-pink-50 text-slate-700',
  google_pmax: 'bg-gradient-to-br from-blue-50 to-yellow-50 text-slate-700',
};

const statusVariant: Record<CampaignStatus, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  draft: 'default',
  generating: 'warning',
  ready: 'info',
  published: 'success',
  failed: 'error',
};

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const deleteCampaign = useDeleteCampaign();

  const clientName =
    typeof campaign.clientId === 'object' ? (campaign.clientId as Client).name : '';

  // Drafts were never generated, so open them back in the wizard to resume
  // (and finish generation) rather than the read-only detail page.
  const target =
    campaign.status === 'draft'
      ? `/campaigns/new?draft=${campaign._id}`
      : `/campaigns/${campaign._id}`;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t('common.confirm'))) {
      deleteCampaign.mutate(campaign._id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => navigate(target)}
      className="cursor-pointer group"
    >
      <Card className="hover:shadow-md transition-shadow relative">
        {/* Action buttons - visible on hover */}
        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(target); }}
            className="p-1.5 rounded-lg bg-white shadow-sm border border-slate-100 text-slate-500 hover:text-brand-primary hover:border-brand-primary/20 transition-all"
            title={t('common.edit')}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg bg-white shadow-sm border border-slate-100 text-slate-500 hover:text-red-500 hover:border-red-200 transition-all"
            title={t('common.delete')}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center justify-center h-8 w-8 rounded-lg ${socialColors[campaign.socialMedia]}`}
            >
              {socialIcons[campaign.socialMedia]}
            </span>
            <span className="text-sm font-medium text-slate-900 capitalize">
              {campaign.socialMedia}
            </span>
          </div>
          <Badge variant={statusVariant[campaign.status]}>{campaign.status}</Badge>
        </div>

        <h4 className="text-sm font-semibold text-slate-900 mb-1">
          {campaign.title || truncate(campaign.campaignDescription, 50)}
        </h4>
        <p className="text-xs text-slate-500 mb-3">
          {truncate(campaign.campaignDescription, 80)}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
          <div className="flex items-center gap-4">
            {clientName && (
              <span className="text-xs text-slate-400">{clientName}</span>
            )}
            {campaign.performanceScore !== null && (
              <span className="text-xs font-semibold text-brand-primary">
                {campaign.performanceScore}%
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="h-3 w-3" />
            {formatDate(campaign.createdAt)}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
