import { Link } from "react-router-dom";
import { GraduationCap, Send, MessageCircle, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary/5 to-secondary/5 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EduPro
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              منصة تعليمية متكاملة تقدم بحوث تخرج جاهزة، سمنارات، وملفات علمية احترافية مخصصة لطلبة الأقسام الطبية.
            </p>
            <div className="flex gap-3">
              <a
                href="https://t.me/Univers_research"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                <Send className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/Graduation_research0"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/research" className="text-muted-foreground hover:text-primary transition-colors">
                  البحوث
                </Link>
              </li>
              <li>
                <Link to="/seminars" className="text-muted-foreground hover:text-primary transition-colors">
                  السمنارات
                </Link>
              </li>
              <li>
                <Link to="/free-resources" className="text-muted-foreground hover:text-primary transition-colors">
                  ملفات مجانية
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">تواصل معنا</h3>
            <p className="text-muted-foreground mb-2">
              للحجز والاستفسارات:
            </p>
            <a
              href="https://t.me/Univers_research"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @Univers_research
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>© 2025 EduPro. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
