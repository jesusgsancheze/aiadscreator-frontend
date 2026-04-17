import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Camera,
  Music,
  Share,
  MessageCircle,
  Link as LinkIcon,
  Trash2,
  Copy,
  Type,
  Image as ImageIcon,
} from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Spinner from '../ui/Spinner';
import GeneratedImagesGrid from './GeneratedImagesGrid';
import PerformanceChart from './PerformanceChart';
import type { Campaign, SocialMedia, CampaignStatus } from '../../types/campaign';
import type { Client } from '../../types/client';
import { useSelectImage, useUpdatePerformance, useDeleteCampaign } from '../../hooks/useCampaigns';
import { getImageUrl } from '../../lib/utils';

const socialIcons: Record<SocialMedia, React.ReactNode> = {
  instagram: <Camera className="h-5 w-5" />,
  tiktok: <Music className="h-5 w-5" />,
  facebook: <Share className="h-5 w-5" />,
  whatsapp: <MessageCircle className="h-5 w-5" />,
};

const statusVariant: Record<CampaignStatus, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  draft: 'default',
  generating: 'warning',
  ready: 'info',
  published: 'success',
  failed: 'error',
};

interface CampaignDetailProps {
  campaign: Campaign;
}

export default function CampaignDetail({ campaign }: CampaignDetailProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const selectImage = useSelectImage();
  const updatePerformance = useUpdatePerformance();
  const deleteCampaign = useDeleteCampaign();
  const [socialMediaLink, setSocialMediaLink] = useState(campaign.socialMediaLink || '');

  const clientName =
    typeof campaign.clientId === 'object' ? (campaign.clientId as Client).name : '';

  const handleSelectImage = (index: number) => {
    selectImage.mutate({ id: campaign._id, imageIndex: index });
  };

  const handleSaveLink = () => {
    updatePerformance.mutate({
      id: campaign._id,
      payload: { socialMediaLink },
    });
  };

  const handleDelete = () => {
    if (window.confirm(t('common.confirm'))) {
      deleteCampaign.mutate(campaign._id, {
        onSuccess: () => navigate('/campaigns'),
      });
    }
  };

  if (campaign.status === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Spinner size="lg" />
        <p className="mt-4 text-slate-500">{t('campaigns.generating')}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/campaigns')}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg gradient-brand text-white">
                {socialIcons[campaign.socialMedia]}
              </span>
              <h2 className="text-xl font-bold text-slate-900 capitalize">
                {campaign.socialMedia}
              </h2>
              <Badge variant={statusVariant[campaign.status]}>{campaign.status}</Badge>
            </div>
            {clientName && (
              <p className="text-sm text-slate-500 mt-1 ml-14">{clientName}</p>
            )}
          </div>
        </div>
        <Button variant="danger" size="sm" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
          {t('campaigns.delete')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Descriptions */}
          <Card>
            <h3 className="text-base font-semibold text-slate-900 mb-3">
              {t('campaigns.campaignDescription')}
            </h3>
            <p className="text-sm text-slate-600">{campaign.campaignDescription}</p>

            <h3 className="text-base font-semibold text-slate-900 mb-3 mt-6">
              {t('campaigns.imageDescription')}
            </h3>
            <p className="text-sm text-slate-600">{campaign.imageDescription}</p>
          </Card>

          {/* Product Image */}
          {campaign.productImage && (
            <Card>
              <h3 className="text-base font-semibold text-slate-900 mb-3">
                {t('campaigns.productImage')}
              </h3>
              <img
                src={getImageUrl(campaign.productImage)}
                alt="Product"
                className="w-full max-h-64 object-contain rounded-xl"
              />
            </Card>
          )}

          {/* Copy & Caption */}
          {campaign.copy && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Copy className="h-4 w-4 text-brand-primary" />
                <h3 className="text-base font-semibold text-slate-900">
                  {t('campaigns.copy')}
                </h3>
              </div>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{campaign.copy}</p>
            </Card>
          )}

          {campaign.caption && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Type className="h-4 w-4 text-brand-secondary" />
                <h3 className="text-base font-semibold text-slate-900">
                  {t('campaigns.caption')}
                </h3>
              </div>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{campaign.caption}</p>
            </Card>
          )}

          {campaign.imagePrompt && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="h-4 w-4 text-purple-500" />
                <h3 className="text-base font-semibold text-slate-900">
                  {t('campaigns.imagePrompt')}
                </h3>
              </div>
              <p className="text-sm text-slate-500 italic">{campaign.imagePrompt}</p>
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Generated Images */}
          {campaign.generatedImages.length > 0 && (
            <Card>
              <h3 className="text-base font-semibold text-slate-900 mb-4">
                {t('campaigns.generatedImages')}
              </h3>
              <GeneratedImagesGrid
                images={campaign.generatedImages}
                selectedIndex={campaign.selectedImage}
                onSelect={handleSelectImage}
              />
            </Card>
          )}

          {/* Social Media Link */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <LinkIcon className="h-4 w-4 text-brand-primary" />
              <h3 className="text-base font-semibold text-slate-900">
                {t('campaigns.socialMediaLink')}
              </h3>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder={t('campaigns.socialMediaLinkPlaceholder')}
                value={socialMediaLink}
                onChange={(e) => setSocialMediaLink(e.target.value)}
              />
              <Button
                size="sm"
                onClick={handleSaveLink}
                loading={updatePerformance.isPending}
              >
                {t('common.save')}
              </Button>
            </div>
          </Card>

          {/* Performance */}
          {campaign.performanceScore !== null && (
            <Card>
              <h3 className="text-base font-semibold text-slate-900 mb-3">
                {t('campaigns.performance')}
              </h3>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20">
                  <svg className="h-20 w-20 -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      stroke="#f1f5f9"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      stroke="#4EBEA2"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(campaign.performanceScore / 100) * 213.6} 213.6`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-slate-900">
                      {campaign.performanceScore}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {t('campaigns.performance')}
                  </p>
                  <p className="text-xs text-slate-400">Score out of 100</p>
                </div>
              </div>
            </Card>
          )}

          {/* Analytics Chart */}
          {campaign.analytics && Object.keys(campaign.analytics).length > 0 && (
            <PerformanceChart analytics={campaign.analytics} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
