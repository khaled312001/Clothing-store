'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export function FadeUp({ children, delay = 0, className = '', as = 'div', once = true, ...rest }) {
  const Component = motion[as] || motion.div;
  return (
    <Component
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
      custom={delay}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  );
}

export function StaggerGroup({ children, className = '' }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

export function HoverLift({ children, className = '' }) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated counter for stats
export function CountUp({ to, duration = 1.6, prefix = '', suffix = '' }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onViewportEnter={(el) => {
        const node = el?.target || document.currentScript?.parentNode;
        if (!node || node.dataset.animated) return;
        node.dataset.animated = '1';
        const target = Number(to);
        let start = 0;
        const startedAt = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - startedAt) / (duration * 1000));
          const eased = 1 - Math.pow(1 - p, 3);
          node.textContent = prefix + Math.round(start + (target - start) * eased).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }}
    >
      {prefix}{to}{suffix}
    </motion.span>
  );
}

// Marquee for trust badges or news
export function Marquee({ children, speed = 30 }) {
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {children}{children}
      </motion.div>
    </div>
  );
}
