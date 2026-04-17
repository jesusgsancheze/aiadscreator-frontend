import { useTranslation } from 'react-i18next';
import AppLayout from '../components/layout/AppLayout';
import CampaignStepper from '../components/campaigns/CampaignStepper';

export default function CreateCampaignPage() {
  const { t } = useTranslation();

  return (
    <AppLayout title={t('campaigns.newCampaign')}>
      <CampaignStepper />
    </AppLayout>
  );
}
