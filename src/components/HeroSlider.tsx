import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, FileText, Presentation, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    icon: FileText,
    title: "بحوث تخرج احترافية",
    description: "بحوث تخرج جاهزة ومتخصصة للتحليلات المرضية بجودة عالية",
    gradient: "from-primary to-primary-glow",
  },
  {
    icon: Presentation,
    title: "سمنارات طبية شاملة",
    description: "عروض تقديمية احترافية لجميع الأقسام الطبية",
    gradient: "from-secondary to-accent",
  },
  {
    icon: BookOpen,
    title: "ملفات علمية مجانية",
    description: "مراجع ومقالات تعليمية متاحة للجميع",
    gradient: "from-accent to-primary",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-2xl">
      {slides.map((slide, index) => {
        const Icon = slide.icon;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            }`}
          >
            <div className={`h-full bg-gradient-to-br ${slide.gradient} flex items-center justify-center relative overflow-hidden`}>
              {/* Decorative circles */}
              <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
              <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
              
              <div className="container mx-auto px-4 text-center relative z-10">
                <div className="mb-8 inline-block p-6 bg-white/20 backdrop-blur-sm rounded-3xl animate-bounce-in">
                  <Icon className="h-20 w-20 text-white" />
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up">
                  {slide.title}
                </h2>
                <p className="text-xl text-white/90 mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  {slide.description}
                </p>
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 animate-fade-in-up shadow-lg"
                  style={{ animationDelay: "0.4s" }}
                >
                  اكتشف المزيد
                </Button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors text-white"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors text-white"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-8" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
