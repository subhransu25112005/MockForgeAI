import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, BarChart3, Mic, Shield, Zap, Target } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const features = [
  { icon: Brain, title: 'Human-like AI Interviewer', desc: 'Conversational questions, follow-ups, and real-time adaptation.' },
  { icon: Mic, title: 'Real-time Speech Coach', desc: 'Detect filler words, pacing, and clarity as you speak.' },
  { icon: BarChart3, title: 'Smart Analytics', desc: 'Track confidence, scores, and readiness over time.' },
  { icon: Shield, title: 'STAR Format Coach', desc: 'Live detection of Situation, Task, Action, Result structure.' },
  { icon: Target, title: 'Company-Specific Prep', desc: 'Tailored questions for Google, Amazon, Meta, and more.' },
  { icon: Zap, title: 'AI Study Plans', desc: 'Personalized 3-day improvement plans after every session.' },
];

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppStore();

  const handleStart = () => {
    navigate(isAuthenticated ? '/dashboard' : '/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" /> AI-Powered Interview Prep
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4">
            <span className="gradient-text">MockForge</span>{' '}
            <span className="text-foreground">AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Practice Smarter. Perform Better.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleStart}
            className="glow-button text-lg px-8 py-4 flex items-center gap-3 mx-auto"
          >
            Start Practicing <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12 gradient-text"
        >
          Everything You Need to Ace Your Interview
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card-hover p-6"
            >
              <f.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-muted-foreground border-t border-border">
        © 2026 MockForge AI. Built for interview excellence.
      </footer>
    </div>
  );
};

export default Landing;
