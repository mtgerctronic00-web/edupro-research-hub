import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { BookOpen, Download, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { openInDriveApp } from "@/lib/drive";

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
}

const FreeResources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<ContentFile[]>([]);
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

    fetchFiles();

    return () => subscription.unsubscribe();
  }, []);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('content_files')
        .select('*')
        .eq('access_type', 'free_download')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('فشل تحميل الملفات');
    } finally {
      setLoading(false);
    }
  };

  const convertDriveLink = (url: string) => {
    // Convert Google Drive view link to direct download/preview link
    if (url.includes('drive.google.com/file/d/')) {
      const fileIdMatch = url.match(/\/d\/([^\/]+)/);
      if (fileIdMatch) {
        return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
      }
    }
    return url;
  };

  const handleDownload = async (file: ContentFile) => {
    if (!user) {
      toast.error('يرجى تسجيل الدخول للتحميل');
      navigate('/auth');
      return;
    }

    try {
      await supabase
        .from('content_files')
        .update({ downloads_count: file.downloads_count + 1 })
        .eq('id', file.id);

      openInDriveApp(file.file_url, 'download');
      toast.success('جاري التحميل...');
      fetchFiles();
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('فشل التحميل');
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'research': return 'بحث تخرج';
      case 'seminar': return 'سمنار';
      case 'report': return 'تقرير عملي';
      default: return type;
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'غير معروف';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredResources = files.filter((file) =>
    file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <PageHeader
        icon={BookOpen}
        title="الملفات المجانية"
        description="مراجع ومقالات علمية متاحة للتحميل المجاني"
        gradient="from-accent to-primary"
      />
      
      <div className="p-8 space-y-8">
        {/* Search Bar */}
        <div className="animate-fade-in">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث عن ملف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 h-14 text-lg rounded-xl"
            />
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">
              {searchQuery ? 'لم يتم العثور على نتائج للبحث' : 'لا توجد ملفات مجانية متاحة حالياً'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((file, index) => (
              <Card
                key={file.id}
                className="p-6 hover:shadow-lg transition-shadow animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 group-hover:from-accent/20 group-hover:to-primary/20 transition-colors">
                    <BookOpen className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <Badge className="bg-gradient-to-r from-accent to-primary text-white mb-2">
                      {getContentTypeLabel(file.content_type)}
                    </Badge>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {file.title}
                    </h3>
                  </div>
                </div>

                {file.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {file.description}
                  </p>
                )}

                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <p>الحجم: {formatFileSize(file.file_size)}</p>
                  <p className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {file.downloads_count} تحميل
                  </p>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90"
                  onClick={() => handleDownload(file)}
                >
                  <Download className="h-4 w-4 ml-2" />
                  تحميل مجاني
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default FreeResources;
