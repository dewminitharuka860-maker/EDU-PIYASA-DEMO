import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface SubjectCardProps {
  subject: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
  };
}

const SubjectCard = ({ subject }: SubjectCardProps) => {
  const navigate = useNavigate();
  
  // Get the icon component dynamically
  const IconComponent = (Icons[subject.icon as keyof typeof Icons] as LucideIcon) || Icons.BookOpen;

  return (
    <Card 
      className="hover:scale-105 transition-transform duration-300 shadow-sm border border-gray-200 cursor-pointer overflow-hidden group bg-white"
      onClick={() => navigate(`/subjects/${subject.id}`)}
    >
      <CardHeader className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg bg-blue-600 group-hover:animate-wiggle">
            <IconComponent className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-gray-800 mb-2">{subject.name}</CardTitle>
        <CardDescription className="text-gray-600 text-sm">{subject.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
          Start Learning 🚀
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubjectCard;
