import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { GraduationCap, Mail, Lock, User, CheckCircle2, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success("تم تسجيل الدخول بنجاح!");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          // Add user role as student
          await supabase.from("user_roles").insert({
            user_id: data.user.id,
            role: "student",
          });
        }

        toast.success("تم إنشاء الحساب بنجاح!");
      }
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ، يرجى المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-start">
        {/* Auth Card */}
        <Card className="w-full p-8 animate-fade-in lg:sticky lg:top-8">
          <div className="flex items-center justify-center mb-8">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-secondary animate-glow">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">
            {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            {isLogin
              ? "مرحباً بك في منصة EduPro"
              : "انضم إلى منصة EduPro الآن"}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="fullName">الاسم الكامل</Label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="pr-10"
                  />
                </div>
              </div>
            )}

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
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pr-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              disabled={loading}
            >
              {loading ? "جاري التحميل..." : isLogin ? "تسجيل الدخول" : "إنشاء الحساب"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin
                ? "ليس لديك حساب؟ إنشاء حساب جديد"
                : "لديك حساب بالفعل؟ تسجيل الدخول"}
            </button>
          </div>
        </Card>

        {/* Instructions Card */}
        <Card className="w-full p-8 bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 animate-fade-in">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 mb-4 animate-bounce-in">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                🔹 طريقة التسجيل
              </h2>
              <p className="text-muted-foreground">اتبع الخطوات البسيطة التالية</p>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {[
                { num: "1", text: 'اختار "إنشاء حساب جديد"', delay: "0" },
                { num: "2", text: 'اكتب أي اسم (مثال: Ahmed)', delay: "100" },
                { num: "3", text: 'اكتب إيميل (مثل ahmed11@gmail.com أو استخدم Gmail موجود)', delay: "200" },
                { num: "4", text: 'اختار رمز سري خاص بيك', delay: "300" },
                { num: "5", text: 'تم التسجيل وتكدر تدخل للمنصة مباشرة ✔️', delay: "400" }
              ].map((step, index) => (
                <div
                  key={index}
                  className="group relative flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-slide-up"
                  style={{ animationDelay: `${step.delay}ms` }}
                >
                  {/* Animated number badge */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold text-lg group-hover:scale-110 transition-transform">
                      {step.num}
                    </div>
                  </div>
                  
                  {/* Step text */}
                  <p className="flex-1 text-foreground pt-2 group-hover:text-primary transition-colors">
                    {step.text}
                  </p>

                  {/* Hover indicator */}
                  <div className="absolute top-1/2 left-0 w-1 h-0 bg-gradient-to-b from-primary to-secondary -translate-y-1/2 group-hover:h-full transition-all duration-300 rounded-r-full" />
                </div>
              ))}
            </div>

            {/* Support Section */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-accent/10 to-secondary/10 border border-accent/20 animate-glow">
              <p className="text-center text-foreground mb-4 font-semibold">
                ❓ ما تعرف كيف تسجل؟
              </p>
              <p className="text-center text-muted-foreground mb-4 text-sm">
                راسل فريق الدعم الفني وبنساعدك
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {/* WhatsApp Button */}
                <a
                  href="https://wa.me/9647753269645"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <MessageCircle className="h-5 w-5 relative z-10" />
                  <span className="relative z-10">واتساب</span>
                </a>

                {/* Telegram Button */}
                <a
                  href="https://t.me/+9647753269645"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <Send className="h-5 w-5 relative z-10" />
                  <span className="relative z-10">تليجرام</span>
                </a>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 animate-float" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/5 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '1s' }} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
