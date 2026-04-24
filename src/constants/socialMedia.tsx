import type { SocialMedia } from '../types/campaign';
import {
  InstagramIcon,
  TikTokIcon,
  FacebookIcon,
  WhatsAppIcon,
  GoogleAdsIcon,
  MetaIcon,
} from '../components/icons/SocialIcons';

export interface SocialMediaMeta {
  id: SocialMedia;
  icon: React.ElementType;
  bg: string;
  label: string;
  hint?: string;
}

export const SOCIAL_MEDIA_PLATFORMS: SocialMediaMeta[] = [
  { id: 'meta_full', icon: MetaIcon, bg: 'bg-gradient-to-br from-blue-600 via-pink-500 to-orange-400', label: 'Full Meta', hint: 'Facebook + Instagram + more' },
  { id: 'google_pmax', icon: GoogleAdsIcon, bg: 'bg-gradient-to-br from-blue-500 via-red-500 to-yellow-400', label: 'Google PMax', hint: 'Search + YouTube + Gmail + Discover' },
  { id: 'instagram', icon: InstagramIcon, bg: 'bg-gradient-to-br from-purple-500 to-pink-500', label: 'Instagram' },
  { id: 'tiktok', icon: TikTokIcon, bg: 'bg-slate-900', label: 'TikTok' },
  { id: 'facebook', icon: FacebookIcon, bg: 'bg-blue-600', label: 'Facebook' },
  { id: 'whatsapp', icon: WhatsAppIcon, bg: 'bg-green-500', label: 'WhatsApp' },
  { id: 'google_ads', icon: GoogleAdsIcon, bg: 'bg-white border border-slate-200', label: 'Google Ads' },
];
