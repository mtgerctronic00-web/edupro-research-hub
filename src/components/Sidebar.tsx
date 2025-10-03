import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, Home, FileText, Presentation, BookOpen, Briefcase, Send, MessageCircle, Facebook, ClipboardList, User, LogOut, Shield, Bell, CreditCard, HeadphonesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { Sheet, SheetContent } from "./ui/sheet";

interface SidebarProps {
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

const Sidebar = ({ mobileMenuOpen = false, setMobileMenuOpen }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        await checkAdminRole(session.user.id);
        fetchUnreadCount(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        // Defer DB calls to avoid deadlocks during auth events
        setTimeout(() => {
          if (session?.user) {
            checkAdminRole(session.user.id);
            fetchUnreadCount(session.user.id);
          }
        }, 0);
      } else {
        setIsAdmin(false);
        setUnreadCount(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!data);
    } catch (error) {
      console.error("Error checking admin role:", error);
    }
  };

  const fetchUnreadCount = async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("read", false);

      if (error) throw error;
      setUnreadCount(count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Subscribe to realtime notifications
    const channel = supabase
      .channel('sidebar-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchUnreadCount(user.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;

      // Hard clear any cached auth tokens (safety net)
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('sb-')) localStorage.removeItem(key);
      });
      
      setUser(null);
      setIsAdmin(false);
      toast.success("تم تسجيل الخروج بنجاح");
      
      navigate("/auth", { replace: true });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    } finally {
      setLoggingOut(false);
    }
  };

  const navItems = user
    ? [
        { name: "الرئيسية", path: "/", icon: Home },
        { name: "المتجر", path: "/shop", icon: ClipboardList },
        { name: "حجز خدمة", path: "/booking", icon: ClipboardList },
        { name: "طلباتي", path: "/my-orders", icon: User },
        { name: "الإشعارات", path: "/notifications", icon: Bell, badge: unreadCount > 0 ? unreadCount : null },
        { name: "معلومات الدفع", path: "/payment-info", icon: CreditCard },
        { name: "الدعم", path: "/support", icon: HeadphonesIcon },
        { name: "البحوث", path: "/research", icon: FileText },
        { name: "السمنارات", path: "/seminars", icon: Presentation },
        { name: "ملفات مجانية", path: "/free-resources", icon: BookOpen },
        { name: "أعمالي", path: "/my-works", icon: Briefcase },
        ...(isAdmin ? [{ name: "لوحة الأدمن", path: "/admin", icon: Shield }] : []),
      ]
    : [
        { name: "الرئيسية", path: "/", icon: Home },
        { name: "المتجر", path: "/shop", icon: ClipboardList },
        { name: "البحوث", path: "/research", icon: FileText },
        { name: "السمنارات", path: "/seminars", icon: Presentation },
        { name: "ملفات مجانية", path: "/free-resources", icon: BookOpen },
        { name: "أعمالي", path: "/my-works", icon: Briefcase },
      ];

  const socialLinks = [
    { icon: Send, href: "https://t.me/Univers_research", label: "تيليجرام" },
    { icon: MessageCircle, href: "https://t.me/Graduation_research0", label: "قناة تيليجرام" },
    { icon: Facebook, href: "#", label: "فيسبوك" },
  ];

  const handleLinkClick = () => {
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-3 group" onClick={handleLinkClick}>
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
              EduPro
            </span>
            <span className="text-xs text-muted-foreground">منصة تعليمية احترافية</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                isActive
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground hover:scale-102"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl animate-glow" />
              )}
              <Icon className={cn(
                "h-5 w-5 relative z-10 transition-transform",
                isActive && "animate-bounce-in"
              )} />
              <span className="font-medium relative z-10 flex-1">{item.name}</span>
              {item.badge && (
                <Badge className="relative z-10 bg-red-500 hover:bg-red-600 text-white">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Social Links & Auth */}
      <div className="p-4 border-t border-border space-y-3">
        {user ? (
          <>
            <div className="px-2 mb-3">
              <p className="text-xs text-muted-foreground mb-1">مرحباً</p>
              <p className="text-sm font-medium truncate">{user.email}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full justify-start gap-2 bg-red-500 hover:bg-red-600"
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </Button>
          </>
        ) : (
          <Link to="/auth" onClick={handleLinkClick}>
            <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              تسجيل الدخول
            </Button>
          </Link>
        )}

        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3 font-medium">تواصل معنا</p>
          <div className="flex gap-2">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 p-3 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary transition-all duration-300 flex items-center justify-center group"
                aria-label={social.label}
              >
                <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
            );
          })}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed right-0 top-0 h-screen w-72 bg-gradient-to-b from-card to-muted border-l border-border flex-col shadow-xl z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent 
          side="right" 
          className="w-72 p-0 bg-gradient-to-b from-card to-muted"
        >
          <div className="h-full flex flex-col">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
