import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

interface AnimatedNumberProps {
  value: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export function AnimatedNumber({ value, className = '', suffix = '', prefix = '' }: AnimatedNumberProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  useEffect(() => {
    if (isClient) {
      spring.set(value);
    }
  }, [value, isClient, spring]);

  const display = useTransform(spring, (current) => 
    Math.round(current).toLocaleString()
  );

  return (
    <div className={`font-mono text-brand-primary text-shadow-glow flex items-baseline ${className}`}>
      {prefix && <span className="mr-1">{prefix}</span>}
      <motion.span>{isClient ? display : value}</motion.span>
      {suffix && <span className="ml-1 text-sm text-gray-400">{suffix}</span>}
    </div>
  );
}
