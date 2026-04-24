import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Pencil, X } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useCampaign, useUpdateCampaign } from '../../../hooks/useCampaigns';
import GeneratedImagesGrid from '../GeneratedImagesGrid';
import { useSelectImage } from '../../../hooks/useCampaigns';
import type { SocialMedia } from '../../../types/campaign';
import { InstagramIcon, TikTokIcon, FacebookIcon, WhatsAppIcon, GoogleAdsIcon, MetaIcon } from '../../icons/SocialIcons';

const socialIcons: Record<SocialMedia, React.ReactNode> = {
  instagram: <InstagramIcon className="h-5 w-5" />,
  tiktok: <TikTokIcon className="h-5 w-5" />,
  facebook: <FacebookIcon className="h-5 w-5" />,
  whatsapp: <WhatsAppIcon className="h-5 w-5" />,
  google_ads: <GoogleAdsIcon className="h-5 w-5" />,
  meta_full: <MetaIcon className="h-5 w-5" />,
  google_pmax: <GoogleAdsIcon className="h-5 w-5" />,
};

interface InlineEditProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  multiline?: boolean;
}

function InlineEdit({ label, value, onSave, multiline }: InlineEditProps) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const handleSave = () => {
    onSave(draft);
    setEditing(false);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-slate-400">{label}</p>
        {!editing ? (
          <button
            onClick={() => { setDraft(value); setEditing(true); }}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-xs text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
          >
            <Pencil className="h-3 w-3" />
            {t('common.edit')}
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              className="p-1 rounded text-brand-primary hover:bg-brand-primary/10 transition-all"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => { setDraft(value); setEditing(false); }}
              className="p-1 rounded text-slate-400 hover:bg-slate-100 transition-all"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
      {editing ? (
        multiline ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all duration-200 resize-none"
          />
        ) : (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all duration-200"
          />
        )
      ) : (
        <p className="text-sm text-slate-600 whitespace-pre-wrap">{value}</p>
      )}
    </Card>
  );
}

interface Step6Props {
  state: {
    socialMedia: SocialMedia | null;
    clientName: string;
    campaignDescription: string;
    imageDescription: string;
    productImagePreviews: string[];
    campaignId: string | null;
  };
}

export default function Step6Review({ state }: Step6Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: campaign } = useCampaign(state.campaignId || '');
  const updateCampaign = useUpdateCampaign();
  const selectImage = useSelectImage();

  const handleSaveField = (field: string, value: string) => {
    if (!state.campaignId) return;
    updateCampaign.mutate({ id: state.campaignId, payload: { [field]: value } });
  };

  const handleSelectImage = (index: number) => {
    if (!state.campaignId) return;
    selectImage.mutate({ id: state.campaignId, imageIndex: index });
  };

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

        {state.productImagePreviews.length > 0 && (
          <Card>
            <p className="text-xs text-slate-400 mb-2">{t('campaigns.referenceImages')}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {state.productImagePreviews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Reference ${i + 1}`}
                  className="w-full h-32 object-cover rounded-xl"
                />
              ))}
            </div>
          </Card>
        )}

        {campaign && (
          <>
            {campaign.copy && (
              <InlineEdit
                label={t('campaigns.copy')}
                value={campaign.copy}
                onSave={(v) => handleSaveField('copy', v)}
                multiline
              />
            )}
            {campaign.caption && (
              <InlineEdit
                label={t('campaigns.caption')}
                value={campaign.caption}
                onSave={(v) => handleSaveField('caption', v)}
                multiline
              />
            )}

            {/* Google PMax preview: headlines + first description */}
            {campaign.socialMedia === 'google_pmax' && campaign.headlines.length > 0 && (
              <Card>
                <p className="text-xs text-slate-400 mb-2">
                  {t('campaigns.headlines')} ({campaign.headlines.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {campaign.headlines.map((h, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-full bg-brand-primary/5 border border-brand-primary/20 text-slate-700"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </Card>
            )}
            {campaign.socialMedia === 'google_pmax' && campaign.descriptions.length > 0 && (
              <Card>
                <p className="text-xs text-slate-400 mb-2">
                  {t('campaigns.descriptions')} ({campaign.descriptions.length})
                </p>
                <ul className="text-sm text-slate-700 space-y-1.5 list-disc list-inside">
                  {campaign.descriptions.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </Card>
            )}

            {campaign.generatedImages.length > 0 && (
              <Card>
                <p className="text-xs text-slate-400 mb-3">{t('campaigns.selectImage')}</p>
                <GeneratedImagesGrid
                  images={campaign.generatedImages}
                  selectedIndex={campaign.selectedImage}
                  onSelect={handleSelectImage}
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
            {t('campaigns.viewCampaign')}
          </Button>
        </div>
      </div>
    </div>
  );
}
