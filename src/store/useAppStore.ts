import { create } from 'zustand';

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

export interface StudyPlanItem {
  day: number;
  topic: string;
  resource: string;
  action: string;
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

const defaultStats: UserStats = {
  interviewsCompleted: 12,
  readinessScore: 73,
  xpPoints: 2450,
  streak: 5,
  level: 7,
  badges: ['First Interview', '5 Day Streak', 'Quick Learner', 'Code Warrior'],
  weeklyScores: [55, 62, 58, 71, 68, 75, 73],
  strengths: ['Data Structures', 'System Design', 'Communication'],
  weaknesses: ['Dynamic Programming', 'Time Management', 'Concurrency'],
  confidenceTrend: [40, 48, 52, 55, 63, 67, 72],
};

interface AuthUser {
  name: string;
  email: string;
}

interface AppState {
  // Auth
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (name: string, email: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
  loadSession: () => void;

  // Stats
  stats: UserStats;

  // Interview
  interviewConfig: InterviewConfig | null;
  messages: Message[];
  interviewHistory: string[]; // AI memory of key points
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
  addXP: (points: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  stats: defaultStats,
  interviewConfig: null,
  messages: [],
  interviewHistory: [],
  currentFeedback: null,
  isInterviewActive: false,
  studyPlan: [],

  login: (name, email) => {
    const user = { name, email };
    localStorage.setItem('mockforage_user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },
  signup: (name, email) => {
    const user = { name, email };
    localStorage.setItem('mockforage_user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('mockforage_user');
    set({ user: null, isAuthenticated: false });
  },
  loadSession: () => {
    const stored = localStorage.getItem('mockforage_user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        set({ user, isAuthenticated: true });
      } catch { /* ignore */ }
    }
  },

  setInterviewConfig: (config) => set({ interviewConfig: config }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  addToHistory: (point) => set((s) => ({ interviewHistory: [...s.interviewHistory, point] })),
  setFeedback: (fb) => set({ currentFeedback: fb }),
  setStudyPlan: (plan) => set({ studyPlan: plan }),
  startInterview: () => set({ isInterviewActive: true, messages: [], interviewHistory: [] }),
  endInterview: () => set({ isInterviewActive: false }),
  clearMessages: () => set({ messages: [], interviewHistory: [] }),
  addXP: (points) => set((s) => ({
    stats: { ...s.stats, xpPoints: s.stats.xpPoints + points },
  })),
}));
