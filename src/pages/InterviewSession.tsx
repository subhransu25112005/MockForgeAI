import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Mic, MicOff, Send, Video, VideoOff, StopCircle, Gauge, Brain, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const simulatedQuestions = [
  "Tell me about yourself and your experience.",
  "Can you explain a challenging project you worked on recently?",
  "How would you design a URL shortener system?",
  "What's the difference between SQL and NoSQL databases?",
  "Describe a time you dealt with a difficult teammate.",
  "How do you handle tight deadlines?",
];

const speechHints = ['Good pace!', 'Slow down a bit', 'Great clarity!', 'Speak more confidently', 'Nice structure!'];

const PRESSURE_TIME = 120; // 2 minutes per answer

// STAR detection
const detectSTAR = (text: string) => {
  const lower = text.toLowerCase();
  const situation = /situation|context|background|when i was|there was a time/i.test(lower);
  const task = /task|goal|objective|i needed to|i had to|responsible for/i.test(lower);
  const action = /action|i did|i decided|i implemented|i took|i built|i created/i.test(lower);
  const result = /result|outcome|impact|improved|increased|decreased|led to|achieved/i.test(lower);
  return { situation, task, action, result, complete: situation && task && action && result };
};

const InterviewSession = () => {
  const navigate = useNavigate();
  const { interviewConfig, addMessage, messages, endInterview, addXP, interviewHistory, addToHistory } = useAppStore();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [typing, setTyping] = useState(false);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [speechHint, setSpeechHint] = useState('');
  const [confidence, setConfidence] = useState(65);
  const [elapsed, setElapsed] = useState(0);
  const [pressureTimer, setPressureTimer] = useState(PRESSURE_TIME);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const isPressure = interviewConfig?.pressureMode ?? false;

  // General timer
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Pressure mode countdown
  useEffect(() => {
    if (!isPressure) return;
    const t = setInterval(() => {
      setPressureTimer((prev) => {
        if (prev <= 1) {
          // Auto-submit
          if (input.trim()) sendMessage();
          return PRESSURE_TIME;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isPressure, input]);

  // Initial question
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = interviewConfig
        ? `Hello! I'm your ${interviewConfig.personality} interviewer today for the ${interviewConfig.role} position at ${interviewConfig.company}. Let's get started.\n\n${simulatedQuestions[0]}`
        : `Hello! Let's begin your interview practice.\n\n${simulatedQuestions[0]}`;
      addMessage({ id: Date.now().toString(), role: 'assistant', content: greeting, timestamp: Date.now() });
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const toggleVideo = async () => {
    if (videoOn) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((t) => t.stop());
      setVideoOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setVideoOn(true);
      } catch { /* camera denied */ }
    }
  };

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setInput(transcript);
      setSpeechHint(speechHints[Math.floor(Math.random() * speechHints.length)]);
    };
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;
    const userText = input.trim();
    addMessage({ id: Date.now().toString(), role: 'user', content: userText, timestamp: Date.now() });
    setInput('');
    setSpeechHint('');
    setPressureTimer(PRESSURE_TIME);
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); }

    // AI Memory: extract key points
    const keyPoint = userText.length > 50 ? userText.substring(0, 80) + '...' : userText;
    addToHistory(keyPoint);

    // Determine follow-up type
    const followupTypes = ['challenge', 'probe', 'next'] as const;
    const followupType = followupTypes[Math.floor(Math.random() * 3)];

    // Simulate AI response with memory
    setTyping(true);
    setConfidence(Math.min(100, confidence + Math.floor(Math.random() * 8)));
    setTimeout(() => {
      const nextIdx = Math.min(questionIdx + 1, simulatedQuestions.length - 1);
      setQuestionIdx(nextIdx);

      // Build memory-aware response
      let memoryRef = '';
      if (interviewHistory.length > 1) {
        memoryRef = `\n\n💭 Earlier you mentioned: "${interviewHistory[Math.floor(Math.random() * interviewHistory.length)]}" — let's build on that.\n\n`;
      }

      const followupLabels = { challenge: '🔥 Challenge', probe: '🔍 Deep Dive', next: '➡️ Moving On' };
      const feedback = `Good answer! I noticed strong communication skills.\n\nScore: ${70 + Math.floor(Math.random() * 20)}/100\nFollow-up Type: ${followupLabels[followupType]}${memoryRef}\n${simulatedQuestions[nextIdx]}`;

      addMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: feedback, timestamp: Date.now() });
      addXP(25);
      setTyping(false);
    }, 1500 + Math.random() * 1000);
  }, [input, isListening, confidence, questionIdx, interviewHistory]);

  const handleEnd = () => {
    endInterview();
    navigate('/results');
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const star = detectSTAR(input);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="lg:w-80 p-4 space-y-4 border-b lg:border-b-0 lg:border-r border-border flex-shrink-0 overflow-y-auto">
        {/* Video */}
        <div className="glass-card overflow-hidden rounded-xl aspect-video relative">
          {videoOn ? (
            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/50 text-muted-foreground text-sm">Camera Off</div>
          )}
          <div className="absolute bottom-2 right-2 flex gap-1">
            <button onClick={toggleVideo} className="p-1.5 rounded-lg bg-card/80 backdrop-blur text-foreground">
              {videoOn ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="glass-card p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Duration</span>
            <span className="ml-auto font-mono font-semibold text-foreground">{formatTime(elapsed)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Gauge className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Confidence</span>
            <span className="ml-auto font-semibold text-primary">{confidence}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${confidence}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Brain className="w-4 h-4 text-accent" />
            <span className="text-muted-foreground">Q #{questionIdx + 1}</span>
          </div>
        </div>

        {/* Pressure Mode Timer */}
        {isPressure && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`glass-card p-4 text-center ${pressureTimer <= 30 ? 'border-destructive/50' : ''}`}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className={`w-4 h-4 ${pressureTimer <= 30 ? 'text-destructive animate-pulse' : 'text-warning'}`} />
              <span className="text-sm font-semibold text-warning">Pressure Mode</span>
            </div>
            <span className={`text-2xl font-mono font-bold ${pressureTimer <= 30 ? 'text-destructive' : 'text-foreground'}`}>
              {formatTime(pressureTimer)}
            </span>
          </motion.div>
        )}

        {/* STAR Format Coach */}
        {input.length > 20 && (interviewConfig?.type === 'Behavioral' || interviewConfig?.type === 'Mixed' || interviewConfig?.type === 'HR Round') && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">STAR Format</p>
            <div className="space-y-1.5">
              {(['situation', 'task', 'action', 'result'] as const).map((s) => (
                <div key={s} className="flex items-center gap-2 text-sm">
                  {star[s] ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/40" />}
                  <span className={star[s] ? 'text-success font-medium' : 'text-muted-foreground'}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                </div>
              ))}
            </div>
            {!star.complete && <p className="text-xs text-warning mt-2">⚠ STAR structure incomplete</p>}
            {star.complete && <p className="text-xs text-success mt-2">✓ Great STAR structure!</p>}
          </motion.div>
        )}

        {/* Speech Hint */}
        <AnimatePresence>
          {speechHint && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-3 text-center text-sm text-primary font-medium">
              🎤 {speechHint}
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={handleEnd} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition text-sm font-medium">
          <StopCircle className="w-4 h-4" /> End Interview
        </button>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'glass-card text-card-foreground rounded-bl-md'
              }`}>
                {m.content}
              </div>
            </motion.div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="glass-card px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="typing-indicator flex gap-1"><span /><span /><span /></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border flex gap-3 items-end">
          <button
            onClick={toggleMic}
            className={`p-3 rounded-xl transition ${isListening ? 'bg-destructive text-destructive-foreground pulse-glow' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <textarea
            className="flex-1 bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary resize-none max-h-32"
            placeholder="Type your answer..."
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          />
          <button onClick={sendMessage} className="glow-button p-3 rounded-xl">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
