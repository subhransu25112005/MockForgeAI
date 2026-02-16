# 🚀 MockForage AI — Smart AI Interview Practice Platform

**MockForage AI** is a modern AI-powered interview preparation platform that simulates real interview experiences with live coaching, analytics, and performance tracking.
It helps students and job seekers practice **technical, HR, and behavioral interviews** with real-time feedback and confidence analysis.

---

## ✨ Key Features

### 🧑‍💻 Core Interview System

* 🔐 User Authentication (Login / Signup)
* 🏠 Landing Page + Protected Dashboard
* 🎯 Role-based interview selection (Frontend, Backend, Full Stack, Data Science, etc.)
* 🧠 AI-style interviewer conversation flow
* ⏱️ Timed interview sessions
* 💬 Chat-style answer interface
* 🧾 Resume-to-Interview Mode (paste resume → generate questions)

---

### 🎥 Media Recording & Analysis

* 📹 **Live Video Recording** during interview
* 🎙️ Microphone input support
* ⌨️ Text-based answering option
* 🟢 Camera preview before recording
* 💾 Recorded media stored locally (can be extended to cloud)

---

### 📊 Confidence & Performance Tracking

* 📈 **Live Confidence Meter**
* ⏱️ Duration tracking
* 🧠 STAR answer structure detection
* 📉 Weekly progress charts
* 🏆 Interview readiness score
* 📊 Performance breakdown (confidence, clarity, completion)

---

### 🎮 Engagement & Gamification

* ⭐ XP points system
* 🔥 Daily practice streaks
* 🏅 Achievement badges
* 🏆 Leaderboard support
* 📅 Interview history tracking

---

### 🤖 Smart Coaching Features

* 🗣️ Real-time speech hints (pace, clarity prompts)
* 🎯 Adaptive difficulty concept ready
* 🧠 Behavioral + Technical question sets
* 💡 Smart feedback generation ready for AI API integration

---

### 🧩 Extra Advanced Features

* 🎥 Confidence detection via camera (visual engagement)
* ⏳ Pressure Mode (auto-submit timer)
* 🤖 Floating AI Assistant help widget
* 🌙 Modern neon dark UI
* ⚡ Fast single-page app experience

---

## 🛠️ Tech Stack

### Frontend

* **React + TypeScript**
* **Vite**
* **Tailwind CSS**
* **Framer Motion** (animations)
* **Lucide Icons**

### State & Routing

* React Router
* Zustand / Context Store (app state)

### Browser APIs Used

* MediaDevices API (camera + mic)
* MediaRecorder API (video/audio recording)
* Speech recognition hooks (optional)

### Charts & UI

* Recharts / Custom graphs
* Responsive component layout

### Deployment

* GitHub (source control)
* Vercel / Netlify compatible

---

## 📂 Project Structure

```
src/
 ├── components/
 │    ├── ConfidenceCamera.tsx
 │    ├── FloatingAssistant.tsx
 │    ├── Navbar.tsx
 │    └── UI components
 │
 ├── pages/
 │    ├── Landing.tsx
 │    ├── Login.tsx
 │    ├── Dashboard.tsx
 │    ├── InterviewSetup.tsx
 │    ├── InterviewSession.tsx
 │    ├── Results.tsx
 │    └── ResumeMode.tsx
 │
 ├── store/
 └── main.tsx
```

---

## ▶️ Run Locally

### 1️⃣ Clone repo

```
git clone <your-repo-url>
cd mockforage-ai
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Start development server

```
npm run dev
```

App runs at:

```
 Local:   http://localhost:8081/
Network: http://10.173.227.155:8081/
```

---

## 🔒 Permissions Required

Browser will request:

* Camera access (video recording & confidence detection)
* Microphone access (audio recording)

Allow both for full functionality.

---

## 🚀 Future Enhancements (Optional)

* AI LLM integration for real question generation
* Cloud video storage (Firebase / Supabase)
* Facial emotion detection model
* Voice tone confidence scoring
* Company-specific interview datasets
* Mobile app version

---

## 👨‍💻 Author

Submitted By: Team SrijanByte
Built for HackFest / Academic Project

---

## 📜 License

Educational / Demo project — free to modify.

---

### ⭐ If you like this project, give it a star on GitHub!
