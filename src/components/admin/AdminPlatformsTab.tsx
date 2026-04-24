import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Eye, EyeOff, Ban } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { cn } from '../../lib/utils';
import { SOCIAL_MEDIA_PLATFORMS } from '../../constants/socialMedia';
import {
  useAdminSettings,
  useUpdateAdminSettings,
} from '../../hooks/useTokens';
import type { SocialMedia } from '../../types/campaign';
import type {
  PlatformAvailabilityMap,
  PlatformAvailabilityState,
} from '../../api/campaigns.api';

const STATES: { key: PlatformAvailabilityState; icon: React.ElementType }[] = [
  { key: 'enabled', icon: Eye },
  { key: 'disabled', icon: Ban },
  { key: 'hidden', icon: EyeOff },
];

function buildDefaults(): PlatformAvailabilityMap {
  return SOCIAL_MEDIA_PLATFORMS.reduce((acc, p) => {
    acc[p.id] = 'enabled';
    return acc;
  }, {} as PlatformAvailabilityMap);
}

export default function AdminPlatformsTab() {
  const { t } = useTranslation();
  const { data: settingsData, isLoading } =
    useAdminSettings<PlatformAvailabilityMap>('platformAvailability');
  const updateSettings = useUpdateAdminSettings<PlatformAvailabilityMap>();

  const defaults = useMemo(buildDefaults, []);
  const [availability, setAvailability] =
    useState<PlatformAvailabilityMap>(defaults);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    if (isLoading) return;
    const saved = settingsData?.value;
    const merged: PlatformAvailabilityMap = { ...defaults };
    if (saved && typeof saved === 'object') {
      for (const p of SOCIAL_MEDIA_PLATFORMS) {
        const v = (saved as Record<string, unknown>)[p.id];
        if (v === 'enabled' || v === 'disabled' || v === 'hidden') {
          merged[p.id] = v;
        }
      }
    }
    setAvailability(merged);
    setInitialized(true);
  }, [settingsData, isLoading, initialized, defaults]);

  const setState = (id: SocialMedia, state: PlatformAvailabilityState) => {
    setAvailability((prev) => ({ ...prev, [id]: state }));
  };

  const handleSave = () => {
    updateSettings.mutate({
      key: 'platformAvailability',
      value: availability,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Card className="max-w-3xl">
      <h3 className="text-lg font-bold text-slate-900 mb-1">
        {t('adminPlatforms.title')}
      </h3>
      <p className="text-sm text-slate-500 mb-6">
        {t('adminPlatforms.description')}
      </p>

      <div className="space-y-3">
        {SOCIAL_MEDIA_PLATFORMS.map((platform) => {
          const Icon = platform.icon;
          const current = availability[platform.id] ?? 'enabled';
          return (
            <div
              key={platform.id}
              className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-100"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn('p-2 rounded-lg text-white shrink-0', platform.bg)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {platform.label}
                  </div>
                  {platform.hint && (
                    <div className="text-xs text-slate-500 truncate">
                      {platform.hint}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-1 bg-slate-50 rounded-lg p-1 shrink-0">
                {STATES.map(({ key, icon: StateIcon }) => {
                  const isActive = current === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setState(platform.id, key)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                        isActive
                          ? 'gradient-brand text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-white',
                      )}
                    >
                      <StateIcon className="h-3.5 w-3.5" />
                      {t(`adminPlatforms.state.${key}`)}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <Button
          onClick={handleSave}
          loading={updateSettings.isPending}
          className="w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {t('common.save')}
        </Button>
      </div>
    </Card>
  );
}
