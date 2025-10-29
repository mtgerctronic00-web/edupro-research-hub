import { useState } from "react";
import { Upload, Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import AppLayout from "@/components/AppLayout";

const PdfTranslation = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [translatedPdfUrl, setTranslatedPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setTranslatedPdfUrl(null);
      toast({
        title: "تم اختيار الملف",
        description: `${selectedFile.name} جاهز للترجمة`,
      });
    } else {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار ملف PDF فقط",
        variant: "destructive",
      });
    }
  };

  const handleTranslate = async () => {
    if (!file) {
      toast({
        title: "تحذير",
        description: "الرجاء اختيار ملف PDF أولاً",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    setProgress(10);

    try {
      // Upload file to storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("pdf-translations")
        .upload(fileName, file);

      if (uploadError) throw uploadError;
      setProgress(30);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("pdf-translations")
        .getPublicUrl(fileName);

      setProgress(50);

      // Call translation edge function
      const { data, error } = await supabase.functions.invoke("translate-pdf", {
        body: { fileUrl: publicUrl, fileName },
      });

      if (error) throw error;
      setProgress(90);

      setTranslatedPdfUrl(data.translatedUrl);
      setProgress(100);

      toast({
        title: "نجحت الترجمة! 🎉",
        description: "يمكنك الآن تحميل الملف المترجم",
      });
    } catch (error: any) {
      console.error("Translation error:", error);
      toast({
        title: "فشلت الترجمة",
        description: error.message || "حدث خطأ أثناء الترجمة",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDownload = () => {
    if (translatedPdfUrl) {
      window.open(translatedPdfUrl, "_blank");
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <PageHeader
          title="ترجمة PDF مجانية"
          description="ترجمة ملفات PDF من الإنجليزية إلى العربية مع الحفاظ على التنسيق"
        />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Feature Description */}
          <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">🌐 ترجمة الملفات PDF مباشرة</h2>
                <p className="text-muted-foreground">من الإنجليزي إلى العربي بكل سهولة واحترافية</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <p className="text-sm">رفع ملف PDF بسهولة من جهازك</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <p className="text-sm">تحويل النصوص بالكامل إلى العربية</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <p className="text-sm">تحميل النسخة المترجمة مباشرة</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <p className="text-sm">مناسب للمستندات الأكاديمية</p>
              </div>
            </div>
          </Card>

          {/* Upload Section */}
          <Card className="p-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-primary/10">
                  <Upload className="w-12 h-12 text-primary" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">اختر ملف PDF للترجمة</h3>
                <p className="text-muted-foreground text-sm">
                  اختر ملف PDF باللغة الإنجليزية لترجمته إلى العربية
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                  disabled={isTranslating}
                />
                <label htmlFor="pdf-upload">
                  <Button
                    variant="outline"
                    size="lg"
                    className="cursor-pointer"
                    disabled={isTranslating}
                    asChild
                  >
                    <span>
                      <FileText className="ml-2 h-5 w-5" />
                      {file ? file.name : "اختر ملف PDF"}
                    </span>
                  </Button>
                </label>

                {file && !isTranslating && !translatedPdfUrl && (
                  <Button
                    size="lg"
                    onClick={handleTranslate}
                    className="w-full max-w-xs bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    🌐 ترجمة الملف
                  </Button>
                )}
              </div>

              {/* Progress Bar */}
              {isTranslating && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-sm font-medium">جاري الترجمة...</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    الرجاء الانتظار، قد تستغرق العملية بضع دقائق
                  </p>
                </div>
              )}

              {/* Download Button */}
              {translatedPdfUrl && (
                <div className="space-y-4 pt-4">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-green-600 dark:text-green-400 font-medium mb-2">
                      ✅ تمت الترجمة بنجاح!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      الملف جاهز للتحميل
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleDownload}
                    className="w-full max-w-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                  >
                    <Download className="ml-2 h-5 w-5" />
                    تحميل الملف المترجم
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* How to Use */}
          <Card className="p-6 mt-8">
            <h3 className="text-lg font-bold mb-4">📝 كيفية الاستخدام</h3>
            <div className="space-y-3">
              {[
                "اضغط على زر 'اختر ملف PDF'",
                "حدد الملف الذي تريد ترجمته (إنكليزي)",
                "اضغط على 'ترجمة الملف'",
                "انتظر لحظات حتى يكتمل التحويل",
                "حمل النسخة العربية من زر التحميل",
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="text-sm">{step}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Features */}
          <Card className="p-6 mt-8">
            <h3 className="text-lg font-bold mb-4">⚡ مميزات احترافية</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: "🖋️", text: "الحفاظ على تنسيق الملف الأصلي" },
                { icon: "⚡", text: "سرعة ودقة في الترجمة" },
                { icon: "💾", text: "تحميل الملف المترجم مباشرة" },
                { icon: "🌐", text: "دعم متعدد للغات" },
                { icon: "🔒", text: "أمان كامل للملفات" },
                { icon: "📱", text: "واجهة سهلة الاستخدام" },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/20">
                  <span className="text-xl">{feature.icon}</span>
                  <p className="text-sm">{feature.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default PdfTranslation;
