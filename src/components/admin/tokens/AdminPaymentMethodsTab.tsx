import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import Card from '../../ui/Card';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import FileUpload from '../../ui/FileUpload';
import Spinner from '../../ui/Spinner';
import {
  useAdminPaymentMethods,
  useUpdatePaymentMethod,
} from '../../../hooks/useTokens';
import type { PaymentMethodType } from '../../../types/tokens';

interface MethodFormState {
  isActive: boolean;
  config: Record<string, string>;
}

const defaultConfigs: Record<PaymentMethodType, Record<string, string>> = {
  binance: { email: '', qrCode: '' },
  zelle: { email: '' },
  pago_movil: { phone: '', cedula: '', bank: '', bcvRate: '', qrCode: '' },
};

export default function AdminPaymentMethodsTab() {
  const { t } = useTranslation();
  const { data: methods, isLoading } = useAdminPaymentMethods();
  const update = useUpdatePaymentMethod();

  const [forms, setForms] = useState<Record<PaymentMethodType, MethodFormState>>({
    binance: { isActive: false, config: { ...defaultConfigs.binance } },
    zelle: { isActive: false, config: { ...defaultConfigs.zelle } },
    pago_movil: { isActive: false, config: { ...defaultConfigs.pago_movil } },
  });

  useEffect(() => {
    if (methods) {
      const newForms = { ...forms };
      methods.forEach((m) => {
        newForms[m.type] = {
          isActive: m.isActive,
          config: { ...defaultConfigs[m.type], ...m.config },
        };
      });
      setForms(newForms);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methods]);

  const handleToggle = (type: PaymentMethodType) => {
    setForms((prev) => ({
      ...prev,
      [type]: { ...prev[type], isActive: !prev[type].isActive },
    }));
  };

  const handleConfigChange = (
    type: PaymentMethodType,
    key: string,
    value: string,
  ) => {
    setForms((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        config: { ...prev[type].config, [key]: value },
      },
    }));
  };

  const handleSave = (type: PaymentMethodType) => {
    update.mutate({
      type,
      isActive: forms[type].isActive,
      config: forms[type].config,
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Binance */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-brand-primary" />
            {t('tokens.binance')}
          </h3>
          <button onClick={() => handleToggle('binance')}>
            {forms.binance.isActive ? (
              <ToggleRight className="h-6 w-6 text-brand-primary" />
            ) : (
              <ToggleLeft className="h-6 w-6 text-slate-300" />
            )}
          </button>
        </div>
        <div className="space-y-3">
          <Input
            label={t('common.email')}
            value={forms.binance.config.email}
            onChange={(e) =>
              handleConfigChange('binance', 'email', e.target.value)
            }
            placeholder="email@example.com"
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              QR Code
            </label>
            <FileUpload
              onFileSelect={(file) => {
                // In a real implementation, you'd upload and get the URL
                const reader = new FileReader();
                reader.onload = () =>
                  handleConfigChange(
                    'binance',
                    'qrCode',
                    reader.result as string,
                  );
                reader.readAsDataURL(file);
              }}
              preview={forms.binance.config.qrCode || null}
              className="min-h-[100px]"
            />
          </div>
          <Button
            size="sm"
            className="w-full"
            onClick={() => handleSave('binance')}
            loading={update.isPending}
          >
            <Save className="h-3.5 w-3.5" />
            {t('common.save')}
          </Button>
        </div>
      </Card>

      {/* Zelle */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-brand-primary" />
            {t('tokens.zelle')}
          </h3>
          <button onClick={() => handleToggle('zelle')}>
            {forms.zelle.isActive ? (
              <ToggleRight className="h-6 w-6 text-brand-primary" />
            ) : (
              <ToggleLeft className="h-6 w-6 text-slate-300" />
            )}
          </button>
        </div>
        <div className="space-y-3">
          <Input
            label={t('common.email')}
            value={forms.zelle.config.email}
            onChange={(e) =>
              handleConfigChange('zelle', 'email', e.target.value)
            }
            placeholder="email@example.com"
          />
          <Button
            size="sm"
            className="w-full"
            onClick={() => handleSave('zelle')}
            loading={update.isPending}
          >
            <Save className="h-3.5 w-3.5" />
            {t('common.save')}
          </Button>
        </div>
      </Card>

      {/* Pago Movil */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-brand-primary" />
            {t('tokens.pagoMovil')}
          </h3>
          <button onClick={() => handleToggle('pago_movil')}>
            {forms.pago_movil.isActive ? (
              <ToggleRight className="h-6 w-6 text-brand-primary" />
            ) : (
              <ToggleLeft className="h-6 w-6 text-slate-300" />
            )}
          </button>
        </div>
        <div className="space-y-3">
          <Input
            label="Tel"
            value={forms.pago_movil.config.phone}
            onChange={(e) =>
              handleConfigChange('pago_movil', 'phone', e.target.value)
            }
            placeholder="04XX-XXXXXXX"
          />
          <Input
            label="Cedula"
            value={forms.pago_movil.config.cedula}
            onChange={(e) =>
              handleConfigChange('pago_movil', 'cedula', e.target.value)
            }
            placeholder="V-XXXXXXXX"
          />
          <Input
            label="Banco"
            value={forms.pago_movil.config.bank}
            onChange={(e) =>
              handleConfigChange('pago_movil', 'bank', e.target.value)
            }
            placeholder="0102"
          />
          <Input
            label={t('tokens.bcvRate')}
            type="number"
            value={forms.pago_movil.config.bcvRate}
            onChange={(e) =>
              handleConfigChange('pago_movil', 'bcvRate', e.target.value)
            }
            placeholder="36.50"
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              QR Code
            </label>
            <FileUpload
              onFileSelect={(file) => {
                const reader = new FileReader();
                reader.onload = () =>
                  handleConfigChange(
                    'pago_movil',
                    'qrCode',
                    reader.result as string,
                  );
                reader.readAsDataURL(file);
              }}
              preview={forms.pago_movil.config.qrCode || null}
              className="min-h-[100px]"
            />
          </div>
          <Button
            size="sm"
            className="w-full"
            onClick={() => handleSave('pago_movil')}
            loading={update.isPending}
          >
            <Save className="h-3.5 w-3.5" />
            {t('common.save')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
