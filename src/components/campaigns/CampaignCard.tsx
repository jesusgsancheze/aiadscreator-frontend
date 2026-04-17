import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Camera, Music, Share, MessageCircle, Calendar } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import type { Campaign, CampaignStatus, SocialMedia } from '../../types/campaign';
import type { Client } from '../../types/client';
import { truncate, formatDate } from '../../lib/utils';

const socialIcons: Record<SocialMedia, React.ReactNode> = {
  instagram: <Camera className="h-4 w-4" />,
  tiktok: <Music className="h-4 w-4" />,
  facebook: <Share className="h-4 w-4" />,
  whatsapp: <MessageCircle className="h-4 w-4" />,
};

const socialColors: Record<SocialMedia, string> = {
  instagram: 'bg-pink-50 text-pink-600',
  tiktok: 'bg-slate-900 text-white',
  facebook: 'bg-blue-50 text-blue-600',
  whatsapp: 'bg-green-50 text-green-600',
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

  const clientName =
    typeof campaign.clientId === 'object' ? (campaign.clientId as Client).name : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/campaigns/${campaign._id}`)}
      className="cursor-pointer"
    >
      <Card className="hover:shadow-md transition-shadow">
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

        <p className="text-sm text-slate-600 mb-3">
          {truncate(campaign.campaignDescription, 100)}
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
