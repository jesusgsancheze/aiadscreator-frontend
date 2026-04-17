import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import CampaignList from '../components/campaigns/CampaignList';
import Button from '../components/ui/Button';

export default function CampaignsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <AppLayout title={t('campaigns.title')}>
      <div className="flex justify-end mb-6">
        <Button onClick={() => navigate('/campaigns/new')}>
          <Plus className="h-4 w-4" />
          {t('campaigns.create')}
        </Button>
      </div>

      <CampaignList />
    </AppLayout>
  );
}
