import { motion } from 'framer-motion';
import { Trophy, Star, Flame, Zap, Target, Award, Medal, Crown, Shield, Rocket } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const allBadges = [
  { name: 'First Interview', icon: Star, desc: 'Complete your first interview', earned: true },
  { name: '5 Day Streak', icon: Flame, desc: 'Practice 5 days in a row', earned: true },
  { name: 'Quick Learner', icon: Zap, desc: 'Score 80+ on first try', earned: true },
  { name: 'Code Warrior', icon: Shield, desc: 'Ace 5 technical rounds', earned: true },
  { name: 'Perfect Score', icon: Crown, desc: 'Score 100/100', earned: false },
  { name: 'Marathoner', icon: Rocket, desc: 'Complete 50 interviews', earned: false },
  { name: 'Multilingual', icon: Target, desc: 'Practice in 3 languages', earned: false },
  { name: 'FAANG Ready', icon: Medal, desc: 'Score 90+ on hard mode', earned: false },
];

const leaderboard = [
  { rank: 1, name: 'Priya S.', xp: 5200, level: 14 },
  { rank: 2, name: 'Rahul M.', xp: 4800, level: 12 },
  { rank: 3, name: 'Sarah K.', xp: 3900, level: 10 },
  { rank: 4, name: 'Alex C.', xp: 2450, level: 7, isYou: true },
  { rank: 5, name: 'James L.', xp: 2100, level: 6 },
];

const Achievements = () => {
  const { stats } = useAppStore();

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text">Achievements & Leaderboard</h1>
        <p className="text-muted-foreground mt-2">Track your milestones and compete with peers.</p>
      </motion.div>

      {/* XP Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-warning" />
            <span className="font-semibold">Level {stats.level}</span>
          </div>
          <span className="text-sm text-muted-foreground">{stats.xpPoints} / 3000 XP</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-3">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${(stats.xpPoints / 3000) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </motion.div>

      {/* Badges */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" /> Badges
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allBadges.map((badge, i) => (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card p-4 text-center ${!badge.earned ? 'opacity-40' : ''}`}
            >
              <badge.icon className={`w-8 h-8 mx-auto mb-2 ${badge.earned ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className="text-sm font-semibold">{badge.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" /> Leaderboard
        </h2>
        <div className="glass-card overflow-hidden">
          {leaderboard.map((entry, i) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-center gap-4 p-4 border-b border-border last:border-0 ${entry.isYou ? 'bg-primary/5' : ''}`}
            >
              <span className={`text-lg font-bold w-8 text-center ${entry.rank <= 3 ? 'text-warning' : 'text-muted-foreground'}`}>
                #{entry.rank}
              </span>
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                {entry.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {entry.name} {entry.isYou && <span className="text-xs text-primary">(You)</span>}
                </p>
                <p className="text-xs text-muted-foreground">Level {entry.level}</p>
              </div>
              <span className="text-sm font-semibold text-primary">{entry.xp} XP</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
