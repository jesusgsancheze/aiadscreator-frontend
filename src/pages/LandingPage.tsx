import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  ImagePlus,
  Video,
  Target,
  Send,
  RefreshCw,
  Check,
  ArrowRight,
  Heart,
  MessageCircle,
  Bookmark,
} from 'lucide-react';
import Button from '../components/ui/Button';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';
import {
  InstagramIcon,
  TikTokIcon,
  GoogleAdsIcon,
} from '../components/icons/SocialIcons';
import { SOCIAL_MEDIA_PLATFORMS } from '../constants/socialMedia';
import { cn } from '../lib/utils';

// Stock photo from Unsplash CDN (free for commercial use, no attribution required).
// Swap for your own hosted asset anytime — just change this URL.
const CONTENT_CREATOR_PHOTO =
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1600&auto=format&fit=crop&q=80';

interface MockAdProps {
  platform: 'instagram' | 'tiktok' | 'google';
  gradient: string;
  headline: string;
  copy: string;
  tone: 'light' | 'dark';
}

function MockAdCard({ platform, gradient, headline, copy, tone }: MockAdProps) {
  const PlatformIcon =
    platform === 'instagram'
      ? InstagramIcon
      : platform === 'tiktok'
      ? TikTokIcon
      : GoogleAdsIcon;
  const platformBg =
    platform === 'instagram'
      ? 'bg-gradient-to-br from-purple-500 to-pink-500'
      : platform === 'tiktok'
      ? 'bg-slate-900'
      : 'bg-white border border-slate-200';

  return (
    <div className="relative w-full rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-300/40 overflow-hidden">
      {/* Platform header strip */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className={cn('p-1.5 rounded-lg text-white', platformBg)}>
            <PlatformIcon className="h-3.5 w-3.5" />
          </div>
          <div className="text-[11px] font-semibold text-slate-700">@yourbrand</div>
        </div>
        <div className="flex gap-1">
          <div className="h-1 w-1 rounded-full bg-slate-300" />
          <div className="h-1 w-1 rounded-full bg-slate-300" />
          <div className="h-1 w-1 rounded-full bg-slate-300" />
        </div>
      </div>
      {/* Image area */}
      <div className={cn('aspect-square relative overflow-hidden', gradient)}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <div
          className={cn(
            'absolute bottom-4 left-4 right-4 font-bold text-2xl leading-tight drop-shadow-md',
            tone === 'dark' ? 'text-slate-900' : 'text-white',
          )}
        >
          {headline}
        </div>
        {/* Decorative shapes */}
        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/20 blur-xl" />
        <div className="absolute top-10 left-6 h-16 w-16 rounded-full bg-white/10" />
      </div>
      {/* Action row */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4 text-slate-500">
          <Heart className="h-5 w-5" />
          <MessageCircle className="h-5 w-5" />
          <Send className="h-5 w-5" />
        </div>
        <Bookmark className="h-5 w-5 text-slate-500" />
      </div>
      {/* Copy */}
      <div className="px-4 pb-4">
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
          <span className="font-semibold text-slate-900">@yourbrand</span> {copy}
        </p>
      </div>
    </div>
  );
}

interface Plan {
  id: string;
  tokens: number;
  price: number;
  bonus: string;
  featured?: boolean;
}

const PLANS: Plan[] = [
  { id: 'pkg_50', tokens: 5500, price: 50, bonus: '10%' },
  { id: 'pkg_100', tokens: 11000, price: 100, bonus: '10%', featured: true },
  { id: 'pkg_200', tokens: 22500, price: 200, bonus: '12.5%' },
];

const FEATURE_ICONS = [Wand2, ImagePlus, Video, Target, Send, RefreshCw];

export default function LandingPage() {
  const { t } = useTranslation();

  const howItWorks = t('landing.how.steps', { returnObjects: true }) as {
    title: string;
    desc: string;
  }[];
  const features = t('landing.features.items', { returnObjects: true }) as {
    title: string;
    desc: string;
  }[];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="gradient-brand p-2 rounded-xl">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-brand-text">ContenidIA</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-500">
            <a href="#how" className="hover:text-slate-900 transition-colors">
              {t('landing.nav.how')}
            </a>
            <a href="#features" className="hover:text-slate-900 transition-colors">
              {t('landing.nav.features')}
            </a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">
              {t('landing.nav.pricing')}
            </a>
          </nav>
          <div className="flex items-center gap-1 sm:gap-3">
            <LanguageSwitcher />
            <Link to="/login">
              <Button variant="ghost" size="sm">
                {t('landing.nav.login')}
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">{t('landing.nav.register')}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-secondary-light">
        {/* Base warm tint */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(226,181,216,0.55) 0%, rgba(226,181,216,0) 60%), radial-gradient(ellipse 70% 80% at 80% 70%, rgba(124,24,93,0.18) 0%, rgba(124,24,93,0) 65%), linear-gradient(180deg, #fff5fb 0%, #fce8f2 100%)',
          }}
        />

        {/* Colored blobs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute -top-24 -right-24 h-[30rem] w-[30rem] rounded-full bg-brand-primary/40 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
          className="absolute top-1/3 -left-32 h-[26rem] w-[26rem] rounded-full bg-brand-secondary blur-3xl opacity-60"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
          className="absolute -bottom-32 right-1/4 h-[22rem] w-[22rem] rounded-full bg-brand-primary-light/40 blur-3xl"
        />

        {/* Subtle dot-grid overlay for texture */}
        <div
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(124,24,93,0.4) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        {/* Bottom fade into the next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Copy side */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 mb-6"
              >
                <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
                {t('landing.hero.badge')}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6"
              >
                {t('landing.hero.title1')}
                <br />
                <span className="gradient-brand-text">{t('landing.hero.title2')}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 mb-10"
              >
                {t('landing.hero.subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3"
              >
                <Link to="/register">
                  <Button size="lg">
                    {t('landing.hero.ctaPrimary')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="#how">
                  <Button variant="ghost" size="lg">
                    {t('landing.hero.ctaSecondary')}
                  </Button>
                </a>
              </motion.div>
            </div>

            {/* Mock ad side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative max-w-sm mx-auto w-full"
            >
              {/* Decorative background cards (layered) */}
              <div className="absolute -top-6 -left-6 right-6 bottom-6 rounded-3xl gradient-brand opacity-20 blur-xl" />
              <div className="absolute top-6 left-6 -right-6 -bottom-6 rounded-3xl bg-brand-secondary/40 blur-lg" />
              <div className="relative rotate-1 hover:rotate-0 transition-transform duration-500">
                <MockAdCard
                  platform="instagram"
                  gradient="bg-gradient-to-br from-brand-primary via-brand-primary-light to-brand-secondary"
                  headline={t('landing.hero.mockHeadline')}
                  copy={t('landing.hero.mockCopy')}
                  tone="light"
                />
              </div>
              {/* Floating "generated in X seconds" pill */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="absolute -bottom-4 -right-3 rotate-3 px-3 py-1.5 rounded-full bg-white shadow-lg border border-slate-100 text-xs font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="h-3 w-3 text-brand-primary" />
                {t('landing.hero.mockBadge')}
              </motion.div>
            </motion.div>
          </div>

          {/* Supported platforms strip */}
          <div className="mt-20 text-center">
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-4">
              {t('landing.hero.platformsLabel')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {SOCIAL_MEDIA_PLATFORMS.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600"
                  >
                    <div className={cn('p-1 rounded-md text-white', p.bg)}>
                      <Icon className="h-3 w-3" />
                    </div>
                    {p.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('landing.how.title')}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              {t('landing.how.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="relative p-6 rounded-2xl border border-slate-100 bg-slate-50"
              >
                <div className="absolute -top-4 left-6 h-8 w-8 rounded-xl gradient-brand flex items-center justify-center text-white text-sm font-bold shadow-md shadow-brand-primary/20">
                  {idx + 1}
                </div>
                <h3 className="text-base font-semibold mt-3 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase gallery — 3 mock creatives */}
      <section className="py-24 relative overflow-hidden bg-brand-secondary-light">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 85% 10%, rgba(124,24,93,0.28) 0%, rgba(124,24,93,0) 60%), radial-gradient(ellipse 60% 70% at 15% 90%, rgba(226,181,216,0.8) 0%, rgba(226,181,216,0) 60%)',
          }}
        />
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(124,24,93,0.5) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('landing.showcase.title')}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              {t('landing.showcase.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:translate-y-8"
            >
              <MockAdCard
                platform="instagram"
                gradient="bg-gradient-to-br from-brand-primary to-brand-secondary-dark"
                headline={t('landing.showcase.ads.0.headline')}
                copy={t('landing.showcase.ads.0.copy')}
                tone="light"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <MockAdCard
                platform="tiktok"
                gradient="bg-gradient-to-br from-slate-900 via-slate-800 to-brand-primary"
                headline={t('landing.showcase.ads.1.headline')}
                copy={t('landing.showcase.ads.1.copy')}
                tone="light"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:translate-y-8"
            >
              <MockAdCard
                platform="google"
                gradient="bg-gradient-to-br from-brand-secondary via-white to-brand-secondary-light"
                headline={t('landing.showcase.ads.2.headline')}
                copy={t('landing.showcase.ads.2.copy')}
                tone="dark"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Human-texture photo strip */}
      <section className="relative h-80 md:h-96 overflow-hidden">
        <img
          src={CONTENT_CREATOR_PHOTO}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/80 via-brand-primary/50 to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
          <div className="max-w-xl text-white">
            <h3 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
              {t('landing.photo.title')}
            </h3>
            <p className="text-white/90 text-sm md:text-base">
              {t('landing.photo.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, idx) => {
              const Icon = FEATURE_ICONS[idx % FEATURE_ICONS.length];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5 transition-all"
                >
                  <div className="h-11 w-11 rounded-xl gradient-brand flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold mb-1.5">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, #f5c6df 0%, #fad8ea 50%, #f5c6df 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,24,93,0.35) 0%, rgba(124,24,93,0) 70%), radial-gradient(ellipse 70% 50% at 50% 100%, rgba(124,24,93,0.2) 0%, rgba(124,24,93,0) 70%)',
          }}
        />
        <div className="absolute top-1/4 -left-40 h-[28rem] w-[28rem] rounded-full bg-brand-primary/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-40 h-[28rem] w-[28rem] rounded-full bg-brand-primary-light/30 blur-3xl pointer-events-none" />
        {/* Dot-grid texture for depth */}
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(85,16,64,0.6) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('landing.pricing.title')}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              {t('landing.pricing.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={cn(
                  'relative p-8 rounded-2xl border bg-white',
                  plan.featured
                    ? 'border-brand-primary/40 shadow-2xl shadow-brand-primary/10 scale-[1.02]'
                    : 'border-slate-100',
                )}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full gradient-brand text-white text-[11px] font-semibold uppercase tracking-wide">
                    {t('landing.pricing.popular')}
                  </div>
                )}
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  {t(`landing.pricing.tiers.${plan.id}`)}
                </h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-5xl font-bold">${plan.price}</span>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                  {plan.tokens.toLocaleString()} {t('landing.pricing.tokens')}{' '}
                  <span className="text-brand-primary font-medium">+{plan.bonus}</span>
                </p>
                <Link to="/register" className="block">
                  <Button
                    variant={plan.featured ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    {t('landing.pricing.cta')}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 max-w-3xl mx-auto p-5 rounded-xl bg-slate-50 border border-slate-100">
            <h4 className="text-sm font-semibold mb-3">
              {t('landing.pricing.costsTitle')}
            </h4>
            <ul className="text-sm text-slate-600 space-y-1.5">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-primary shrink-0" />
                {t('landing.pricing.costCopy')}
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-primary shrink-0" />
                {t('landing.pricing.costImage')}
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-primary shrink-0" />
                {t('landing.pricing.costCustom')}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative rounded-3xl overflow-hidden gradient-brand p-12 md:p-16 text-white">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('landing.finalCta.title')}
              </h2>
              <p className="text-white/90 mb-8 max-w-xl mx-auto">
                {t('landing.finalCta.subtitle')}
              </p>
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-brand-primary hover:bg-white hover:shadow-xl"
                >
                  {t('landing.finalCta.cta')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="gradient-brand p-1.5 rounded-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold">ContenidIA</span>
          </div>
          <a
            href="https://instagram.com/lasdelcontenido_"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-500 hover:text-brand-primary transition-colors"
          >
            Powered by @lasdelcontenido_
          </a>
        </div>
      </footer>
    </div>
  );
}
