import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle, Target, MessageSquare, Brain, Eye, Activity,
  ArrowRight, RotateCcw, TrendingUp
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

const mockResults = {
  score: 78,
  clarity: 82,
  confidence: 71,
  technical_depth: 75,
  communication: 88,
  body_language_score: 65,
  feedback: "Strong communication skills with clear structure. Work on providing more specific technical examples and improving eye contact with the camera.",
  ideal_answer: "When answering system design questions, start with requirements clarification, then move to high-level architecture, and finally dive into specific components.",
  weaknesses: ['Time management', 'Technical depth on databases', 'Filler words usage'],
  suggested_topics: ['B-Trees & Indexing', 'Distributed Systems', 'STAR Method Practice'],
};

const Results = () => {
  const navigate = useNavigate();

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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 text-center"
      >
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

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/setup')}
          className="flex-1 glow-button flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Practice Again
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/')}
          className="flex-1 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium flex items-center justify-center gap-2 hover:bg-secondary/80 transition"
        >
          Back to Dashboard <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default Results;
