import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { Presentation, Download, Eye, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ContentFile {
  id: string;
  title: string;
  description: string;
  content_type: 'research' | 'seminar' | 'report';
  access_type: 'view_only' | 'free_download' | 'paid_download';
  file_url: string;
  downloads_count: number;
  views_count: number;
  file_name: string;
  file_size: number | null;
  price: number;
}

const Seminars = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [seminars, setSeminars] = useState<ContentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    fetchSeminars();

    return () => subscription.unsubscribe();
  }, []);

  const fetchSeminars = async () => {
    try {
      const { data, error } = await supabase
        .from('content_files')
        .select('*')
        .eq('content_type', 'seminar')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSeminars(data || []);
    } catch (error) {
      console.error('Error fetching seminars:', error);
      toast.error('فشل تحميل السمنارات');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (seminar: ContentFile) => {
    if (!user) {
      toast.error('يرجى تسجيل الدخول للتحميل');
      navigate('/auth');
      return;
    }

    if (seminar.access_type === 'paid_download') {
      toast.info('هذا السمنار متاح للشراء في صفحة المتجر');
      navigate('/shop');
      return;
    }

    if (seminar.access_type === 'view_only') {
      toast.info('هذا السمنار للعرض فقط، يمكنك حجزه من صفحة الحجز');
      navigate('/booking');
      return;
    }

    try {
      await supabase
        .from('content_files')
        .update({ downloads_count: seminar.downloads_count + 1 })
        .eq('id', seminar.id);

      window.open(seminar.file_url, '_blank');
      toast.success('جاري التحميل...');
      fetchSeminars();
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('فشل التحميل');
    }
  };

  const handleView = async (seminar: ContentFile) => {
    try {
      await supabase
        .from('content_files')
        .update({ views_count: seminar.views_count + 1 })
        .eq('id', seminar.id);

      window.open(seminar.file_url, '_blank');
      fetchSeminars();
    } catch (error) {
      console.error('Error viewing file:', error);
    }
  };

  const getAccessTypeLabel = (type: string) => {
    switch (type) {
      case 'view_only': return 'عرض فقط';
      case 'free_download': return 'تحميل مجاني';
      case 'paid_download': return 'مدفوع';
      default: return type;
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'غير معروف';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredSeminars = seminars.filter((seminar) =>
    seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seminar.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <PageHeader
        icon={Presentation}
        title="السمنارات"
        description="عروض تقديمية احترافية شاملة لجميع التخصصات الطبية"
        gradient="from-secondary to-accent"
      />
      
      <div className="p-8 space-y-8">
        {/* Search Bar */}
        <div className="animate-fade-in">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث عن سمنار..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 h-14 text-lg rounded-xl"
            />
          </div>
        </div>

        {/* Seminars Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        ) : filteredSeminars.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <Presentation className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">
              {searchQuery ? 'لم يتم العثور على نتائج للبحث' : 'لا توجد سمنارات متاحة حالياً'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeminars.map((seminar, index) => (
              <Card
                key={seminar.id}
                className="p-6 hover:shadow-lg transition-shadow animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-secondary/10 to-accent/10 group-hover:from-secondary/20 group-hover:to-accent/20 transition-colors">
                    <Presentation className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <Badge className="bg-gradient-to-r from-secondary to-accent text-white mb-2">
                      {getAccessTypeLabel(seminar.access_type)}
                    </Badge>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                      {seminar.title}
                    </h3>
                  </div>
                </div>

                {seminar.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {seminar.description}
                  </p>
                )}

                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <p>الحجم: {formatFileSize(seminar.file_size)}</p>
                  <p className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {seminar.downloads_count} تحميل
                  </p>
                  <p className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {seminar.views_count} مشاهدة
                  </p>
                  {seminar.access_type === 'paid_download' && (
                    <p className="font-bold text-secondary">
                      السعر: {new Intl.NumberFormat('ar-IQ').format(seminar.price)} د.ع
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-secondary to-accent hover:opacity-90"
                    onClick={() => handleDownload(seminar)}
                  >
                    <Download className="h-4 w-4 ml-2" />
                    {seminar.access_type === 'free_download' ? 'تحميل' : 
                     seminar.access_type === 'paid_download' ? 'شراء' : 'حجز'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleView(seminar)}
                  >
                    <Eye className="h-4 w-4 ml-2" />
                    معاينة
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

export default Seminars;
