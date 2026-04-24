import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useRegister } from '../../hooks/useAuth';

const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const { t, i18n } = useTranslation();
  const registerMutation = useRegister();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(
      { ...data, language: i18n.language },
      {
        onSuccess: () => {
          navigate('/login');
        },
      },
    );
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

      <h1 className="text-2xl font-bold text-slate-900 mb-2">{t('auth.registerTitle')}</h1>
      <p className="text-sm text-slate-500 mb-8">{t('auth.registerSubtitle')}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label={t('auth.firstName')}
            placeholder="John"
            icon={<User className="h-4 w-4" />}
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label={t('auth.lastName')}
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>
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

        <Button type="submit" loading={registerMutation.isPending} className="w-full" size="lg">
          {t('auth.register')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        {t('auth.hasAccount')}{' '}
        <Link
          to="/login"
          className="font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors"
        >
          {t('auth.login')}
        </Link>
      </p>
    </motion.div>
  );
}
