import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'si';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'si' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.admin': 'Admin',
    'nav.logout': 'Logout',
    'nav.loggedOut': 'Logged out',
    'nav.seeYou': 'See you next time! 👋',
    
    // Landing Page
    'landing.learnHub': 'EduPiyasa',
    'landing.heroTitle': 'Fun Learning for Bright Kids!',
    'landing.heroDescription': 'A colorful self-learning platform where students can study from home with fun lessons, exciting quizzes, and awesome rewards! 🎉',
    'landing.startLearning': 'Start Learning 🚀',
    'landing.signIn': 'Sign In',
    'landing.whyLove': 'Why Kids Love EduPiyasa! ✨',
    'landing.funLessons': 'Fun Lessons',
    'landing.funLessonsDesc': 'Colorful lessons with videos, games, and interactive content!',
    'landing.earnRewards': 'Earn Rewards',
    'landing.earnRewardsDesc': 'Get points, badges, and stars for completing lessons!',
    'landing.learnTogether': 'Learn Together',
    'landing.learnTogetherDesc': 'Join a community of curious learners just like you!',
    'landing.readyTitle': 'Ready to Start Your Learning Adventure?',
    'landing.readyDesc': 'Join thousands of students learning and having fun every day!',
    'landing.getStarted': 'Get Started Free! 🎯',
    'landing.howItWorks': 'How It Works',
    'landing.step1': 'Sign Up Free',
    'landing.step1Desc': 'Create your account in just 30 seconds!',
    'landing.step2': 'Choose Subject',
    'landing.step2Desc': 'Pick your favorite subjects to learn',
    'landing.step3': 'Learn & Earn',
    'landing.step3Desc': 'Complete lessons and earn amazing rewards!',
    'landing.stats': 'Amazing Results',
    'landing.students': 'Happy Students',
    'landing.lessons': 'Fun Lessons',
    'landing.rewards': 'Rewards Given',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.ready': 'Ready to learn something amazing today?',
    'dashboard.points': 'Points',
    'dashboard.streak': 'Streak',
    'dashboard.days': 'days',
    'dashboard.yourSubjects': 'Your Subjects',
    'dashboard.student': 'Student',
    
    // Quizzes
    'quiz.title': 'Quizzes',
    'quiz.playNow': 'Play Now',
    'quiz.questions': 'Questions',
    'quiz.timeLimit': 'Time Limit',
    'quiz.seconds': 'seconds',
    'quiz.startQuiz': 'Start Quiz',
    'quiz.nextQuestion': 'Next Question',
    'quiz.finishQuiz': 'Finish Quiz',
    'quiz.yourScore': 'Your Score',
    'quiz.correct': 'Correct',
    'quiz.playAgain': 'Play Again',
    'quiz.backToQuizzes': 'Back to Quizzes',
    'quiz.selectAnswer': 'Select an answer',
    
    // Textbooks
    'textbooks.title': 'Textbooks',
    'textbooks.download': 'Download',
    'textbooks.selectGrade': 'Select Grade',
    'textbooks.selectSubject': 'Select Subject',
    'textbooks.selectMedium': 'Select Medium',
    'textbooks.allSubjects': 'All Subjects',
    'textbooks.allMediums': 'All Mediums',
    'textbooks.grade': 'Grade',
    'textbooks.medium': 'Medium',
    'textbooks.fileSize': 'File Size',
    'textbooks.noBooks': 'No textbooks found',
    'textbooks.sinhala': 'Sinhala',
    'textbooks.english': 'English',
    'textbooks.tamil': 'Tamil',
    
    // Activities
    'activities.title': 'Activities',
    'activities.matching': 'Matching',
    'activities.dragDrop': 'Drag & Drop to Match',
    'activities.dropHere': 'Drop here',
    'activities.checkAnswers': 'Check Answers',
    'activities.tryAgain': 'Try Again',
    'activities.complete': 'Activity Complete!',
    'activities.correctMatches': 'Correct Matches',
    'activities.startActivity': 'Start Activity',
    'activities.backToActivities': 'Back to Activities',
    'activities.noActivities': 'No activities found',
    'activities.instructions': 'Drag items from the left and drop them on the correct matches on the right',
  },
  si: {
    // Navbar
    'nav.home': 'මුල් පිටුව',
    'nav.admin': 'පරිපාලක',
    'nav.logout': 'පිටවීම',
    'nav.loggedOut': 'ඔබ පිටව ගියා',
    'nav.seeYou': 'නැවත හමුවෙමු! 👋',
    
    // Landing Page
    'landing.learnHub': 'EduPiyasa',
    'landing.heroTitle': 'දක්ෂ දරුවන් සඳහා විනෝදජනක ඉගෙනීම!',
    'landing.heroDescription': 'විනෝදජනක පාඩම්, උද්යෝගිමත් ප්‍රශ්නාවලි සහ අපූරු ත්‍යාග සමඟ නිවසේ සිට ඉගෙනීමට පාට පාට ස්වයං-ඉගෙනුම් වේදිකාවක්! 🎉',
    'landing.startLearning': 'ඉගෙනීම අරඹමු 🚀',
    'landing.signIn': 'ඇතුල් වන්න',
    'landing.whyLove': 'දරුවන් EduPiyasa වලට ආදරය කරන්නේ ඇයි! ✨',
    'landing.funLessons': 'විනෝදජනක පාඩම්',
    'landing.funLessonsDesc': 'වීඩියෝ, ක්‍රීඩා සහ අන්තර් ක්‍රියාකාරී අන්තර්ගත සමඟ පාට පාට පාඩම්!',
    'landing.earnRewards': 'ත්‍යාග උපයන්න',
    'landing.earnRewardsDesc': 'පාඩම් සම්පූර්ණ කිරීම සඳහා ලකුණු, ලාංඡන සහ තරු ලබා ගන්න!',
    'landing.learnTogether': 'එකට ඉගෙන ගන්න',
    'landing.learnTogetherDesc': 'ඔබ වැනි කුතුහලශීලී ඉගෙන ගන්නන්ගේ ප්‍රජාවකට සම්බන්ධ වන්න!',
    'landing.readyTitle': 'ඔබගේ ඉගෙනුම් වික්‍රමය ආරම්භ කිරීමට සූදානම්ද?',
    'landing.readyDesc': 'සෑම දිනකම ඉගෙන ගෙන විනෝද වන දහස් ගණන් සිසුන් සමඟ එක්වන්න!',
    'landing.getStarted': 'නොමිලේ ආරම්භ කරන්න! 🎯',
    'landing.howItWorks': 'මෙය ක්‍රියා කරන ආකාරය',
    'landing.step1': 'නොමිලේ ලියාපදිංචි වන්න',
    'landing.step1Desc': 'තත්පර 30කින් ඔබේ ගිණුම සාදන්න!',
    'landing.step2': 'විෂයයක් තෝරන්න',
    'landing.step2Desc': 'ඉගෙන ගැනීමට ඔබේ ප්‍රියතම විෂයයන් තෝරන්න',
    'landing.step3': 'ඉගෙන ගෙන උපයන්න',
    'landing.step3Desc': 'පාඩම් සම්පූර්ණ කර අපූරු ත්‍යාග උපයන්න!',
    'landing.stats': 'විශ්මිත ප්‍රතිඵල',
    'landing.students': 'සතුටු සිසුන්',
    'landing.lessons': 'විනෝදජනක පාඩම්',
    'landing.rewards': 'ලබා දුන් ත්‍යාග',
    
    // Dashboard
    'dashboard.welcome': 'නැවත පැමිණීම ගැන සතුටුයි',
    'dashboard.ready': 'අද විශ්මය ජනක දෙයක් ඉගෙන ගන්නට සූදානම්ද?',
    'dashboard.points': 'ලකුණු',
    'dashboard.streak': 'අඛණ්ඩ',
    'dashboard.days': 'දින',
    'dashboard.yourSubjects': 'ඔබගේ විෂයයන්',
    'dashboard.student': 'සිසුවා',
    
    // Quizzes
    'quiz.title': 'ප්‍රශ්නාවලි',
    'quiz.playNow': 'දැන් ක්‍රීඩා කරන්න',
    'quiz.questions': 'ප්‍රශ්න',
    'quiz.timeLimit': 'කාල සීමාව',
    'quiz.seconds': 'තත්පර',
    'quiz.startQuiz': 'ප්‍රශ්නාවලිය ආරම්භ කරන්න',
    'quiz.nextQuestion': 'ඊළඟ ප්‍රශ්නය',
    'quiz.finishQuiz': 'ප්‍රශ්නාවලිය අවසන් කරන්න',
    'quiz.yourScore': 'ඔබගේ ලකුණු',
    'quiz.correct': 'නිවැරදි',
    'quiz.playAgain': 'නැවත ක්‍රීඩා කරන්න',
    'quiz.backToQuizzes': 'ප්‍රශ්නාවලි වෙත ආපසු',
    'quiz.selectAnswer': 'පිළිතුරක් තෝරන්න',
    
    // Textbooks
    'textbooks.title': 'පෙළපොත්',
    'textbooks.download': 'බාගන්න',
    'textbooks.selectGrade': 'ශ්‍රේණිය තෝරන්න',
    'textbooks.selectSubject': 'විෂයය තෝරන්න',
    'textbooks.selectMedium': 'මාධ්‍යය තෝරන්න',
    'textbooks.allSubjects': 'සියලුම විෂයයන්',
    'textbooks.allMediums': 'සියලුම මාධ්‍යය',
    'textbooks.grade': 'ශ්‍රේණිය',
    'textbooks.medium': 'මාධ්‍යය',
    'textbooks.fileSize': 'ගොනු ප්‍රමාණය',
    'textbooks.noBooks': 'පෙළපොත් හමු නොවීය',
    'textbooks.sinhala': 'සිංහල',
    'textbooks.english': 'ඉංග්‍රීසි',
    'textbooks.tamil': 'දෙමළ',
    
    // Activities
    'activities.title': 'ක්‍රියාකාරකම්',
    'activities.matching': 'ගැලපීම',
    'activities.dragDrop': 'ඇදගෙන යා ගැලපීමට දමන්න',
    'activities.dropHere': 'මෙහි දමන්න',
    'activities.checkAnswers': 'පිළිතුරු පරීක්ෂා කරන්න',
    'activities.tryAgain': 'නැවත උත්සාහ කරන්න',
    'activities.complete': 'ක්‍රියාකාරකම සම්පූර්ණයි!',
    'activities.correctMatches': 'නිවැරදි ගැලපීම්',
    'activities.startActivity': 'ක්‍රියාකාරකම ආරම්භ කරන්න',
    'activities.backToActivities': 'ක්‍රියාකාරකම් වෙත ආපසු',
    'activities.noActivities': 'ක්‍රියාකාරකම් හමු නොවීය',
    'activities.instructions': 'වමෙන් අයිතම ඇදගෙන දකුණේ නිවැරදි ගැලපීම් මත දමන්න',
  }
};
