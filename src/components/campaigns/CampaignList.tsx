import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Megaphone, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import CampaignCard from './CampaignCard';
import EmptyState from '../ui/EmptyState';
import Spinner from '../ui/Spinner';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useCampaigns } from '../../hooks/useCampaigns';

export default function CampaignList() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [socialMedia, setSocialMedia] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useCampaigns({
    page,
    limit: 9,
    status: status || undefined,
    socialMedia: socialMedia || undefined,
    search: search || undefined,
  });

  const statusOptions = [
    { value: '', label: t('common.all') },
    { value: 'draft', label: 'Draft' },
    { value: 'generating', label: 'Generating' },
    { value: 'ready', label: 'Ready' },
    { value: 'published', label: 'Published' },
    { value: 'failed', label: 'Failed' },
  ];

  const socialOptions = [
    { value: '', label: t('common.all') },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'whatsapp', label: 'WhatsApp' },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          placeholder={t('common.search')}
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
        />
        <Select
          options={statusOptions}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="max-w-[160px]"
        />
        <Select
          options={socialOptions}
          value={socialMedia}
          onChange={(e) => {
            setSocialMedia(e.target.value);
            setPage(1);
          }}
          className="max-w-[160px]"
        />
      </div>

      {!data?.data || data.data.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="h-8 w-8" />}
          title={t('campaigns.noResults')}
          description={t('campaigns.noResults')}
        />
      ) : (
        <>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {data.data.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </motion.div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                {t('common.previous')}
              </Button>
              <span className="text-sm text-slate-500">
                {t('common.page')} {data.page} {t('common.of')} {data.totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                {t('common.next')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
