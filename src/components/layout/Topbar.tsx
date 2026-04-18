import { Link } from 'react-router-dom';
import { Menu, Coins } from 'lucide-react';
import { useUIStore } from '../../store/ui.store';
import { useTokenBalance } from '../../hooks/useTokens';
import LanguageSwitcher from './LanguageSwitcher';

interface TopbarProps {
  title?: string;
}

export default function Topbar({ title }: TopbarProps) {
  const { toggleSidebar } = useUIStore();
  const { data: balanceData, isLoading } = useTokenBalance();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="flex items-center justify-between px-4 lg:px-8 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-slate-600" />
          </button>
          {title && (
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/tokens"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
          >
            <div className="p-1 rounded-lg gradient-brand">
              <Coins className="h-4 w-4 text-white" />
            </div>
            {isLoading ? (
              <div className="h-5 w-12 bg-slate-200 rounded animate-pulse" />
            ) : (
              <span className="text-sm font-bold gradient-brand-text">
                {balanceData?.balance?.toLocaleString() ?? 0}
              </span>
            )}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
