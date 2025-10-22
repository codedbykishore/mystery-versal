import { motion } from 'framer-motion';

interface ConnectionLineProps {
  path: string;
  delay?: number;
  opacity?: number;
  animate?: boolean;
}

export function ConnectionLine({ path, delay = 0, opacity = 1, animate = true }: ConnectionLineProps) {
  if (!animate) {
    return (
      <motion.g opacity={opacity}>
        <motion.path
          d={path}
          stroke="rgba(96, 165, 250, 0.3)"
          strokeWidth="3"
          fill="none"
          filter="url(#glow)"
        />
        <motion.path
          d={path}
          stroke="rgba(96, 165, 250, 0.6)"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead)"
          strokeDasharray="5,5"
        />
      </motion.g>
    );
  }

  return (
    <motion.g opacity={opacity}>
      {/* Glow trail */}
      <motion.path
        d={path}
        stroke="rgba(96, 165, 250, 0.3)"
        strokeWidth="3"
        fill="none"
        filter="url(#glow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 1.5,
          delay,
          ease: "easeInOut"
        }}
      />
      {/* Main trail */}
      <motion.path
        d={path}
        stroke="rgba(96, 165, 250, 0.6)"
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrowhead)"
        strokeDasharray="5,5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 1.5,
          delay,
          ease: "easeInOut"
        }}
      />
    </motion.g>
  );
}