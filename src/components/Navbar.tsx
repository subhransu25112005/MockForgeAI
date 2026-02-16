import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Play, Trophy, FileText, User, LogOut, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/setup', label: 'Start Interview', icon: Play },
  { path: '/achievements', label: 'Achievements', icon: Trophy },
  { path: '/resume', label: 'Resume Mode', icon: FileText },
];

const Navbar = () => {
  const location = useLocation();
  const { user, stats } = useAppStore();

  return (
    <nav className="glass-card border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <span className="text-lg font-bold gradient-text hidden sm:inline">InterviewMaster AI</span>
      </Link>

      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden md:inline">{item.label}</span>
              {active && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-xs font-semibold">
          <Zap className="w-3 h-3" />
          {stats.xpPoints} XP
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
            {user?.name?.[0] || 'U'}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
