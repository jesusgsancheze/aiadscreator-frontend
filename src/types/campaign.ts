import type { Client } from './client';

export type SocialMedia =
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'whatsapp'
  | 'google_ads'
  | 'meta_full'
  | 'google_pmax';
export type TextAgent = 'claude' | 'grok';
export type ImageAgent = 'gemini' | 'flux' | 'gpt_image';
export type CampaignStatus = 'draft' | 'generating' | 'ready' | 'published' | 'failed';

export interface CampaignAnalytics {
  impressions?: number;
  clicks?: number;
  conversions?: number;
  engagement?: number;
  reach?: number;
  ctr?: number;
  spent?: number;
}

export interface CampaignSuggestion {
  objective: string;
  dailyBudget: number;
  optimizationGoal: string;
  billingEvent: string;
  targeting: {
    countries: string[];
    ageMin: number;
    ageMax: number;
    genders: number[];
    advantageAudience: boolean;
    interests: string[];
  };
  placements?: {
    publisherPlatforms: string[];
    facebookPositions: string[];
    instagramPositions: string[];
    messengerPositions: string[];
    audienceNetworkPositions: string[];
    useAdvantagePlacements: boolean;
  };
  rationale: string;
}

export interface GoogleAdsCampaignSuggestion {
  dailyBudget: number;
  biddingStrategy: string;
  targetCpa: number | null;
  targetRoas: number | null;
  audienceSignals: {
    demographics: {
      ageRanges: string[];
      genders: string[];
    };
    interests: string[];
    customSegmentHints: string[];
  };
  geo: {
    countries: string[];
    regions: string[];
  };
  languages: string[];
  finalUrls: string[];
  callToAction: string | null;
  rationale: string;
}

export interface Campaign {
  _id: string;
  title: string;
  socialMedia: SocialMedia;
  productImages: string[];
  campaignDescription: string;
  imageDescription: string;
  imageCount: number;
  textAgent: TextAgent;
  imagePromptAgent: TextAgent;
  imageAgent: ImageAgent;
  preserveProduct: boolean;
  clientId: string | Client;
  userId: string;
  copy: string | null;
  caption: string | null;
  imagePrompt: string | null;
  verticalImagePrompt: string | null;
  videoPrompt: string | null;
  generatedImages: string[];
  verticalImages: string[];
  videos: string[];
  status: CampaignStatus;
  socialMediaLink: string | null;
  analytics: CampaignAnalytics;
  performanceScore: number | null;
  selectedImage: number | null;
  selectedVerticalImage: number | null;
  selectedVideo: number | null;
  metaCampaignId: string | null;
  metaAdSetId: string | null;
  metaAdId: string | null;
  metaStatus: string | null;
  // Google Ads (Performance Max) — all null/empty unless socialMedia === 'google_pmax'
  headlines: string[];
  longHeadlines: string[];
  descriptions: string[];
  landscapeImages: string[];
  selectedLandscapeImage: number | null;
  landscapeImagePrompt: string | null;
  businessName: string | null;
  googleAdsSuggestion: GoogleAdsCampaignSuggestion | null;
  googleCustomerId: string | null;
  googleAdsCampaignId: string | null;
  googleAssetGroupId: string | null;
  googleAdsStatus: string | null;
  suggestion: CampaignSuggestion | null;
  createdAt: string;
  updatedAt: string;
}
