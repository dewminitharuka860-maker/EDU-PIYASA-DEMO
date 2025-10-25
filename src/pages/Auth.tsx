import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, BookOpen, GraduationCap } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const role = formData.get("role") as string;

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast({
        title: "Account created! 🎉",
        description: "Welcome to LearnHub! Let's start learning.",
      });
      
      // Auto-upgrade admin@learnhub.com to admin role
      if (email === 'admin@learnhub.com') {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('user_roles')
            .insert({ user_id: user.id, role: 'admin' });
        }
      }
      
      navigate("/dashboard");
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

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back! 👋",
        description: "Ready to continue learning?",
      });
      navigate("/dashboard");
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

  return (
    <div className="min-h-screen gradient-fun flex items-center justify-center p-4">
      <div className="absolute top-4 left-4 animate-bounce-slow">
        <Sparkles className="w-8 h-8 text-secondary" />
      </div>
      <div className="absolute bottom-4 right-4 animate-wiggle">
        <BookOpen className="w-8 h-8 text-accent" />
      </div>
      <div className="absolute top-1/4 right-1/4 animate-float">
        <GraduationCap className="w-10 h-10 text-primary" />
      </div>

      <Card className="w-full max-w-md shadow-lg-colored">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 gradient-primary rounded-full flex items-center justify-center animate-bounce-slow">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">LearnHub</CardTitle>
          <CardDescription className="text-lg">Your fun learning adventure starts here! 🚀</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="rounded-xl"
                  />
                </div>
                <Button type="submit" className="w-full gradient-primary rounded-xl" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In 🎯"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    name="fullName"
                    type="text"
                    placeholder="Your Name"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="rounded-xl"
                  />
                </div>
                {/* Hidden field - all signups are students by default */}
                <input type="hidden" name="role" value="student" />
                <Button type="submit" className="w-full gradient-primary rounded-xl" disabled={loading}>
                  {loading ? "Creating account..." : "Start Learning! 🚀"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
