import type { Client } from './client';

export type SocialMedia = 'instagram' | 'tiktok' | 'facebook' | 'whatsapp' | 'google_ads';
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
  generatedImages: string[];
  status: CampaignStatus;
  socialMediaLink: string | null;
  analytics: CampaignAnalytics;
  performanceScore: number | null;
  selectedImage: number | null;
  metaCampaignId: string | null;
  metaAdSetId: string | null;
  metaAdId: string | null;
  metaStatus: string | null;
  createdAt: string;
  updatedAt: string;
}
