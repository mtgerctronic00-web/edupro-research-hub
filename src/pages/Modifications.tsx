import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Edit3, CheckCircle, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";

const Modifications = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    orderId: "",
    modificationType: "",
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
        return;
      }
      fetchOrders();
    };
    checkAuth();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["مكتمل", "مؤكد - جاري التنفيذ"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast({
        title: "حدث خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار تاريخ التسليم",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.from("modifications").insert([
        {
          user_id: user.id,
          order_id: formData.orderId,
          modification_type: formData.modificationType,
          details: formData.details,
          delivery_date: format(date, "yyyy-MM-dd"),
        },
      ]);

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "تم إرسال طلب التعديل بنجاح",
        description: "سيتم مراجعة طلبك والبدء بالعمل عليه قريباً",
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

  const getModificationTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      addition: "إضافة",
      deletion: "حذف",
      rephrasing: "إعادة صياغة",
      formatting: "تنسيق",
    };
    return types[type] || type;
  };

  if (isSubmitted) {
    return (
      <AppLayout>
        <PageHeader 
          title="تم إرسال طلب التعديل" 
          description="طلب التعديل على الخدمة"
          icon={Edit3}
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
                تم استلام طلب التعديل!
              </h2>
              <p className="text-muted-foreground">
                سيقوم فريقنا بمراجعة طلبك والبدء بالعمل على التعديلات المطلوبة
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6">
              <p className="text-sm">
                سيتم إشعارك عند اكتمال التعديلات المطلوبة
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
        title="طلب تعديل" 
        description="اطلب تعديلات على خدمة سابقة"
        icon={Edit3}
        gradient="from-primary to-secondary"
      />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-8 animate-fade-in">
          {orders.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-muted-foreground">
                ليس لديك طلبات مكتملة أو قيد التنفيذ حالياً
              </p>
              <Button onClick={() => navigate("/booking")}>
                احجز خدمة جديدة
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="orderId">الخدمة المراد تعديلها *</Label>
                <Select
                  value={formData.orderId}
                  onValueChange={(value) => setFormData({ ...formData, orderId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((order) => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.service_type} - {order.order_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modificationType">نوع التعديل *</Label>
                <Select
                  value={formData.modificationType}
                  onValueChange={(value) => setFormData({ ...formData, modificationType: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع التعديل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="addition">إضافة</SelectItem>
                    <SelectItem value="deletion">حذف</SelectItem>
                    <SelectItem value="rephrasing">إعادة صياغة</SelectItem>
                    <SelectItem value="formatting">تنسيق</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">تفاصيل التعديل *</Label>
                <Textarea
                  id="details"
                  required
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="اشرح التعديلات المطلوبة بالتفصيل"
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label>موعد التسليم المطلوب *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: ar }) : "اختر التاريخ"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={loading}
              >
                {loading ? "جاري الإرسال..." : "إرسال طلب التعديل"}
                <Edit3 className="h-4 w-4" />
              </Button>
            </form>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default Modifications;