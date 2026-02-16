import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

const tips = [
  "Practice the STAR method for behavioral questions.",
  "Research the company's recent news before interviews.",
  "Pause before answering — it shows confidence.",
  "Ask clarifying questions to buy thinking time.",
  "End with a thoughtful question for your interviewer.",
];

const FloatingAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: 'assistant', text: "Hi! 👋 Need interview tips? Ask me anything!" },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { role: 'user', text: input }]);
    const tip = tips[Math.floor(Math.random() * tips.length)];
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'assistant', text: tip }]);
    }, 800);
    setInput('');
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 glass-card border border-glass-border rounded-2xl overflow-hidden z-50 flex flex-col"
            style={{ height: 400 }}
          >
            <div className="p-4 border-b border-border flex items-center gap-2 bg-primary/5">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">AI Interview Coach</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                    m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <input
                className="flex-1 bg-secondary rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
                placeholder="Ask for tips..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
              />
              <button onClick={send} className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full glow-button flex items-center justify-center z-50"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  );
};

export default FloatingAssistant;
