import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Check, Loader2, AlertTriangle, CheckCircle, Coins } from 'lucide-react';
import Button from '../../ui/Button';
import Spinner from '../../ui/Spinner';
import GeneratedImagesGrid from '../GeneratedImagesGrid';
import Card from '../../ui/Card';
import { useCreateCampaign, useCampaign, useGenerateContent, useSelectImage } from '../../../hooks/useCampaigns';
import { useTokenBalance, useCampaignCost } from '../../../hooks/useTokens';
import type { SocialMedia } from '../../../types/campaign';

interface Step5Props {
  state: {
    socialMedia: SocialMedia | null;
    clientId: string | null;
    productImages: File[];
    campaignDescription: string;
    imageDescription: string;
    imageCount: number;
    campaignId: string | null;
  };
  onCampaignCreated: (id: string) => void;
  onNext: () => void;
}

type GenerationPhase = 'idle' | 'creating' | 'generating' | 'polling' | 'done' | 'error';

const steps = [
  'generatingCopy',
  'generatingCaption',
  'generatingImagePrompt',
  'creatingImages',
];

export default function Step5AIGeneration({ state, onCampaignCreated, onNext }: Step5Props) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<GenerationPhase>(state.campaignId ? 'polling' : 'idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [campaignId, setCampaignId] = useState(state.campaignId);

  const createCampaign = useCreateCampaign();
  const generateContent = useGenerateContent();
  const selectImage = useSelectImage();
  const { data: campaign, refetch } = useCampaign(campaignId || '');
  const { data: balanceData } = useTokenBalance();
  const { data: costData } = useCampaignCost(state.imageCount);

  const balance = balanceData?.balance ?? 0;
  const totalCost = costData?.total ?? 0;
  const hasEnoughTokens = balance >= totalCost;

  // Animate through generation steps
  useEffect(() => {
    if (phase === 'generating' || phase === 'polling') {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          return prev;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Poll campaign status
  useEffect(() => {
    if (campaign?.status === 'ready' || campaign?.status === 'published') {
      setPhase('done');
      setCurrentStep(steps.length);
    } else if (campaign?.status === 'failed') {
      setPhase('error');
    } else if (campaign?.status === 'generating' && phase === 'polling') {
      const timeout = setTimeout(() => refetch(), 3000);
      return () => clearTimeout(timeout);
    }
  }, [campaign?.status, phase, refetch]);

  const startGeneration = async () => {
    try {
      setPhase('creating');

      // Create campaign first
      const formData = new FormData();
      formData.append('socialMedia', state.socialMedia!);
      formData.append('clientId', state.clientId!);
      formData.append('campaignDescription', state.campaignDescription);
      formData.append('imageDescription', state.imageDescription);
      formData.append('imageCount', String(state.imageCount));
      state.productImages.forEach((file) => {
        formData.append('productImages', file);
      });

      const res = await createCampaign.mutateAsync(formData);
      const newId = res._id;
      setCampaignId(newId);
      onCampaignCreated(newId);

      // Trigger generation
      setPhase('generating');
      await generateContent.mutateAsync(newId);

      setPhase('polling');
    } catch (err) {
      setPhase('error');
    }
  };

  const handleSelectImage = (index: number) => {
    if (campaignId) {
      selectImage.mutate({ id: campaignId, imageIndex: index });
    }
  };

  if (phase === 'idle') {
    return (
      <div className="text-center py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">{t('campaigns.step5Title')}</h2>
          <p className="text-sm text-slate-500 mt-2">{t('campaigns.step5Desc')}</p>
        </div>

        {/* Token cost breakdown */}
        {costData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-sm mx-auto mb-6"
          >
            <Card className="text-left">
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Coins className="h-4 w-4 text-brand-primary" />
                {t('tokens.costBreakdown')}
              </h4>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>{t('tokens.copyCaption')}</span>
                  <span className="font-medium">{costData.copyCaption} tokens</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{t('tokens.perImage')} ({state.imageCount})</span>
                  <span className="font-medium">{costData.images} tokens</span>
                </div>
                <div className="flex justify-between text-slate-900 font-semibold border-t border-slate-100 pt-1.5">
                  <span>{t('tokens.total')}</span>
                  <span>{costData.total} tokens</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="text-slate-500">{t('tokens.currentBalance')}:</span>
                <span className="font-bold gradient-brand-text">{balance.toLocaleString()}</span>
              </div>
              {hasEnoughTokens ? (
                <div className="mt-2 flex items-center gap-1.5 text-emerald-600 text-xs">
                  <CheckCircle className="h-3.5 w-3.5" />
                  {t('tokens.enoughTokens')}
                </div>
              ) : (
                <div className="mt-2">
                  <div className="flex items-center gap-1.5 text-red-500 text-xs">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {t('tokens.insufficientTokensHint', { count: totalCost - balance })}
                  </div>
                  <Link
                    to="/tokens"
                    className="text-xs font-medium text-brand-primary hover:underline mt-1 inline-block"
                  >
                    {t('tokens.buyTokens')} &rarr;
                  </Link>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex flex-col items-center"
        >
          <div className="p-6 rounded-3xl gradient-brand mb-6">
            <Sparkles className="h-12 w-12 text-white" />
          </div>
          <Button size="lg" onClick={startGeneration} disabled={!hasEnoughTokens}>
            <Sparkles className="h-4 w-4" />
            {t('campaigns.startGeneration')}
          </Button>
        </motion.div>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{t('common.error')}</p>
        <Button onClick={startGeneration}>{t('campaigns.startGeneration')}</Button>
      </div>
    );
  }

  if (phase === 'done' && campaign) {
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
          <h2 className="text-2xl font-bold text-slate-900">{t('campaigns.generationComplete')}</h2>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          {campaign.copy && (
            <Card>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">{t('campaigns.copy')}</h3>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{campaign.copy}</p>
            </Card>
          )}

          {campaign.caption && (
            <Card>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">{t('campaigns.caption')}</h3>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{campaign.caption}</p>
            </Card>
          )}

          {campaign.generatedImages.length > 0 && (
            <Card>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                {t('campaigns.selectImage')}
              </h3>
              <GeneratedImagesGrid
                images={campaign.generatedImages}
                selectedIndex={campaign.selectedImage}
                onSelect={handleSelectImage}
              />
            </Card>
          )}

          <div className="flex justify-end pt-4">
            <Button size="lg" onClick={onNext}>
              {t('common.next')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Generating state
  return (
    <div className="text-center py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">{t('campaigns.step5Title')}</h2>
        <p className="text-sm text-slate-500 mt-2">{t('campaigns.step5Desc')}</p>
      </div>

      <Spinner size="lg" className="mx-auto mb-8" />

      <div className="max-w-sm mx-auto space-y-3">
        {steps.map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i <= currentStep ? 1 : 0.3, x: 0 }}
            transition={{ delay: i * 0.5 }}
            className="flex items-center gap-3"
          >
            {i < currentStep ? (
              <div className="h-6 w-6 rounded-full gradient-brand flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
            ) : i === currentStep ? (
              <Loader2 className="h-6 w-6 text-brand-primary animate-spin" />
            ) : (
              <div className="h-6 w-6 rounded-full bg-slate-100" />
            )}
            <span
              className={`text-sm ${
                i <= currentStep ? 'text-slate-900 font-medium' : 'text-slate-400'
              }`}
            >
              {t(`campaigns.${step}`)}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
