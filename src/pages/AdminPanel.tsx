import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, CheckCircle, XCircle, MessageSquare, Eye, FileText, Upload, Trash2, Edit, FolderOpen } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "sonner";

const AdminPanel = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [contentFiles, setContentFiles] = useState<any[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<any>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [fileData, setFileData] = useState({
    title: "",
    description: "",
    content_type: "research" as "research" | "seminar" | "report",
    access_type: "view_only" as "view_only" | "free_download" | "paid_download",
    price: 0,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        await checkAdminRole(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        // Defer DB access to avoid recursion/deadlocks during auth event
        setTimeout(() => {
          if (session?.user) checkAdminRole(session.user.id);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setIsAdmin(true);
        fetchOrders();
        fetchContentFiles();
      } else {
        setIsAdmin(false);
        navigate("/");
        toast.error("ليس لديك صلاحيات الوصول لهذه الصفحة");
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
      navigate("/");
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, notes?: string, rejection?: string) => {
    try {
      const updates: any = { status };
      if (notes) updates.admin_notes = notes;
      if (rejection) updates.rejection_reason = rejection;

      const { error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", orderId);

      if (error) throw error;

      toast.success("تم تحديث حالة الطلب بنجاح");
      fetchOrders();
      setSelectedOrder(null);
      setAdminNotes("");
      setRejectionReason("");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ");
    }
  };

  const fetchContentFiles = async () => {
    try {
      const { data, error } = await supabase
        .from("content_files")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContentFiles(data || []);
    } catch (error) {
      console.error("Error fetching content files:", error);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !fileData.title) {
      toast.error("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }

    setUploadLoading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("content-files")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("content-files")
        .getPublicUrl(filePath);

      const insertData = {
        ...fileData,
        file_url: urlData.publicUrl,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        uploaded_by: user?.id,
      };

      if (editingFile) {
        const { error } = await supabase
          .from("content_files")
          .update(insertData)
          .eq("id", editingFile.id);

        if (error) throw error;
        toast.success("تم تحديث الملف بنجاح!");
      } else {
        const { error } = await supabase
          .from("content_files")
          .insert(insertData);

        if (error) throw error;
        toast.success("تم رفع الملف بنجاح!");
      }

      fetchContentFiles();
      setUploadDialogOpen(false);
      resetFileForm();
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error(error.message || "حدث خطأ أثناء رفع الملف");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteFile = async (fileId: string, fileUrl: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الملف؟")) return;

    try {
      const filePath = fileUrl.split('/').pop();
      if (filePath) {
        await supabase.storage.from("content-files").remove([filePath]);
      }

      const { error } = await supabase
        .from("content_files")
        .delete()
        .eq("id", fileId);

      if (error) throw error;

      toast.success("تم حذف الملف بنجاح!");
      fetchContentFiles();
    } catch (error: any) {
      console.error("Error deleting file:", error);
      toast.error(error.message || "حدث خطأ أثناء حذف الملف");
    }
  };

  const resetFileForm = () => {
    setFileData({
      title: "",
      description: "",
      content_type: "research",
      access_type: "view_only",
      price: 0,
    });
    setSelectedFile(null);
    setEditingFile(null);
  };

  const openEditDialog = (file: any) => {
    setEditingFile(file);
    setFileData({
      title: file.title,
      description: file.description || "",
      content_type: file.content_type,
      access_type: file.access_type,
      price: file.price || 0,
    });
    setUploadDialogOpen(true);
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case "research": return "بحث تخرج";
      case "seminar": return "سمنار";
      case "report": return "تقرير عملي";
      default: return type;
    }
  };

  const getAccessTypeLabel = (type: string) => {
    switch (type) {
      case "view_only": return "عرض فقط";
      case "free_download": return "تحميل مجاني";
      case "paid_download": return "تحميل مدفوع";
      default: return type;
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <AppLayout>
      <PageHeader
        icon={Shield}
        title="لوحة تحكم الأدمن"
        description="إدارة ومراجعة المحتوى والطلبات"
        gradient="from-red-500 to-orange-500"
      />

      <div className="p-8">
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="orders">
              <FileText className="h-4 w-4 ml-2" />
              إدارة الطلبات
            </TabsTrigger>
            <TabsTrigger value="content">
              <FolderOpen className="h-4 w-4 ml-2" />
              إدارة المحتوى
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">جاري التحميل...</p>
              </div>
            ) : orders.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">لا توجد طلبات</h3>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => (
                  <Card key={order.id} className="p-6">
...
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">إدارة الملفات والمحتوى</h3>
                <Dialog open={uploadDialogOpen} onOpenChange={(open) => {
                  setUploadDialogOpen(open);
                  if (!open) resetFileForm();
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-primary to-secondary">
                      <Upload className="h-4 w-4 ml-2" />
                      رفع ملف جديد
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingFile ? "تعديل الملف" : "رفع ملف جديد"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="file">اختر الملف *</Label>
                        <Input
                          id="file"
                          type="file"
                          accept=".pdf,.doc,.docx,.ppt,.pptx"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          الأنواع المدعومة: PDF, Word, PowerPoint
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="title">عنوان الملف *</Label>
                        <Input
                          id="title"
                          value={fileData.title}
                          onChange={(e) => setFileData({ ...fileData, title: e.target.value })}
                          placeholder="مثال: بحث عن فحص الدم الكامل"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">الوصف</Label>
                        <Textarea
                          id="description"
                          value={fileData.description}
                          onChange={(e) => setFileData({ ...fileData, description: e.target.value })}
                          placeholder="وصف مختصر عن المحتوى..."
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="content_type">نوع المحتوى *</Label>
                          <Select
                            value={fileData.content_type}
                            onValueChange={(value: any) => setFileData({ ...fileData, content_type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="research">بحث تخرج</SelectItem>
                              <SelectItem value="seminar">سمنار</SelectItem>
                              <SelectItem value="report">تقرير عملي</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="access_type">نوع الوصول *</Label>
                          <Select
                            value={fileData.access_type}
                            onValueChange={(value: any) => setFileData({ ...fileData, access_type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="view_only">عرض فقط</SelectItem>
                              <SelectItem value="free_download">تحميل مجاني</SelectItem>
                              <SelectItem value="paid_download">تحميل مدفوع</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {fileData.access_type === "paid_download" && (
                        <div>
                          <Label htmlFor="price">السعر (بالدينار العراقي)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={fileData.price}
                            onChange={(e) => setFileData({ ...fileData, price: parseFloat(e.target.value) })}
                            placeholder="0"
                          />
                        </div>
                      )}

                      <Button
                        className="w-full"
                        onClick={handleFileUpload}
                        disabled={uploadLoading}
                      >
                        {uploadLoading ? "جاري الرفع..." : editingFile ? "تحديث الملف" : "رفع الملف"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {contentFiles.length === 0 ? (
                <Card className="p-12 text-center">
                  <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-bold mb-2">لا توجد ملفات</h3>
                  <p className="text-muted-foreground">ابدأ برفع أول ملف</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {contentFiles.map((file) => (
                    <Card key={file.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2">{file.title}</h4>
                          {file.description && (
                            <p className="text-sm text-muted-foreground mb-3">{file.description}</p>
                          )}
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline">
                              {getContentTypeLabel(file.content_type)}
                            </Badge>
                            <Badge variant="outline">
                              {getAccessTypeLabel(file.access_type)}
                            </Badge>
                            {file.access_type === "paid_download" && (
                              <Badge className="bg-green-500/10 text-green-500">
                                {file.price} IQD
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>👁️ {file.views_count} مشاهدة</span>
                            <span>⬇️ {file.downloads_count} تحميل</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(file)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteFile(file.id, file.file_url)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AdminPanel;
