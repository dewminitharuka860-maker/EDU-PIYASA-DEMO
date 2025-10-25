import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Brain, Clock, HelpCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuizCardProps {
  quiz: {
    id: string;
    title: string;
    title_si: string;
    description?: string;
    description_si?: string;
    time_limit: number;
    points_per_question: number;
  };
  questionCount: number;
}

const QuizCard = ({ quiz, questionCount }: QuizCardProps) => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  
  const title = language === 'si' ? quiz.title_si : quiz.title;
  const description = language === 'si' ? quiz.description_si : quiz.description;

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white border border-gray-200">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Brain className="w-8 h-8 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
          {description && (
            <p className="text-gray-600 text-sm mb-4">{description}</p>
          )}
          
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>{questionCount} {t('quiz.questions')}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>{quiz.time_limit} {t('quiz.seconds')}</span>
            </div>
          </div>
          
          <Button
            onClick={() => navigate(`/quiz/${quiz.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {t('quiz.playNow')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QuizCard;
