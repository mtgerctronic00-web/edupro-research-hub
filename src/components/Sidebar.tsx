import { Link, useLocation } from "react-router-dom";
import { GraduationCap, Home, FileText, Presentation, BookOpen, Briefcase, Send, MessageCircle, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: "الرئيسية", path: "/", icon: Home },
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

  return (
    <aside className="fixed right-0 top-0 h-screen w-72 bg-gradient-to-b from-card to-muted border-l border-border flex flex-col shadow-xl z-40">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-3 group">
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
              <span className="font-medium relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Social Links */}
      <div className="p-4 border-t border-border">
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
    </aside>
  );
};

export default Sidebar;
