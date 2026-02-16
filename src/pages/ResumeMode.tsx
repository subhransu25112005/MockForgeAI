import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Sparkles, BookOpen, Code, Users } from 'lucide-react';

const mockGeneratedQuestions = {
  project: [
    "Walk me through the architecture of your e-commerce platform.",
    "What challenges did you face with real-time data sync?",
    "How did you handle authentication in your SaaS project?",
  ],
  technical: [
    "Explain the time complexity of your caching solution.",
    "How would you optimize the database queries you mentioned?",
    "Describe how you'd scale this system to 1M users.",
  ],
  behavioral: [
    "Tell me about a time you disagreed with your team lead.",
    "Describe a situation where you had to learn something quickly.",
    "How do you prioritize when everything is urgent?",
  ],
};

const ResumeMode = () => {
  const [resumeText, setResumeText] = useState('');
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setGenerated(true);
      setLoading(false);
    }, 1500);
  };

  const sections = [
    { title: 'Project Questions', icon: Code, questions: mockGeneratedQuestions.project, color: 'text-primary' },
    { title: 'Technical Questions', icon: BookOpen, questions: mockGeneratedQuestions.technical, color: 'text-accent' },
    { title: 'Behavioral Questions', icon: Users, questions: mockGeneratedQuestions.behavioral, color: 'text-success' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text">Resume-to-Interview Mode</h1>
        <p className="text-muted-foreground mt-2">Paste your resume and get personalized interview questions.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Your Resume</h3>
        </div>
        <textarea
          className="w-full h-48 bg-secondary rounded-xl p-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary resize-none"
          placeholder="Paste your resume content here... (Include skills, experience, projects, education)"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={!resumeText.trim() || loading}
          className={`mt-4 glow-button flex items-center gap-2 ${!resumeText.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Generate Questions
            </>
          )}
        </motion.button>
      </motion.div>

      {generated && (
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="glass-card p-6"
            >
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${section.color}`}>
                <section.icon className="w-5 h-5" /> {section.title}
              </h3>
              <ul className="space-y-3">
                {section.questions.map((q, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-secondary-foreground">
                    <span className="text-xs font-mono text-muted-foreground mt-0.5">Q{i + 1}</span>
                    {q}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeMode;
