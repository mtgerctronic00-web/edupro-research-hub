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
import { ClipboardList, Upload, Calendar } from "lucide-react";
import { toast } from "sonner";

const BookingPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    university: "",
    college: "",
    department: "",
    serviceType: "",
    title: "",
    deliveryDate: "",
  });

  const [receiptFile, setReceiptFile] = useState<File | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
      
      if (!validTypes.includes(file.type)) {
        toast.error("يرجى رفع صورة أو ملف PDF فقط");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الملف يجب أن يكون أقل من 5 ميجابايت");
        return;
      }

      setReceiptFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !receiptFile) {
      toast.error("يرجى رفع وصل الدفع");
      return;
    }

    setLoading(true);

    try {
      // Upload receipt to storage
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('payment-receipts')
        .upload(fileName, receiptFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-receipts')
        .getPublicUrl(fileName);

      // Insert order
      const { error: insertError } = await supabase.from('orders').insert({
        user_id: user.id,
        full_name: formData.fullName,
        university: formData.university,
        college: formData.college,
        department: formData.department,
        service_type: formData.serviceType as Database["public"]["Enums"]["service_type"],
        title: formData.title,
        delivery_date: formData.deliveryDate,
        payment_receipt_url: publicUrl,
      });

      if (insertError) throw insertError;

      toast.success("تم إرسال طلبك بنجاح! سيتم مراجعته قريباً");
      navigate("/my-orders");
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">الاسم الثلاثي *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  placeholder="أدخل اسمك الثلاثي"
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
              <Label htmlFor="receipt">رفع وصل الدفع (صورة أو PDF) *</Label>
              <div className="mt-2">
                <label
                  htmlFor="receipt"
                  className="flex items-center justify-center w-full h-32 px-4 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {receiptFile
                        ? receiptFile.name
                        : "انقر لرفع الوصل (صورة أو PDF - حد أقصى 5 ميجا)"}
                    </p>
                  </div>
                  <input
                    id="receipt"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12 text-lg"
              disabled={loading}
            >
              {loading ? "جاري الإرسال..." : "إرسال الطلب"}
            </Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default BookingPage;
