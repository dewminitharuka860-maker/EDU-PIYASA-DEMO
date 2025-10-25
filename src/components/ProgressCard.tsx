import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface ProgressCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const ProgressCard = ({ icon, label, value, color }: ProgressCardProps) => {
  return (
    <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`p-2 rounded-xl ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm opacity-80">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
