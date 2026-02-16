import { create } from 'zustand';

export interface InterviewConfig {
  role: string;
  difficulty: string;
  type: string;
  company: string;
  language: string;
  personality: string;
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
  difficulty_change: 'increase' | 'decrease' | 'maintain';
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

interface AppState {
  user: { name: string; email: string } | null;
  stats: UserStats;
  interviewConfig: InterviewConfig | null;
  messages: Message[];
  currentFeedback: FeedbackData | null;
  isInterviewActive: boolean;
  login: (name: string, email: string) => void;
  logout: () => void;
  setInterviewConfig: (config: InterviewConfig) => void;
  addMessage: (msg: Message) => void;
  setFeedback: (fb: FeedbackData) => void;
  startInterview: () => void;
  endInterview: () => void;
  clearMessages: () => void;
  addXP: (points: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: { name: 'Alex Chen', email: 'alex@example.com' },
  stats: defaultStats,
  interviewConfig: null,
  messages: [],
  currentFeedback: null,
  isInterviewActive: false,
  login: (name, email) => set({ user: { name, email } }),
  logout: () => set({ user: null }),
  setInterviewConfig: (config) => set({ interviewConfig: config }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setFeedback: (fb) => set({ currentFeedback: fb }),
  startInterview: () => set({ isInterviewActive: true, messages: [] }),
  endInterview: () => set({ isInterviewActive: false }),
  clearMessages: () => set({ messages: [] }),
  addXP: (points) => set((s) => ({
    stats: { ...s.stats, xpPoints: s.stats.xpPoints + points },
  })),
}));
