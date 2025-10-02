import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, CheckCircle, XCircle, MessageSquare, Eye, FileText, Upload, Trash2, Edit, FolderOpen, Users, UserCog, Search, BarChart3, TrendingUp, DollarSign, HeadphonesIcon } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

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
  const [uploadMode, setUploadMode] = useState<"file" | "link">("file");
  const [fileUrlInput, setFileUrlInput] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [supportMenuOpen, setSupportMenuOpen] = useState(false);
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
        fetchUsers();
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
      // Normalize any legacy or invalid status values before updating DB
      const normalizedStatus =
        status === 'قيد التنفيذ' ? 'مؤكد - جاري التنفيذ' :
        status === 'تم التسليم' ? 'مكتمل' :
        status;

      const updates: any = { status: normalizedStatus };
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
    if (!fileData.title) {
      toast.error("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }

    setUploadLoading(true);
    try {
      let insertData: any = {
        ...fileData,
        uploaded_by: user?.id,
      };

      if (uploadMode === "file") {
        if (!selectedFile) {
          toast.error("يرجى اختيار ملف");
          setUploadLoading(false);
          return;
        }
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

        insertData = {
          ...insertData,
          file_url: urlData.publicUrl,
          file_name: selectedFile.name,
          file_size: selectedFile.size,
        };
      } else {
        // Link mode
        if (!fileUrlInput.trim()) {
          toast.error("يرجى إدخال رابط الملف");
          setUploadLoading(false);
          return;
        }
        const url = new URL(fileUrlInput.trim());
        const last = url.pathname.split('/').pop() || "file";
        insertData = {
          ...insertData,
          file_url: fileUrlInput.trim(),
          file_name: decodeURIComponent(last),
          file_size: null,
        };
      }

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
        toast.success(uploadMode === 'file' ? "تم رفع الملف بنجاح!" : "تم حفظ الرابط بنجاح!");
      }

      fetchContentFiles();
      setUploadDialogOpen(false);
      resetFileForm();
    } catch (error: any) {
      console.error("Error uploading file:", error);
      if (error?.message?.includes("Missing tenant config")) {
        toast.error("خدمة التخزين غير مُفعّلة حالياً. تم التحويل إلى وضع إدخال الرابط.");
        setUploadMode("link");
      } else {
        toast.error(error.message || "حدث خطأ أثناء رفع الملف");
      }
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

  const fetchUsers = async () => {
    try {
      const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
      if (usersError) throw usersError;

      const usersWithDetails = await Promise.all(
        usersData.users.map(async (user) => {
          const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id);

          const { count: ordersCount } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id);

          return {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            roles: roles?.map((r) => r.role) || [],
            ordersCount: ordersCount || 0,
          };
        })
      );

      setUsers(usersWithDetails);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleUserRole = async (userId: string, role: string, shouldAdd: boolean) => {
    try {
      if (shouldAdd) {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: role as "admin" | "student" });
        if (error) throw error;
        toast.success(`تم إضافة دور ${role} للمستخدم`);
      } else {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", role as "admin" | "student");
        if (error) throw error;
        toast.success(`تم إزالة دور ${role} من المستخدم`);
      }
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.roles.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  // Statistics calculations
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === "قيد المراجعة").length,
    inProgressOrders: orders.filter(o => o.status === "مؤكد - جاري التنفيذ").length,
    completedOrders: orders.filter(o => o.status === "مكتمل").length,
    totalUsers: users.length,
    adminUsers: users.filter(u => u.roles.includes("admin")).length,
  };

  // Orders by status for pie chart
  const ordersByStatus = [
    { name: "قيد المراجعة", value: stats.pendingOrders, color: "#f59e0b" },
    { name: "مؤكد - جاري التنفيذ", value: stats.inProgressOrders, color: "#3b82f6" },
    { name: "مكتمل", value: stats.completedOrders, color: "#10b981" },
    { name: "مرفوض", value: orders.filter(o => o.status === "مرفوض").length, color: "#ef4444" },
  ];

  // Orders by service type
  const ordersByService = orders.reduce((acc: any, order) => {
    const existing = acc.find((item: any) => item.name === order.service_type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: order.service_type, value: 1 });
    }
    return acc;
  }, []);

  // Orders over time (last 7 days)
  const ordersOverTime = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayStart = startOfDay(date);
    const dayOrders = orders.filter(o => {
      const orderDate = startOfDay(new Date(o.created_at));
      return orderDate.getTime() === dayStart.getTime();
    });
    return {
      date: format(date, "MMM d", { locale: ar }),
      orders: dayOrders.length,
    };
  });

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

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
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-4">
            <TabsTrigger value="dashboard">
              <BarChart3 className="h-4 w-4 ml-2" />
              الإحصائيات
            </TabsTrigger>
            <TabsTrigger value="orders">
              <FileText className="h-4 w-4 ml-2" />
              الطلبات
            </TabsTrigger>
            <TabsTrigger value="content">
              <FolderOpen className="h-4 w-4 ml-2" />
              المحتوى
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 ml-2" />
              المستخدمين
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">إجمالي الطلبات</p>
                      <h3 className="text-3xl font-bold">{stats.totalOrders}</h3>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-500/20">
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4 text-sm">
                    <span className="text-orange-500">⏳ {stats.pendingOrders} قيد المراجعة</span>
                    <span className="text-blue-500">🔄 {stats.inProgressOrders} جاري التنفيذ</span>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">الطلبات المكتملة</p>
                      <h3 className="text-3xl font-bold">{stats.completedOrders}</h3>
                    </div>
                    <div className="p-3 rounded-xl bg-green-500/20">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>معدل الإنجاز {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">المستخدمين</p>
                      <h3 className="text-3xl font-bold">{stats.totalUsers}</h3>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-500/20">
                      <Users className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <span>👑 {stats.adminUsers} أدمن</span>
                  </div>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Orders by Status */}
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-6">توزيع الطلبات حسب الحالة</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ordersByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {ordersByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>

                {/* Orders by Service Type */}
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-6">الطلبات حسب نوع الخدمة</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ordersByService}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Orders Over Time */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-6">الطلبات خلال آخر 7 أيام</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ordersOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} name="عدد الطلبات" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

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
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">رقم الطلب: {order.order_number || 'غير متوفر'}</p>
                          <h3 className="font-bold text-lg">{order.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {order.service_type} - {order.university}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{order.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-muted-foreground mb-1">الطالب</p>
                        <p className="font-medium">{order.full_name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">الكلية</p>
                        <p className="font-medium">{order.college}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">القسم</p>
                        <p className="font-medium">{order.department}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">التاريخ</p>
                        <p className="font-medium">{format(new Date(order.created_at), "d MMM yyyy", { locale: ar })}</p>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">ملاحظات الطالب:</p>
                        <p className="text-sm">{order.notes}</p>
                      </div>
                    )}

                    {order.admin_notes && (
                      <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <p className="text-xs text-blue-600 mb-1">ملاحظات الأدمن:</p>
                        <p className="text-sm">{order.admin_notes}</p>
                      </div>
                    )}

                    {order.rejection_reason && (
                      <div className="mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                        <p className="text-xs text-red-600 mb-1">سبب الرفض:</p>
                        <p className="text-sm">{order.rejection_reason}</p>
                      </div>
                    )}

                    {order.payment_receipt_url && (
                      <div className="mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(order.payment_receipt_url, '_blank')}
                        >
                          <Eye className="h-4 w-4 ml-2" />
                          عرض وصل الدفع
                        </Button>
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {order.status === 'قيد المراجعة' && (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <CheckCircle className="h-4 w-4 ml-2" />
                                قبول
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>قبول الطلب</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                <p>هل تريد قبول هذا الطلب؟</p>
                                <div>
                                  <Label>ملاحظات (اختياري)</Label>
                                  <Textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    rows={3}
                                  />
                                </div>
                                <Button
                                  className="w-full bg-green-500 hover:bg-green-600"
                                  onClick={() => updateOrderStatus(order.id, 'مؤكد - جاري التنفيذ', adminNotes)}
                                >
                                  تأكيد القبول
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <XCircle className="h-4 w-4 ml-2" />
                                رفض
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>رفض الطلب</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                <div>
                                  <Label>سبب الرفض *</Label>
                                  <Textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    rows={3}
                                    required
                                  />
                                </div>
                                <Button
                                  variant="destructive"
                                  className="w-full"
                                  onClick={() => updateOrderStatus(order.id, 'مرفوض', undefined, rejectionReason)}
                                >
                                  تأكيد الرفض
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}

                      {order.status === 'مؤكد - جاري التنفيذ' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              <MessageSquare className="h-4 w-4 ml-2" />
                              تحديث
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>تحديث الطلب</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div>
                                <Label>حالة جديدة</Label>
                                <select
                                  className="w-full p-2 border rounded"
                                  onChange={(e) => {
                                    if (e.target.value === 'مكتمل') {
                                      updateOrderStatus(order.id, 'مكتمل');
                                    }
                                  }}
                                >
                                  <option value="">اختر...</option>
                                  <option value="مكتمل">مكتمل</option>
                                </select>
                              </div>
                              <div>
                                <Label>ملاحظات إضافية</Label>
                                <Textarea
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  rows={3}
                                />
                              </div>
                              <Button
                                className="w-full"
                                onClick={() => updateOrderStatus(order.id, order.status, adminNotes)}
                              >
                                حفظ التحديث
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
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
                      <DialogDescription>
                        حدد وسيلة الإضافة: رفع ملف أو لصق رابط مباشر للمحتوى.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="flex gap-2">
                        <Button type="button" variant={uploadMode==='file' ? 'default' : 'outline'} onClick={() => setUploadMode('file')}>
                          رفع ملف
                        </Button>
                        <Button type="button" variant={uploadMode==='link' ? 'default' : 'outline'} onClick={() => setUploadMode('link')}>
                          رابط مباشر
                        </Button>
                      </div>

                      {uploadMode === 'file' ? (
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
                      ) : (
                        <div>
                          <Label htmlFor="file_url">رابط الملف *</Label>
                          <Input
                            id="file_url"
                            type="url"
                            value={fileUrlInput}
                            onChange={(e) => setFileUrlInput(e.target.value)}
                            placeholder="https://example.com/file.pdf"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            ألصق رابط مباشر للملف (Google Drive مباشِر أو أي استضافة عامة)
                          </p>
                        </div>
                      )}

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

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث عن مستخدم بالبريد الإلكتروني..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="تصفية حسب الدور" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المستخدمين</SelectItem>
                    <SelectItem value="admin">أدمن</SelectItem>
                    <SelectItem value="student">طالب</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users List */}
              {filteredUsers.length === 0 ? (
                <Card className="p-12 text-center">
                  <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-bold mb-2">لا توجد نتائج</h3>
                  <p className="text-muted-foreground">جرب تغيير معايير البحث</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredUsers.map((user) => (
                    <Card key={user.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{user.email}</h3>
                            <p className="text-sm text-muted-foreground">
                              انضم في {format(new Date(user.created_at), "d MMM yyyy", { locale: ar })}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="gap-1">
                          <FileText className="h-3 w-3" />
                          {user.ordersCount} طلب
                        </Badge>
                      </div>

                      {/* Roles Section */}
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">الأدوار:</p>
                        <div className="flex flex-wrap gap-2">
                          {["admin", "student"].map((role) => {
                            const hasRole = user.roles.includes(role);
                            return (
                              <Button
                                key={role}
                                size="sm"
                                variant={hasRole ? "default" : "outline"}
                                onClick={() => toggleUserRole(user.id, role, !hasRole)}
                                className="gap-2"
                              >
                                <UserCog className="h-4 w-4" />
                                {role === "admin" ? "أدمن" : "طالب"}
                                {hasRole && (
                                  <XCircle className="h-3 w-3" />
                                )}
                              </Button>
                            );
                          })}
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

      {/* Floating Support Button */}
      <div className="fixed bottom-6 left-6 z-50">
        {supportMenuOpen && (
          <div className="mb-3 flex flex-col gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 border">
            <a
              href="https://wa.me/964775326XXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span className="font-medium">واتساب</span>
            </a>
            <a
              href="https://t.me/Univers_research"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span className="font-medium">تيليجرام</span>
            </a>
          </div>
        )}
        <Button
          size="lg"
          onClick={() => setSupportMenuOpen(!supportMenuOpen)}
          className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          <HeadphonesIcon className="h-6 w-6" />
        </Button>
      </div>
    </AppLayout>
  );
};

export default AdminPanel;
