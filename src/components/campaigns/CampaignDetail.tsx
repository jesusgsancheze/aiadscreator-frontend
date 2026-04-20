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
  Pencil,
  Check,
  X,
  RefreshCw,
  Send,
  Search,
  ClipboardCopy,
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
import type { Campaign, SocialMedia, CampaignStatus } from '../../types/campaign';
import type { Client } from '../../types/client';
import {
  useUpdateCampaign,
  useUpdatePerformance,
  useDeleteCampaign,
} from '../../hooks/useCampaigns';
import { useMetaInsights } from '../../hooks/useMeta';
import { getImageUrl } from '../../lib/utils';

const socialIcons: Record<SocialMedia, React.ReactNode> = {
  instagram: <Camera className="h-5 w-5" />,
  tiktok: <Music className="h-5 w-5" />,
  facebook: <Share className="h-5 w-5" />,
  whatsapp: <MessageCircle className="h-5 w-5" />,
  google_ads: <Search className="h-5 w-5" />,
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
  const updatePerformance = useUpdatePerformance();
  const deleteCampaign = useDeleteCampaign();
  const [socialMediaLink, setSocialMediaLink] = useState(campaign.socialMediaLink || '');
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const { data: metaInsights, refetch: refetchInsights } = useMetaInsights(campaign.metaCampaignId || '');

  const clientName =
    typeof campaign.clientId === 'object' ? (campaign.clientId as Client).name : '';

  const handleSaveField = (field: string, value: string) => {
    updateCampaign.mutate({ id: campaign._id, payload: { [field]: value } });
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
            (campaign.socialMedia === 'facebook' || campaign.socialMedia === 'instagram') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setPublishModalOpen(true)}
            >
              <Send className="h-4 w-4" />
              {t('meta.publishToMeta')}
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
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Generated Images Manager */}
          <CampaignImagesManager
            campaignId={campaign._id}
            images={campaign.generatedImages}
            selectedIndex={campaign.selectedImage}
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
                    <circle cx="40" cy="40" r="34" stroke="#f1f5f9" strokeWidth="6" fill="none" />
                    <circle
                      cx="40" cy="40" r="34" stroke="#4EBEA2" strokeWidth="6" fill="none"
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
    </motion.div>
  );
}
