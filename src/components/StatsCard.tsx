import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  delay?: number;
}

const StatsCard = ({ icon, label, value, subtitle, delay = 0 }: StatsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card-hover p-6"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold mt-1 gradient-text">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className="p-3 rounded-lg bg-primary/10 text-primary">{icon}</div>
    </div>
  </motion.div>
);

export default StatsCard;
