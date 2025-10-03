import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: Error };

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Helpful for Netlify: ensure errors are visible in console
    console.error("App crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-xl w-full text-center space-y-4">
            <h1 className="text-2xl font-bold">حدث خطأ غير متوقع</h1>
            <p className="text-muted-foreground text-sm">
              إذا كنت تشاهد هذه الرسالة على Netlify، فتأكد من إعداد متغيرات البيئة:
              VITE_SUPABASE_URL و VITE_SUPABASE_PUBLISHABLE_KEY ثم أعد النشر.
            </p>
            <a href="/" className="inline-block px-4 py-2 rounded-md bg-primary text-primary-foreground">
              الرجوع إلى الرئيسية
            </a>
          </div>
          <Toaster />
          <Sonner />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
