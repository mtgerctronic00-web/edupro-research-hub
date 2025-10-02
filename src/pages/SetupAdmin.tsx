import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Shield, Mail } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const SetupAdmin = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('make_user_admin', {
        user_email: email
      });

      if (error) throw error;

      toast.success("تم إضافة صلاحيات الأدمن بنجاح! يرجى تسجيل الدخول مرة أخرى");
      setEmail("");
    } catch (error: any) {
      console.error("Error making admin:", error);
      toast.error(error.message || "حدث خطأ، تأكد من البريد الإلكتروني");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500/10 via-orange-500/10 to-yellow-500/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 animate-fade-in">
        <div className="flex items-center justify-center mb-8">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500">
            <Shield className="h-12 w-12 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">
          إضافة صلاحيات أدمن
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          أدخل البريد الإلكتروني للمستخدم المسجل لمنحه صلاحيات الأدمن
        </p>

        <form onSubmit={handleMakeAdmin} className="space-y-6">
          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pr-10"
                dir="ltr"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              يجب أن يكون المستخدم مسجلاً في الموقع أولاً
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90 h-12 text-lg"
            disabled={loading}
          >
            {loading ? "جاري الإضافة..." : "منح صلاحيات الأدمن"}
          </Button>
        </form>

        <div className="mt-8 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <h3 className="font-bold text-yellow-700 mb-2">⚠️ ملاحظة هامة</h3>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
            <li>يجب أن يكون المستخدم مسجلاً في الموقع أولاً</li>
            <li>بعد إضافة الصلاحيات، سجل خروج ثم سجل دخول مرة أخرى</li>
            <li>سيظهر قسم "لوحة الأدمن" في القائمة الجانبية</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-primary hover:underline text-sm">
            العودة للرئيسية
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SetupAdmin;
