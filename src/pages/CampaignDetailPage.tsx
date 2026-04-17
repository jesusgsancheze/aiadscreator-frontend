import { useParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import CampaignDetail from '../components/campaigns/CampaignDetail';
import Spinner from '../components/ui/Spinner';
import { useCampaign } from '../hooks/useCampaigns';

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: campaign, isLoading } = useCampaign(id || '');

  return (
    <AppLayout>
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : campaign ? (
        <CampaignDetail campaign={campaign} />
      ) : (
        <div className="text-center py-20 text-slate-400">Campaign not found</div>
      )}
    </AppLayout>
  );
}
