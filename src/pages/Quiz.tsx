import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Trophy, Clock } from "lucide-react";

interface Question {
  id: string;
  question: string;
  question_si: string;
  option_a: string;
  option_a_si: string;
  option_b: string;
  option_b_si: string;
  option_c: string;
  option_c_si: string;
  option_d: string;
  option_d_si: string;
  correct_answer: string;
}

interface Quiz {
  id: string;
  title: string;
  title_si: string;
  time_limit: number;
  points_per_question: number;
}

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const fetchQuizData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: quizData } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", id)
        .single();

      if (quizData) {
        setQuiz(quizData);
        setTimeLeft(quizData.time_limit);
      }

      const { data: questionsData } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", id)
        .order("order_index");

      if (questionsData) {
        setQuestions(questionsData);
      }
    };

    fetchQuizData();
  }, [id, navigate]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && questions.length > 0) {
      handleFinish();
    }
  }, [timeLeft, showResult]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      toast({
        title: t('quiz.selectAnswer'),
        variant: "destructive",
      });
      return;
    }

    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore(score + (quiz?.points_per_question || 10));
      setCorrectAnswers(correctAnswers + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("quiz_attempts").insert({
        quiz_id: id,
        user_id: user.id,
        score: score,
        total_questions: questions.length,
        correct_answers: correctAnswers,
        time_taken: timeTaken,
      });

      // Update user points
      const { data: profile } = await supabase
        .from("profiles")
        .select("points")
        .eq("id", user.id)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({ points: profile.points + score })
          .eq("id", user.id);
      }
    }

    setShowResult(true);
  };

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto p-8 text-center animate-scale-in">
            <Trophy className="w-20 h-20 mx-auto mb-4 text-secondary animate-bounce-slow" />
            <h1 className="text-4xl font-bold mb-4">{t('quiz.yourScore')}</h1>
            <div className="text-6xl font-bold gradient-primary bg-clip-text text-transparent mb-6">
              {score}
            </div>
            <p className="text-xl mb-8">
              {t('quiz.correct')}: {correctAnswers} / {questions.length}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/dashboard")} variant="outline">
                {t('quiz.backToQuizzes')}
              </Button>
              <Button onClick={() => window.location.reload()} className="gradient-primary">
                {t('quiz.playAgain')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const question = language === 'si' ? currentQuestion.question_si : currentQuestion.question;
  const options = [
    { key: 'A', text: language === 'si' ? currentQuestion.option_a_si : currentQuestion.option_a },
    { key: 'B', text: language === 'si' ? currentQuestion.option_b_si : currentQuestion.option_b },
    { key: 'C', text: language === 'si' ? currentQuestion.option_c_si : currentQuestion.option_c },
    { key: 'D', text: language === 'si' ? currentQuestion.option_d_si : currentQuestion.option_d },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{language === 'si' ? quiz.title_si : quiz.title}</h1>
              <p className="text-muted-foreground">
                {t('quiz.questions')} {currentQuestionIndex + 1} / {questions.length}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <Clock className="w-6 h-6 text-secondary" />
              {timeLeft}s
            </div>
          </div>

          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="mb-6" />

          {/* Question Card */}
          <Card className="p-8 mb-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-8">{question}</h2>
            
            <div className="space-y-4">
              {options.map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleAnswerSelect(option.key)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    selectedAnswer === option.key
                      ? 'border-primary bg-primary/10 scale-105'
                      : 'border-border hover:border-primary/50 hover:scale-102'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      selectedAnswer === option.key ? 'bg-primary text-white' : 'bg-muted'
                    }`}>
                      {option.key}
                    </div>
                    <span className="text-lg">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              size="lg"
              className="gradient-primary"
            >
              {currentQuestionIndex === questions.length - 1
                ? t('quiz.finishQuiz')
                : t('quiz.nextQuestion')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
