import AppLayout from "@/components/AppLayout";
import HeroSlider from "@/components/HeroSlider";
import UsageInstructions from "@/components/UsageInstructions";
import StudentStats from "@/components/StudentStats";
import ServiceCard from "@/components/ServiceCard";
import { FileText, Presentation, BookOpen, Briefcase, TrendingUp, Languages, Sparkles, ArrowLeft } from "lucide-react";
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

  return (
    <AppLayout>
      <div className="space-y-0">
        {/* Hero Section */}
        <HeroSlider />

        {/* PDF Translation Banner - NEW */}
        <div className="p-4 md:p-6 lg:p-8">
          <Link to="/pdf-translation" className="block group">
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-6 md:p-8 lg:p-10 shadow-2xl hover:shadow-[0_20px_60px_rgba(147,51,234,0.4)] transition-all duration-500 hover:scale-[1.02] animate-fade-in">
              {/* Animated Background Blobs */}
              <div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 left-0 w-40 h-40 md:w-80 md:h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-75" />
              
              {/* Floating Icons Animation */}
              <div className="absolute top-4 left-4 md:top-8 md:left-8 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-white animate-pulse" />
              </div>
              <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                <Sparkles className="w-6 h-6 md:w-10 md:h-10 text-white animate-pulse delay-100" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Icon & Text */}
                <div className="flex items-center gap-4 md:gap-6 text-center md:text-right">
                  <div className="p-4 md:p-5 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                    <Languages className="w-8 h-8 md:w-12 md:h-12 text-white drop-shadow-lg" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                      <span className="px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs md:text-sm font-bold animate-pulse shadow-lg">
                        🎁 مجاناً
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs md:text-sm font-bold border border-white/30">
                        ✨ جديد
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
                      ترجمة PDF احترافية 🌐
                    </h3>
                    <p className="text-base md:text-lg lg:text-xl text-white/90 font-medium max-w-xl">
                      ترجم ملفاتك من الإنجليزية للعربية بضغطة واحدة - سريع، دقيق، ومجاني تماماً!
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex-shrink-0">
                  <div className="px-6 md:px-8 py-3 md:py-4 rounded-xl bg-white text-purple-600 font-bold text-base md:text-lg shadow-2xl group-hover:shadow-white/50 group-hover:bg-yellow-300 group-hover:text-purple-700 transition-all duration-300 flex items-center gap-2 group-hover:gap-4">
                    <span>جرب الآن</span>
                    <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

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
