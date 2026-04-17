import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Camera, Music, Share, MessageCircle } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useCampaign } from '../../../hooks/useCampaigns';
import { getImageUrl } from '../../../lib/utils';
import type { SocialMedia } from '../../../types/campaign';

const socialIcons: Record<SocialMedia, React.ReactNode> = {
  instagram: <Camera className="h-5 w-5" />,
  tiktok: <Music className="h-5 w-5" />,
  facebook: <Share className="h-5 w-5" />,
  whatsapp: <MessageCircle className="h-5 w-5" />,
};

interface Step6Props {
  state: {
    socialMedia: SocialMedia | null;
    clientName: string;
    campaignDescription: string;
    imageDescription: string;
    productImagePreview: string | null;
    campaignId: string | null;
  };
}

export default function Step6Review({ state }: Step6Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: campaign } = useCampaign(state.campaignId || '');

  return (
    <div>
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center h-16 w-16 gradient-brand rounded-full mb-4"
        >
          <Check className="h-8 w-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-900">{t('campaigns.step6Title')}</h2>
        <p className="text-sm text-slate-500 mt-2">{t('campaigns.step6Desc')}</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        <Card>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">{t('campaigns.socialMedia')}</p>
              <div className="flex items-center gap-2">
                {state.socialMedia && (
                  <span className="p-1.5 rounded-lg gradient-brand text-white">
                    {socialIcons[state.socialMedia]}
                  </span>
                )}
                <span className="text-sm font-medium text-slate-900 capitalize">
                  {state.socialMedia}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">{t('campaigns.selectClient')}</p>
              <p className="text-sm font-medium text-slate-900">{state.clientName}</p>
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-xs text-slate-400 mb-1">{t('campaigns.campaignDescription')}</p>
          <p className="text-sm text-slate-600">{state.campaignDescription}</p>
          <p className="text-xs text-slate-400 mb-1 mt-4">{t('campaigns.imageDescription')}</p>
          <p className="text-sm text-slate-600">{state.imageDescription}</p>
        </Card>

        {state.productImagePreview && (
          <Card>
            <p className="text-xs text-slate-400 mb-2">{t('campaigns.productImage')}</p>
            <img
              src={state.productImagePreview}
              alt="Product"
              className="max-h-48 rounded-xl object-contain"
            />
          </Card>
        )}

        {campaign && (
          <>
            {campaign.copy && (
              <Card>
                <p className="text-xs text-slate-400 mb-1">{t('campaigns.copy')}</p>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{campaign.copy}</p>
              </Card>
            )}
            {campaign.caption && (
              <Card>
                <p className="text-xs text-slate-400 mb-1">{t('campaigns.caption')}</p>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{campaign.caption}</p>
              </Card>
            )}
            {campaign.selectedImage !== null && campaign.generatedImages[campaign.selectedImage] && (
              <Card>
                <p className="text-xs text-slate-400 mb-2">{t('campaigns.selectImage')}</p>
                <img
                  src={getImageUrl(campaign.generatedImages[campaign.selectedImage])}
                  alt="Selected"
                  className="max-h-64 rounded-xl object-contain"
                />
              </Card>
            )}
          </>
        )}

        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            onClick={() => navigate(state.campaignId ? `/campaigns/${state.campaignId}` : '/campaigns')}
          >
            {t('campaigns.save')}
          </Button>
        </div>
      </div>
    </div>
  );
}
