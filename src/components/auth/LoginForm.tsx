import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useLogin, useResendVerification } from '../../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { t } = useTranslation();
  const login = useLogin();
  const resend = useResendVerification();
  const [showResend, setShowResend] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data, {
      onError: (err: any) => {
        if (err.response?.status === 403) {
          setShowResend(true);
        }
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Mobile logo */}
      <div className="flex items-center gap-2.5 mb-8 lg:hidden">
        <div className="gradient-brand p-2 rounded-xl">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold gradient-brand-text">ContenidIA</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-2">{t('auth.loginTitle')}</h1>
      <p className="text-sm text-slate-500 mb-8">{t('auth.loginSubtitle')}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label={t('auth.email')}
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label={t('auth.password')}
          type="password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex justify-end -mt-1">
          <Link
            to="/forgot-password"
            className="text-sm text-brand-primary hover:text-brand-primary-dark transition-colors"
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>

        <Button type="submit" loading={login.isPending} className="w-full" size="lg">
          {t('auth.login')}
        </Button>
      </form>

      {showResend && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4"
        >
          <button
            onClick={() => resend.mutate(getValues('email'))}
            disabled={resend.isPending}
            className="text-sm text-brand-primary hover:text-brand-primary-dark transition-colors"
          >
            {t('auth.resendVerification')}
          </button>
        </motion.div>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        {t('auth.noAccount')}{' '}
        <Link
          to="/register"
          className="font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors"
        >
          {t('auth.register')}
        </Link>
      </p>
    </motion.div>
  );
}
