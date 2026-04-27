import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useUpdateLanguage } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/auth.store';
import { useUIStore } from '../../store/ui.store';

const languages = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'es', label: 'Espanol', flag: 'ES' },
  { code: 'fr', label: 'Francais', flag: 'FR' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const updateLanguage = useUpdateLanguage();
  const { token } = useAuthStore();
  const { setLanguage } = useUIStore();

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    setLanguage(code as 'en' | 'es' | 'fr', { explicit: !token });
    if (token) {
      updateLanguage.mutate(code);
    }
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span className="font-medium">{currentLang.flag}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1 overflow-hidden"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                  lang.code === i18n.language
                    ? 'bg-brand-primary/5 text-brand-primary font-medium'
                    : 'text-slate-600 hover:bg-slate-50',
                )}
              >
                <span className="font-semibold text-xs">{lang.flag}</span>
                {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
