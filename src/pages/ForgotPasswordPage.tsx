import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useForgotPassword } from '../hooks/useAuth';

const schema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const forgot = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    forgot.mutate(data.email);
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-2.5 mb-8 lg:hidden">
          <div className="gradient-brand p-2 rounded-xl">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold gradient-brand-text">ContenidIA</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {t('auth.forgotPasswordTitle')}
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          {t('auth.forgotPasswordSubtitle')}
        </p>

        {forgot.isSuccess ? (
          <div className="flex flex-col items-center gap-4 text-center py-4">
            <CheckCircle2 className="h-12 w-12 text-brand-primary" />
            <p className="text-sm text-slate-600">{t('auth.forgotPasswordSent')}</p>
            <Link
              to="/login"
              className="font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors text-sm"
            >
              {t('auth.backToLogin')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('auth.email')}
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Button
              type="submit"
              loading={forgot.isPending}
              className="w-full"
              size="lg"
            >
              {t('auth.sendResetLink')}
            </Button>

            <p className="mt-6 text-center text-sm text-slate-500">
              <Link
                to="/login"
                className="font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors"
              >
                {t('auth.backToLogin')}
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </AuthLayout>
  );
}
