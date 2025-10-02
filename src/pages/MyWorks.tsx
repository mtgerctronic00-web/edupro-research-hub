import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { Briefcase, Eye, Search, FileText, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Tables } from "@/integrations/supabase/types";

type Order = Tables<"orders">;

const MyWorks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [works, setWorks] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchWorks(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setTimeout(() => {
          if (session?.user) fetchWorks(session.user.id);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchWorks = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          content_files:content_file_id (
            file_url,
            file_name
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'مكتمل')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorks(data || []);
    } catch (error) {
      console.error('Error fetching works:', error);
      toast.error('فشل تحميل الأعمال');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (contentFile: any) => {
    if (contentFile?.file_url) {
      window.open(contentFile.file_url, '_blank');
    } else {
      toast.error('الملف غير متوفر');
    }
  };

  const getServiceTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'research': 'بحث تخرج',
      'seminar': 'سمنار',
      'practical_report': 'تقرير عملي',
      'special_request': 'طلب خاص'
    };
    return types[type] || type;
  };

  const filteredWorks = works.filter((work) =>
    work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    work.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getServiceTypeLabel(work.service_type).includes(searchQuery)
  );

  if (!user) return null;

  return (
    <AppLayout>
      <PageHeader
        icon={Briefcase}
        title="أعمالي السابقة"
        description="معرض الأعمال والمشاريع المنجزة"
        gradient="from-primary to-secondary"
      />
      
      <div className="p-8 space-y-8">
        {/* Search Bar */}
        <div className="animate-fade-in">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث في أعمالك السابقة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 h-14 text-lg rounded-xl"
            />
          </div>
        </div>

        {/* Works Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        ) : filteredWorks.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">
              {searchQuery ? 'لم يتم العثور على نتائج للبحث' : 'لا توجد أعمال مكتملة حالياً'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorks.map((work, index) => (
              <Card
                key={work.id}
                className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                  <div className="flex items-center justify-center h-full">
                    <FileText className="h-24 w-24 text-primary/30" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    رقم الطلب: {work.order_number}
                  </span>
                  <Badge className="absolute bottom-4 right-4 bg-green-500">
                    مكتمل
                  </Badge>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {getServiceTypeLabel(work.service_type)}
                    </Badge>
                    {work.delivery_date && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(work.delivery_date), 'd MMM yyyy', { locale: ar })}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {work.title}
                  </h3>

                  {work.notes && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {work.notes}
                    </p>
                  )}

                  <Button
                    variant="outline"
                    className="w-full group-hover:border-primary group-hover:text-primary transition-colors"
                    onClick={() => handleView((work as any).content_files)}
                    disabled={!(work as any).content_files?.file_url}
                  >
                    <Eye className="h-4 w-4 ml-2" />
                    {(work as any).content_files?.file_url ? 'معاينة العمل' : 'الملف غير متوفر'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MyWorks;
