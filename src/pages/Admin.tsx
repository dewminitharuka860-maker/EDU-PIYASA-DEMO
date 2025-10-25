import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, BookOpen, FileText, Video, Upload, List, Trash2, Edit } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [stats, setStats] = useState({ totalLessons: 0, totalStudents: 0, totalAssignments: 0 });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const isAuthorized = roles?.some(r => r.role === "admin" || r.role === "teacher");
      
      if (!isAuthorized) {
        toast({
          title: "Access Denied",
          description: "You need admin or teacher access.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      setAuthorized(true);

      // Fetch subjects
      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("*")
        .order("name");
      
      if (subjectsData) setSubjects(subjectsData);

      // Fetch lessons
      const { data: lessonsData } = await supabase
        .from("lessons")
        .select("*, subjects(name)")
        .order("created_at", { ascending: false });
      
      if (lessonsData) setLessons(lessonsData);

      // Fetch assignments
      const { data: assignmentsData } = await supabase
        .from("assignments")
        .select("*, subjects(name)")
        .order("created_at", { ascending: false });
      
      if (assignmentsData) setAssignments(assignmentsData);

      // Get stats
      const { count: lessonCount } = await supabase
        .from("lessons")
        .select("*", { count: "exact", head: true });

      const { count: studentCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "student");

      const { count: assignmentCount } = await supabase
        .from("assignments")
        .select("*", { count: "exact", head: true });

      setStats({
        totalLessons: lessonCount || 0,
        totalStudents: studentCount || 0,
        totalAssignments: assignmentCount || 0,
      });
    };

    checkAuth();
  }, [navigate, toast]);

  const fetchLessons = async () => {
    const { data } = await supabase
      .from("lessons")
      .select("*, subjects(name)")
      .order("created_at", { ascending: false });
    
    if (data) setLessons(data);
  };

  const fetchAssignments = async () => {
    const { data } = await supabase
      .from("assignments")
      .select("*, subjects(name)")
      .order("created_at", { ascending: false });
    
    if (data) setAssignments(data);
  };

  const handleCreateLesson = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const subjectId = formData.get("subject_id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const videoUrl = formData.get("video_url") as string;
    const pdfUrl = formData.get("pdf_url") as string;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("lessons")
        .insert({
          subject_id: subjectId,
          title,
          description,
          content,
          video_url: videoUrl || null,
          pdf_url: pdfUrl || null,
          created_by: user?.id,
        });

      if (error) throw error;

      toast({
        title: "Lesson Created! 🎉",
        description: "Students can now access this lesson.",
      });
      
      (e.target as HTMLFormElement).reset();
      fetchLessons();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const subjectId = formData.get("assignment_subject_id") as string;
    const title = formData.get("assignment_title") as string;
    const description = formData.get("assignment_description") as string;
    const dueDate = formData.get("due_date") as string;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("assignments")
        .insert({
          subject_id: subjectId,
          title,
          description,
          due_date: dueDate || null,
          created_by: user?.id,
        });

      if (error) throw error;

      toast({
        title: "Assignment Created! 📝",
        description: "Students can now see this assignment.",
      });
      
      (e.target as HTMLFormElement).reset();
      fetchAssignments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    try {
      const { error } = await supabase
        .from("lessons")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Lesson Deleted",
        description: "The lesson has been removed.",
      });
      
      fetchLessons();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    try {
      const { error } = await supabase
        .from("assignments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Assignment Deleted",
        description: "The assignment has been removed.",
      });
      
      fetchAssignments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 gradient-fun rounded-3xl p-8 text-white shadow-lg-colored">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <FileText className="w-10 h-10" />
            Admin Control Panel
          </h1>
          <p className="text-xl opacity-90">Manage lessons, assignments, and system content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="shadow-colored">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 gradient-primary rounded-2xl">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Lessons</p>
                  <p className="text-3xl font-bold">{stats.totalLessons}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-colored">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 gradient-secondary rounded-2xl">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assignments</p>
                  <p className="text-3xl font-bold">{stats.totalAssignments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-colored">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 gradient-success rounded-2xl">
                  <List className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold">{stats.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="create-lesson" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 rounded-2xl">
            <TabsTrigger value="create-lesson">Create Lesson</TabsTrigger>
            <TabsTrigger value="create-assignment">Create Assignment</TabsTrigger>
            <TabsTrigger value="view-lessons">View Lessons</TabsTrigger>
            <TabsTrigger value="view-assignments">View Assignments</TabsTrigger>
          </TabsList>

          {/* Create Lesson Tab */}
          <TabsContent value="create-lesson">
            <Card className="shadow-colored">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-6 h-6" />
                  Create New Lesson
                </CardTitle>
                <CardDescription>Add educational content with videos and PDFs</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateLesson} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject_id">Subject *</Label>
                    <Select name="subject_id" required>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Lesson Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Introduction to Addition"
                        required
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        name="description"
                        placeholder="Learn the basics..."
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Lesson Content (Notes) *</Label>
                    <Textarea
                      id="content"
                      name="content"
                      placeholder="Write detailed lesson notes here..."
                      rows={8}
                      className="rounded-xl"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="video_url">
                        <Video className="w-4 h-4 inline mr-2" />
                        Video URL (YouTube/Drive)
                      </Label>
                      <Input
                        id="video_url"
                        name="video_url"
                        placeholder="https://youtube.com/watch?v=..."
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pdf_url">
                        <Upload className="w-4 h-4 inline mr-2" />
                        PDF URL (Drive/Dropbox)
                      </Label>
                      <Input
                        id="pdf_url"
                        name="pdf_url"
                        placeholder="https://drive.google.com/..."
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full gradient-primary rounded-xl" disabled={loading}>
                    {loading ? "Creating..." : "Create Lesson 📚"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Assignment Tab */}
          <TabsContent value="create-assignment">
            <Card className="shadow-colored">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-6 h-6" />
                  Create New Assignment
                </CardTitle>
                <CardDescription>Add homework and tasks for students</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAssignment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignment_subject_id">Subject *</Label>
                    <Select name="assignment_subject_id" required>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assignment_title">Assignment Title *</Label>
                      <Input
                        id="assignment_title"
                        name="assignment_title"
                        placeholder="Chapter 1 Homework"
                        required
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="due_date">Due Date</Label>
                      <Input
                        id="due_date"
                        name="due_date"
                        type="datetime-local"
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignment_description">Assignment Description *</Label>
                    <Textarea
                      id="assignment_description"
                      name="assignment_description"
                      placeholder="Complete exercises 1-10 from the textbook..."
                      rows={6}
                      className="rounded-xl"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full gradient-secondary rounded-xl" disabled={loading}>
                    {loading ? "Creating..." : "Create Assignment 📝"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* View Lessons Tab */}
          <TabsContent value="view-lessons">
            <Card className="shadow-colored">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="w-6 h-6" />
                  All Lessons ({lessons.length})
                </CardTitle>
                <CardDescription>Manage existing lessons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lessons.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No lessons yet. Create one!</p>
                  ) : (
                    lessons.map((lesson) => (
                      <div key={lesson.id} className="p-4 border rounded-2xl hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{lesson.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {lesson.subjects?.name} • {lesson.description}
                            </p>
                            {lesson.video_url && (
                              <p className="text-xs text-primary mt-1">
                                <Video className="w-3 h-3 inline mr-1" />
                                Video attached
                              </p>
                            )}
                            {lesson.pdf_url && (
                              <p className="text-xs text-secondary mt-1">
                                <Upload className="w-3 h-3 inline mr-1" />
                                PDF attached
                              </p>
                            )}
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="rounded-xl"
                            onClick={() => handleDeleteLesson(lesson.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* View Assignments Tab */}
          <TabsContent value="view-assignments">
            <Card className="shadow-colored">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="w-6 h-6" />
                  All Assignments ({assignments.length})
                </CardTitle>
                <CardDescription>Manage existing assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assignments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No assignments yet. Create one!</p>
                  ) : (
                    assignments.map((assignment) => (
                      <div key={assignment.id} className="p-4 border rounded-2xl hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{assignment.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {assignment.subjects?.name}
                            </p>
                            {assignment.due_date && (
                              <p className="text-xs text-destructive mt-1">
                                Due: {new Date(assignment.due_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="rounded-xl"
                            onClick={() => handleDeleteAssignment(assignment.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
