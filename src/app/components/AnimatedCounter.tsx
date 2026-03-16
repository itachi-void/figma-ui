import { motion, animate, useMotionValue, useTransform } from 'motion/react';
import { useEffect } from 'react';

export default function AnimatedCounter({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, value, { duration: 1.5 });
    return animation.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}
