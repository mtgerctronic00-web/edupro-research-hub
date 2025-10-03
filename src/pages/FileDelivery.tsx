import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, MessageCircle, Send, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FileDelivery = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const fileFormats = [
    {
      icon: FileText,
      title: "Word",
      description: "قابل للتعديل",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: FileText,
      title: "PDF",
      description: "نسخة جاهزة للطباعة",
      color: "from-red-500 to-red-600"
    },
    {
      icon: FileText,
      title: "PowerPoint",
      description: "للسمنارات والعروض التقديمية",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const deliveryMethods = [
    {
      id: "whatsapp",
      icon: MessageCircle,
      title: "واتساب",
      description: "إرسال مباشر للملفات",
      color: "from-green-500 to-green-600",
      link: "https://wa.me/9647733373000"
    },
    {
      id: "telegram",
      icon: Send,
      title: "تليجرام",
      description: "إرسال آمن وسريع",
      color: "from-blue-400 to-blue-500",
      link: "https://t.me/Univers_research"
    }
  ];

  const handleDeliveryMethod = (methodId: string, link: string) => {
    setSelectedMethod(methodId);
    window.open(link, '_blank');
  };

  return (
    <AppLayout>
      <PageHeader
        title="تسليم الملفات"
        description="التسليم يتم فقط على الخاص للحفاظ على خصوصية الطالب"
        icon={Download}
        gradient="from-primary to-secondary"
      />

      <div className="space-y-8 max-w-6xl mx-auto">
        {/* File Formats Section */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Download className="h-6 w-6 text-primary" />
              تفاصيل التسليم
            </CardTitle>
            <CardDescription className="text-base">
              بعد إنجاز البحث / السمنار / التقرير يتم تجهيز الملفات النهائية بصيغ:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fileFormats.map((format, index) => {
                const Icon = format.icon;
                return (
                  <div
                    key={index}
                    className="relative group overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${format.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                    <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                      <div className={`p-4 rounded-full bg-gradient-to-br ${format.color} shadow-lg`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-lg">{format.title}</h3>
                      <p className="text-sm text-muted-foreground">{format.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Methods Section */}
        <Card className="border-secondary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Send className="h-6 w-6 text-secondary" />
              آلية التسليم
            </CardTitle>
            <CardDescription className="text-base">
              التسليم يتم فقط على الخاص للحفاظ على خصوصية الطالب
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {deliveryMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                return (
                  <div
                    key={method.id}
                    className={`relative group overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                      isSelected 
                        ? 'border-primary shadow-xl scale-105' 
                        : 'border-border hover:border-primary/50 hover:shadow-lg'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                    <div className="relative z-10 p-8 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`p-4 rounded-full bg-gradient-to-br ${method.color} shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        {isSelected && (
                          <Badge className="bg-green-500 hover:bg-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            تم الاختيار
                          </Badge>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl mb-2">{method.title}</h3>
                        <p className="text-muted-foreground">{method.description}</p>
                      </div>
                      <Button
                        onClick={() => handleDeliveryMethod(method.id, method.link)}
                        className={`w-full bg-gradient-to-r ${method.color} hover:opacity-90 transition-all duration-300 group-hover:scale-105`}
                      >
                        <Icon className="h-4 w-4 ml-2" />
                        استلام عبر {method.title}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-accent/20 mt-1">
                <Check className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">ضمان الخصوصية</h4>
                <p className="text-muted-foreground leading-relaxed">
                  نحن نحرص على سرية معلوماتك وملفاتك. جميع الملفات يتم إرسالها بشكل خاص ومباشر لك عبر الواتساب أو التليجرام، ولا يتم مشاركتها مع أي طرف ثالث.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default FileDelivery;
