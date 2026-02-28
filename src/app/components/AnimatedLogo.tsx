import { motion } from "motion/react";

export function AnimatedLogo() {
  return (
    <div className="flex items-center gap-2">
      <motion.svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="cursor-pointer"
        whileHover="hover"
        initial="initial"
        animate="animate"
      >
        {/* Background circle */}
        <motion.circle
          cx="20"
          cy="20"
          r="18"
          stroke="#14b8a6"
          strokeWidth="1"
          fill="none"
          variants={{
            initial: { opacity: 0.3 },
            animate: { opacity: [0.3, 0.6, 0.3], transition: { duration: 3, repeat: Infinity } },
            hover: { opacity: 1, scale: 1.1 }
          }}
        />

        {/* Letter R */}
        <motion.path
          d="M15 12 L15 28 M15 12 L21 12 Q24 12 24 15.5 Q24 18 21 18 L15 18 M21 18 L25 28"
          stroke="#f3f4f6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          variants={{
            initial: { pathLength: 1 },
            animate: {
              pathLength: [1, 0.8, 1],
              transition: { duration: 3, repeat: Infinity }
            },
            hover: {
              stroke: "#14b8a6",
              pathLength: 1,
              transition: { duration: 0.3 }
            }
          }}
        />

        {/* Neural network nodes */}
        {[
          { cx: 12, cy: 15, delay: 0 },
          { cx: 28, cy: 15, delay: 0.3 },
          { cx: 12, cy: 25, delay: 0.6 },
          { cx: 28, cy: 25, delay: 0.9 }
        ].map((node, i) => (
          <motion.circle
            key={i}
            cx={node.cx}
            cy={node.cy}
            r="1.5"
            fill="#14b8a6"
            variants={{
              initial: { opacity: 0, scale: 0 },
              animate: {
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  delay: node.delay
                }
              },
              hover: {
                opacity: 1,
                scale: 1.5,
                transition: { duration: 0.2 }
              }
            }}
          />
        ))}
      </motion.svg>

      <motion.span
        className="font-mono text-lg"
        style={{ color: '#f3f4f6' }}
        whileHover={{ color: '#14b8a6' }}
        transition={{ duration: 0.3 }}
      >
        Ritik Rajdev
      </motion.span>
    </div>
  );
}
