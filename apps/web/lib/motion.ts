import type { Transition, Variants } from 'framer-motion';

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0 },
};

export const defaultTransition: Transition = {
  duration: 0.2,
  ease: [0.16, 1, 0.3, 1],
};

export function getMotionTransition(reducedMotion: boolean): Transition {
  return reducedMotion ? { duration: 0 } : defaultTransition;
}

export function getStaggerDelay(reducedMotion: boolean, index: number): number {
  return reducedMotion ? 0 : index * 0.04;
}
