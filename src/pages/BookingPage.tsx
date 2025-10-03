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
    notes: ""
  });
  useEffect(() => {
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
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
      const {
        data: orderResult,
        error: insertError
      } = await supabase.from('orders').insert({
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
  return <AppLayout>
      <PageHeader icon={ClipboardList} title="حجز خدمة جديدة" description="املأ النموذج أدناه لحجز بحث أو سمنار أو تقرير" gradient="from-primary to-secondary" />

      <div className="p-8">
        <Card className="max-w-3xl mx-auto p-8">
          {orderSuccess ? <div className="space-y-6 py-8">
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
              </div>

              <div className="text-center pt-6 space-y-4">
                <Button 
                  onClick={() => navigate('/payment-info')} 
                  className="w-full max-w-md bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12 text-lg"
                >
                  أكمل عملية الدفع
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/my-orders')} 
                  className="w-full max-w-md"
                >
                  عرض طلباتي
                </Button>
              </div>
            </div> : <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">الاسم الكامل *</Label>
                <Input id="fullName" value={formData.fullName} onChange={e => setFormData({
                ...formData,
                fullName: e.target.value
              })} required placeholder="أدخل اسمك الكامل" />
              </div>

              <div>
                <Label htmlFor="phone">رقم الهاتف *</Label>
                <Input id="phone" value={formData.phone} onChange={e => setFormData({
                ...formData,
                phone: e.target.value
              })} required placeholder="+964 7XX XXX XXXX" />
              </div>

              <div>
                <Label htmlFor="university">الجامعة *</Label>
                <Input id="university" value={formData.university} onChange={e => setFormData({
                ...formData,
                university: e.target.value
              })} required placeholder="مثال: جامعة بغداد" />
              </div>

              <div>
                <Label htmlFor="college">الكلية *</Label>
                <Input id="college" value={formData.college} onChange={e => setFormData({
                ...formData,
                college: e.target.value
              })} required placeholder="مثال: كلية الطب" />
              </div>

              <div>
                <Label htmlFor="department">القسم *</Label>
                <Input id="department" value={formData.department} onChange={e => setFormData({
                ...formData,
                department: e.target.value
              })} required placeholder="مثال: التحليلات المرضية" />
              </div>

              <div>
                <Label htmlFor="serviceType">نوع الخدمة *</Label>
                <Select value={formData.serviceType} onValueChange={value => setFormData({
                ...formData,
                serviceType: value
              })} required>
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
                  <Input id="deliveryDate" type="date" value={formData.deliveryDate} onChange={e => setFormData({
                  ...formData,
                  deliveryDate: e.target.value
                })} required className="pr-10" min={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="title">العنوان أو الموضوع *</Label>
              <Textarea id="title" value={formData.title} onChange={e => setFormData({
              ...formData,
              title: e.target.value
            })} required placeholder="اكتب عنوان البحث أو الموضوع المطلوب" rows={3} />
            </div>

            <div>
              <Label htmlFor="notes">ملاحظات إضافية</Label>
              <Textarea id="notes" value={formData.notes} onChange={e => setFormData({
              ...formData,
              notes: e.target.value
            })} placeholder="أي ملاحظات أو متطلبات خاصة..." rows={3} />
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

            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12 text-lg" disabled={loading}>
              {loading ? "جاري الإرسال..." : "إرسال الطلب"}
            </Button>
          </form>}
        </Card>
      </div>
    </AppLayout>;
};
export default BookingPage;