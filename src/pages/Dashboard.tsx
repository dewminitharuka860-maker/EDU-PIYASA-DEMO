import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import SubjectCard from "@/components/SubjectCard";
import QuizCard from "@/components/QuizCard";
import ProgressCard from "@/components/ProgressCard";
import ChatBot from "@/components/ChatBot";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Sparkles, Trophy, Flame, Brain, Search, Play, Monitor, BarChart3, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  grade: number;
}

interface Quiz {
  id: string;
  title: string;
  title_si: string;
  description?: string;
  description_si?: string;
  time_limit: number;
  points_per_question: number;
}

interface Profile {
  full_name: string;
  points: number;
  streak_days: number;
  role: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizQuestionCounts, setQuizQuestionCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
        
        // Redirect admins and teachers to admin panel
        if (profileData.role === 'admin' || profileData.role === 'teacher') {
          navigate("/admin");
          return;
        }
      }

      // Fetch subjects for students
      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("*")
        .order("name");

      if (subjectsData) {
        setSubjects(subjectsData);
      }

      // Fetch quizzes
      const { data: quizzesData } = await supabase
        .from("quizzes")
        .select("*")
        .order("created_at", { ascending: false });

      if (quizzesData) {
        setQuizzes(quizzesData);
        
        // Fetch question counts for each quiz
        const counts: Record<string, number> = {};
        for (const quiz of quizzesData) {
          const { count } = await supabase
            .from("quiz_questions")
            .select("*", { count: "exact", head: true })
            .eq("quiz_id", quiz.id);
          counts[quiz.id] = count || 0;
        }
        setQuizQuestionCounts(counts);
      }
      
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-48 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  Welcome, {profile?.full_name?.split(' ')[0] || 'Student'}!
                </h1>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search"
                  className="pl-10 w-80 bg-white border-gray-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Continue Learning Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Continue Learning</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Introduction to Programming</h3>
                  <p className="text-gray-600 mb-4">50% Completed</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Your Courses Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Web Development Course */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Web Development</h3>
                    <p className="text-gray-600 text-sm">75% Completed</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              {/* Data Analysis Course */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Data Analysis</h3>
                    <p className="text-gray-600 text-sm">20% Completed</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>

              {/* Machine Learning Course */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Machine Learning</h3>
                    <p className="text-gray-600 text-sm">40% Completed</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs for Subjects and Quizzes */}
          <Tabs defaultValue="subjects" className="mb-8">
            <TabsList className="grid w-full grid-cols-2 rounded-2xl mb-6 bg-white">
              <TabsTrigger value="subjects" className="text-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                {t('dashboard.yourSubjects')}
              </TabsTrigger>
              <TabsTrigger value="quizzes" className="text-lg">
                <Brain className="w-5 h-5 mr-2" />
                {t('quiz.title')}
              </TabsTrigger>
            </TabsList>

            {/* Subjects Tab */}
            <TabsContent value="subjects">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {subjects.map((subject) => (
                  <SubjectCard key={subject.id} subject={subject} />
                ))}
              </div>
            </TabsContent>

            {/* Quizzes Tab */}
            <TabsContent value="quizzes">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.map((quiz) => (
                  <QuizCard 
                    key={quiz.id} 
                    quiz={quiz} 
                    questionCount={quizQuestionCounts[quiz.id] || 0}
                  />
                ))}
                {quizzes.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-xl text-muted-foreground">No quizzes available yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <ChatBot />
    </div>
  );
};

export default Dashboard;
