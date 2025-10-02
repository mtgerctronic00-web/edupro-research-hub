import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const MyOrders = () => {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchOrders(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchOrders(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchOrders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "قيد المراجعة":
        return <Clock className="h-5 w-5" />;
      case "مؤكد - جاري التنفيذ":
        return <CheckCircle className="h-5 w-5" />;
      case "مرفوض":
        return <XCircle className="h-5 w-5" />;
      case "مكتمل":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "قيد المراجعة":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "مؤكد - جاري التنفيذ":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "مرفوض":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "مكتمل":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <PageHeader
        icon={FileText}
        title="طلباتي"
        description="تابع حالة طلباتك وتحديثاتها"
        gradient="from-primary to-secondary"
      />

      <div className="p-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">لا توجد طلبات بعد</h3>
            <p className="text-muted-foreground mb-6">
              قم بحجز خدمة جديدة للبدء
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{order.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.service_type} - {order.university}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} flex items-center gap-2`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">الكلية</p>
                    <p className="font-medium">{order.college}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">القسم</p>
                    <p className="font-medium">{order.department}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      موعد التسليم
                    </p>
                    <p className="font-medium">
                      {format(new Date(order.delivery_date), "dd MMMM yyyy", { locale: ar })}
                    </p>
                  </div>
                </div>

                {order.admin_notes && (
                  <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-sm font-medium text-blue-600 mb-1">ملاحظات الإدارة:</p>
                    <p className="text-sm text-blue-700">{order.admin_notes}</p>
                  </div>
                )}

                {order.rejection_reason && (
                  <div className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                    <p className="text-sm font-medium text-red-600 mb-1">سبب الرفض:</p>
                    <p className="text-sm text-red-700">{order.rejection_reason}</p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                  تاريخ الطلب: {format(new Date(order.created_at), "dd MMMM yyyy - hh:mm a", { locale: ar })}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MyOrders;
