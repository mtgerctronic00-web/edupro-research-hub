import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ClipboardList, Calendar } from "lucide-react";
import { toast } from "sonner";

const BookingPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    university: "",
    college: "",
    department: "",
    serviceType: "",
    title: "",
    deliveryDate: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }

    setLoading(true);

    try {
      // Insert order without receipt
      const { data: orderResult, error: insertError } = await supabase.from('orders').insert({
        user_id: user.id,
        full_name: formData.fullName,
        university: formData.university,
        college: formData.college,
        department: formData.department,
        service_type: formData.serviceType as Database["public"]["Enums"]["service_type"],
        title: formData.title,
        delivery_date: formData.deliveryDate,
        phone: formData.phone,
        notes: formData.notes,
        payment_receipt_url: '',
        status: 'قيد المراجعة'
      }).select('order_number').single();

      if (insertError) throw insertError;

      setOrderNumber(orderResult.order_number || '');
      setOrderSuccess(true);
      toast.success("تم إرسال طلبك بنجاح!");
    } catch (error: any) {
      console.error("Error submitting order:", error);
      toast.error(error.message || "حدث خطأ، يرجى المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <PageHeader
        icon={ClipboardList}
        title="حجز خدمة جديدة"
        description="املأ النموذج أدناه لحجز بحث أو سمنار أو تقرير"
        gradient="from-primary to-secondary"
      />

      <div className="p-8">
        <Card className="max-w-3xl mx-auto p-8">
          {orderSuccess ? (
            <div className="space-y-6 py-8">
              <div className="text-center">
                <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">تم إرسال طلبك بنجاح!</h3>
                <p className="text-xl font-medium text-primary mb-4">
                  رقم الطلب: {orderNumber}
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  الآن أرسل وصل الدفع لتأكيد الطلب
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                <a
                  href={`https://wa.me/9647753269645?text=رقم الطلب: ${orderNumber}%0Aأرسل وصل الدفع`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 p-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  واتساب
                </a>
                <a
                  href="https://t.me/Univers_research"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 p-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  تيليجرام
                </a>
              </div>

              <div className="text-center pt-6 space-y-4">
                <Button
                  onClick={() => navigate('/payment-info')}
                  className="px-8 h-12 text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  إكمال عملية الدفع
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/my-orders')}
                  className="px-8"
                >
                  عرض طلباتي
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">الاسم الكامل *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div>
                <Label htmlFor="phone">رقم الهاتف *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  placeholder="+964 7XX XXX XXXX"
                />
              </div>

              <div>
                <Label htmlFor="university">الجامعة *</Label>
                <Input
                  id="university"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  required
                  placeholder="مثال: جامعة بغداد"
                />
              </div>

              <div>
                <Label htmlFor="college">الكلية *</Label>
                <Input
                  id="college"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  required
                  placeholder="مثال: كلية الطب"
                />
              </div>

              <div>
                <Label htmlFor="department">القسم *</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                  placeholder="مثال: التحليلات المرضية"
                />
              </div>

              <div>
                <Label htmlFor="serviceType">نوع الخدمة *</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="بحث">بحث</SelectItem>
                    <SelectItem value="سمنار">سمنار</SelectItem>
                    <SelectItem value="تقرير">تقرير</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="deliveryDate">موعد التسليم *</Label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    required
                    className="pr-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="title">العنوان أو الموضوع *</Label>
              <Textarea
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="اكتب عنوان البحث أو الموضوع المطلوب"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="notes">ملاحظات إضافية</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="أي ملاحظات أو متطلبات خاصة..."
                rows={3}
              />
            </div>

            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                معلومات الدفع
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                بعد إرسال الطلب، سيظهر رقم الطلب وأزرار لإرسال وصل الدفع
              </p>
              <p className="text-sm font-medium">
                📱 تيليجرام / واتساب: <span dir="ltr">+964 775 326 9645</span>
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12 text-lg"
              disabled={loading}
            >
              {loading ? "جاري الإرسال..." : "إرسال الطلب"}
            </Button>
          </form>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default BookingPage;
