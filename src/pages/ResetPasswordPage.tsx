import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Sparkles, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useResetPassword } from '../hooks/useAuth';

const schema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const reset = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    if (!token) return;
    reset.mutate({ token, password: data.password });
  };

  if (!token) {
    return (
      <AuthLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <XCircle className="h-16 w-16 text-red-500" />
          <h2 className="text-xl font-bold text-slate-900">
            {t('auth.resetPasswordTitle')}
          </h2>
          <p className="text-sm text-red-500">{t('auth.resetPasswordInvalid')}</p>
          <Link to="/forgot-password">
            <Button variant="secondary">{t('auth.forgotPassword')}</Button>
          </Link>
        </motion.div>
      </AuthLayout>
    );
  }

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
          {t('auth.resetPasswordTitle')}
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          {t('auth.resetPasswordSubtitle')}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label={t('auth.newPassword')}
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label={t('auth.confirmPassword')}
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            loading={reset.isPending}
            className="w-full"
            size="lg"
          >
            {t('auth.resetPassword')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link
            to="/login"
            className="font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors"
          >
            {t('auth.backToLogin')}
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
