import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import {
  Briefcase, BarChart2, MessageSquare, Building2, Globe, User,
  ArrowRight, Sparkles, Timer
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const options = {
  role: ['Frontend Developer', 'Backend Developer', 'Full Stack', 'Data Scientist', 'DevOps', 'Product Manager', 'ML Engineer'],
  difficulty: ['Easy', 'Medium', 'Hard', 'Expert'],
  type: ['Technical', 'Behavioral', 'System Design', 'HR Round', 'Mixed'],
  company: ['Google', 'Amazon', 'Microsoft', 'Meta', 'TCS', 'Infosys', 'Startup', 'General'],
  language: ['English', 'Hindi', 'Hinglish'],
  personality: ['Friendly', 'Strict', 'Expert', 'Casual'],
};

const icons: Record<string, React.ReactNode> = {
  role: <Briefcase className="w-5 h-5" />,
  difficulty: <BarChart2 className="w-5 h-5" />,
  type: <MessageSquare className="w-5 h-5" />,
  company: <Building2 className="w-5 h-5" />,
  language: <Globe className="w-5 h-5" />,
  personality: <User className="w-5 h-5" />,
};

const labels: Record<string, string> = {
  role: 'Role / Domain',
  difficulty: 'Difficulty Level',
  type: 'Interview Type',
  company: 'Target Company',
  language: 'Language',
  personality: 'Interviewer Style',
};

const InterviewSetup = () => {
  const navigate = useNavigate();
  const { setInterviewConfig, startInterview } = useAppStore();
  const [config, setConfig] = useState({
    role: '', difficulty: '', type: '', company: '', language: '', personality: '',
  });
  const [pressureMode, setPressureMode] = useState(false);

  const allSelected = Object.values(config).every(Boolean);

  const handleStart = () => {
    if (!allSelected) return;
    setInterviewConfig({ ...config, pressureMode });
    startInterview();
    navigate('/interview');
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text">Configure Your Interview</h1>
        <p className="text-muted-foreground mt-2">Customize your practice session for the best results.</p>
      </motion.div>

      <div className="space-y-6">
        {Object.entries(options).map(([key, opts], idx) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4 text-primary">
              {icons[key]}
              <h3 className="font-semibold">{labels[key]}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {opts.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setConfig((c) => ({ ...c, [key]: opt }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                    config[key as keyof typeof config] === opt
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Pressure Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-warning" />
              <div>
                <h3 className="font-semibold">Pressure Mode</h3>
                <p className="text-sm text-muted-foreground">Countdown timer with auto-submit. Test under pressure!</p>
              </div>
            </div>
            <Switch checked={pressureMode} onCheckedChange={setPressureMode} />
          </div>
        </motion.div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleStart}
        disabled={!allSelected}
        className={`w-full glow-button flex items-center justify-center gap-2 text-lg py-4 ${
          !allSelected ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Sparkles className="w-5 h-5" />
        Begin Interview
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default InterviewSetup;
