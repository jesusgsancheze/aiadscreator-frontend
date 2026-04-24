export interface GoogleAdsConnection {
  _id: string;
  userId: string;
  clientId: string;
  scopes: string[];
  customerId: string | null;
  loginCustomerId: string | null;
  accessibleCustomers: string[];
  isActive: boolean;
  lastVerified: string | null;
  conversionTrackingReady: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OAuthStartResponse {
  authUrl: string;
}

export interface SelectCustomerPayload {
  customerId: string;
  loginCustomerId?: string;
}

export interface VerifyConnectionResponse {
  valid: boolean;
  descriptiveName: string;
  currencyCode: string;
  conversionTrackingReady: boolean;
}

// Shape of the postMessage the popup sends back to the opener window.
export interface GoogleAdsPopupMessage {
  type: 'google-ads-connection';
  status: 'picker' | 'done' | 'error';
  connectionId?: string;
  message?: string;
}

export interface PublishPmaxPayload {
  campaignId: string;
  name?: string;
  dailyBudget?: number;
  biddingStrategy?: string;
  targetCpa?: number;
  targetRoas?: number;
  countries?: string[];
  languages?: string[];
  finalUrls?: string[];
  callToAction?: string;
  startDate?: string;
  endDate?: string;
}

export interface PublishPmaxResponse {
  googleCustomerId: string;
  googleAdsCampaignId: string;
  googleAssetGroupId: string;
  googleAdsStatus: string;
}
