import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  Upload,
  Sparkles,
  Loader2,
  ImageIcon,
  ChevronDown,
  ChevronUp,
  Download,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { cn, getImageUrl } from '../../lib/utils';
import {
  useSelectImage,
  useDeleteCampaignImage,
  useUploadCampaignImage,
  useGenerateMoreImages,
} from '../../hooks/useCampaigns';
import { useTokenBalance } from '../../hooks/useTokens';
import type { ImageAgent } from '../../types/campaign';

const imageAgents: { id: ImageAgent; label: string }[] = [
  { id: 'gemini', label: 'Gemini' },
  { id: 'flux', label: 'Flux' },
  { id: 'gpt_image', label: 'GPT-5' },
];

const MAX_IMAGES = 10;
const COST_PER_IMAGE = 40;

interface CampaignImagesManagerProps {
  campaignId: string;
  images: string[];
  selectedIndex: number | null;
}

export default function CampaignImagesManager({
  campaignId,
  images,
  selectedIndex,
}: CampaignImagesManagerProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [generateCount, setGenerateCount] = useState(1);
  const [generateInstructions, setGenerateInstructions] = useState('');
  const [selectedImageAgent, setSelectedImageAgent] = useState<ImageAgent>('gemini');

  const selectImage = useSelectImage();
  const deleteImage = useDeleteCampaignImage();
  const uploadImage = useUploadCampaignImage();
  const generateImages = useGenerateMoreImages();
  const { data: balanceData } = useTokenBalance();

  const balance = balanceData?.balance ?? 0;
  const remainingSlots = MAX_IMAGES - images.length;
  const generateCost = generateCount * COST_PER_IMAGE;
  const hasEnoughTokens = balance >= generateCost;
  const isAtMax = images.length >= MAX_IMAGES;

  const handleSelect = (index: number) => {
    selectImage.mutate({ id: campaignId, imageIndex: index });
  };

  const handleDelete = (index: number) => {
    if (window.confirm(t('campaigns.deleteImageConfirm'))) {
      deleteImage.mutate({ id: campaignId, imageIndex: index });
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadImage.mutate({ id: campaignId, file });
    e.target.value = '';
  };

  const handleGenerate = () => {
    generateImages.mutate(
      {
        id: campaignId,
        count: generateCount,
        instructions: generateInstructions.trim() || undefined,
        imageAgent: selectedImageAgent,
      },
      {
        onSuccess: () => {
          setShowGenerateForm(false);
          setGenerateCount(1);
          setGenerateInstructions('');
        },
      },
    );
  };

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-brand-primary" />
          <h3 className="text-base font-semibold text-slate-900">
            {t('campaigns.imagesCount', { current: images.length, max: MAX_IMAGES })}
          </h3>
        </div>
      </div>

      {/* Image grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'group relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200',
                selectedIndex === index
                  ? 'border-brand-primary shadow-lg shadow-brand-primary/20'
                  : 'border-transparent hover:border-brand-primary/30',
              )}
            >
              <div onClick={() => handleSelect(index)}>
                <img
                  src={getImageUrl(image)}
                  alt={`Generated ${index + 1}`}
                  className="w-full aspect-square object-cover"
                />
              </div>

              {/* Selected checkmark */}
              {selectedIndex === index && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-3 right-3 h-8 w-8 gradient-brand rounded-full flex items-center justify-center shadow-lg"
                >
                  <Check className="h-4 w-4 text-white" />
                </motion.div>
              )}

              {/* Action buttons on hover */}
              <div className="absolute top-2 left-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(index);
                  }}
                  className="h-7 w-7 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 shadow-md"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <a
                  href={getImageUrl(image)}
                  download={`campaign-image-${index + 1}.png`}
                  onClick={(e) => e.stopPropagation()}
                  className="h-7 w-7 rounded-full bg-slate-800/80 text-white flex items-center justify-center hover:bg-slate-900 shadow-md"
                >
                  <Download className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 mb-4 rounded-xl bg-slate-50">
          <ImageIcon className="h-10 w-10 text-slate-300 mb-2" />
          <p className="text-sm text-slate-400">{t('campaigns.noImages')}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <Button
          variant="secondary"
          size="sm"
          onClick={handleUpload}
          disabled={isAtMax || uploadImage.isPending}
          loading={uploadImage.isPending}
        >
          <Upload className="h-3.5 w-3.5" />
          {uploadImage.isPending ? t('campaigns.uploadingImage') : t('campaigns.uploadImage')}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowGenerateForm(!showGenerateForm)}
          disabled={isAtMax || generateImages.isPending}
        >
          {showGenerateForm ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {t('campaigns.generateMoreImages')}
        </Button>

        {isAtMax && (
          <span className="text-xs text-slate-400 ml-1">
            {t('campaigns.maxImagesReached')}
          </span>
        )}
      </div>

      {/* Generate with AI inline form */}
      <AnimatePresence>
        {showGenerateForm && !isAtMax && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              {generateImages.isPending ? (
                <div className="flex items-center justify-center gap-3 py-6">
                  <Spinner size="sm" />
                  <span className="text-sm font-medium text-slate-600">
                    {t('campaigns.generatingImages', { count: generateCount })}
                  </span>
                </div>
              ) : (
                <>
                  {/* Count input */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      {t('campaigns.imageCount')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={remainingSlots}
                      value={generateCount}
                      onChange={(e) => {
                        const val = Math.min(Math.max(1, Number(e.target.value)), remainingSlots);
                        setGenerateCount(val);
                      }}
                      className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                    />
                  </div>

                  {/* Image Agent Selector */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">
                      {t('campaigns.imageGenAgent')}
                    </label>
                    <div className="flex gap-2">
                      {imageAgents.map((agent) => (
                        <button
                          key={agent.id}
                          type="button"
                          onClick={() => setSelectedImageAgent(agent.id)}
                          className={cn(
                            'flex-1 px-3 py-2 rounded-lg border text-xs font-semibold transition-all',
                            selectedImageAgent === agent.id
                              ? 'border-purple-500 bg-purple-50 text-purple-600'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                          )}
                        >
                          {agent.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional style override */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">
                      {t('campaigns.generateImagesInstructions')}
                      <span className="text-slate-400 font-normal ml-1">({t('common.optional') || 'optional'})</span>
                    </label>
                    <textarea
                      value={generateInstructions}
                      onChange={(e) => setGenerateInstructions(e.target.value)}
                      rows={2}
                      placeholder={t('campaigns.generateImagesPlaceholder')}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary transition-all duration-200 resize-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      {t('campaigns.generateImagesHint')}
                    </p>
                  </div>

                  {/* Cost display */}
                  <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 border border-slate-100">
                    <span className="text-xs text-slate-500">
                      {t('campaigns.imageGenerationCost', {
                        count: generateCount,
                        total: generateCost,
                      })}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        hasEnoughTokens ? 'text-brand-primary' : 'text-red-500'
                      }`}
                    >
                      {t('tokens.balance')}: {balance}
                    </span>
                  </div>

                  {!hasEnoughTokens && (
                    <div className="rounded-lg bg-red-50 px-3 py-2">
                      <p className="text-xs text-red-600">
                        {t('tokens.insufficientTokens')}.{' '}
                        <Link
                          to="/tokens"
                          className="font-semibold underline hover:text-red-700"
                        >
                          {t('tokens.buyTokens')}
                        </Link>
                      </p>
                    </div>
                  )}

                  {/* Generate button */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={handleGenerate}
                      disabled={!hasEnoughTokens || generateCount < 1}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {t('campaigns.generateMoreImages')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowGenerateForm(false)}
                    >
                      {t('common.cancel')}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
