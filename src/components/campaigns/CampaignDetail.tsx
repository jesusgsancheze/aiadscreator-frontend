import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Link as LinkIcon,
  Trash2,
  Copy,
  Type,
  Image as ImageIcon,
  Pencil,
  Check,
  X,
  RefreshCw,
  Send,
  ClipboardCopy,
  Building2,
  AlignLeft,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Spinner from '../ui/Spinner';
import AIEditableField from './AIEditableField';
import CampaignImagesManager from './CampaignImagesManager';
import PerformanceChart from './PerformanceChart';
import PublishToMetaModal from '../meta/PublishToMetaModal';
import PublishToGoogleAdsModal from '../google-ads/PublishToGoogleAdsModal';
import type { Campaign, SocialMedia, CampaignStatus } from '../../types/campaign';
import type { Client } from '../../types/client';
import {
  useUpdateCampaign,
  useDeleteCampaign,
} from '../../hooks/useCampaigns';
import { useMetaInsights } from '../../hooks/useMeta';
import { getImageUrl } from '../../lib/utils';
import { InstagramIcon, TikTokIcon, FacebookIcon, WhatsAppIcon, GoogleAdsIcon, MetaIcon } from '../icons/SocialIcons';

const socialIcons: Record<SocialMedia, React.ReactNode> = {
  instagram: <InstagramIcon className="h-5 w-5" />,
  tiktok: <TikTokIcon className="h-5 w-5" />,
  facebook: <FacebookIcon className="h-5 w-5" />,
  whatsapp: <WhatsAppIcon className="h-5 w-5" />,
  google_ads: <GoogleAdsIcon className="h-5 w-5" />,
  meta_full: <MetaIcon className="h-5 w-5" />,
  google_pmax: <GoogleAdsIcon className="h-5 w-5" />,
};

const statusVariant: Record<CampaignStatus, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  draft: 'default',
  generating: 'warning',
  ready: 'info',
  published: 'success',
  failed: 'error',
};

interface EditableFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  onSave: (value: string) => void;
  saving?: boolean;
  multiline?: boolean;
}

function EditableField({ label, value, icon, onSave, saving, multiline }: EditableFieldProps) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const handleSave = () => {
    onSave(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-base font-semibold text-slate-900">{label}</h3>
        </div>
        {!editing ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => { navigator.clipboard.writeText(value); toast.success(t('common.copied')); }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
            >
              <ClipboardCopy className="h-3.5 w-3.5" />
            </button>
          <button
            onClick={() => { setDraft(value); setEditing(true); }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
          >
            <Pencil className="h-3.5 w-3.5" />
            {t('common.edit')}
          </button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="p-1.5 rounded-lg text-brand-primary hover:bg-brand-primary/10 transition-all"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      {editing ? (
        multiline ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={6}
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

interface CampaignDetailProps {
  campaign: Campaign;
}

export default function CampaignDetail({ campaign }: CampaignDetailProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();
  const [socialMediaLink, setSocialMediaLink] = useState(campaign.socialMediaLink || '');
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [googleAdsPublishOpen, setGoogleAdsPublishOpen] = useState(false);
  const { data: metaInsights, refetch: refetchInsights } = useMetaInsights(campaign.metaCampaignId || '');

  const clientName =
    typeof campaign.clientId === 'object' ? (campaign.clientId as Client).name : '';

  const handleSaveField = (field: string, value: string) => {
    updateCampaign.mutate({ id: campaign._id, payload: { [field]: value } });
  };

  const handleSaveLink = () => {
    updateCampaign.mutate({
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
              <h2 className="text-xl font-bold text-slate-900">
                {campaign.title || campaign.socialMedia}
              </h2>
              <Badge variant={statusVariant[campaign.status]}>{campaign.status}</Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1 ml-14">
              {[clientName, campaign.socialMedia].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(campaign.status === 'ready' || campaign.status === 'published') &&
            (campaign.socialMedia === 'facebook' || campaign.socialMedia === 'instagram' || campaign.socialMedia === 'meta_full') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setPublishModalOpen(true)}
            >
              <Send className="h-4 w-4" />
              {t('meta.publishToMeta')}
            </Button>
          )}
          {(campaign.status === 'ready' || campaign.status === 'published') &&
            campaign.socialMedia === 'google_pmax' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setGoogleAdsPublishOpen(true)}
            >
              <Send className="h-4 w-4" />
              {t('googleAds.publishCta')}
            </Button>
          )}
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
            {t('campaigns.delete')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Descriptions - editable */}
          <EditableField
            label={t('campaigns.campaignDescription')}
            value={campaign.campaignDescription}
            icon={<Type className="h-4 w-4 text-slate-500" />}
            onSave={(v) => handleSaveField('campaignDescription', v)}
            saving={updateCampaign.isPending}
            multiline
          />

          <EditableField
            label={t('campaigns.imageDescription')}
            value={campaign.imageDescription}
            icon={<ImageIcon className="h-4 w-4 text-slate-500" />}
            onSave={(v) => handleSaveField('imageDescription', v)}
            saving={updateCampaign.isPending}
            multiline
          />

          {/* Reference Images */}
          {campaign.productImages && campaign.productImages.length > 0 && (
            <Card>
              <h3 className="text-base font-semibold text-slate-900 mb-3">
                {t('campaigns.referenceImages')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {campaign.productImages.map((img, i) => (
                  <img
                    key={i}
                    src={getImageUrl(img)}
                    alt={`Reference ${i + 1}`}
                    className="w-full h-32 object-cover rounded-xl"
                  />
                ))}
              </div>
            </Card>
          )}

          {/* Copy - AI editable */}
          {campaign.copy && (
            <AIEditableField
              label={t('campaigns.copy')}
              value={campaign.copy}
              icon={<Copy className="h-4 w-4 text-brand-primary" />}
              field="copy"
              campaignId={campaign._id}
              onUpdate={(v) => handleSaveField('copy', v)}
              saving={updateCampaign.isPending}
            />
          )}

          {/* Caption - AI editable */}
          {campaign.caption && (
            <AIEditableField
              label={t('campaigns.caption')}
              value={campaign.caption}
              icon={<Type className="h-4 w-4 text-brand-secondary" />}
              field="caption"
              campaignId={campaign._id}
              onUpdate={(v) => handleSaveField('caption', v)}
              saving={updateCampaign.isPending}
            />
          )}

          {/* Image Prompt - editable */}
          {campaign.imagePrompt && (
            <EditableField
              label={t('campaigns.imagePrompt')}
              value={campaign.imagePrompt}
              icon={<ImageIcon className="h-4 w-4 text-purple-500" />}
              onSave={(v) => handleSaveField('imagePrompt', v)}
              saving={updateCampaign.isPending}
              multiline
            />
          )}

          {/* Google PMax: business name, headlines, long headlines, descriptions,
              AI suggestion rationale, landscape image prompt. */}
          {campaign.socialMedia === 'google_pmax' && (
            <>
              {campaign.businessName && (
                <Card>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-brand-primary" />
                    <h3 className="text-sm font-semibold text-slate-700">
                      {t('campaigns.businessName')}
                    </h3>
                  </div>
                  <p className="text-base font-medium text-slate-900">
                    {campaign.businessName}
                  </p>
                </Card>
              )}

              {campaign.headlines.length > 0 && (
                <Card>
                  <div className="flex items-center gap-2 mb-3">
                    <Type className="h-4 w-4 text-brand-primary" />
                    <h3 className="text-sm font-semibold text-slate-700">
                      {t('campaigns.headlines')} ({campaign.headlines.length})
                    </h3>
                  </div>
                  <div className="space-y-1.5">
                    {campaign.headlines.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2"
                      >
                        <p className="text-sm text-slate-700">{h}</p>
                        <span className="text-xs text-slate-400 shrink-0 tabular-nums">
                          {h.length}/30
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {campaign.longHeadlines.length > 0 && (
                <Card>
                  <div className="flex items-center gap-2 mb-3">
                    <Type className="h-4 w-4 text-brand-secondary" />
                    <h3 className="text-sm font-semibold text-slate-700">
                      {t('campaigns.longHeadlines')} ({campaign.longHeadlines.length})
                    </h3>
                  </div>
                  <div className="space-y-1.5">
                    {campaign.longHeadlines.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2"
                      >
                        <p className="text-sm text-slate-700">{h}</p>
                        <span className="text-xs text-slate-400 shrink-0 tabular-nums">
                          {h.length}/90
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {campaign.descriptions.length > 0 && (
                <Card>
                  <div className="flex items-center gap-2 mb-3">
                    <AlignLeft className="h-4 w-4 text-purple-500" />
                    <h3 className="text-sm font-semibold text-slate-700">
                      {t('campaigns.descriptions')} ({campaign.descriptions.length})
                    </h3>
                  </div>
                  <div className="space-y-1.5">
                    {campaign.descriptions.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2"
                      >
                        <p className="text-sm text-slate-700">{d}</p>
                        <span className="text-xs text-slate-400 shrink-0 tabular-nums">
                          {d.length}/90
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {campaign.googleAdsSuggestion && (
                <Card className="border-brand-primary/20 bg-brand-primary/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-brand-primary" />
                    <h3 className="text-sm font-semibold text-brand-primary">
                      {t('campaigns.googleAdsSuggestionTitle')}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 italic mb-3">
                    "{campaign.googleAdsSuggestion.rationale}"
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-slate-400 mb-0.5">
                        {t('campaigns.biddingStrategy')}
                      </p>
                      <p className="text-slate-900 font-medium">
                        {campaign.googleAdsSuggestion.biddingStrategy.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-0.5">{t('meta.dailyBudget')}</p>
                      <p className="text-slate-900 font-medium">
                        ${campaign.googleAdsSuggestion.dailyBudget}
                      </p>
                    </div>
                    {campaign.googleAdsSuggestion.targetCpa != null && (
                      <div>
                        <p className="text-slate-400 mb-0.5">{t('campaigns.targetCpa')}</p>
                        <p className="text-slate-900 font-medium">
                          ${campaign.googleAdsSuggestion.targetCpa}
                        </p>
                      </div>
                    )}
                    {campaign.googleAdsSuggestion.targetRoas != null && (
                      <div>
                        <p className="text-slate-400 mb-0.5">{t('campaigns.targetRoas')}</p>
                        <p className="text-slate-900 font-medium">
                          {campaign.googleAdsSuggestion.targetRoas}x
                        </p>
                      </div>
                    )}
                    {campaign.googleAdsSuggestion.callToAction && (
                      <div>
                        <p className="text-slate-400 mb-0.5">
                          {t('campaigns.callToAction')}
                        </p>
                        <p className="text-slate-900 font-medium">
                          {campaign.googleAdsSuggestion.callToAction.replace(/_/g, ' ')}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-slate-400 mb-0.5">{t('campaigns.countries')}</p>
                      <p className="text-slate-900 font-medium">
                        {campaign.googleAdsSuggestion.geo.countries.join(', ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-0.5">{t('campaigns.languages')}</p>
                      <p className="text-slate-900 font-medium">
                        {campaign.googleAdsSuggestion.languages.join(', ').toUpperCase()}
                      </p>
                    </div>
                  </div>
                  {campaign.googleAdsSuggestion.audienceSignals.interests.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-slate-400 mb-1">
                        {t('campaigns.audienceInterests')}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {campaign.googleAdsSuggestion.audienceSignals.interests.map(
                          (interest, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600"
                            >
                              {interest}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                  {campaign.googleAdsSuggestion.audienceSignals.customSegmentHints
                    .length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-slate-400 mb-1">
                        {t('campaigns.customSegmentHints')}
                      </p>
                      <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
                        {campaign.googleAdsSuggestion.audienceSignals.customSegmentHints.map(
                          (hint, idx) => (
                            <li key={idx}>{hint}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </Card>
              )}

              {campaign.landscapeImagePrompt && (
                <EditableField
                  label={t('campaigns.landscapeImagePrompt')}
                  value={campaign.landscapeImagePrompt}
                  icon={<ImageIcon className="h-4 w-4 text-amber-500" />}
                  onSave={(v) => handleSaveField('landscapeImagePrompt', v)}
                  saving={updateCampaign.isPending}
                  multiline
                />
              )}
            </>
          )}

          {/* Meta-family: inline AI suggestion card (same info the Publish modal pre-fills). */}
          {(campaign.socialMedia === 'meta_full' ||
            campaign.socialMedia === 'facebook' ||
            campaign.socialMedia === 'instagram') &&
            campaign.suggestion && (
              <Card className="border-brand-primary/20 bg-brand-primary/5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-brand-primary" />
                  <h3 className="text-sm font-semibold text-brand-primary">
                    {t('meta.suggestion.banner')}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mb-1.5">
                  {t('meta.suggestion.applied')}
                </p>
                {campaign.suggestion.rationale && (
                  <p className="text-xs text-slate-500 italic mb-3">
                    "{campaign.suggestion.rationale}"
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-slate-400 mb-0.5">{t('meta.objective')}</p>
                    <p className="text-slate-900 font-medium">
                      {campaign.suggestion.objective.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-0.5">{t('meta.dailyBudget')}</p>
                    <p className="text-slate-900 font-medium">
                      ${campaign.suggestion.dailyBudget}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-0.5">
                      {t('meta.suggestion.optimizationGoal')}
                    </p>
                    <p className="text-slate-900 font-medium">
                      {campaign.suggestion.optimizationGoal.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-0.5">
                      {t('meta.suggestion.billingEvent')}
                    </p>
                    <p className="text-slate-900 font-medium">
                      {campaign.suggestion.billingEvent.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-0.5">
                      {t('meta.suggestion.ageRange')}
                    </p>
                    <p className="text-slate-900 font-medium">
                      {campaign.suggestion.targeting.ageMin}–
                      {campaign.suggestion.targeting.ageMax}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-0.5">
                      {t('meta.suggestion.gender')}
                    </p>
                    <p className="text-slate-900 font-medium">
                      {(() => {
                        const g = campaign.suggestion.targeting.genders;
                        if (!g || g.length === 0 || (g.includes(1) && g.includes(2))) {
                          return t('meta.suggestion.genderAll');
                        }
                        if (g.length === 1 && g[0] === 1) return t('meta.suggestion.genderMale');
                        if (g.length === 1 && g[0] === 2) return t('meta.suggestion.genderFemale');
                        return t('meta.suggestion.genderAll');
                      })()}
                    </p>
                  </div>
                  {campaign.suggestion.targeting.countries.length > 0 && (
                    <div className="col-span-2">
                      <p className="text-slate-400 mb-0.5">{t('campaigns.countries')}</p>
                      <p className="text-slate-900 font-medium">
                        {campaign.suggestion.targeting.countries.join(', ')}
                      </p>
                    </div>
                  )}
                </div>

                {campaign.suggestion.targeting.interests.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-400 mb-1">
                      {t('meta.suggestion.interests')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {campaign.suggestion.targeting.interests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {campaign.suggestion.placements && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-400 mb-1">
                      {t('meta.suggestion.placements')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {campaign.suggestion.placements.publisherPlatforms.map((p, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 capitalize"
                        >
                          {p === 'facebook' && t('meta.suggestion.platformFacebook')}
                          {p === 'instagram' && t('meta.suggestion.platformInstagram')}
                          {p === 'messenger' && t('meta.suggestion.platformMessenger')}
                          {p === 'audience_network' &&
                            t('meta.suggestion.platformAudienceNetwork')}
                          {!['facebook', 'instagram', 'messenger', 'audience_network'].includes(p) && p}
                        </span>
                      ))}
                      {campaign.suggestion.placements.useAdvantagePlacements && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-medium">
                          {t('meta.suggestion.useAdvantagePlacements')}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Generated Images Manager */}
          <CampaignImagesManager
            campaignId={campaign._id}
            images={campaign.generatedImages}
            selectedIndex={campaign.selectedImage}
            verticalImages={campaign.verticalImages}
            selectedVerticalIndex={campaign.selectedVerticalImage}
            videos={campaign.videos}
            selectedVideoIndex={campaign.selectedVideo}
            videoPrompt={campaign.videoPrompt}
            showVideoSection={campaign.socialMedia === 'meta_full'}
            landscapeImages={campaign.landscapeImages}
            selectedLandscapeIndex={campaign.selectedLandscapeImage}
            showLandscapeSection={campaign.socialMedia === 'google_pmax'}
          />

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
                loading={updateCampaign.isPending}
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
                    <circle cx="40" cy="40" r="34" stroke="#f1f5f9" strokeWidth="6" fill="none" />
                    <circle
                      cx="40" cy="40" r="34" stroke="#7c185d" strokeWidth="6" fill="none"
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
                  <p className="text-sm font-medium text-slate-900">{t('campaigns.performance')}</p>
                  <p className="text-xs text-slate-400">Score out of 100</p>
                </div>
              </div>
            </Card>
          )}

          {/* Analytics Chart */}
          {campaign.analytics && Object.keys(campaign.analytics).length > 0 && (
            <PerformanceChart analytics={campaign.analytics} />
          )}

          {/* Meta Status */}
          {campaign.metaCampaignId && (
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-slate-900">{t('meta.metaStatus')}</h3>
                <Badge variant={campaign.metaStatus === 'ACTIVE' ? 'success' : 'default'}>
                  {campaign.metaStatus || 'N/A'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Meta Campaign ID: <span className="font-mono">{campaign.metaCampaignId}</span>
              </p>
              {metaInsights && (
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xs text-slate-400">Impressions</p>
                    <p className="text-sm font-semibold text-slate-900">{metaInsights.impressions.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xs text-slate-400">Clicks</p>
                    <p className="text-sm font-semibold text-slate-900">{metaInsights.clicks.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xs text-slate-400">Reach</p>
                    <p className="text-sm font-semibold text-slate-900">{metaInsights.reach.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xs text-slate-400">CTR</p>
                    <p className="text-sm font-semibold text-slate-900">{metaInsights.ctr}%</p>
                  </div>
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={() => refetchInsights()}>
                <RefreshCw className="h-3.5 w-3.5" />
                {t('meta.syncInsights')}
              </Button>
            </Card>
          )}
        </div>
      </div>

      <PublishToMetaModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        campaign={campaign}
      />
      <PublishToGoogleAdsModal
        isOpen={googleAdsPublishOpen}
        onClose={() => setGoogleAdsPublishOpen(false)}
        campaign={campaign}
      />
    </motion.div>
  );
}
