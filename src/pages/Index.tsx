import AppLayout from "@/components/AppLayout";
import HeroSlider from "@/components/HeroSlider";
import ServiceCard from "@/components/ServiceCard";
import { FileText, Presentation, BookOpen, Briefcase, Star, Users, TrendingUp, Send } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const services = [
    {
      icon: FileText,
      title: "بحوث التخرج",
      description: "بحوث تخرج متخصصة وجاهزة للتحليلات المرضية بأعلى معايير الجودة",
      link: "/research",
      gradient: "from-primary to-primary-glow",
    },
    {
      icon: Presentation,
      title: "السمنارات",
      description: "عروض تقديمية احترافية شاملة لجميع التخصصات الطبية",
      link: "/seminars",
      gradient: "from-secondary to-accent",
    },
    {
      icon: BookOpen,
      title: "ملفات مجانية",
      description: "مراجع ومقالات علمية متاحة للتحميل المجاني",
      link: "/free-resources",
      gradient: "from-accent to-primary",
    },
    {
      icon: Briefcase,
      title: "أعمالي السابقة",
      description: "تصفح معرض الأعمال والمشاريع المنجزة",
      link: "/my-works",
      gradient: "from-primary to-secondary",
    },
  ];

  const stats = [
    { icon: Star, value: "500+", label: "بحث مكتمل" },
    { icon: Users, value: "1000+", label: "طالب راضٍ" },
    { icon: FileText, value: "200+", label: "ملف مجاني" },
  ];

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        {/* Hero Section */}
        <HeroSlider />

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border text-center animate-fade-in hover:shadow-lg transition-shadow"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="inline-block p-3 rounded-full bg-gradient-to-br from-primary to-secondary mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
        </div>

        {/* Services Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">الخدمات المتاحة</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-3xl bg-gradient-to-br from-primary to-secondary p-12 text-center text-white animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              هل تحتاج مساعدة في مشروعك؟
            </h2>
            <p className="text-xl mb-8 text-white/90">
              تواصل معنا الآن وسنساعدك في تحقيق أهدافك الأكاديمية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://t.me/Univers_research"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-colors"
              >
                تواصل عبر تيليجرام
              </a>
              <a
                href="https://t.me/Graduation_research0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-colors border border-white/30"
              >
                انضم للقناة
              </a>
            </div>
          </div>
        </div>

        {/* Developer Credit Section */}
        <div className="flex justify-center items-center py-8">
          <a
            href="https://t.me/Aoopuy"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 hover:border-primary/40 transition-all duration-500 overflow-hidden hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] hover:scale-105"
          >
            {/* Animated background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            {/* Glowing orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-2 bg-gradient-to-br from-primary to-secondary rounded-xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                  <Send className="h-5 w-5 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors duration-300">
                  Developed by
                </span>
                <span className="text-lg font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent group-hover:from-secondary group-hover:via-primary group-hover:to-secondary transition-all duration-500">
                  Aoopuy
                </span>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
              </div>
            </div>
          </a>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
