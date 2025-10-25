import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Sparkles, BookOpen, Trophy, Users, Languages, Rocket, Target, Star } from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";
import kidsStudying from "@/assets/kids-studying.jpg";
import learningFun from "@/assets/learning-fun.jpg";
import rewardsImage from "@/assets/rewards.jpg";
import togetherImage from "@/assets/together.jpg";
import stepSignup from "@/assets/step-signup.jpg";
import stepChoose from "@/assets/step-choose.jpg";
import stepEarn from "@/assets/step-earn.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Language Selector - Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full shadow-lg"
            >
              <Languages className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background z-50">
            <DropdownMenuItem 
              onClick={() => setLanguage('en')}
              className={language === 'en' ? 'bg-accent' : ''}
            >
              English
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLanguage('si')}
              className={language === 'si' ? 'bg-accent' : ''}
            >
              සිංහල
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 animate-float">
          <Sparkles className="w-12 h-12 text-primary opacity-50" />
        </div>
        <div className="absolute bottom-20 right-20 animate-bounce-slow">
          <Trophy className="w-12 h-12 text-secondary opacity-50" />
        </div>
        <div className="absolute top-1/3 right-10 animate-wiggle">
          <BookOpen className="w-10 h-10 text-accent opacity-50" />
        </div>

        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center animate-bounce-slow">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold">
                  <span className="text-primary">Edu</span>
                  <span className="text-secondary">Piyasa</span>
                </h1>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                {t('landing.heroTitle')}
              </h2>

              <p className="text-xl text-muted-foreground">
                {t('landing.heroDescription')}
              </p>

              <div className="flex gap-4 flex-wrap">
                <Button 
                  size="lg" 
                  className="gradient-primary text-lg rounded-2xl shadow-lg-colored hover:scale-105 transition-transform"
                  onClick={() => navigate("/auth")}
                >
                  {t('landing.startLearning')}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg rounded-2xl border-2"
                  onClick={() => navigate("/auth")}
                >
                  {t('landing.signIn')}
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-lg-colored animate-float">
                <img 
                  src={heroImage} 
                  alt="Kids learning together"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Images */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 animate-fade-in">
            {t('landing.whyLove')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-12 h-12" />,
                title: t('landing.funLessons'),
                description: t('landing.funLessonsDesc'),
                color: "bg-primary",
                image: learningFun
              },
              {
                icon: <Trophy className="w-12 h-12" />,
                title: t('landing.earnRewards'),
                description: t('landing.earnRewardsDesc'),
                color: "bg-secondary",
                image: rewardsImage
              },
              {
                icon: <Users className="w-12 h-12" />,
                title: t('landing.learnTogether'),
                description: t('landing.learnTogetherDesc'),
                color: "bg-accent",
                image: togetherImage
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="bg-card rounded-3xl overflow-hidden shadow-lg-colored hover:scale-105 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-lg">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 gradient-fun relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 animate-bounce-slow">
            <Star className="w-24 h-24 text-white" />
          </div>
          <div className="absolute bottom-10 right-10 animate-float">
            <Trophy className="w-32 h-32 text-white" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center text-white mb-12 animate-fade-in">
            {t('landing.stats')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: "10,000+", label: t('landing.students'), icon: <Users className="w-10 h-10" /> },
              { number: "500+", label: t('landing.lessons'), icon: <BookOpen className="w-10 h-10" /> },
              { number: "50,000+", label: t('landing.rewards'), icon: <Trophy className="w-10 h-10" /> }
            ].map((stat, i) => (
              <div 
                key={i}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex justify-center mb-4 text-white">
                  {stat.icon}
                </div>
                <div className="text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-xl text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 animate-fade-in">
            {t('landing.howItWorks')}
          </h2>
          <p className="text-xl text-center text-muted-foreground mb-16">
            {t('landing.heroDescription').split('!')[0]}
          </p>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div 
              className="relative text-center animate-fade-in"
              style={{ animationDelay: '0ms' }}
            >
              <div className="mb-6 rounded-2xl overflow-hidden shadow-lg-colored">
                <img 
                  src={stepSignup} 
                  alt="Sign up step"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg-colored text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold mb-3">{t('landing.step1')}</h3>
              <p className="text-muted-foreground text-lg">{t('landing.step1Desc')}</p>
            </div>

            <div 
              className="relative text-center animate-fade-in"
              style={{ animationDelay: '200ms' }}
            >
              <div className="mb-6 rounded-2xl overflow-hidden shadow-lg-colored">
                <img 
                  src={stepChoose} 
                  alt="Choose subject step"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="w-16 h-16 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg-colored text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold mb-3">{t('landing.step2')}</h3>
              <p className="text-muted-foreground text-lg">{t('landing.step2Desc')}</p>
            </div>

            <div 
              className="relative text-center animate-fade-in"
              style={{ animationDelay: '400ms' }}
            >
              <div className="mb-6 rounded-2xl overflow-hidden shadow-lg-colored">
                <img 
                  src={stepEarn} 
                  alt="Learn and earn step"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg-colored text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold mb-3">{t('landing.step3')}</h3>
              <p className="text-muted-foreground text-lg">{t('landing.step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-20 gradient-fun">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
              <img 
                src={kidsStudying} 
                alt="Kids studying together"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-5xl font-bold">
              {t('landing.readyTitle')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('landing.readyDesc')}
            </p>
            <Button 
              size="lg" 
              className="gradient-primary text-xl px-12 py-6 rounded-2xl shadow-lg-colored hover:scale-105 transition-transform"
              onClick={() => navigate("/auth")}
            >
              {t('landing.getStarted')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
