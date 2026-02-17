import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { LogIn, Zap } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ DEMO LOGIN (SAFE FOR HACKATHON)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // create name from email
      const name = email
        .split('@')[0]
        .replace(/[^a-zA-Z]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());

      // store login in Zustand/local store
      login(name, email);

      // go dashboard
      navigate('/dashboard');

    } catch (err) {
      console.log(err);
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DEMO FORGOT PASSWORD (NO FIREBASE)
  const handleReset = () => {
    if (!email.trim()) {
      setError("Enter email first");
      return;
    }

    alert("Password reset link sent to email (Demo Mode)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 w-full max-w-md"
      >
        {/* LOGO */}
        <img src="/logo.png" className="h-10 mx-auto" />
          

        <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Sign in to continue practicing
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-secondary rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-secondary rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* LOGIN BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full glow-button flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>

        </form>

        {/* FORGOT PASSWORD */}
        <button
          type="button"
          onClick={handleReset}
          className="text-primary text-sm mt-3 w-full hover:underline"
        >
          Forgot Password?
        </button>

        {/* SIGNUP LINK */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>

      </motion.div>
    </div>
  );
};

export default Login;
