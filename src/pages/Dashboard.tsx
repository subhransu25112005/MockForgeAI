import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Target, Flame, Award, TrendingUp, Zap, ArrowRight,
  Brain, BookOpen, Code
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import StatsCard from '@/components/StatsCard';
import ReadinessScore from '@/components/ReadinessScore';
import { useAppStore } from '@/store/useAppStore';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { stats } = useAppStore();

  const weeklyData = stats.weeklyScores.map((score, i) => ({
    day: weekDays[i],
    score,
    confidence: stats.confidenceTrend[i],
  }));

  const radarData = [
    { skill: 'DSA', value: 78 },
    { skill: 'System Design', value: 65 },
    { skill: 'Behavioral', value: 82 },
    { skill: 'Communication', value: 88 },
    { skill: 'Problem Solving', value: 71 },
    { skill: 'Leadership', value: 60 },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="gradient-text">Alex</span>
          </h1>
          <p className="text-muted-foreground mt-1">Your interview journey continues. Let's ace it today!</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/setup')}
          className="glow-button flex items-center gap-2"
        >
          Start Interview <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={<BarChart3 className="w-5 h-5" />} label="Interviews" value={stats.interviewsCompleted} subtitle="Completed" delay={0.1} />
        <StatsCard icon={<Flame className="w-5 h-5" />} label="Streak" value={`${stats.streak} days`} subtitle="Keep going!" delay={0.2} />
        <StatsCard icon={<Zap className="w-5 h-5" />} label="XP Points" value={stats.xpPoints} subtitle={`Level ${stats.level}`} delay={0.3} />
        <StatsCard icon={<Award className="w-5 h-5" />} label="Badges" value={stats.badges.length} subtitle="Earned" delay={0.4} />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Weekly Progress
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
              <XAxis dataKey="day" stroke="hsl(215 20% 55%)" fontSize={12} />
              <YAxis stroke="hsl(215 20% 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(222 40% 10%)',
                  border: '1px solid hsl(222 30% 22%)',
                  borderRadius: '8px',
                  color: 'hsl(210 40% 96%)',
                }}
              />
              <Line type="monotone" dataKey="score" stroke="hsl(187 80% 50%)" strokeWidth={2} dot={{ fill: 'hsl(187 80% 50%)' }} />
              <Line type="monotone" dataKey="confidence" stroke="hsl(265 70% 60%)" strokeWidth={2} dot={{ fill: 'hsl(265 70% 60%)' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Readiness */}
        <ReadinessScore score={stats.readinessScore} />
      </div>

      {/* Skills Radar + Strengths/Weaknesses */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" /> Skills Heatmap
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(222 30% 18%)" />
              <PolarAngleAxis dataKey="skill" stroke="hsl(215 20% 55%)" fontSize={11} />
              <PolarRadiusAxis stroke="hsl(222 30% 18%)" fontSize={10} />
              <Radar dataKey="value" stroke="hsl(187 80% 50%)" fill="hsl(187 80% 50%)" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 space-y-6"
        >
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Code className="w-5 h-5 text-success" /> Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats.strengths.map((s) => (
                <span key={s} className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-warning" /> Areas to Improve
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats.weaknesses.map((w) => (
                <span key={w} className="px-3 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium">{w}</span>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" /> Badges
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats.badges.map((b) => (
                <span key={b} className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold border border-accent/20">{b}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
