import AppLayout from "@/components/AppLayout";
import HeroSlider from "@/components/HeroSlider";
import UsageInstructions from "@/components/UsageInstructions";
import StudentStats from "@/components/StudentStats";
import ServiceCard from "@/components/ServiceCard";
import { FileText, Presentation, BookOpen, Briefcase, TrendingUp } from "lucide-react";

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

  return (
    <AppLayout>
      <div className="space-y-0">
        {/* Hero Section */}
        <HeroSlider />

        {/* Usage Instructions Section */}
        <UsageInstructions />

        {/* Student Statistics Section */}
        <StudentStats />

        <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">

        {/* Services Section */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold">الخدمات المتاحة</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
            {services.map((service, index) => (
              <div key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary to-secondary p-6 md:p-8 lg:p-12 text-center text-white animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white/10 rounded-full blur-2xl md:blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 md:w-80 md:h-80 bg-white/10 rounded-full blur-2xl md:blur-3xl" />
            
          <div className="relative z-10">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 px-2">
              هل تحتاج مساعدة في مشروعك؟
            </h2>
            <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-white/90 px-4">
              تواصل معنا الآن وسنساعدك في تحقيق أهدافك الأكاديمية
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <a
                href="https://t.me/Univers_research"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 md:px-8 py-2.5 md:py-3 bg-white text-primary font-semibold rounded-lg md:rounded-xl hover:bg-white/90 transition-colors text-sm md:text-base"
              >
                تواصل عبر تيليجرام
              </a>
              <a
                href="https://t.me/Graduation_research0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 md:px-8 py-2.5 md:py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg md:rounded-xl hover:bg-white/30 transition-colors border border-white/30 text-sm md:text-base"
              >
                انضم للقناة
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
