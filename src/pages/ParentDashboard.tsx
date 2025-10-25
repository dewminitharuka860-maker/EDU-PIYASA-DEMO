import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Heart, TrendingUp, AlertTriangle, Award, Clock, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";

interface EmotionalData {
  state: string;
  intensity: number;
  created_at: string;
  context: string;
  activity_type: string;
  activity_id: string;
}

interface ProgressData {
  totalPoints: number;
  streakDays: number;
  activitiesCompleted: number;
  quizzesCompleted: number;
  averageScore: number;
  timeSpent: number;
  frustrationEvents: number;
}

const ParentDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [childProfile, setChildProfile] = useState<any>(null);
  const [emotionalData, setEmotionalData] = useState<EmotionalData[]>([]);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    // Check if user is parent/admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "admin" && profile?.role !== "teacher") {
      toast({
        title: "Access Denied",
        description: "This dashboard is for parents and teachers only.",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    fetchData();
  };

  const fetchData = async () => {
    try {
      // Fetch child profiles (simplified - you'd select specific child)
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "student")
        .limit(1)
        .single();

      if (profiles) {
        setChildProfile(profiles);

        // Fetch emotional states
        const { data: emotions } = await supabase
          .from("emotional_states")
          .select("*")
          .eq("user_id", profiles.id)
          .order("created_at", { ascending: false })
          .limit(10);

        setEmotionalData(emotions || []);

        // Fetch progress data
        const { data: activities } = await supabase
          .from("activity_attempts")
          .select("*")
          .eq("user_id", profiles.id);

        const { data: quizzes } = await supabase
          .from("quiz_attempts")
          .select("*")
          .eq("user_id", profiles.id);

        const totalActivities = activities?.length || 0;
        const totalQuizzes = quizzes?.length || 0;
        const avgScore = activities && activities.length > 0
          ? activities.reduce((sum, a) => sum + (a.score || 0), 0) / activities.length
          : 0;

        const frustrationCount = (activities || []).filter(a => a.hints_used > 2).length;

        setProgressData({
          totalPoints: profiles.points || 0,
          streakDays: profiles.streak_days || 0,
          activitiesCompleted: totalActivities,
          quizzesCompleted: totalQuizzes,
          averageScore: Math.round(avgScore),
          timeSpent: activities?.reduce((sum, a) => sum + (a.time_taken || 0), 0) || 0,
          frustrationEvents: frustrationCount,
        });

        // Fetch alerts
        const { data: alertsData } = await supabase
          .from("parental_alerts")
          .select("*")
          .eq("user_id", profiles.id)
          .eq("read", false)
          .order("created_at", { ascending: false });

        setAlerts(alertsData || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getEmotionalColor = (state: string) => {
    const colors: Record<string, string> = {
      frustrated: "bg-red-500",
      engaged: "bg-green-500",
      confused: "bg-yellow-500",
      excited: "bg-blue-500",
      bored: "bg-gray-500",
    };
    return colors[state] || "bg-gray-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Brain className="h-12 w-12 animate-pulse mx-auto mb-4" />
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <Navbar />
      <div className="container mx-auto p-6 pt-24">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Parent Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor {childProfile?.full_name}'s learning journey
          </p>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Alert className="mb-6 border-orange-500">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You have {alerts.length} new alert(s) requiring attention.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="emotional">Emotional State</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{progressData?.totalPoints}</div>
                  <p className="text-xs text-muted-foreground">
                    {progressData?.streakDays} day streak
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Activities</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{progressData?.activitiesCompleted}</div>
                  <p className="text-xs text-muted-foreground">
                    Avg score: {progressData?.averageScore}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round((progressData?.timeSpent || 0) / 60)}m
                  </div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Frustration Events</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{progressData?.frustrationEvents}</div>
                  <p className="text-xs text-muted-foreground">Needs support</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="emotional" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Recent Emotional States
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {emotionalData.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No emotional data recorded yet
                  </p>
                ) : (
                  emotionalData.map((emotion, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${getEmotionalColor(emotion.state)}`} />
                        <div>
                          <p className="font-medium capitalize">{emotion.state}</p>
                          <p className="text-sm text-muted-foreground">{emotion.context}</p>
                        </div>
                      </div>
                      <Badge variant="outline">Intensity: {emotion.intensity}/10</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            {alerts.map((alert) => (
              <Alert key={alert.id} className={alert.severity === "high" ? "border-red-500" : ""}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex justify-between items-center">
                  <span>{alert.message}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      await supabase
                        .from("parental_alerts")
                        .update({ read: true })
                        .eq("id", alert.id);
                      fetchData();
                    }}
                  >
                    Mark as Read
                  </Button>
                </AlertDescription>
              </Alert>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParentDashboard;