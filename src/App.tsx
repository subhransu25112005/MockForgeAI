import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FloatingAssistant from "@/components/FloatingAssistant";
import Dashboard from "@/pages/Dashboard";
import InterviewSetup from "@/pages/InterviewSetup";
import InterviewSession from "@/pages/InterviewSession";
import Results from "@/pages/Results";
import Achievements from "@/pages/Achievements";
import ResumeMode from "@/pages/ResumeMode";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/setup" element={<InterviewSetup />} />
            <Route path="/interview" element={<InterviewSession />} />
            <Route path="/results" element={<Results />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/resume" element={<ResumeMode />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FloatingAssistant />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
