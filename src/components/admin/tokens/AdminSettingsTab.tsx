import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, X, Plus, Save } from 'lucide-react';
import Card from '../../ui/Card';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import Spinner from '../../ui/Spinner';
import {
  useAdminSettings,
  useUpdateAdminSettings,
} from '../../../hooks/useTokens';

export default function AdminSettingsTab() {
  const { t } = useTranslation();
  const { data: settingsData, isLoading } = useAdminSettings('notificationEmails');
  const updateSettings = useUpdateAdminSettings();

  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && settingsData) {
      const saved = Array.isArray(settingsData?.value) ? settingsData.value : [];
      setEmails(saved);
      setInitialized(true);
    }
  }, [settingsData, initialized]);

  const addEmail = () => {
    const email = newEmail.trim();
    if (email && !emails.includes(email)) {
      const updated = [...emails, email];
      setEmails(updated);
      setNewEmail('');
    }
  };

  const removeEmail = (email: string) => {
    const updated = emails.filter((e) => e !== email);
    setEmails(updated);
  };

  const handleSave = useCallback(() => {
    console.log('Saving notification emails:', emails);
    updateSettings.mutate({ key: 'notificationEmails', value: emails });
  }, [emails, updateSettings]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Card className="max-w-lg">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Mail className="h-5 w-5 text-brand-primary" />
        {t('tokens.notificationEmails')}
      </h3>

      <div className="space-y-4">
        {/* Email tags */}
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {emails.length === 0 && (
            <p className="text-sm text-slate-400">{t('tokens.noEmails') || 'No notification emails configured'}</p>
          )}
          {emails.map((email) => (
            <span
              key={email}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium"
            >
              {email}
              <button
                onClick={() => removeEmail(email)}
                className="p-0.5 rounded-full hover:bg-brand-primary/20 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Add email input */}
        <div className="flex gap-2">
          <Input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="email@example.com"
            type="email"
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={addEmail}
            disabled={!newEmail.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={handleSave}
          loading={updateSettings.isPending}
          className="w-full"
        >
          <Save className="h-4 w-4" />
          {t('common.save')} ({emails.length} {emails.length === 1 ? 'email' : 'emails'})
        </Button>
      </div>
    </Card>
  );
}
