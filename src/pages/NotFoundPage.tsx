import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-8xl font-bold gradient-brand-text mb-4">404</h1>
        <p className="text-xl text-slate-600 mb-2">Page not found</p>
        <p className="text-sm text-slate-400 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/dashboard">
          <Button size="lg">
            <Home className="h-4 w-4" />
            {t('nav.dashboard')}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
