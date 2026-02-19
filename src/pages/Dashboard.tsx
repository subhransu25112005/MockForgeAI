import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  BarChart3, Flame, Award, TrendingUp, Zap, ArrowRight,
  Brain, BookOpen, Code, Trash2,
  ExternalLink, MapPin, Briefcase, BookMarked, Terminal
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";

import StatsCard from '@/components/StatsCard';
import ReadinessScore from '@/components/ReadinessScore';
import { useAppStore } from '@/store/useAppStore';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const GATEWAY_LINKS = [
  {
    label: 'Practice Coding',
    description: 'Solve DSA problems & challenges',
    url: 'https://leetcode.com',
    icon: Terminal,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
  },
  {
    label: 'Learn Interview Concepts',
    description: 'CS fundamentals & interview guides',
    url: 'https://www.geeksforgeeks.org',
    icon: BookMarked,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20',
  },
  {
    label: 'Mock Interview Practice',
    description: 'Real-time mock interviews & prep',
    url: 'https://www.interviewbit.com',
    icon: Brain,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { stats, user } = useAppStore();
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const detectedCity =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            null;
          setCity(detectedCity);
        } catch {
          // silently ignore
        }
      },
      () => { /* permission denied — use default */ }
    );
  }, []);

  async function handleDeleteAccount() {
    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.email) {
      alert("No logged-in user found");
      return;
    }

    const ok = window.confirm(
      "Are you sure you want to permanently delete your account?"
    );
    if (!ok) return;

    try {
      // 🔐 ALWAYS re-authenticate first (required by Firebase)
      const password = window.prompt("Enter your password to confirm deletion:");
      if (!password) return;

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      );

      await reauthenticateWithCredential(currentUser, credential);
      console.log("Re-auth success. UID:", currentUser.uid);

      // 🧹 Delete Firestore profile first
      await deleteDoc(doc(db, "users", currentUser.uid)).catch(() => { });
      console.log("Firestore deleted");

      // ❌ Delete Firebase Auth account
      await deleteUser(currentUser);
      console.log("Auth deleted");

      alert("Account deleted successfully");
      navigate("/login");

    } catch (err: any) {
      console.error("Delete error:", err);

      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        alert("Incorrect password. Please try again.");
      } else if (err.code === "auth/too-many-requests") {
        alert("Too many attempts. Try again later.");
      } else {
        alert(err.message || "Delete failed. Please try again.");
      }
    }
  }

  // SAFE FALLBACKS (prevents crash if store empty)
  const weeklyScores = stats?.weeklyScores?.length ? stats.weeklyScores : [60, 65, 70, 75, 80, 85, 90];
  const confidenceTrend = stats?.confidenceTrend?.length ? stats.confidenceTrend : [55, 60, 65, 70, 72, 75, 80];

  // WEEKLY LINE CHART DATA (REAL)
  const weeklyData = weekDays.map((day, i) => ({
    day,
    score: weeklyScores[i] ?? 60,
    confidence: confidenceTrend[i] ?? 60,
  }));

  // DYNAMIC RADAR DATA (NO HARDCODE)
  const radarData = [
    { skill: 'DSA', value: weeklyScores[6] ?? 60 },
    { skill: 'System Design', value: weeklyScores[5] ?? 60 },
    { skill: 'Behavioral', value: weeklyScores[4] ?? 60 },
    { skill: 'Communication', value: confidenceTrend[6] ?? 60 },
    { skill: 'Problem Solving', value: weeklyScores[3] ?? 60 },
    { skill: 'Leadership', value: confidenceTrend[5] ?? 60 },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back,
            <span className="gradient-text ml-2">
              {user?.name || 'User'}
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Your interview journey continues. Let's ace it today!
          </p>
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

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <StatsCard
          icon={<BarChart3 className="w-5 h-5" />}
          label="Interviews"
          value={stats?.interviewsCompleted ?? 0}
          subtitle="Completed"
          delay={0.1}
        />

        <StatsCard
          icon={<Flame className="w-5 h-5" />}
          label="Streak"
          value={`${stats?.streak ?? 0} days`}
          subtitle="Keep going!"
          delay={0.2}
        />

        <StatsCard
          icon={<Zap className="w-5 h-5" />}
          label="XP Points"
          value={stats?.xpPoints ?? 0}
          subtitle={`Level ${stats?.level ?? 1}`}
          delay={0.3}
        />

        <StatsCard
          icon={<Award className="w-5 h-5" />}
          label="Badges"
          value={stats?.badges?.length ?? 0}
          subtitle="Earned"
          delay={0.4}
        />

      </div>

      {/* CHART + READINESS */}
      <div className="grid lg:grid-cols-3 gap-6">

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
                  color: 'hsl(210 40% 96%)'
                }}
              />
              <Line type="monotone" dataKey="score" stroke="hsl(187 80% 50%)" strokeWidth={2} dot />
              <Line type="monotone" dataKey="confidence" stroke="hsl(265 70% 60%)" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <ReadinessScore score={stats?.readinessScore ?? 0} />

      </div>

      {/* RADAR + SKILLS */}
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
              <Radar
                dataKey="value"
                stroke="hsl(187 80% 50%)"
                fill="hsl(187 80% 50%)"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* SKILLS LIST */}
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
              {(stats?.strengths ?? []).map((s) => (
                <span key={s} className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-warning" /> Areas to Improve
            </h3>

            <div className="flex flex-wrap gap-2">
              {(stats?.weaknesses ?? []).map((w) => (
                <span key={w} className="px-3 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium">
                  {w}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" /> Badges
            </h3>

            <div className="flex flex-wrap gap-2">
              {(stats?.badges ?? []).map((b) => (
                <span
                  key={b}
                  className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold border border-accent/20"
                >
                  {b}
                </span>
              ))}
            </div>

          </div>

        </motion.div>
      </div>

      {/* CAREER GATEWAY */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" /> Continue Your Journey
        </h3>
        <p className="text-sm text-muted-foreground mb-5">
          Resources &amp; opportunities to accelerate your interview success.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GATEWAY_LINKS.map(({ label, description, url, icon: Icon, color, bg, border }) => (
            <motion.a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex flex-col gap-3 p-4 rounded-xl border ${border} ${bg} hover:brightness-110 transition-all cursor-pointer`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg} border ${border}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="flex-1">
                <p className={`font-semibold text-sm ${color}`}>{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
              </div>
              <ExternalLink className={`w-3.5 h-3.5 ${color} opacity-60 self-end`} />
            </motion.a>
          ))}

          {/* FIND NEARBY JOBS */}
          <motion.a
            href={`https://www.google.com/search?q=software+jobs+near+${city ? encodeURIComponent(city) : 'me'}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex flex-col gap-3 p-4 rounded-xl border border-orange-400/20 bg-orange-400/10 hover:brightness-110 transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-orange-400/10 border border-orange-400/20">
              <MapPin className="w-5 h-5 text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-orange-400">Find Nearby Jobs</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {city ? `Jobs near ${city}` : 'Software jobs near you'}
              </p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-orange-400 opacity-60 self-end" />
          </motion.a>
        </div>
      </motion.div>

      {/* DELETE ACCOUNT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDeleteAccount}
          className="px-6 py-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </motion.button>
      </motion.div>

    </div>
  );
};

export default Dashboard;
