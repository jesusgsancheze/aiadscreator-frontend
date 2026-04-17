import { cn } from '../../lib/utils';

interface SkeletonProps {
  variant?: 'text' | 'card' | 'avatar';
  className?: string;
  lines?: number;
}

export default function Skeleton({ variant = 'text', className, lines = 1 }: SkeletonProps) {
  if (variant === 'avatar') {
    return (
      <div className={cn('h-10 w-10 rounded-full bg-slate-200 animate-pulse', className)} />
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('bg-white rounded-2xl border border-slate-100 p-6 space-y-4', className)}>
        <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse" />
        <div className="h-32 w-full bg-slate-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-slate-200 rounded animate-pulse"
          style={{ width: `${Math.max(40, 100 - i * 20)}%` }}
        />
      ))}
    </div>
  );
}
