import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Gift, CheckCircle } from "lucide-react";

const FreeSample = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    serviceType: "",
    details: "",
    contactMethod: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "يجب تسجيل الدخول",
          description: "الرجاء تسجيل الدخول للوصول إلى هذه الصفحة",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.from("free_service_requests").insert([
        {
          user_id: user.id,
          full_name: formData.fullName,
          service_type: formData.serviceType,
          details: formData.details,
          contact_method: formData.contactMethod,
        },
      ]);

      if (error) throw error;

      setIsSubmitted(true);
      
      // إرسال التفاصيل تلقائياً حسب طريقة التواصل المختارة
      const message = generateMessage();
      if (formData.contactMethod === "whatsapp") {
        window.open(`https://wa.me/9647753269645?text=${message}`, '_blank');
      } else if (formData.contactMethod === "telegram") {
        window.open(`https://t.me/Univers_research?text=${message}`, '_blank');
      }

      toast({
        title: "تم إرسال الطلب بنجاح",
        description: "سيتم مراجعة طلبك والتواصل معك قريباً",
      });
    } catch (error: any) {
      toast({
        title: "حدث خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getServiceTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      introduction: "مقدمة بحث",
      abstract: "ملخص بحث",
      chapter: "فصل من بحث",
      conclusion: "خاتمة بحث",
      seminar_intro: "مقدمة سمنار",
      report_intro: "مقدمة تقرير",
    };
    return types[type] || type;
  };

  const generateMessage = () => {
    const message = `🎁 طلب خدمة مجانية

👤 الاسم: ${formData.fullName}
📝 نوع الخدمة المطلوبة: ${getServiceTypeLabel(formData.serviceType)}
📞 التواصل: ${formData.contactMethod === "whatsapp" ? "واتساب" : "تليجرام"}

تفاصيل الطلب:
${formData.details}`;
    
    return encodeURIComponent(message);
  };

  if (isSubmitted) {
    return (
      <AppLayout>
        <PageHeader 
          title="تم إرسال الطلب" 
          description="طلب الخدمة المجانية"
          icon={Gift}
          gradient="from-green-500 to-emerald-600"
        />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto p-8 text-center space-y-6 animate-fade-in">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center animate-scale-in">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                تم استلام طلبك!
              </h2>
              <p className="text-muted-foreground">
                سيقوم فريقنا بمراجعة طلبك والتواصل معك قريباً
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6">
              <p className="text-sm">
                تم إرسال الطلب تلقائياً. سيتم إشعارك عند قبول طلبك
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mt-4"
            >
              العودة للرئيسية
            </Button>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader 
        title="اطلب خدمة مجانية" 
        description="احصل على عينة مجانية من خدماتنا"
        icon={Gift}
        gradient="from-primary to-secondary"
      />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">الاسم الثلاثي *</Label>
              <Input
                type="text"
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="أدخل الاسم الثلاثي"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceType">نوع الخدمة المطلوبة *</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="introduction">مقدمة بحث</SelectItem>
                  <SelectItem value="abstract">ملخص بحث</SelectItem>
                  <SelectItem value="chapter">فصل من بحث</SelectItem>
                  <SelectItem value="conclusion">خاتمة بحث</SelectItem>
                  <SelectItem value="seminar_intro">مقدمة سمنار</SelectItem>
                  <SelectItem value="report_intro">مقدمة تقرير</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactMethod">طريقة التواصل *</Label>
              <Select
                value={formData.contactMethod}
                onValueChange={(value) => setFormData({ ...formData, contactMethod: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر طريقة التواصل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">واتساب</SelectItem>
                  <SelectItem value="telegram">تليجرام</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">تفاصيل الطلب *</Label>
              <Textarea
                id="details"
                required
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="اشرح تفاصيل ما تحتاجه (الموضوع، المجال، أي متطلبات خاصة...)"
                rows={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={loading}
            >
              {loading ? "جاري الإرسال..." : "إرسال الطلب"}
              <Gift className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default FreeSample;