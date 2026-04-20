import { useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';
import Step1SocialMedia from './steps/Step1SocialMedia';
import Step2SelectClient from './steps/Step2SelectClient';
import Step3UploadImage from './steps/Step3UploadImage';
import Step4Descriptions from './steps/Step4Descriptions';
import Step5AIGeneration from './steps/Step5AIGeneration';
import Step6Review from './steps/Step6Review';
import type { SocialMedia, TextAgent, ImageAgent } from '../../types/campaign';
import { cn } from '../../lib/utils';

interface CampaignState {
  step: number;
  socialMedia: SocialMedia | null;
  clientId: string | null;
  clientName: string;
  productImages: File[];
  productImagePreviews: string[];
  title: string;
  campaignDescription: string;
  imageDescription: string;
  imageCount: number;
  textAgent: TextAgent;
  imagePromptAgent: TextAgent;
  imageAgent: ImageAgent;
  preserveProduct: boolean;
  campaignId: string | null;
}

type CampaignAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_SOCIAL_MEDIA'; socialMedia: SocialMedia }
  | { type: 'SET_CLIENT'; clientId: string; clientName: string }
  | { type: 'SET_IMAGES'; files: File[]; previews: string[] }
  | { type: 'ADD_IMAGES'; files: File[]; previews: string[] }
  | { type: 'REMOVE_IMAGE'; index: number }
  | { type: 'SET_DESCRIPTIONS'; title: string; campaignDescription: string; imageDescription: string; imageCount: number; textAgent: TextAgent; imagePromptAgent: TextAgent; imageAgent: ImageAgent; preserveProduct: boolean }
  | { type: 'SET_CAMPAIGN_ID'; campaignId: string };

function reducer(state: CampaignState, action: CampaignAction): CampaignState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'SET_SOCIAL_MEDIA':
      return { ...state, socialMedia: action.socialMedia };
    case 'SET_CLIENT':
      return { ...state, clientId: action.clientId, clientName: action.clientName };
    case 'SET_IMAGES':
      return { ...state, productImages: action.files, productImagePreviews: action.previews };
    case 'ADD_IMAGES': {
      const newImages = [...state.productImages, ...action.files].slice(0, 10);
      const newPreviews = [...state.productImagePreviews, ...action.previews].slice(0, 10);
      return { ...state, productImages: newImages, productImagePreviews: newPreviews };
    }
    case 'REMOVE_IMAGE': {
      const filteredImages = state.productImages.filter((_, i) => i !== action.index);
      const filteredPreviews = state.productImagePreviews.filter((_, i) => i !== action.index);
      return { ...state, productImages: filteredImages, productImagePreviews: filteredPreviews };
    }
    case 'SET_DESCRIPTIONS':
      return {
        ...state,
        title: action.title,
        campaignDescription: action.campaignDescription,
        imageDescription: action.imageDescription,
        imageCount: action.imageCount,
        textAgent: action.textAgent,
        imagePromptAgent: action.imagePromptAgent,
        imageAgent: action.imageAgent,
        preserveProduct: action.preserveProduct,
      };
    case 'SET_CAMPAIGN_ID':
      return { ...state, campaignId: action.campaignId };
    default:
      return state;
  }
}

const initialState: CampaignState = {
  step: 1,
  socialMedia: null,
  clientId: null,
  clientName: '',
  productImages: [],
  productImagePreviews: [],
  title: '',
  campaignDescription: '',
  imageDescription: '',
  imageCount: 3,
  textAgent: 'claude',
  imagePromptAgent: 'claude',
  imageAgent: 'gemini',
  preserveProduct: false,
  campaignId: null,
};

const stepKeys = [
  'step1Title',
  'step2Title',
  'step3Title',
  'step4Title',
  'step5Title',
  'step6Title',
];

export default function CampaignStepper() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  const canNext = () => {
    switch (state.step) {
      case 1: return !!state.socialMedia;
      case 2: return !!state.clientId;
      case 3: return state.productImages.length > 0;
      case 4: return !!state.title && !!state.campaignDescription && !!state.imageDescription;
      default: return true;
    }
  };

  const goNext = () => {
    if (state.step < 6 && canNext()) {
      dispatch({ type: 'SET_STEP', step: state.step + 1 });
    }
  };

  const goBack = () => {
    if (state.step > 1) {
      dispatch({ type: 'SET_STEP', step: state.step - 1 });
    } else {
      navigate('/campaigns');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {stepKeys.map((key, i) => (
            <div key={key} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                    i + 1 < state.step
                      ? 'gradient-brand text-white'
                      : i + 1 === state.step
                      ? 'gradient-brand text-white shadow-lg shadow-brand-primary/30'
                      : 'bg-slate-100 text-slate-400',
                  )}
                >
                  {i + 1}
                </div>
                <span
                  className={cn(
                    'text-xs mt-2 hidden sm:block',
                    i + 1 <= state.step ? 'text-slate-900 font-medium' : 'text-slate-400',
                  )}
                >
                  {t(`campaigns.${key}`)}
                </span>
              </div>
              {i < 5 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2',
                    i + 1 < state.step ? 'gradient-brand' : 'bg-slate-100',
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {state.step === 1 && (
            <Step1SocialMedia
              selected={state.socialMedia}
              onSelect={(sm) => {
                dispatch({ type: 'SET_SOCIAL_MEDIA', socialMedia: sm });
              }}
            />
          )}
          {state.step === 2 && (
            <Step2SelectClient
              selected={state.clientId}
              onSelect={(id, name) => {
                dispatch({ type: 'SET_CLIENT', clientId: id, clientName: name });
              }}
            />
          )}
          {state.step === 3 && (
            <Step3UploadImage
              previews={state.productImagePreviews}
              onAddFiles={(files, previews) => {
                dispatch({ type: 'ADD_IMAGES', files, previews });
              }}
              onRemove={(index) => {
                dispatch({ type: 'REMOVE_IMAGE', index });
              }}
            />
          )}
          {state.step === 4 && (
            <Step4Descriptions
              title={state.title}
              campaignDescription={state.campaignDescription}
              imageDescription={state.imageDescription}
              imageCount={state.imageCount}
              textAgent={state.textAgent}
              imagePromptAgent={state.imagePromptAgent}
              imageAgent={state.imageAgent}
              preserveProduct={state.preserveProduct}
              onChange={(ti, cd, id, ic, ta, ipa, ia, pp) => {
                dispatch({
                  type: 'SET_DESCRIPTIONS',
                  title: ti,
                  campaignDescription: cd,
                  imageDescription: id,
                  imageCount: ic,
                  textAgent: ta,
                  imagePromptAgent: ipa,
                  imageAgent: ia,
                  preserveProduct: pp,
                });
              }}
            />
          )}
          {state.step === 5 && (
            <Step5AIGeneration
              state={state}
              onCampaignCreated={(id) => {
                dispatch({ type: 'SET_CAMPAIGN_ID', campaignId: id });
              }}
              onNext={() => dispatch({ type: 'SET_STEP', step: 6 })}
            />
          )}
          {state.step === 6 && (
            <Step6Review state={state} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {state.step < 5 && (
        <div className="flex justify-between mt-8">
          <Button variant="ghost" onClick={goBack}>
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Button>
          <Button onClick={goNext} disabled={!canNext()}>
            {t('common.next')}
          </Button>
        </div>
      )}
    </div>
  );
}
