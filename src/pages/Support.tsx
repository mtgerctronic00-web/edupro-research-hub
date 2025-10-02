import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { HeadphonesIcon, MessageCircle, Phone } from "lucide-react";

const Support = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

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

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <PageHeader
        icon={HeadphonesIcon}
        title="الدعم والمساعدة"
        description="تواصل معنا عبر الوسائل التالية"
        gradient="from-primary to-secondary"
      />

      <div className="p-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* واتساب */}
          <a
            href="https://wa.me/964775326XXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <Card className="p-8 hover:shadow-2xl transition-all duration-300 group-hover:scale-105 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-6 rounded-full bg-green-500/20 group-hover:bg-green-500 transition-colors">
                  <svg className="h-16 w-16 text-green-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">واتساب</h3>
                  <p className="text-muted-foreground mb-4">تواصل معنا عبر واتساب للدعم الفوري</p>
                  <div className="flex items-center justify-center gap-2 text-lg font-medium text-green-600 group-hover:text-green-700">
                    <Phone className="h-5 w-5" />
                    <span dir="ltr">+964 775 326 XXXX</span>
                  </div>
                </div>
                <div className="mt-4 px-6 py-3 rounded-lg bg-green-500 group-hover:bg-green-600 text-white font-medium transition-colors">
                  فتح واتساب
                </div>
              </div>
            </Card>
          </a>

          {/* تيليجرام */}
          <a
            href="https://t.me/Univers_research"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <Card className="p-8 hover:shadow-2xl transition-all duration-300 group-hover:scale-105 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-6 rounded-full bg-blue-500/20 group-hover:bg-blue-500 transition-colors">
                  <svg className="h-16 w-16 text-blue-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">تيليجرام</h3>
                  <p className="text-muted-foreground mb-4">انضم لقناتنا على تيليجرام للتواصل المباشر</p>
                  <div className="flex items-center justify-center gap-2 text-lg font-medium text-blue-600 group-hover:text-blue-700">
                    <MessageCircle className="h-5 w-5" />
                    <span>@Univers_research</span>
                  </div>
                </div>
                <div className="mt-4 px-6 py-3 rounded-lg bg-blue-500 group-hover:bg-blue-600 text-white font-medium transition-colors">
                  فتح تيليجرام
                </div>
              </div>
            </Card>
          </a>
        </div>

        {/* معلومات إضافية */}
        <Card className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <HeadphonesIcon className="h-6 w-6 text-primary" />
            معلومات الدعم
          </h3>
          <div className="space-y-3 text-muted-foreground">
            <p className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>فريق الدعم متاح للرد على استفساراتك على مدار الساعة</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>يمكنك إرسال أي استفسارات تتعلق بالطلبات أو الخدمات المتاحة</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>نحن هنا لمساعدتك في أي وقت</span>
            </p>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Support;
