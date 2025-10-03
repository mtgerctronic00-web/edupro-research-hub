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
    <div className="relative h-[350px] md:h-[500px] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl">
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
              <div className="absolute top-10 right-10 md:top-20 md:right-20 w-40 h-40 md:w-72 md:h-72 bg-white/10 rounded-full blur-2xl md:blur-3xl animate-float" />
              <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-52 h-52 md:w-96 md:h-96 bg-white/10 rounded-full blur-2xl md:blur-3xl animate-float" style={{ animationDelay: "1s" }} />
              
              <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
                <div className="mb-4 md:mb-8 inline-block p-4 md:p-6 bg-white/20 backdrop-blur-sm rounded-2xl md:rounded-3xl animate-bounce-in">
                  <Icon className="h-12 w-12 md:h-20 md:w-20 text-white" />
                </div>
                <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold text-white mb-3 md:mb-4 animate-fade-in-up px-2">
                  {slide.title}
                </h2>
                <p className="text-sm md:text-lg lg:text-xl text-white/90 mb-5 md:mb-8 animate-fade-in-up px-4 leading-relaxed" style={{ animationDelay: "0.2s" }}>
                  {slide.description}
                </p>
                <Button
                  size="default"
                  className="bg-white text-primary hover:bg-white/90 animate-fade-in-up shadow-lg h-10 md:h-11 text-sm md:text-base px-6 md:px-8"
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
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors text-white"
      >
        <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors text-white"
      >
        <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-6 md:w-8" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
