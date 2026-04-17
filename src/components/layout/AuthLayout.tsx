import { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - gradient */}
      <div className="hidden lg:flex lg:w-1/2 gradient-brand relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Sparkles className="h-8 w-8" />
            </div>
            <span className="text-3xl font-bold">AI Ads Creator</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Create stunning ads
            <br />
            powered by AI
          </h2>
          <p className="text-lg text-white/80 max-w-md">
            Generate professional ad campaigns for Instagram, TikTok, Facebook, and
            WhatsApp in seconds.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute bottom-20 left-10 h-32 w-32 rounded-full bg-white/5" />
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
