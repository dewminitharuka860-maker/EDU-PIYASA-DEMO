import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Home, Settings, Languages, BookOpen, Puzzle, Target, Users, Search, Bell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const getRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        
        if (data) {
          setRole(data.role);
        }
      }
    };
    getRole();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: t('nav.loggedOut'),
      description: t('nav.seeYou'),
    });
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <div className="w-8 h-8 bg-blue-600 transform rotate-45 flex items-center justify-center">
              <div className="w-4 h-4 bg-white transform -rotate-45"></div>
            </div>
            <span className="text-2xl font-bold text-gray-800">EDUPIYASA</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2"
              onClick={() => navigate("/")}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2"
              onClick={() => navigate("/textbooks")}
            >
              My Courses
            </Button>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            >
              <Search className="w-5 h-5" />
            </Button>
            
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                <Bell className="w-5 h-5" />
              </Button>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                9
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                >
                  <Languages className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white z-50">
                <DropdownMenuItem 
                  onClick={() => setLanguage('en')}
                  className={language === 'en' ? 'bg-blue-50' : ''}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage('si')}
                  className={language === 'si' ? 'bg-blue-50' : ''}
                >
                  සිංහල
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Admin/Teacher Menu */}
            {(role === "admin" || role === "teacher") && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white z-50">
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    Admin Panel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/parent-dashboard")}>
                    Parent Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {!(role === "admin" || role === "teacher") && (
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
