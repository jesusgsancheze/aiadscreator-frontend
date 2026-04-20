import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Gift } from 'lucide-react';
import Card from '../../ui/Card';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { useAdminGrantTokens } from '../../../hooks/useTokens';
import { useAdminUsers } from '../../../hooks/useAdmin';

export default function AdminGrantTab() {
  const { t } = useTranslation();
  const [userId, setUserId] = useState('');
  const [tokens, setTokens] = useState('');
  const [note, setNote] = useState('');
  const grant = useAdminGrantTokens();
  const { data: users = [] } = useAdminUsers();

  const handleGrant = () => {
    if (!userId || !tokens) return;
    grant.mutate(
      { userId, tokens: parseInt(tokens), adminNote: note || undefined },
      {
        onSuccess: () => {
          setUserId('');
          setTokens('');
          setNote('');
        },
      },
    );
  };

  return (
    <Card className="max-w-lg">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Gift className="h-5 w-5 text-brand-primary" />
        {t('tokens.grantTokens')}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {t('tokens.selectUser')}
          </label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all duration-200"
          >
            <option value="">{t('tokens.selectUser')}</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.firstName} {u.lastName} ({u.email})
              </option>
            ))}
          </select>
        </div>

        <Input
          label={t('tokens.tokenAmount')}
          type="number"
          min="1"
          value={tokens}
          onChange={(e) => setTokens(e.target.value)}
          placeholder="e.g. 1000"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {t('tokens.adminNote')}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all duration-200 resize-none"
            placeholder={t('tokens.adminNote')}
          />
        </div>

        <Button
          onClick={handleGrant}
          loading={grant.isPending}
          disabled={!userId || !tokens}
          className="w-full"
        >
          <Gift className="h-4 w-4" />
          {t('tokens.grantTokens')}
        </Button>
      </div>
    </Card>
  );
}
