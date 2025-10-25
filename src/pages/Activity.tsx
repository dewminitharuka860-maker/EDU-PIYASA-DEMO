import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDraggable,
  useDroppable,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ActivityData {
  id: string;
  title: string;
  title_si: string;
  description: string | null;
  description_si: string | null;
  items: {
    pairs: Array<{
      left: string;
      left_si: string;
      right: string;
      right_si: string;
    }>;
  };
  points: number;
}

interface DraggableItemProps {
  id: string;
  text: string;
}

const DraggableItem = ({ id, text }: DraggableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-primary text-white p-4 rounded-lg cursor-move hover:shadow-lg transition-shadow text-center font-medium touch-none"
    >
      {text}
    </div>
  );
};

interface DroppableZoneProps {
  id: string;
  text: string;
  matched: boolean;
  checked: boolean;
}

const DroppableZone = ({ id, text, matched, checked }: DroppableZoneProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`border-2 border-dashed p-4 rounded-lg min-h-[80px] flex items-center justify-center transition-all ${
        isOver ? 'border-primary bg-primary/10 scale-105' : 'border-gray-300'
      } ${
        checked && matched ? 'bg-green-100 border-green-500' : 
        checked && !matched ? 'bg-red-100 border-red-500' : ''
      }`}
    >
      <div className="text-center">
        <p className="font-medium mb-2">{text}</p>
        {checked && (
          matched ? 
            <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto" /> :
            <XCircle className="w-6 h-6 text-red-600 mx-auto" />
        )}
      </div>
    </div>
  );
};

const Activity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const [showIntro, setShowIntro] = useState(true);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    if (id) {
      fetchActivity();
    }
  }, [id]);

  const fetchActivity = async () => {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching activity:", error);
      toast.error("Failed to load activity");
      navigate("/activities");
      return;
    }

    setActivity(data as unknown as ActivityData);
    setLoading(false);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over) {
      setMatches(prev => ({
        ...prev,
        [over.id as string]: active.id as string
      }));
    }
    
    setActiveId(null);
    setChecked(false);
  };

  const checkAnswers = async () => {
    if (!activity) return;

    let correctCount = 0;
    const totalItems = activity.items.pairs.length;

    activity.items.pairs.forEach((pair, index) => {
      const rightId = `right-${index}`;
      const matchedLeftId = matches[rightId];
      
      if (matchedLeftId === `left-${index}`) {
        correctCount++;
      }
    });

    setChecked(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const score = Math.floor((correctCount / totalItems) * activity.points);

      await supabase.from("activity_attempts").insert({
        activity_id: activity.id,
        user_id: user.id,
        score,
        total_items: totalItems,
        correct_matches: correctCount,
        time_taken: timeTaken,
      });

      if (correctCount === totalItems) {
        toast.success(t('activities.complete'));
        
        // Update user points
        const { data: profile } = await supabase
          .from("profiles")
          .select("points")
          .eq("id", user.id)
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({ points: (profile.points || 0) + score })
            .eq("id", user.id);
        }
      } else {
        toast.info(`${t('activities.correctMatches')}: ${correctCount}/${totalItems}`);
      }
    }
  };

  const resetActivity = () => {
    setMatches({});
    setChecked(false);
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

  if (!activity) return null;

  const unmatchedLeftItems = activity.items.pairs
    .map((pair, index) => ({ id: `left-${index}`, text: language === 'si' ? pair.left_si : pair.left }))
    .filter(item => !Object.values(matches).includes(item.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      
      {/* Intro Dialog */}
      <Dialog open={showIntro} onOpenChange={setShowIntro}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {language === 'si' ? 'ආරම්භ කරමු!' : "Let's Get Started!"}
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-4">
              <p className="font-medium">
                {language === 'si' 
                  ? 'මෙම ක්‍රියාකාරකමේ ක්‍රියා කරන ආකාරය:' 
                  : 'How this activity works:'}
              </p>
              <ol className="list-decimal list-inside space-y-2 text-left">
                <li>
                  {language === 'si'
                    ? 'වම් පැත්තේ ඇති අයිතම ඇදගෙන යන්න'
                    : 'Drag items from the left side'}
                </li>
                <li>
                  {language === 'si'
                    ? 'දකුණු පැත්තේ නිවැරදි ගැලපීම මත දමන්න'
                    : 'Drop them on the correct match on the right'}
                </li>
                <li>
                  {language === 'si'
                    ? 'සියලු අයිතම ගැලපූ පසු "පිළිතුරු පරීක්ෂා කරන්න" ක්ලික් කරන්න'
                    : 'Click "Check Answers" when all items are matched'}
                </li>
                <li>
                  {language === 'si'
                    ? 'හරි ගැලපීම් සඳහා ලකුණු උපයන්න! 🎯'
                    : 'Earn points for correct matches! 🎯'}
                </li>
              </ol>
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowIntro(false)} className="w-full">
            {language === 'si' ? 'තේරුණා, ආරම්භ කරමු!' : 'Got it, Start!'}
          </Button>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/activities")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('activities.backToActivities')}
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{language === 'si' ? activity.title_si : activity.title}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowIntro(true)}
              >
                {language === 'si' ? 'උපදෙස්' : 'Help'}
              </Button>
            </CardTitle>
            <CardDescription>
              {language === 'si' ? activity.description_si : activity.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t('activities.instructions')}
            </p>
          </CardContent>
        </Card>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {language === 'si' ? 'ඇදගෙන යන්න' : 'Drag Items'}
              </h3>
              <div className="space-y-3">
                {unmatchedLeftItems.map((item) => (
                  <DraggableItem key={item.id} id={item.id} text={item.text} />
                ))}
                {unmatchedLeftItems.length === 0 && !checked && (
                  <p className="text-center text-muted-foreground py-8">
                    {language === 'si' 
                      ? 'සියලු අයිතම ගැලපීම් කර ඇත! පිළිතුරු පරීක්ෂා කරන්න.' 
                      : 'All items matched! Check your answers.'}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                {language === 'si' ? 'මෙහි දමන්න' : 'Drop Zones'}
              </h3>
              <div className="space-y-3">
                {activity.items.pairs.map((pair, index) => {
                  const rightId = `right-${index}`;
                  const matchedLeftId = matches[rightId];
                  const isCorrect = checked && matchedLeftId === `left-${index}`;
                  
                  return (
                    <DroppableZone
                      key={rightId}
                      id={rightId}
                      text={language === 'si' ? pair.right_si : pair.right}
                      matched={isCorrect}
                      checked={checked}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <DragOverlay>
            {activeId ? (
              <div className="bg-primary text-white p-4 rounded-lg shadow-2xl">
                {unmatchedLeftItems.find(item => item.id === activeId)?.text}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            onClick={checkAnswers}
            size="lg"
            disabled={Object.keys(matches).length !== activity.items.pairs.length}
            className="min-w-[200px]"
          >
            {t('activities.checkAnswers')}
          </Button>
          <Button
            onClick={resetActivity}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            {t('activities.tryAgain')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Activity;
