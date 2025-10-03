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
import { Gift, CheckCircle, MessageCircle, Send } from "lucide-react";

const FreeSample = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    university: "",
    serviceType: "",
    topic: "",
    pagesCount: 1,
    details: "",
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

      const { error } = await supabase.from("free_samples").insert([
        {
          user_id: user.id,
          full_name: formData.fullName,
          university: formData.university,
          service_type: formData.serviceType,
          topic: formData.topic,
          pages_count: formData.pagesCount,
          details: formData.details,
        },
      ]);

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "تم إرسال طلبك بنجاح",
        description: "سيتم مراجعة طلبك والرد عليك قريباً",
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

  if (isSubmitted) {
    return (
      <AppLayout>
        <PageHeader 
          title="تم إرسال الطلب" 
          description="طلب العينة المجانية"
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
                تم استلام طلبك بنجاح!
              </h2>
              <p className="text-muted-foreground">
                سيقوم فريقنا بمراجعة طلبك وإعداد العينة المجانية لك
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 space-y-3">
              <h3 className="font-semibold text-lg">الخطوات القادمة:</h3>
              <ul className="text-right space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>سنقوم بإعداد عينة من 1-4 صفحات حسب طلبك</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>يمكنك عرضها على دكتورك للتأكد من الجودة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>إذا أعجبك العمل، يمكنك طلب الخدمة الكاملة المدفوعة</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <a
                href="https://wa.me/9647735777457"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button className="w-full sm:w-auto gap-2">
                  <MessageCircle className="h-4 w-4" />
                  تواصل عبر واتساب
                </Button>
              </a>
              <a
                href="https://t.me/Oo9p"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="outline" className="w-full sm:w-auto gap-2">
                  <Send className="h-4 w-4" />
                  تواصل عبر تليجرام
                </Button>
              </a>
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
        title="خدمة مجانية أولية" 
        description="احصل على عينة مجانية من 1-4 صفحات"
        icon={Gift}
        gradient="from-primary to-secondary"
      />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-8 animate-fade-in">
          <div className="mb-6 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
            <h3 className="font-semibold mb-2 text-lg">عن الخدمة المجانية:</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              نقدم لك عينة مجانية من العمل (1-4 صفحات) لتتمكن من عرضها على دكتورك أو أستاذك والتأكد من جودة العمل قبل طلب الخدمة الكاملة المدفوعة.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">الاسم الكامل *</Label>
              <Input
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="أدخل اسمك الكامل"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">الجامعة *</Label>
              <Input
                id="university"
                required
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                placeholder="أدخل اسم جامعتك"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceType">نوع الخدمة *</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="research">بحث تخرج</SelectItem>
                  <SelectItem value="seminar">سمنار</SelectItem>
                  <SelectItem value="report">تقرير</SelectItem>
                  <SelectItem value="presentation">عرض تقديمي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">عنوان الموضوع *</Label>
              <Input
                id="topic"
                required
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="أدخل عنوان الموضوع"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pagesCount">عدد الصفحات المطلوبة (1-4) *</Label>
              <Input
                id="pagesCount"
                type="number"
                min="1"
                max="4"
                required
                value={formData.pagesCount}
                onChange={(e) => setFormData({ ...formData, pagesCount: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">تفاصيل إضافية</Label>
              <Textarea
                id="details"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="أضف أي تفاصيل إضافية تساعدنا في إعداد العينة"
                rows={4}
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