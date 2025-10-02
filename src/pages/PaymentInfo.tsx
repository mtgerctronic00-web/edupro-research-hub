import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, QrCode } from "lucide-react";
import zaincashQR from "@/assets/zaincash-qr.jpg";

const PaymentInfo = () => {
  const masterCards = [
    { id: 1, number: "7137432576", label: "ماستر كارد الأولى" },
    { id: 2, number: "7918171195", label: "ماستر كارد الثانية" }
  ];

  return (
    <AppLayout>
      <PageHeader 
        title="معلومات الدفع"
        description="حسابات الدفع المتاحة لإتمام طلباتك"
        icon={CreditCard}
        gradient="from-green-500 to-emerald-600"
      />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Master Cards Section */}
        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-primary" />
              <CardTitle>حسابات الماستر كارد</CardTitle>
            </div>
            <CardDescription>
              يمكنك الدفع عبر التحويل إلى أحد الحسابات التالية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {masterCards.map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 hover:shadow-elegant transition-all duration-300"
              >
                <span className="text-lg font-semibold text-foreground">
                  {card.label}
                </span>
                <span className="text-2xl font-bold text-primary tracking-wider font-mono">
                  {card.number}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ZainCash Section */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <QrCode className="h-6 w-6 text-primary" />
              <CardTitle>زين كاش</CardTitle>
            </div>
            <CardDescription>
              امسح رمز QR للدفع عبر زين كاش
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <img
                src={zaincashQR}
                alt="ZainCash QR Code"
                className="relative w-64 h-64 object-contain rounded-lg bg-white p-4 shadow-lg"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              استخدم تطبيق زين كاش لمسح الرمز وإتمام الدفع
            </p>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="animate-slide-up bg-gradient-to-br from-accent/20 to-background" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="text-lg">تعليمات الدفع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• بعد إتمام الدفع، يرجى إرسال إثبات الدفع إلى الإدارة</p>
            <p>• احتفظ برقم الطلب لمتابعة حالة طلبك</p>
            <p>• سيتم مراجعة طلبك خلال 24 ساعة من استلام الدفع</p>
            <p>• للاستفسارات، تواصل معنا عبر واتساب أو تلغرام</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PaymentInfo;
