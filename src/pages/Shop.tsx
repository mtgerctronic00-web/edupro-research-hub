import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye, Download } from "lucide-react";
import { toast } from "sonner";

interface ContentFile {
  id: string;
  title: string;
  description: string;
  content_type: 'research' | 'seminar' | 'report';
  access_type: 'view_only' | 'free_download' | 'paid_download';
  price: number;
  views_count: number;
  downloads_count: number;
  file_url: string;
}

const Shop = () => {
  const [user, setUser] = useState<any>(null);
  const [files, setFiles] = useState<ContentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<ContentFile | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  // Booking form
  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  
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
        .in('access_type', ['free_download', 'paid_download'])
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

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً');
      navigate('/auth');
      return;
    }

    if (!selectedFile) return;

    setSubmitting(true);
    try {
      // Create order without receipt
      const orderData: any = {
        user_id: user.id,
        content_file_id: selectedFile.id,
        service_type: getContentTypeLabel(selectedFile.content_type),
        title: selectedFile.title,
        full_name: fullName,
        university,
        college,
        department,
        phone,
        notes,
        payment_receipt_url: '',
        delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'قيد المراجعة'
      };

      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select('order_number')
        .single();

      if (orderError) throw orderError;

      setOrderNumber(orderResult.order_number || '');
      setOrderSuccess(true);
      toast.success('تم إرسال طلبك بنجاح!');

    } catch (error: any) {
      console.error('Error submitting booking:', error);
      toast.error(error.message || 'فشل إرسال الطلب');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFreeDownload = async (file: ContentFile) => {
    if (!user) {
      toast.error('يرجى تسجيل الدخول للتحميل');
      navigate('/auth');
      return;
    }

    try {
      // Increment downloads count
      await supabase
        .from('content_files')
        .update({ downloads_count: file.downloads_count + 1 })
        .eq('id', file.id);

      // Open file in new tab
      window.open(file.file_url, '_blank');
      toast.success('جاري التحميل...');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('فشل التحميل');
    }
  };

  const resetForm = () => {
    setFullName('');
    setUniversity('');
    setCollege('');
    setDepartment('');
    setPhone('');
    setNotes('');
    setSelectedFile(null);
    setOrderSuccess(false);
    setOrderNumber('');
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'research': return 'بحث تخرج';
      case 'seminar': return 'سمنار';
      case 'report': return 'تقرير عملي';
      default: return type;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'research': return 'from-blue-500 to-blue-600';
      case 'seminar': return 'from-green-500 to-green-600';
      case 'report': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-IQ').format(price) + ' د.ع';
  };

  return (
    <AppLayout>
      <PageHeader
        icon={ShoppingCart}
        title="متجر الخدمات"
        description="تصفح وشراء البحوث والسمنارات والتقارير"
        gradient="from-green-500 to-blue-500"
      />

      <div className="p-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        ) : files.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">لا توجد خدمات متاحة حالياً</h3>
            <p className="text-muted-foreground">تحقق لاحقاً من الخدمات الجديدة</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <Card key={file.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-2 bg-gradient-to-r ${getContentTypeColor(file.content_type)}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`bg-gradient-to-r ${getContentTypeColor(file.content_type)} text-white`}>
                      {getContentTypeLabel(file.content_type)}
                    </Badge>
                    {file.access_type === 'paid_download' && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{formatPrice(file.price)}</p>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{file.title}</h3>
                  
                  {file.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {file.description}
                    </p>
                  )}

                  <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {file.views_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {file.downloads_count}
                    </span>
                  </div>

                  {file.access_type === 'free_download' ? (
                    <Button
                      className="w-full bg-gradient-to-r from-green-500 to-green-600"
                      onClick={() => handleFreeDownload(file)}
                    >
                      <Download className="h-4 w-4 ml-2" />
                      تحميل مجاني
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-secondary h-10 md:h-11 text-sm md:text-base"
                      onClick={() => navigate('/booking')}
                    >
                      <ShoppingCart className="h-4 w-4 ml-2" />
                      احجز الآن
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Shop;