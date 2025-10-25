import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, BookOpen, FileText } from "lucide-react";
import { toast } from "sonner";

interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Textbook {
  id: string;
  title: string;
  title_si: string;
  subject_id: string | null;
  subjects?: Subject;
  grade: number;
  medium: string;
  pdf_url: string;
  cover_image_url: string | null;
  file_size: string | null;
  description: string | null;
  description_si: string | null;
}

const Textbooks = () => {
  const { t, language } = useLanguage();
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<string>("10");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedMedium, setSelectedMedium] = useState<string>("all");

  useEffect(() => {
    fetchSubjects();
    fetchTextbooks();
  }, []);

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching subjects:", error);
      return;
    }

    setSubjects(data || []);
  };

  const fetchTextbooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("textbooks")
      .select(`
        *,
        subjects (
          id,
          name,
          icon,
          color
        )
      `)
      .order("grade", { ascending: true })
      .order("title", { ascending: true });

    if (error) {
      console.error("Error fetching textbooks:", error);
      toast.error("Failed to load textbooks");
      setLoading(false);
      return;
    }

    setTextbooks(data || []);
    setLoading(false);
  };

  const filteredTextbooks = textbooks.filter((book) => {
    const gradeMatch = book.grade === parseInt(selectedGrade);
    const subjectMatch = selectedSubject === "all" || book.subject_id === selectedSubject;
    const mediumMatch = selectedMedium === "all" || book.medium === selectedMedium;
    return gradeMatch && subjectMatch && mediumMatch;
  });

  const handleDownload = (url: string, title: string) => {
    window.open(url, '_blank');
    toast.success(`Downloading ${title}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <BookOpen className="w-10 h-10 text-primary" />
            {t('textbooks.title')}
          </h1>
          <p className="text-muted-foreground text-lg">
            {language === 'si' ? 'ඔබේ ශ්‍රේණිය සහ විෂයය තෝරා පොත් බාගන්න' : 'Select your grade and subject to download textbooks'}
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
            <SelectTrigger>
              <SelectValue placeholder={t('textbooks.selectGrade')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">{t('textbooks.grade')} 10</SelectItem>
              <SelectItem value="11">{t('textbooks.grade')} 11</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder={t('textbooks.selectSubject')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('textbooks.allSubjects')}</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMedium} onValueChange={setSelectedMedium}>
            <SelectTrigger>
              <SelectValue placeholder={t('textbooks.selectMedium')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('textbooks.allMediums')}</SelectItem>
              <SelectItem value="Sinhala">{t('textbooks.sinhala')}</SelectItem>
              <SelectItem value="English">{t('textbooks.english')}</SelectItem>
              <SelectItem value="Tamil">{t('textbooks.tamil')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredTextbooks.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">{t('textbooks.noBooks')}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTextbooks.map((book) => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {book.cover_image_url && (
                  <div className="h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                    <img
                      src={book.cover_image_url}
                      alt={language === 'si' ? book.title_si : book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-2">
                    <span>{language === 'si' ? book.title_si : book.title}</span>
                    {book.subjects && (
                      <span className="text-sm px-2 py-1 rounded-full" style={{ backgroundColor: `${book.subjects.color}20`, color: book.subjects.color }}>
                        {book.subjects.name}
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {t('textbooks.grade')} {book.grade} • {book.medium}
                    {book.file_size && ` • ${book.file_size}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {language === 'si' ? book.description_si : book.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleDownload(book.pdf_url, language === 'si' ? book.title_si : book.title)}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('textbooks.download')}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Textbooks;
