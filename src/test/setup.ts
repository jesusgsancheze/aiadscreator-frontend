import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import React from 'react';

// Strip motion-only props and render the underlying HTML tag so semantic
// roles (button, form, etc.) survive for RTL queries.
vi.mock('framer-motion', () => {
  const MOTION_ONLY_PROPS = new Set([
    'initial',
    'animate',
    'exit',
    'transition',
    'variants',
    'whileHover',
    'whileTap',
    'whileFocus',
    'whileDrag',
    'whileInView',
    'layout',
    'layoutId',
  ]);

  const stripMotionProps = (props: Record<string, any>) => {
    const out: Record<string, any> = {};
    for (const [key, value] of Object.entries(props)) {
      if (!MOTION_ONLY_PROPS.has(key)) out[key] = value;
    }
    return out;
  };

  const motion = new Proxy(
    {},
    {
      get: (_target, tag: string) => (props: any) => {
        const Tag = tag as any;
        const { children, ...rest } = props;
        return React.createElement(Tag, stripMotionProps(rest), children);
      },
    },
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

afterEach(() => {
  cleanup();
});
