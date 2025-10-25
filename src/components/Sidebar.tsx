import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, BookOpen, FileText, MessageCircle } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "courses",
      label: "My Courses",
      icon: BookOpen,
      path: "/textbooks",
    },
    {
      id: "assignments",
      label: "Assignments",
      icon: FileText,
      path: "/activities",
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      path: "/messages",
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path === "/dashboard" && location.pathname === "/") ||
           (path === "/textbooks" && location.pathname.startsWith("/subjects"));
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start px-4 py-3 h-auto text-left ${
                  isActive(item.path)
                    ? "bg-gray-100 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
                onClick={() => navigate(item.path)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
