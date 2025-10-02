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
import { Shield, CheckCircle, XCircle, MessageSquare, Eye, FileText } from "lucide-react";
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

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <AppLayout>
      <PageHeader
        icon={Shield}
        title="لوحة تحكم الأدمن"
        description="إدارة ومراجعة طلبات الطلاب"
        gradient="from-red-500 to-orange-500"
      />

      <div className="p-8">
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
                  <div>
                    <h3 className="font-bold text-lg mb-1">{order.full_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.university} - {order.college} - {order.department}
                    </p>
                  </div>
                  <Badge
                    className={
                      order.status === "قيد المراجعة"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : order.status === "مؤكد - جاري التنفيذ"
                        ? "bg-blue-500/10 text-blue-500"
                        : order.status === "مرفوض"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-green-500/10 text-green-500"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>

                <div className="mb-4">
                  <p className="font-medium mb-1">نوع الخدمة: {order.service_type}</p>
                  <p className="text-sm text-muted-foreground mb-1">العنوان: {order.title}</p>
                  <p className="text-sm text-muted-foreground">
                    موعد التسليم: {format(new Date(order.delivery_date), "dd MMMM yyyy", { locale: ar })}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 ml-2" />
                        عرض الوصل
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>وصل الدفع</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <img
                          src={order.payment_receipt_url}
                          alt="Payment Receipt"
                          className="w-full rounded-lg"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>

                  {order.status === "قيد المراجعة" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() =>
                          updateOrderStatus(order.id, "مؤكد - جاري التنفيذ")
                        }
                      >
                        <CheckCircle className="h-4 w-4 ml-2" />
                        تأكيد الوصل
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <XCircle className="h-4 w-4 ml-2" />
                            رفض الوصل
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>رفض الوصل</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div>
                              <Label htmlFor="rejectionReason">سبب الرفض</Label>
                              <Textarea
                                id="rejectionReason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="اكتب سبب رفض الوصل..."
                                rows={4}
                              />
                            </div>
                            <Button
                              className="w-full"
                              variant="destructive"
                              onClick={() =>
                                updateOrderStatus(
                                  order.id,
                                  "مرفوض",
                                  undefined,
                                  rejectionReason
                                )
                              }
                            >
                              تأكيد الرفض
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order);
                          setAdminNotes(order.admin_notes || "");
                        }}
                      >
                        <MessageSquare className="h-4 w-4 ml-2" />
                        إضافة ملاحظة
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>إضافة ملاحظة للطالب</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label htmlFor="adminNotes">الملاحظة</Label>
                          <Textarea
                            id="adminNotes"
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="اكتب ملاحظاتك هنا..."
                            rows={4}
                          />
                        </div>
                        <Button
                          className="w-full"
                          onClick={() =>
                            updateOrderStatus(order.id, order.status, adminNotes)
                          }
                        >
                          حفظ الملاحظة
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {order.status === "مؤكد - جاري التنفيذ" && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => updateOrderStatus(order.id, "مكتمل")}
                    >
                      <CheckCircle className="h-4 w-4 ml-2" />
                      تحويل إلى مكتمل
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

export default AdminPanel;
