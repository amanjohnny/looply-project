import type { Transition, Variants } from 'framer-motion';

export const bounceSpring: Transition = {
  type: 'spring',
  stiffness: 360,
  damping: 24,
  mass: 0.7,
};

export const tapBounce = {
  whileTap: { scale: 0.95 },
  whileHover: { y: -1.5, scale: 1.01 },
};

export const tabBounce = {
  whileTap: { scale: 0.97, y: 0 },
  whileHover: { y: -1.5 },
  transition: bounceSpring,
};

export const subtleShake: Variants = {
  idle: { x: 0 },
  shake: {
    x: [0, -4, 4, -3, 3, -2, 2, 0],
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};

export const cardIn: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export const pageFade: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export type BurstParticle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
};

export function createBurst(count = 12): BurstParticle[] {
  return Array.from({ length: count }).map((_, index) => {
    const angle = (Math.PI * 2 * index) / count;
    const radius = 40 + (index % 4) * 10;

    return {
      id: index,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      size: 6 + (index % 3) * 2,
      duration: 0.55 + (index % 4) * 0.08,
      delay: (index % 5) * 0.02,
    };
  });
}
