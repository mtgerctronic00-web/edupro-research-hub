import { Gift, ClipboardList, CreditCard, FileCheck, RefreshCw, Phone } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const UsageInstructions = () => {
  const steps = [
    {
      icon: Gift,
      number: "1",
      title: "الخدمة المجانية المقدمة",
      description: "بالبداية تقدر تطلب مقدمة مجانية من بحثك أو سمنارك.",
      details: [
        "نرسللك نسخة تجريبية صغيرة حتى توريها للدكتور/الأستاذ",
        "إذا حصلت موافقة، نكمل باقي التفاصيل وياك"
      ],
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: ClipboardList,
      number: "2",
      title: "حجز الخدمة",
      description: "من المنصة اختار نوع الخدمة المناسبة لك.",
      details: [
        "🔹 بحث تخرج",
        "🔹 سمنار (PowerPoint)",
        "🔹 تقرير علمي",
        "عبّي الاستمارة بمعلوماتك واضغط إرسال الطلب"
      ],
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: CreditCard,
      number: "3",
      title: "الدفع وتثبيت الحجز",
      description: "بعد الطلب راح تتحول لصفحة الدفع.",
      details: [
        "💳 ماستر كارد / فيزا",
        "📱 زين كاش",
        "صوّر وصل التحويل وأرسله على واتساب أو تليجرام لتثبيت الحجز"
      ],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: FileCheck,
      number: "4",
      title: "استلام الملفات",
      description: "بعد إنجاز خدمتك راح يوصلك إشعار.",
      details: [
        '✅ "تم إنجاز طلبك بنجاح"',
        "نسلمك الملفات النهائية (Word / PDF / PowerPoint) على الخاص واتس أو تليجرام"
      ],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: RefreshCw,
      number: "5",
      title: "طلب تعديل (إذا تحتاج)",
      description: "إذا الدكتور طلب تعديل، نحن جاهزين.",
      details: [
        "ترجع للمنصة وتدخل على قسم التعديلات",
        "تملي استمارة التعديل (نوع التعديل + التفاصيل)",
        "نكمل التعديل ونسلمك النسخة الجديدة على الخاص"
      ],
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="w-full py-8 md:py-12 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <div className="inline-block p-3 md:p-4 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4 shadow-lg animate-bounce-in">
            <Phone className="h-8 w-8 md:h-10 md:w-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            🎓 EduPro – منصة بحوث التخرج
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            تعليمات الاستخدام - اتبع الخطوات التالية للاستفادة من خدماتنا
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 md:space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card 
                key={index}
                className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl animate-fade-in bg-card/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-4 md:p-6 lg:p-8">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    {/* Number & Icon */}
                    <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-4">
                      <div className="relative">
                        {/* Glow effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                        
                        {/* Icon container */}
                        <div className={`relative p-4 md:p-5 rounded-2xl bg-gradient-to-br ${step.gradient} shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                          <Icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
                        </div>
                      </div>
                      
                      {/* Step number */}
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500`}>
                        <span className="text-2xl md:text-3xl font-bold text-white">{step.number}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3 md:space-y-4">
                      <div>
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text group-hover:from-primary group-hover:to-secondary transition-all duration-500">
                          {step.title}
                        </h3>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      {/* Details */}
                      <div className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <div 
                            key={detailIndex}
                            className="flex items-start gap-3 p-2 md:p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-300 group/item"
                          >
                            <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-br ${step.gradient} mt-2 group-hover/item:scale-150 transition-transform duration-300`} />
                            <p className="text-xs md:text-sm text-foreground/90 flex-1 leading-relaxed">
                              {detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-8 md:mt-12 p-4 md:p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/20 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg">
              <Phone className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg md:text-xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                🌟 ملاحظة مهمة
              </h4>
              <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                كل تعاملات التسليم والتواصل النهائي تكون <span className="font-bold text-primary">خاصة عبر واتساب أو تليجرام</span> لضمان الخصوصية. منصة EduPro مصممة حتى ترتب كل شغلك بخطوات واضحة وسهلة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageInstructions;
