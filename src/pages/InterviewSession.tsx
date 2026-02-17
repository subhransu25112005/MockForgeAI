import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import {
  Mic, MicOff, Send, Video, VideoOff,
  StopCircle, Gauge, Brain, Clock,
  AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';
import ConfidenceCamera from "@/components/ConfidenceCamera";

/* ---------------- DATA ---------------- */

const simulatedQuestions = [
  "Tell me about yourself and your experience.",
  "Can you explain a challenging project you worked on recently?",
  "How would you design a URL shortener system?",
  "What's the difference between SQL and NoSQL databases?",
  "Describe a time you dealt with a difficult teammate.",
  "How do you handle tight deadlines?",
];

const PRESSURE_TIME = 120;

/* ---------------- STAR CHECK ---------------- */

const detectSTAR = (text: string) => {
  const lower = text.toLowerCase();
  const situation = /situation|context|background|when i was/i.test(lower);
  const task = /task|goal|objective|i needed/i.test(lower);
  const action = /action|i did|implemented|built|created/i.test(lower);
  const result = /result|outcome|impact|achieved|improved/i.test(lower);
  return { situation, task, action, result, complete: situation && task && action && result };
};

/* ================================================= */

const InterviewSession = () => {

  const navigate = useNavigate();

  const {
    interviewConfig,
    addMessage,
    messages,
    endInterview,
    updateStatsAfterInterview,   // ✅ IMPORTANT
    addXP,
    interviewHistory,
    addToHistory
  } = useAppStore();

  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [confidence, setConfidence] = useState(65);
  const [elapsed, setElapsed] = useState(0);
  const [pressureTimer, setPressureTimer] = useState(PRESSURE_TIME);

  const [videoOn, setVideoOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isPressure = interviewConfig?.pressureMode ?? false;

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  /* ---------------- PRESSURE MODE ---------------- */

  useEffect(() => {
    if (!isPressure) return;
    const t = setInterval(() => {
      setPressureTimer(prev => {
        if (prev <= 1) {
          if (input.trim()) sendMessage();
          return PRESSURE_TIME;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isPressure, input]);

  /* ---------------- INITIAL QUESTION ---------------- */

  useEffect(() => {
    if (messages.length === 0) {
      const greeting =
        interviewConfig
          ? `Hello! I'm your ${interviewConfig.personality} interviewer for ${interviewConfig.role} at ${interviewConfig.company}.\n\n${simulatedQuestions[0]}`
          : `Hello! Let's begin.\n\n${simulatedQuestions[0]}`;

      addMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: greeting,
        timestamp: Date.now()
      });
    }
  }, []);

  /* ---------------- SCROLL ---------------- */

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  /* ---------------- CAMERA ---------------- */

  const toggleVideo = async () => {
    if (videoOn) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(t => t.stop());
      setVideoOn(false);
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setVideoOn(true);
    }
  };

  /* ---------------- MIC ---------------- */

  const toggleMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  /* ---------------- SEND MESSAGE ---------------- */

  const sendMessage = useCallback(() => {

    if (!input.trim()) return;

    const userText = input.trim();

    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: Date.now()
    });

    setInput('');
    setPressureTimer(PRESSURE_TIME);

    const keyPoint =
      userText.length > 50
        ? userText.substring(0, 80) + '...'
        : userText;

    addToHistory(keyPoint);

    setTyping(true);

    const newConfidence =
      Math.min(100, confidence + Math.floor(Math.random() * 8));

    setConfidence(newConfidence);

    setTimeout(() => {

      const nextIdx =
        Math.min(questionIdx + 1, simulatedQuestions.length - 1);

      setQuestionIdx(nextIdx);

      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          `Good answer!\nScore: ${70 + Math.floor(Math.random()*20)}/100\n\n${simulatedQuestions[nextIdx]}`,
        timestamp: Date.now()
      });

      addXP(25);
      setTyping(false);

    }, 1200);

  }, [input, confidence, questionIdx, interviewHistory]);

  /* ---------------- END INTERVIEW (FIXED) ---------------- */

  const handleEnd = () => {

    endInterview();

    // ✅ ONE LINE does EVERYTHING
    updateStatsAfterInterview(confidence);

    navigate('/results');
  };

  const formatTime = (s:number)=>
    `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  const star = detectSTAR(input);

  /* ====================== UI ====================== */

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">

      {/* LEFT PANEL */}
      <div className="lg:w-80 p-4 space-y-4 border-r border-border">

        {/* VIDEO */}
        <div className="glass-card rounded-xl overflow-hidden aspect-video">
          {videoOn
            ? <video ref={videoRef} autoPlay muted className="w-full h-full object-cover"/>
            : <div className="w-full h-full flex items-center justify-center text-muted-foreground">Camera Off</div>
          }
          <button onClick={toggleVideo} className="m-2 p-2 bg-card rounded">
            {videoOn ? <VideoOff/> : <Video/>}
          </button>
        </div>

        {/* METRICS */}
        <div className="glass-card p-4 space-y-2 text-sm">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2"/> Duration
            <span className="ml-auto font-mono">{formatTime(elapsed)}</span>
          </div>

          <div className="flex items-center">
            <Gauge className="w-4 h-4 mr-2"/> Confidence
            <span className="ml-auto text-primary font-semibold">{confidence}%</span>
          </div>

          <div className="w-full bg-secondary h-2 rounded">
            <motion.div
              className="bg-primary h-full rounded"
              animate={{width:`${confidence}%`}}
            />
          </div>

          <div className="flex items-center">
            <Brain className="w-4 h-4 mr-2"/> Question #{questionIdx+1}
          </div>
        </div>

        {/* PRESSURE TIMER */}
        {isPressure &&
          <div className="glass-card p-4 text-center">
            <AlertTriangle className="mx-auto mb-2"/>
            <div className="text-2xl font-mono">{formatTime(pressureTimer)}</div>
          </div>
        }

        {/* STAR */}
        {input.length>20 &&
          <div className="glass-card p-3 text-sm">
            {(['situation','task','action','result'] as const).map(s=>(
              <div key={s} className="flex gap-2">
                {star[s]?<CheckCircle size={14}/>:<XCircle size={14}/>}
                {s}
              </div>
            ))}
          </div>
        }

        <button onClick={handleEnd}
          className="w-full bg-destructive/10 text-destructive py-2 rounded-lg">
          <StopCircle className="inline mr-2"/> End Interview
        </button>

      </div>

      {/* CHAT */}
      <div className="flex-1 flex flex-col">

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(m=>(
            <div key={m.id}
              className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
              <div className={`px-4 py-3 rounded-xl max-w-[80%]
                ${m.role==='user'?'bg-primary text-white':'glass-card'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {typing && <div className="text-sm">AI typing...</div>}
          <div ref={chatEndRef}/>
        </div>

        <div className="p-4 border-t flex gap-2">
          <button onClick={toggleMic} className="p-3 bg-secondary rounded">
            <Mic/>
          </button>

          <textarea
            className="flex-1 bg-secondary rounded px-3 py-2"
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{
              if(e.key==='Enter' && !e.shiftKey){
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <button onClick={sendMessage} className="p-3 bg-primary rounded text-white">
            <Send/>
          </button>
        </div>

      </div>

      <ConfidenceCamera/>

    </div>
  );
};

export default InterviewSession;
