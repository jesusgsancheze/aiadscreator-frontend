import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  Upload,
  Sparkles,
  ImageIcon,
  ChevronUp,
  Download,
  Video as VideoIcon,
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
  useSelectVerticalImage,
  useDeleteVerticalImage,
  useUploadVerticalImage,
  useGenerateMoreVerticalImages,
  useSelectVideo,
  useDeleteVideo,
  useUploadVideo,
  useSelectLandscapeImage,
  useDeleteLandscapeImage,
  useUploadLandscapeImage,
  useGenerateMoreLandscapeImages,
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
  verticalImages?: string[];
  selectedVerticalIndex?: number | null;
  videos?: string[];
  selectedVideoIndex?: number | null;
  videoPrompt?: string | null;
  showVideoSection?: boolean;
  landscapeImages?: string[];
  selectedLandscapeIndex?: number | null;
  showLandscapeSection?: boolean;
}

export default function CampaignImagesManager({
  campaignId,
  images,
  selectedIndex,
  verticalImages = [],
  selectedVerticalIndex = null,
  videos = [],
  selectedVideoIndex = null,
  videoPrompt = null,
  showVideoSection = false,
  landscapeImages = [],
  selectedLandscapeIndex = null,
  showLandscapeSection = false,
}: CampaignImagesManagerProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const verticalFileInputRef = useRef<HTMLInputElement>(null);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [generateCount, setGenerateCount] = useState(1);
  const [generateInstructions, setGenerateInstructions] = useState('');
  const [selectedImageAgent, setSelectedImageAgent] = useState<ImageAgent>('gemini');
  const [showVerticalGenerateForm, setShowVerticalGenerateForm] = useState(false);
  const [verticalGenerateCount, setVerticalGenerateCount] = useState(1);
  const [verticalGenerateInstructions, setVerticalGenerateInstructions] = useState('');
  const [selectedVerticalImageAgent, setSelectedVerticalImageAgent] = useState<ImageAgent>('gemini');

  const selectImage = useSelectImage();
  const deleteImage = useDeleteCampaignImage();
  const uploadImage = useUploadCampaignImage();
  const generateImages = useGenerateMoreImages();
  const selectVerticalImage = useSelectVerticalImage();
  const deleteVerticalImage = useDeleteVerticalImage();
  const uploadVerticalImage = useUploadVerticalImage();
  const generateVerticalImages = useGenerateMoreVerticalImages();
  const selectVideo = useSelectVideo();
  const deleteVideo = useDeleteVideo();
  const uploadVideo = useUploadVideo();
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const MAX_VIDEOS = 5;

  const selectLandscapeImage = useSelectLandscapeImage();
  const deleteLandscapeImage = useDeleteLandscapeImage();
  const uploadLandscapeImage = useUploadLandscapeImage();
  const generateLandscapeImages = useGenerateMoreLandscapeImages();
  const landscapeFileInputRef = useRef<HTMLInputElement>(null);
  const [showLandscapeGenerateForm, setShowLandscapeGenerateForm] = useState(false);
  const [landscapeGenerateCount, setLandscapeGenerateCount] = useState(1);
  const [landscapeGenerateInstructions, setLandscapeGenerateInstructions] = useState('');
  const [selectedLandscapeImageAgent, setSelectedLandscapeImageAgent] = useState<ImageAgent>('gemini');

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

  // --- Vertical image handlers ---
  const verticalRemainingSlots = MAX_IMAGES - verticalImages.length;
  const verticalIsAtMax = verticalImages.length >= MAX_IMAGES;
  const verticalGenerateCost = verticalGenerateCount * COST_PER_IMAGE;
  const verticalHasEnoughTokens = balance >= verticalGenerateCost;

  const handleSelectVertical = (index: number) => {
    selectVerticalImage.mutate({ id: campaignId, imageIndex: index });
  };

  const handleDeleteVertical = (index: number) => {
    if (window.confirm(t('campaigns.deleteImageConfirm'))) {
      deleteVerticalImage.mutate({ id: campaignId, imageIndex: index });
    }
  };

  const handleUploadVertical = () => {
    verticalFileInputRef.current?.click();
  };

  const handleVerticalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadVerticalImage.mutate({ id: campaignId, file });
    e.target.value = '';
  };

  const handleGenerateVertical = () => {
    generateVerticalImages.mutate(
      {
        id: campaignId,
        count: verticalGenerateCount,
        instructions: verticalGenerateInstructions.trim() || undefined,
        imageAgent: selectedVerticalImageAgent,
      },
      {
        onSuccess: () => {
          setShowVerticalGenerateForm(false);
          setVerticalGenerateCount(1);
          setVerticalGenerateInstructions('');
        },
      },
    );
  };

  // --- Video handlers ---
  const videoIsAtMax = videos.length >= MAX_VIDEOS;

  const handleSelectVideo = (index: number) => {
    selectVideo.mutate({ id: campaignId, videoIndex: index });
  };

  const handleDeleteVideo = (index: number) => {
    if (window.confirm(t('campaigns.deleteImageConfirm'))) {
      deleteVideo.mutate({ id: campaignId, videoIndex: index });
    }
  };

  const handleUploadVideoClick = () => {
    videoFileInputRef.current?.click();
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadVideo.mutate({ id: campaignId, file });
    e.target.value = '';
  };

  // --- Landscape (1.91:1) image handlers ---
  const landscapeRemainingSlots = MAX_IMAGES - landscapeImages.length;
  const landscapeIsAtMax = landscapeImages.length >= MAX_IMAGES;
  const landscapeGenerateCost = landscapeGenerateCount * COST_PER_IMAGE;
  const landscapeHasEnoughTokens = balance >= landscapeGenerateCost;

  const handleSelectLandscape = (index: number) => {
    selectLandscapeImage.mutate({ id: campaignId, imageIndex: index });
  };

  const handleDeleteLandscape = (index: number) => {
    if (window.confirm(t('campaigns.deleteImageConfirm'))) {
      deleteLandscapeImage.mutate({ id: campaignId, imageIndex: index });
    }
  };

  const handleUploadLandscape = () => {
    landscapeFileInputRef.current?.click();
  };

  const handleLandscapeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadLandscapeImage.mutate({ id: campaignId, file });
    e.target.value = '';
  };

  const handleGenerateLandscape = () => {
    generateLandscapeImages.mutate(
      {
        id: campaignId,
        count: landscapeGenerateCount,
        instructions: landscapeGenerateInstructions.trim() || undefined,
        imageAgent: selectedLandscapeImageAgent,
      },
      {
        onSuccess: () => {
          setShowLandscapeGenerateForm(false);
          setLandscapeGenerateCount(1);
          setLandscapeGenerateInstructions('');
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
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      const res = await fetch(getImageUrl(image));
                      const blob = await res.blob();
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `campaign-image-${index + 1}.png`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    } catch { /* ignore */ }
                  }}
                  className="h-7 w-7 rounded-full bg-slate-800/80 text-white flex items-center justify-center hover:bg-slate-900 shadow-md"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
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

      {/* Vertical variants (meta_full): selectable + editable */}
      {verticalImages.length > 0 && (
        <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold text-slate-800">
              {t('campaigns.verticalImagesTitle', { count: verticalImages.length })}
            </h4>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            {t('campaigns.verticalImagesHint')}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {verticalImages.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'group relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all',
                  selectedVerticalIndex === index
                    ? 'border-brand-primary shadow-md shadow-brand-primary/20'
                    : 'border-transparent hover:border-brand-primary/30',
                )}
              >
                <div onClick={() => handleSelectVertical(index)}>
                  <img
                    src={getImageUrl(image)}
                    alt={`Vertical ${index + 1}`}
                    className="w-full aspect-[9/16] object-cover"
                  />
                </div>
                {selectedVerticalIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-2 right-2 h-6 w-6 gradient-brand rounded-full flex items-center justify-center shadow"
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                )}
                <div className="absolute top-2 left-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteVertical(index);
                    }}
                    className="h-6 w-6 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 shadow"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        const res = await fetch(getImageUrl(image));
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `campaign-vertical-${index + 1}.png`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      } catch { /* ignore */ }
                    }}
                    className="h-6 w-6 rounded-full bg-slate-800/80 text-white flex items-center justify-center hover:bg-slate-900 shadow"
                  >
                    <Download className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Vertical toolbar */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <input
              ref={verticalFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleVerticalFileChange}
              className="hidden"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleUploadVertical}
              disabled={verticalIsAtMax || uploadVerticalImage.isPending}
              loading={uploadVerticalImage.isPending}
            >
              <Upload className="h-3.5 w-3.5" />
              {t('campaigns.uploadImage')}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowVerticalGenerateForm(!showVerticalGenerateForm)}
              disabled={verticalIsAtMax || generateVerticalImages.isPending}
            >
              {showVerticalGenerateForm ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {t('campaigns.generateMoreImages')}
            </Button>
            {verticalIsAtMax && (
              <span className="text-xs text-slate-400 ml-1">
                {t('campaigns.maxImagesReached')}
              </span>
            )}
          </div>

          {/* Vertical generate-more inline form */}
          <AnimatePresence>
            {showVerticalGenerateForm && !verticalIsAtMax && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                  {generateVerticalImages.isPending ? (
                    <div className="flex items-center justify-center gap-3 py-6">
                      <Spinner size="sm" />
                      <span className="text-sm font-medium text-slate-600">
                        {t('campaigns.generatingImages', { count: verticalGenerateCount })}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          {t('campaigns.imageCount')}
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={verticalRemainingSlots}
                          value={verticalGenerateCount}
                          onChange={(e) => {
                            const val = Math.min(
                              Math.max(1, Number(e.target.value)),
                              verticalRemainingSlots,
                            );
                            setVerticalGenerateCount(val);
                          }}
                          className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                          {t('campaigns.imageGenAgent')}
                        </label>
                        <div className="flex gap-2">
                          {imageAgents.map((agent) => (
                            <button
                              key={agent.id}
                              type="button"
                              onClick={() => setSelectedVerticalImageAgent(agent.id)}
                              className={cn(
                                'flex-1 px-3 py-2 rounded-lg border text-xs font-semibold transition-all',
                                selectedVerticalImageAgent === agent.id
                                  ? 'border-purple-500 bg-purple-50 text-purple-600'
                                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                              )}
                            >
                              {agent.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                          {t('campaigns.generateImagesInstructions')}
                          <span className="text-slate-400 font-normal ml-1">
                            ({t('common.optional') || 'optional'})
                          </span>
                        </label>
                        <textarea
                          value={verticalGenerateInstructions}
                          onChange={(e) => setVerticalGenerateInstructions(e.target.value)}
                          rows={2}
                          placeholder={t('campaigns.generateImagesPlaceholder')}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary transition-all duration-200 resize-none"
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 border border-slate-100">
                        <span className="text-xs text-slate-500">
                          {t('campaigns.imageGenerationCost', {
                            count: verticalGenerateCount,
                            total: verticalGenerateCost,
                          })}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            verticalHasEnoughTokens ? 'text-brand-primary' : 'text-red-500'
                          }`}
                        >
                          {t('tokens.balance')}: {balance}
                        </span>
                      </div>
                      {!verticalHasEnoughTokens && (
                        <div className="rounded-lg bg-red-50 px-3 py-2">
                          <p className="text-xs text-red-600">
                            {t('tokens.insufficientTokens')}.{' '}
                            <Link to="/tokens" className="font-semibold underline hover:text-red-700">
                              {t('tokens.buyTokens')}
                            </Link>
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={handleGenerateVertical}
                          disabled={!verticalHasEnoughTokens || verticalGenerateCount < 1}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          {t('campaigns.generateMoreImages')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowVerticalGenerateForm(false)}
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
        </div>
      )}

      {/* Videos (meta_full Tier 3) */}
      {showVideoSection && (
        <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <VideoIcon className="h-4 w-4 text-brand-primary" />
            <h4 className="text-sm font-semibold text-slate-800">
              {t('campaigns.videosTitle', { count: videos.length })}
            </h4>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            {t('campaigns.videosHint')}
          </p>

          {videoPrompt && (
            <div className="mb-3 rounded-xl bg-white border border-slate-200 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
                {t('campaigns.videoConceptTitle')}
              </p>
              <p className="text-xs text-slate-700 italic">"{videoPrompt}"</p>
            </div>
          )}

          {videos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {videos.map((video, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'group relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all bg-slate-900',
                    selectedVideoIndex === index
                      ? 'border-brand-primary shadow-md shadow-brand-primary/20'
                      : 'border-transparent hover:border-brand-primary/30',
                  )}
                >
                  <div onClick={() => handleSelectVideo(index)}>
                    <video
                      src={getImageUrl(video)}
                      className="w-full aspect-[9/16] object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  </div>
                  {selectedVideoIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-2 right-2 h-6 w-6 gradient-brand rounded-full flex items-center justify-center shadow"
                    >
                      <Check className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVideo(index);
                      }}
                      className="h-6 w-6 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 shadow"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 rounded-xl bg-white border border-dashed border-slate-200">
              <VideoIcon className="h-8 w-8 text-slate-300 mb-2" />
              <p className="text-xs text-slate-400 text-center px-4">
                {t('campaigns.noVideos')}
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <input
              ref={videoFileInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoFileChange}
              className="hidden"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleUploadVideoClick}
              disabled={videoIsAtMax || uploadVideo.isPending}
              loading={uploadVideo.isPending}
            >
              <Upload className="h-3.5 w-3.5" />
              {t('campaigns.uploadVideo')}
            </Button>
            {videoIsAtMax && (
              <span className="text-xs text-slate-400 ml-1">
                {t('campaigns.maxImagesReached')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Landscape variants (google_pmax Phase 3): selectable + editable */}
      {showLandscapeSection && (
        <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="h-4 w-4 text-amber-500" />
            <h4 className="text-sm font-semibold text-slate-800">
              {t('campaigns.landscapeImagesTitle', { count: landscapeImages.length })}
            </h4>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            {t('campaigns.landscapeImagesHint')}
          </p>

          {landscapeImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {landscapeImages.map((image, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={cn(
                    'group relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all',
                    selectedLandscapeIndex === index
                      ? 'border-brand-primary shadow-md shadow-brand-primary/20'
                      : 'border-transparent hover:border-brand-primary/30',
                  )}
                >
                  <div onClick={() => handleSelectLandscape(index)}>
                    <img
                      src={getImageUrl(image)}
                      alt={`Landscape ${index + 1}`}
                      className="w-full aspect-[191/100] object-cover"
                    />
                  </div>
                  {selectedLandscapeIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-2 right-2 h-6 w-6 gradient-brand rounded-full flex items-center justify-center shadow"
                    >
                      <Check className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLandscape(index);
                      }}
                      className="h-6 w-6 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 shadow"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const res = await fetch(getImageUrl(image));
                          const blob = await res.blob();
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `campaign-landscape-${index + 1}.png`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        } catch { /* ignore */ }
                      }}
                      className="h-6 w-6 rounded-full bg-slate-800/80 text-white flex items-center justify-center hover:bg-slate-900 shadow"
                    >
                      <Download className="h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 rounded-xl bg-white border border-dashed border-slate-200">
              <ImageIcon className="h-8 w-8 text-slate-300 mb-2" />
              <p className="text-xs text-slate-400 text-center px-4">
                {t('campaigns.noLandscapeImages')}
              </p>
            </div>
          )}

          {/* Landscape toolbar */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <input
              ref={landscapeFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLandscapeFileChange}
              className="hidden"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleUploadLandscape}
              disabled={landscapeIsAtMax || uploadLandscapeImage.isPending}
              loading={uploadLandscapeImage.isPending}
            >
              <Upload className="h-3.5 w-3.5" />
              {t('campaigns.uploadImage')}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowLandscapeGenerateForm(!showLandscapeGenerateForm)}
              disabled={landscapeIsAtMax || generateLandscapeImages.isPending}
            >
              {showLandscapeGenerateForm ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {t('campaigns.generateMoreImages')}
            </Button>
            {landscapeIsAtMax && (
              <span className="text-xs text-slate-400 ml-1">
                {t('campaigns.maxImagesReached')}
              </span>
            )}
          </div>

          {/* Landscape generate-more inline form */}
          <AnimatePresence>
            {showLandscapeGenerateForm && !landscapeIsAtMax && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                  {generateLandscapeImages.isPending ? (
                    <div className="flex items-center justify-center gap-3 py-6">
                      <Spinner size="sm" />
                      <span className="text-sm font-medium text-slate-600">
                        {t('campaigns.generatingImages', { count: landscapeGenerateCount })}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          {t('campaigns.imageCount')}
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={landscapeRemainingSlots}
                          value={landscapeGenerateCount}
                          onChange={(e) => {
                            const val = Math.min(
                              Math.max(1, Number(e.target.value)),
                              landscapeRemainingSlots,
                            );
                            setLandscapeGenerateCount(val);
                          }}
                          className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                          {t('campaigns.imageGenAgent')}
                        </label>
                        <div className="flex gap-2">
                          {imageAgents.map((agent) => (
                            <button
                              key={agent.id}
                              type="button"
                              onClick={() => setSelectedLandscapeImageAgent(agent.id)}
                              className={cn(
                                'flex-1 px-3 py-2 rounded-lg border text-xs font-semibold transition-all',
                                selectedLandscapeImageAgent === agent.id
                                  ? 'border-purple-500 bg-purple-50 text-purple-600'
                                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                              )}
                            >
                              {agent.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                          {t('campaigns.generateImagesInstructions')}
                          <span className="text-slate-400 font-normal ml-1">
                            ({t('common.optional') || 'optional'})
                          </span>
                        </label>
                        <textarea
                          value={landscapeGenerateInstructions}
                          onChange={(e) => setLandscapeGenerateInstructions(e.target.value)}
                          rows={2}
                          placeholder={t('campaigns.generateImagesPlaceholder')}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary transition-all duration-200 resize-none"
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 border border-slate-100">
                        <span className="text-xs text-slate-500">
                          {t('campaigns.imageGenerationCost', {
                            count: landscapeGenerateCount,
                            total: landscapeGenerateCost,
                          })}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            landscapeHasEnoughTokens ? 'text-brand-primary' : 'text-red-500'
                          }`}
                        >
                          {t('tokens.balance')}: {balance}
                        </span>
                      </div>
                      {!landscapeHasEnoughTokens && (
                        <div className="rounded-lg bg-red-50 px-3 py-2">
                          <p className="text-xs text-red-600">
                            {t('tokens.insufficientTokens')}.{' '}
                            <Link to="/tokens" className="font-semibold underline hover:text-red-700">
                              {t('tokens.buyTokens')}
                            </Link>
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={handleGenerateLandscape}
                          disabled={!landscapeHasEnoughTokens || landscapeGenerateCount < 1}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          {t('campaigns.generateMoreImages')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowLandscapeGenerateForm(false)}
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
