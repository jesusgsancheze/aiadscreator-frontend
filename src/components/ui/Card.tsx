import { forwardRef, type HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'md', hover = false, children, ...props }, ref) => {
    const Component = hover ? motion.div : 'div';
    const motionProps = hover
      ? { whileHover: { y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' } }
      : {};

    return (
      <Component
        ref={ref}
        className={cn(
          'bg-white rounded-2xl border border-slate-100 shadow-sm',
          'transition-all duration-200',
          paddings[padding],
          className,
        )}
        {...motionProps}
        {...(props as any)}
      >
        {children}
      </Component>
    );
  },
);

Card.displayName = 'Card';
export default Card;
