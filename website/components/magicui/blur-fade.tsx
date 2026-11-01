'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion, type MotionProps, type Variants } from 'motion/react';

interface BlurFadeProps extends MotionProps {
  children: React.ReactNode;
  className?: string | undefined;
  duration?: number;
  /** Seconds before the element enters. */
  delay?: number;
  /** Distance in pixels the element travels. */
  offset?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Wait until the element scrolls into view. */
  inView?: boolean;
  blur?: string;
}

/**
 * Fades and unblurs its children into place. Local adaptation: reduced motion and
 * server rendering keep the content visible, so nothing stays hidden without script.
 */
export function BlurFade({
  children,
  className,
  duration = 0.5,
  delay = 0,
  offset = 20,
  direction = 'up',
  inView = true,
  blur = '6px',
  ...props
}: BlurFadeProps) {
  const ref = useRef(null);
  const reduced = useReducedMotion() === true;
  const inViewResult = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const visible = !inView || inViewResult;
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
  const sign = direction === 'right' || direction === 'down' ? -1 : 1;
  const variants: Variants = {
    hidden: { [axis]: sign * offset, opacity: 0, filter: `blur(${blur})` },
    visible: { [axis]: 0, opacity: 1, filter: 'blur(0px)' },
  };

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ delay: 0.04 + delay, duration, ease: [0.25, 1, 0.5, 1] }}
      className={className}
      data-blur-fade=""
      {...props}
    >
      {children}
    </motion.div>
  );
}
