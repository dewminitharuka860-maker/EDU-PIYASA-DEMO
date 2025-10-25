import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Play, CheckCircle, Video, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  video_url?: string;
  pdf_url?: string;
}

const Subject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subject, setSubject] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Fetch subject
      const { data: subjectData } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", id)
        .single();

      if (subjectData) {
        setSubject(subjectData);
      }

      // Fetch lessons
      const { data: lessonsData } = await supabase
        .from("lessons")
        .select("*")
        .eq("subject_id", id)
        .order("order_index");

      if (lessonsData) {
        setLessons(lessonsData);
      }

      setLoading(false);
    };

    fetchData();
  }, [id, navigate]);

  const handleCompleteLesson = async (lessonId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("progress")
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      });

    if (!error) {
      // Update points
      const { data: profile } = await supabase
        .from("profiles")
        .select("points")
        .eq("id", user.id)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({ points: (profile.points || 0) + 10 })
          .eq("id", user.id);
      }

      toast({
        title: "Lesson Completed! 🎉",
        description: "You earned 10 points!",
      });
      
      setDialogOpen(false);
    }
  };

  const handleOpenLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-48 w-full rounded-3xl mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Subject not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Subject Header */}
        <div className={`${subject.color} rounded-3xl p-8 text-white shadow-lg-colored mb-8`}>
          <h1 className="text-4xl font-bold mb-2">{subject.name}</h1>
          <p className="text-xl opacity-90">{subject.description}</p>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            Lessons
          </h2>

          {lessons.length === 0 ? (
            <Card className="shadow-colored">
              <CardContent className="p-12 text-center">
                <p className="text-xl text-muted-foreground">
                  No lessons available yet. Check back soon! 📚
                </p>
              </CardContent>
            </Card>
          ) : (
            lessons.map((lesson, index) => (
              <Card key={lesson.id} className="shadow-colored hover:shadow-lg-colored transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <span className="gradient-primary text-white w-10 h-10 rounded-full flex items-center justify-center text-lg">
                          {index + 1}
                        </span>
                        {lesson.title}
                      </CardTitle>
                      <CardDescription className="text-base mt-2">
                        {lesson.description}
                      </CardDescription>
                      <div className="flex gap-2 mt-2">
                        {lesson.video_url && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg">
                            <Video className="w-3 h-3 inline mr-1" />
                            Video
                          </span>
                        )}
                        {lesson.pdf_url && (
                          <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-lg">
                            <FileText className="w-3 h-3 inline mr-1" />
                            PDF
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button 
                      className="gradient-primary rounded-xl"
                      onClick={() => handleOpenLesson(lesson)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Lesson
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-xl"
                      onClick={() => handleCompleteLesson(lesson.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Lesson Content Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedLesson && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold flex items-center gap-2">
                    <BookOpen className="w-8 h-8 text-primary" />
                    {selectedLesson.title}
                  </DialogTitle>
                  <DialogDescription className="text-lg">
                    {selectedLesson.description}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="mt-6 space-y-6">
                  {/* Lesson Content */}
                  <div className="prose prose-lg max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-primary mb-4" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-secondary mb-3" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-xl font-bold mb-2" {...props} />,
                        p: ({node, ...props}) => <p className="mb-4 text-base leading-relaxed" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                        li: ({node, ...props}) => <li className="ml-4" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-primary" {...props} />,
                      }}
                    >
                      {selectedLesson.content}
                    </ReactMarkdown>
                  </div>

                  {/* Video if available */}
                  {selectedLesson.video_url && (
                    <Card className="shadow-colored">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Video className="w-5 h-5 text-primary" />
                          Lesson Video
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <a 
                          href={selectedLesson.video_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Watch Video 🎬
                        </a>
                      </CardContent>
                    </Card>
                  )}

                  {/* PDF if available */}
                  {selectedLesson.pdf_url && (
                    <Card className="shadow-colored">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-secondary" />
                          Lesson Notes (PDF)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <a 
                          href={selectedLesson.pdf_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-secondary hover:underline"
                        >
                          Download PDF 📄
                        </a>
                      </CardContent>
                    </Card>
                  )}

                  {/* Complete Lesson Button */}
                  <Button 
                    className="w-full gradient-success rounded-xl text-lg py-6"
                    onClick={() => handleCompleteLesson(selectedLesson.id)}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Complete Lesson & Earn 10 Points! 🎉
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Subject;
