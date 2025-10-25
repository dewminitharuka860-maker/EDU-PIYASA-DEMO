import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, Trash2, Save, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";

interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
}

const LearningPlan = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [plan, setPlan] = useState({
    title: "",
    description: "",
    weekly_goal: 5,
    daily_goal: 1,
    preferred_subjects: [] as string[],
  });
  const [existingPlan, setExistingPlan] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    fetchData(session.user.id);
  };

  const fetchData = async (userId: string) => {
    try {
      // Fetch subjects
      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("*")
        .order("name");

      setSubjects(subjectsData || []);

      // Fetch existing learning plan
      const { data: planData } = await supabase
        .from("learning_plans")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (planData) {
        setExistingPlan(planData);
        const subjects = planData.preferred_subjects;
        setPlan({
          title: planData.title,
          description: planData.description || "",
          weekly_goal: planData.weekly_goal,
          daily_goal: planData.daily_goal,
          preferred_subjects: Array.isArray(subjects) 
            ? (subjects as string[])
            : [],
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (subjectId: string) => {
    setPlan((prev) => ({
      ...prev,
      preferred_subjects: prev.preferred_subjects.includes(subjectId)
        ? prev.preferred_subjects.filter((id) => id !== subjectId)
        : [...prev.preferred_subjects, subjectId],
    }));
  };

  const savePlan = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      if (existingPlan) {
        const { error } = await supabase
          .from("learning_plans")
          .update(plan)
          .eq("id", existingPlan.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("learning_plans")
          .insert({
            ...plan,
            user_id: session.user.id,
          });

        if (error) throw error;
      }

      toast({
        title: t("Success!"),
        description: t("Your learning plan has been saved"),
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving plan:", error);
      toast({
        title: t("Error"),
        description: t("Failed to save learning plan"),
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Target className="h-12 w-12 animate-pulse mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <Navbar />
      <div className="container mx-auto p-6 pt-24 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-3">
            <Target className="h-10 w-10" />
            {t("My Learning Plan")}
          </h1>
          <p className="text-muted-foreground">
            {t("Create your own personalized learning journey")}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Plan Details")}</CardTitle>
              <CardDescription>
                {t("Give your learning plan a name and description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">{t("Plan Title")}</Label>
                <Input
                  id="title"
                  value={plan.title}
                  onChange={(e) => setPlan({ ...plan, title: e.target.value })}
                  placeholder={t("My Awesome Learning Journey")}
                />
              </div>
              <div>
                <Label htmlFor="description">{t("Description")}</Label>
                <Textarea
                  id="description"
                  value={plan.description}
                  onChange={(e) => setPlan({ ...plan, description: e.target.value })}
                  placeholder={t("What do you want to achieve?")}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t("Goals")}
              </CardTitle>
              <CardDescription>
                {t("Set your daily and weekly learning goals")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="daily">{t("Daily Goal (activities)")}</Label>
                  <Input
                    id="daily"
                    type="number"
                    min="1"
                    value={plan.daily_goal}
                    onChange={(e) => setPlan({ ...plan, daily_goal: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="weekly">{t("Weekly Goal (activities)")}</Label>
                  <Input
                    id="weekly"
                    type="number"
                    min="1"
                    value={plan.weekly_goal}
                    onChange={(e) => setPlan({ ...plan, weekly_goal: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Favorite Subjects")}</CardTitle>
              <CardDescription>
                {t("Select the subjects you want to focus on")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subjects.map((subject) => (
                  <Button
                    key={subject.id}
                    variant={plan.preferred_subjects.includes(subject.id) ? "default" : "outline"}
                    className="justify-start h-auto py-3"
                    onClick={() => toggleSubject(subject.id)}
                  >
                    <span className="text-2xl mr-2">{subject.icon}</span>
                    <span>{subject.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              {t("Cancel")}
            </Button>
            <Button onClick={savePlan} disabled={!plan.title}>
              <Save className="h-4 w-4 mr-2" />
              {t("Save Plan")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPlan;