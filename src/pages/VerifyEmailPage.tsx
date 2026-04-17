import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/ui/Button';
import { useVerifyEmail } from '../hooks/useAuth';

export default function VerifyEmailPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const verify = useVerifyEmail();

  useEffect(() => {
    if (token && !verify.isSuccess && !verify.isError) {
      verify.mutate(token);
    }
  }, [token]);

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {verify.isPending && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-16 w-16 text-brand-primary animate-spin" />
            <h2 className="text-xl font-bold text-slate-900">{t('auth.verifying')}</h2>
          </div>
        )}

        {verify.isSuccess && (
          <div className="flex flex-col items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              <CheckCircle2 className="h-16 w-16 text-brand-primary" />
            </motion.div>
            <h2 className="text-xl font-bold text-slate-900">{t('auth.verifyEmailTitle')}</h2>
            <p className="text-sm text-slate-500">{t('auth.verified')}</p>
            <Link to="/login">
              <Button>{t('auth.login')}</Button>
            </Link>
          </div>
        )}

        {verify.isError && (
          <div className="flex flex-col items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              <XCircle className="h-16 w-16 text-red-500" />
            </motion.div>
            <h2 className="text-xl font-bold text-slate-900">{t('auth.verifyEmailTitle')}</h2>
            <p className="text-sm text-red-500">{t('auth.verifyFailed')}</p>
            <Link to="/login">
              <Button variant="secondary">{t('auth.login')}</Button>
            </Link>
          </div>
        )}

        {!token && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="h-16 w-16 text-slate-300" />
            <h2 className="text-xl font-bold text-slate-900">{t('auth.verifyEmailTitle')}</h2>
            <p className="text-sm text-slate-500">{t('auth.verifyEmailSubtitle')}</p>
          </div>
        )}
      </motion.div>
    </AuthLayout>
  );
}
