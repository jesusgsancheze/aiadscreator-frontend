export interface MetaConnection {
  _id: string;
  userId: string;
  clientId: string;
  accessToken: string;
  adAccountId: string;
  pageId: string;
  instagramAccountId?: string;
  isActive: boolean;
  lastVerified: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMetaConnectionPayload {
  clientId: string;
  accessToken: string;
  adAccountId: string;
  pageId: string;
  instagramAccountId?: string;
}

export interface UpdateMetaConnectionPayload {
  accessToken?: string;
  adAccountId?: string;
  pageId?: string;
  instagramAccountId?: string;
}

export interface PublishCampaignPayload {
  campaignId: string;
  name: string;
  objective?: string;
  dailyBudget?: number;
  targetCountries?: string[];
  startDate?: string;
  endDate?: string;
}

export interface PublishCampaignResponse {
  metaCampaignId: string;
  metaAdSetId: string;
  metaAdId: string;
  status: string;
}

export interface MetaInsights {
  impressions: number;
  clicks: number;
  spend: string;
  reach: number;
  ctr: string;
  actions?: Array<{ action_type: string; value: string }>;
}
