import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle, Target, MessageSquare, Brain, Activity,
  ArrowRight, RotateCcw, TrendingUp, CalendarDays, BookOpen
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

const savedConfidence =
  Number(localStorage.getItem("last_confidence") || 70);

const savedXP =
  Number(localStorage.getItem("xp") || 0);

const savedInterviews =
  Number(localStorage.getItem("interviews_done") || 0);

const mockResults = {
  score: Math.min(100, 60 + Math.floor(savedConfidence / 2)),
  clarity: 75 + Math.floor(Math.random() * 10),
  confidence: savedConfidence,
  technical_depth: 70 + Math.floor(Math.random() * 10),
  communication: 75 + Math.floor(Math.random() * 10),
  body_language_score: 65 + Math.floor(Math.random() * 10),

  feedback:
    savedConfidence > 75
      ? "Excellent confidence and communication. Ready for interviews."
      : "Good attempt. Improve confidence and provide more structured answers.",

  ideal_answer:
    "Use STAR method: Situation → Task → Action → Result with measurable impact.",

  weaknesses: ["Time management", "Depth in examples"],
  suggested_topics: ["STAR method", "System Design basics"],

  study_plan: [
    { day: 1, topic: "Behavioral STAR", resource: "Mock practice", action: "Practice 5 answers" },
    { day: 2, topic: "System Design", resource: "YouTube + notes", action: "Study basics" },
    { day: 3, topic: "Mock Interview", resource: "MockForge AI", action: "Take one session" }
  ],

  total_interviews: savedInterviews,
  total_xp: savedXP
};


const Results = () => {
  const navigate = useNavigate();
  const [showPlan, setShowPlan] = useState(false);

  const radarData = [
    { metric: 'Clarity', value: mockResults.clarity },
    { metric: 'Confidence', value: mockResults.confidence },
    { metric: 'Technical', value: mockResults.technical_depth },
    { metric: 'Communication', value: mockResults.communication },
    { metric: 'Body Lang.', value: mockResults.body_language_score },
  ];

  const barData = radarData.map(d => ({ ...d, fill: d.value >= 75 ? 'hsl(152 69% 45%)' : d.value >= 50 ? 'hsl(38 92% 50%)' : 'hsl(0 72% 51%)' }));

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Score Header */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
          <CheckCircle className="w-4 h-4" /> Interview Complete
        </div>
        <h1 className="text-5xl font-bold gradient-text mb-2">{mockResults.score}/100</h1>
        <p className="text-muted-foreground">Overall Performance Score</p>
        <p className="text-sm text-primary mt-2">+25 XP earned!</p>
      </motion.div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Performance Radar
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(222 30% 18%)" />
              <PolarAngleAxis dataKey="metric" stroke="hsl(215 20% 55%)" fontSize={11} />
              <PolarRadiusAxis stroke="hsl(222 30% 18%)" fontSize={10} domain={[0, 100]} />
              <Radar dataKey="value" stroke="hsl(187 80% 50%)" fill="hsl(187 80% 50%)" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Score Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
              <XAxis type="number" domain={[0, 100]} stroke="hsl(215 20% 55%)" fontSize={12} />
              <YAxis dataKey="metric" type="category" stroke="hsl(215 20% 55%)" fontSize={11} width={85} />
              <Tooltip contentStyle={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 22%)', borderRadius: '8px', color: 'hsl(210 40% 96%)' }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="hsl(187 80% 50%)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Feedback */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" /> AI Feedback
        </h3>
        <p className="text-secondary-foreground leading-relaxed">{mockResults.feedback}</p>
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-sm font-medium text-primary mb-1">💡 Ideal Approach</p>
          <p className="text-sm text-muted-foreground">{mockResults.ideal_answer}</p>
        </div>
      </motion.div>

      {/* Weaknesses + Topics */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-warning" /> Areas to Improve
          </h3>
          <ul className="space-y-2">
            {mockResults.weaknesses.map((w) => (
              <li key={w} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-warning" /> {w}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success" /> Suggested Topics
          </h3>
          <ul className="space-y-2">
            {mockResults.suggested_topics.map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-success" /> {t}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* AI Study Plan */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <button
          onClick={() => setShowPlan(!showPlan)}
          className="w-full glass-card-hover p-6 text-left"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-accent" /> Your 3-Day Improvement Plan
            </h3>
            <span className="text-muted-foreground text-sm">{showPlan ? 'Hide' : 'Show'}</span>
          </div>
        </button>
        {showPlan && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-3 mt-4">
            {mockResults.study_plan.map((item) => (
              <div key={item.day} className="glass-card p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                    D{item.day}
                  </div>
                  <h4 className="font-semibold">{item.topic}</h4>
                </div>
                <div className="ml-11 space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" /> {item.resource}
                  </p>
                  <p className="text-sm text-primary">→ {item.action}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/setup')} className="flex-1 glow-button flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" /> Practice Again
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/dashboard')} className="flex-1 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium flex items-center justify-center gap-2 hover:bg-secondary/80 transition">
          Back to Dashboard <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default Results;
