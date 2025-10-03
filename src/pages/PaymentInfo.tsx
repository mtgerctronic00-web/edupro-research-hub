import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreditCard, QrCode, Copy, Check, Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import zaincashQR from "@/assets/zaincash-qr.jpg";

const PaymentInfo = () => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const masterCards = [
    { id: 1, number: "7137432576", label: "ماستر كارد الأولى" },
    { id: 2, number: "7918171195", label: "ماستر كارد الثانية" }
  ];

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("تم نسخ الرقم بنجاح!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AppLayout>
      <PageHeader 
        title="معلومات الدفع"
        description="حسابات الدفع المتاحة لإتمام طلباتك"
        icon={CreditCard}
        gradient="from-green-500 to-emerald-600"
      />

      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Master Cards Section */}
        <Card className="animate-slide-up hover:shadow-2xl transition-all duration-500 group border-2 border-transparent hover:border-primary/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-1.5 md:p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-300">
                <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <CardTitle className="group-hover:text-primary transition-colors duration-300 text-lg md:text-xl">حسابات الماستر كارد</CardTitle>
            </div>
            <CardDescription className="text-sm md:text-base">
              يمكنك الدفع عبر التحويل إلى أحد الحسابات التالية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            {masterCards.map((card, index) => (
              <div
                key={card.id}
                className="group/card relative overflow-hidden rounded-lg md:rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-2 border-primary/20 hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-elegant cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => copyToClipboard(card.number, card.id)}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover/card:translate-x-[100%] transition-transform duration-1000"></div>
                
                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between p-3 md:p-5 gap-2 md:gap-0">
                  <span className="text-base md:text-lg font-semibold text-foreground group-hover/card:text-primary transition-colors duration-300">
                    {card.label}
                  </span>
                  <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-between md:justify-start">
                    <span className="text-lg md:text-2xl font-bold text-primary tracking-wider font-mono group-hover/card:scale-110 transition-transform duration-300">
                      {card.number}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="opacity-100 md:opacity-0 group-hover/card:opacity-100 transition-all duration-300 hover:bg-primary/20 h-8 w-8 md:h-10 md:w-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(card.number, card.id);
                      }}
                    >
                      {copiedId === card.id ? (
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-green-500 animate-bounce-in" />
                      ) : (
                        <Copy className="h-3 w-3 md:h-4 md:w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ZainCash Section */}
        <Card className="animate-slide-up hover:shadow-2xl transition-all duration-500 group border-2 border-transparent hover:border-primary/30" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-1.5 md:p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-300">
                <QrCode className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <CardTitle className="group-hover:text-primary transition-colors duration-300 text-lg md:text-xl">زين كاش</CardTitle>
            </div>
            <CardDescription className="text-sm md:text-base">
              امسح رمز QR للدفع عبر زين كاش
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 md:gap-6">
            <div className="relative group/qr">
              {/* Glow effect */}
              <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-primary via-secondary to-primary rounded-xl md:rounded-2xl blur-lg md:blur-xl opacity-0 group-hover/qr:opacity-40 transition-all duration-700 animate-shimmer"></div>
              
              {/* Border gradient */}
              <div className="absolute -inset-0.5 md:-inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg md:rounded-xl blur opacity-25 group-hover/qr:opacity-75 transition-all duration-500"></div>
              
              {/* QR Code */}
              <div className="relative">
                <img
                  src={zaincashQR}
                  alt="ZainCash QR Code"
                  className="relative w-48 h-48 md:w-72 md:h-72 object-contain rounded-lg md:rounded-xl bg-white p-4 md:p-6 shadow-xl md:shadow-2xl transform group-hover/qr:scale-105 transition-all duration-500 ring-2 ring-primary/20 group-hover/qr:ring-primary/50"
                />
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground text-center max-w-md animate-fade-in px-4">
              استخدم تطبيق زين كاش لمسح الرمز وإتمام الدفع بشكل آمن وسريع
            </p>
          </CardContent>
        </Card>

        {/* Send Payment Receipt */}
        <Card className="animate-slide-up hover:shadow-2xl transition-all duration-500 group border-2 border-transparent hover:border-primary/30" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-1.5 md:p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-300">
                <Send className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <CardTitle className="group-hover:text-primary transition-colors duration-300 text-lg md:text-xl">إرسال وصل الدفع</CardTitle>
            </div>
            <CardDescription className="text-sm md:text-base">
              أرسل صورة وصل الدفع للإدارة لتأكيد طلبك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-accent shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 h-10 md:h-11 text-sm md:text-base">
                  <Send className="h-4 w-4 md:h-5 md:w-5" />
                  إرسال الوصل
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg md:text-xl">اختر طريقة الإرسال</DialogTitle>
                  <DialogDescription className="text-sm md:text-base">
                    اختر التطبيق المفضل لإرسال وصل الدفع
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 md:gap-4 py-4">
                  <a
                    href="https://wa.me/9647753269645"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full gap-2 md:gap-3 bg-green-600 hover:bg-green-700 h-12 md:h-14 text-sm md:text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                      <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
                      إرسال عبر واتساب
                    </Button>
                  </a>
                  <a
                    href="https://t.me/Univers_research"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full gap-2 md:gap-3 bg-blue-600 hover:bg-blue-700 h-12 md:h-14 text-sm md:text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                      <Send className="h-5 w-5 md:h-6 md:w-6" />
                      إرسال عبر تليجرام
                    </Button>
                  </a>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="animate-slide-up bg-gradient-to-br from-accent/30 via-background to-accent/20 hover:shadow-elegant transition-all duration-500 border-2 border-accent/30 hover:border-accent/50" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="text-base md:text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              تعليمات الدفع
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 md:space-y-3">
            {[
              "بعد إتمام الدفع، يرجى إرسال إثبات الدفع إلى الإدارة",
              "احتفظ برقم الطلب لمتابعة حالة طلبك",
              "سيتم مراجعة طلبك خلال 24 ساعة من استلام الدفع",
              "للاستفسارات، تواصل معنا عبر واتساب أو تلغرام"
            ].map((text, index) => (
              <div 
                key={index}
                className="flex items-start gap-2 md:gap-3 p-2 md:p-3 rounded-lg hover:bg-accent/20 transition-all duration-300 group/instruction cursor-default"
                style={{ animationDelay: `${0.4 + index * 0.05}s` }}
              >
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary group-hover/instruction:scale-150 group-hover/instruction:bg-secondary transition-all duration-300 flex-shrink-0"></div>
                <p className="text-xs md:text-sm text-muted-foreground group-hover/instruction:text-foreground transition-colors duration-300">
                  {text}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PaymentInfo;
