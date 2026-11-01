'use client';

import React, { useEffect, useMemo, useState, type ComponentPropsWithoutRef } from 'react';
import { AnimatePresence, motion, useReducedMotion, type MotionProps } from 'motion/react';

import { cn } from '@/lib/utils';

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion() === true;
  const animations: MotionProps = reduced
    ? {}
    : {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1, originY: 0 },
        exit: { scale: 0, opacity: 0 },
        transition: { type: 'spring', stiffness: 350, damping: 40 },
      };

  return (
    <motion.div {...animations} layout={!reduced} className="w-full">
      {children}
    </motion.div>
  );
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
  /** Milliseconds between two items. */
  delay?: number;
  /** Starts the sequence. Pass false to hold it, for example until the list is in view. */
  play?: boolean;
}

/**
 * Shows its children one after another, newest first. Local adaptation: the
 * sequence waits for `play`, and reduced motion shows every item at once.
 */
export const AnimatedList = React.memo(function AnimatedList({
  children,
  className,
  delay = 1000,
  play = true,
  ...props
}: AnimatedListProps) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion() === true;
  const childrenArray = useMemo(() => React.Children.toArray(children), [children]);

  useEffect(() => {
    if (!play || reduced || index >= childrenArray.length - 1) {
      return;
    }
    const timeout = setTimeout(() => {
      setIndex(index + 1);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [index, delay, play, reduced, childrenArray.length]);

  const shown = reduced ? childrenArray.length : index + 1;
  const itemsToShow = useMemo(() => childrenArray.slice(0, shown).reverse(), [childrenArray, shown]);

  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      <AnimatePresence>
        {itemsToShow.map(item => (
          <AnimatedListItem key={React.isValidElement(item) ? item.key : null}>
            {item}
          </AnimatedListItem>
        ))}
      </AnimatePresence>
    </div>
  );
});
