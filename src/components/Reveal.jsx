import { motion } from 'framer-motion';

/** Rises into place once, the first time it scrolls into view. */
export default function Reveal({ as = 'div', delay = 0, y = 24, children, className, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1, delay, ease: [0.23, 1, 0.32, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
