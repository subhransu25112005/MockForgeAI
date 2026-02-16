import { motion } from 'framer-motion';

interface ReadinessScoreProps {
  score: number;
}

const ReadinessScore = ({ score }: ReadinessScoreProps) => {
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="glass-card p-8 flex flex-col items-center"
    >
      <h3 className="text-lg font-semibold text-muted-foreground mb-4">Interview Readiness</h3>
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="none" strokeWidth="8" className="stroke-secondary" />
          <motion.circle
            cx="80" cy="80" r="70" fill="none" strokeWidth="8"
            strokeLinecap="round"
            className="stroke-primary"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeDasharray={circumference}
            style={{ filter: 'drop-shadow(0 0 8px hsl(var(--glow-primary) / 0.5))' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold gradient-text">{score}%</span>
          <span className="text-xs text-muted-foreground">Ready</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ReadinessScore;
