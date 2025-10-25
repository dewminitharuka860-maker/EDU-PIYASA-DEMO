import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Puzzle, Star } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  title_si: string;
  description: string | null;
  description_si: string | null;
  grade: number;
  activity_type: string;
  points: number;
}

const Activities = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("grade", { ascending: true })
      .order("title", { ascending: true });

    if (error) {
      console.error("Error fetching activities:", error);
      setLoading(false);
      return;
    }

    setActivities(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Puzzle className="w-10 h-10 text-primary" />
            {t('activities.title')}
          </h1>
          <p className="text-muted-foreground text-lg">
            {language === 'si' ? 'ඇදගෙන දමා ගැලපීමේ ක්‍රියාකාරකම්' : 'Interactive drag and drop matching activities'}
          </p>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-12">
            <Puzzle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">{t('activities.noActivities')}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/activity/${activity.id}`)}>
                <CardHeader className="gradient-primary text-white">
                  <CardTitle className="flex items-center justify-between">
                    <span>{language === 'si' ? activity.title_si : activity.title}</span>
                    <Star className="w-5 h-5" />
                  </CardTitle>
                  <CardDescription className="text-white/90">
                    {t('textbooks.grade')} {activity.grade} • {activity.points} {t('dashboard.points')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === 'si' ? activity.description_si : activity.description}
                  </p>
                  <Button className="w-full">
                    {t('activities.startActivity')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
