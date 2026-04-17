import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Camera, Music, Share, MessageCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { SocialMedia } from '../../../types/campaign';

const platforms: { id: SocialMedia; icon: React.ElementType; color: string; bg: string }[] = [
  { id: 'instagram', icon: Camera, color: 'text-pink-500', bg: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  { id: 'tiktok', icon: Music, color: 'text-slate-900', bg: 'bg-slate-900' },
  { id: 'facebook', icon: Share, color: 'text-blue-600', bg: 'bg-blue-600' },
  { id: 'whatsapp', icon: MessageCircle, color: 'text-green-500', bg: 'bg-green-500' },
];

interface Step1Props {
  selected: SocialMedia | null;
  onSelect: (sm: SocialMedia) => void;
}

export default function Step1SocialMedia({ selected, onSelect }: Step1Props) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">{t('campaigns.step1Title')}</h2>
        <p className="text-sm text-slate-500 mt-2">{t('campaigns.step1Desc')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const isSelected = selected === platform.id;

          return (
            <motion.button
              key={platform.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(platform.id)}
              className={cn(
                'flex flex-col items-center gap-4 p-8 rounded-2xl border-2 transition-all duration-200 cursor-pointer',
                isSelected
                  ? 'border-brand-primary bg-brand-primary/5 shadow-lg shadow-brand-primary/10'
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md',
              )}
            >
              <div className={cn('p-4 rounded-2xl text-white', platform.bg)}>
                <Icon className="h-8 w-8" />
              </div>
              <span className="text-sm font-semibold text-slate-900 capitalize">
                {platform.id === 'tiktok' ? 'TikTok' : platform.id.charAt(0).toUpperCase() + platform.id.slice(1)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
