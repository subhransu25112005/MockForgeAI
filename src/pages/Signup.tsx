import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { UserPlus, Zap } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAppStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    signup(name, email);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 w-full max-w-md"
      >
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold gradient-text">MockForage AI</span>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-center text-muted-foreground text-sm mb-6">Start your interview prep journey</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-destructive text-sm text-center">{error}</p>}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Full Name</label>
            <input
              type="text"
              className="w-full bg-secondary rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
              placeholder="Alex Chen"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Email</label>
            <input
              type="email"
              className="w-full bg-secondary rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Password</label>
            <input
              type="password"
              className="w-full bg-secondary rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full glow-button flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Create Account
          </motion.button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
