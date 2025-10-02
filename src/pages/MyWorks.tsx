import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Briefcase, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MyWorks = () => {
  // Sample data
  const works = [
    {
      id: 1,
      title: "بحث تخرج: تحليل الدم الشامل",
      type: "بحث",
      year: "2024",
      preview: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400",
    },
    {
      id: 2,
      title: "سمنار: أمراض القلب",
      type: "سمنار",
      year: "2024",
      preview: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
    },
    {
      id: 3,
      title: "بحث: الأمراض المعدية",
      type: "بحث",
      year: "2023",
      preview: "https://images.unsplash.com/photo-1583912267550-1a5a3e89b5e9?w=400",
    },
    {
      id: 4,
      title: "سمنار: علم الأدوية",
      type: "سمنار",
      year: "2023",
      preview: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-6">
              <Briefcase className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              أعمالي السابقة
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              معرض الأعمال والمشاريع المنجزة
            </p>
          </div>

          {/* Works Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map((work, index) => (
              <Card
                key={work.id}
                className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                  <img
                    src={work.preview}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {work.year}
                  </span>
                </div>

                <div className="p-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium mb-3">
                    {work.type}
                  </span>
                  <h3 className="font-bold text-lg mb-4 group-hover:text-primary transition-colors">
                    {work.title}
                  </h3>

                  <Button
                    variant="outline"
                    className="w-full group-hover:border-primary group-hover:text-primary transition-colors"
                  >
                    <Eye className="h-4 w-4 ml-2" />
                    معاينة فقط
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyWorks;
