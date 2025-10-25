import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Subject from "./pages/Subject";
import Quiz from "./pages/Quiz";
import Textbooks from "./pages/Textbooks";
import Activities from "./pages/Activities";
import Activity from "./pages/Activity";
import ParentDashboard from "./pages/ParentDashboard";
import LearningPlan from "./pages/LearningPlan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/subjects/:id" element={<Subject />} />
            <Route path="/quiz/:id" element={<Quiz />} />
            <Route path="/textbooks" element={<Textbooks />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/activity/:id" element={<Activity />} />
            <Route path="/parent-dashboard" element={<ParentDashboard />} />
            <Route path="/learning-plan" element={<LearningPlan />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
