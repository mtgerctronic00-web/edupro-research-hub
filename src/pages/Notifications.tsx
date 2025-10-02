import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Trash2, FileText } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "sonner";

const Notifications = () => {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchNotifications(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setTimeout(() => {
          if (session?.user) fetchNotifications(session.user.id);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    // Subscribe to realtime notifications
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchNotifications(user.id);
          toast.success("لديك إشعار جديد!");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchNotifications = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .or(`user_id.eq.${userId},is_general.eq.true`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string, isGeneral: boolean) => {
    try {
      if (isGeneral) {
        // For general notifications, we can't mark as read globally
        // Just update locally for this user session
        toast.info("الإشعارات العامة لا يمكن تعليمها كمقروءة");
        return;
      }
      
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;
      fetchNotifications(user.id);
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ");
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);

      if (error) throw error;
      toast.success("تم تعليم جميع الإشعارات كمقروءة");
      fetchNotifications(user.id);
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ");
    }
  };

  const deleteNotification = async (notificationId: string, isGeneral: boolean) => {
    try {
      if (isGeneral) {
        toast.error("لا يمكن حذف الإشعارات العامة");
        return;
      }
      
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;
      toast.success("تم حذف الإشعار");
      fetchNotifications(user.id);
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      case "error":
        return <Bell className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) return null;

  return (
    <AppLayout>
      <PageHeader
        icon={Bell}
        title="الإشعارات"
        description="تابع آخر التحديثات على طلباتك"
        gradient="from-blue-500 to-purple-500"
      />

      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">إشعاراتك</h2>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                لديك {unreadCount} إشعار غير مقروء
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <Check className="h-4 w-4 ml-2" />
              تعليم الكل كمقروء
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        ) : notifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">لا توجد إشعارات</h3>
            <p className="text-muted-foreground">سيتم إشعارك عند حدوث أي تحديث</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-6 transition-all ${
                  !notification.read
                    ? "bg-blue-500/5 border-blue-500/20"
                    : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{notification.title}</h3>
                          {notification.is_general && (
                            <Badge variant="secondary" className="text-xs">
                              إشعار عام
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read && !notification.is_general && (
                        <Badge variant="default" className="mr-2">
                          جديد
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(notification.created_at), "d MMM yyyy - h:mm a", { locale: ar })}
                      </p>
                      {notification.related_order_id && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto"
                          onClick={() => navigate("/my-orders")}
                        >
                          <FileText className="h-3 w-3 ml-1" />
                          عرض الطلب
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && !notification.is_general && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id, notification.is_general)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {!notification.is_general && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id, notification.is_general)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Notifications;
