import { create } from 'zustand';

/* ================= TYPES ================= */

export interface InterviewConfig {
  role: string;
  difficulty: string;
  type: string;
  company: string;
  language: string;
  personality: string;
  pressureMode: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface StudyPlanItem {
  day: number;
  topic: string;
  resource: string;
  action: string;
}

export interface FeedbackData {
  score: number;
  clarity: number;
  confidence: number;
  technical_depth: number;
  communication: number;
  body_language_score: number;
  feedback: string;
  ideal_answer: string;
  weaknesses: string[];
  suggested_topics: string[];
  next_followup: string;
  followup_type: 'challenge' | 'probe' | 'next';
  difficulty_change: 'increase' | 'decrease' | 'maintain';
  study_plan: StudyPlanItem[];
}

export interface UserStats {
  interviewsCompleted: number;
  readinessScore: number;
  xpPoints: number;
  streak: number;
  level: number;
  badges: string[];
  weeklyScores: number[];
  strengths: string[];
  weaknesses: string[];
  confidenceTrend: number[];
}

/* ================= STORAGE HELPERS ================= */

const loadStats = (): UserStats => ({
  interviewsCompleted: Number(localStorage.getItem("interviews_done")) || 0,
  readinessScore: Number(localStorage.getItem("last_confidence")) || 0,
  xpPoints: Number(localStorage.getItem("xp")) || 0,
  streak: Number(localStorage.getItem("streak")) || 1,
  level: Number(localStorage.getItem("level")) || 1,
  badges: JSON.parse(localStorage.getItem("badges") || '["First Interview"]'),
  weeklyScores: JSON.parse(localStorage.getItem("weeklyScores") || "[60,65,70]"),
  strengths: ['Data Structures', 'System Design', 'Communication'],
  weaknesses: ['Dynamic Programming', 'Time Management', 'Concurrency'],
  confidenceTrend: JSON.parse(localStorage.getItem("confidenceTrend") || "[50,55,60]"),
});

const saveStats = (stats: UserStats) => {
  localStorage.setItem("interviews_done", String(stats.interviewsCompleted));
  localStorage.setItem("last_confidence", String(stats.readinessScore));
  localStorage.setItem("xp", String(stats.xpPoints));
  localStorage.setItem("streak", String(stats.streak));
  localStorage.setItem("level", String(stats.level));
  localStorage.setItem("badges", JSON.stringify(stats.badges));
  localStorage.setItem("weeklyScores", JSON.stringify(stats.weeklyScores));
  localStorage.setItem("confidenceTrend", JSON.stringify(stats.confidenceTrend));
};

/* ================= AUTH ================= */

interface AuthUser {
  name: string;
  email: string;
}

/* ================= STORE ================= */

interface AppState {

  /* Auth */
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;

  /* Stats */
  stats: UserStats;
  updateStatsAfterInterview: (confidence: number) => void;
  addXP: (points: number) => void;

  /* Interview */
  interviewConfig: InterviewConfig | null;
  messages: Message[];
  interviewHistory: string[];
  currentFeedback: FeedbackData | null;
  isInterviewActive: boolean;
  studyPlan: StudyPlanItem[];

  setInterviewConfig: (config: InterviewConfig) => void;
  addMessage: (msg: Message) => void;
  addToHistory: (point: string) => void;
  setFeedback: (fb: FeedbackData) => void;
  setStudyPlan: (plan: StudyPlanItem[]) => void;
  startInterview: () => void;
  endInterview: () => void;
  clearMessages: () => void;
}

/* ================= IMPLEMENTATION ================= */

export const useAppStore = create<AppState>((set, get) => ({

  user: null,
  isAuthenticated: false,

  stats: loadStats(),

  interviewConfig: null,
  messages: [],
  interviewHistory: [],
  currentFeedback: null,
  isInterviewActive: false,
  studyPlan: [],

  /* ===== AUTH ===== */

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  /* ===== STATS UPDATE AFTER INTERVIEW ===== */

  updateStatsAfterInterview: (confidence) => {

    const s = get().stats;

    const newStats: UserStats = {
      ...s,
      interviewsCompleted: s.interviewsCompleted + 1,
      readinessScore: confidence,
      xpPoints: s.xpPoints + 50,
      confidenceTrend: [...s.confidenceTrend.slice(-6), confidence],
      weeklyScores: [...s.weeklyScores.slice(-6), confidence],
      streak: s.streak + 1,
      level: Math.floor((s.xpPoints + 50) / 200) + 1,
    };

    saveStats(newStats);

    set({ stats: newStats });
  },

  addXP: (points) => {
    const s = get().stats;
    const newStats = { ...s, xpPoints: s.xpPoints + points };
    saveStats(newStats);
    set({ stats: newStats });
  },

  /* ===== INTERVIEW ===== */

  setInterviewConfig: (config) => set({ interviewConfig: config }),

  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),

  addToHistory: (point) =>
    set((s) => ({ interviewHistory: [...s.interviewHistory, point] })),

  setFeedback: (fb) => set({ currentFeedback: fb }),

  setStudyPlan: (plan) => set({ studyPlan: plan }),

  startInterview: () =>
    set({ isInterviewActive: true, messages: [], interviewHistory: [] }),

  endInterview: () => set({ isInterviewActive: false }),

  clearMessages: () => set({ messages: [], interviewHistory: [] }),

}));
