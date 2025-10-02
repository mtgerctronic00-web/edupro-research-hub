import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { BookOpen, Download, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const FreeResources = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data
  const resources = [
    {
      id: 1,
      title: "دليل المختبرات الطبية الشامل",
      type: "مرجع",
      format: "PDF",
      size: "5 MB",
      downloads: 500,
    },
    {
      id: 2,
      title: "مقالة: أحدث التقنيات في التحليلات",
      type: "مقالة",
      format: "PDF",
      size: "2 MB",
      downloads: 350,
    },
    {
      id: 3,
      title: "كتاب: علم الأمراض الأساسي",
      type: "كتاب",
      format: "PDF",
      size: "10 MB",
      downloads: 600,
    },
  ];

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <PageHeader
        icon={BookOpen}
        title="الملفات المجانية"
        description="مراجع ومقالات علمية متاحة للتحميل المجاني"
        gradient="from-accent to-primary"
      />
      
      <div className="p-8 space-y-8">
        {/* Search Bar */}
        <div className="animate-fade-in">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث عن ملف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 h-14 text-lg rounded-xl"
            />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
              <Card
                key={resource.id}
                className="p-6 hover:shadow-lg transition-shadow animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 group-hover:from-accent/20 group-hover:to-primary/20 transition-colors">
                    <BookOpen className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-2">
                      {resource.type}
                    </span>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                      {resource.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <p>الصيغة: {resource.format}</p>
                  <p>الحجم: {resource.size}</p>
                  <p className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {resource.downloads} تحميل
                  </p>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90"
                >
                  <Download className="h-4 w-4 ml-2" />
                  تحميل مجاني
                </Button>
              </Card>
            ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <p className="text-muted-foreground text-lg">
              لم يتم العثور على نتائج للبحث
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default FreeResources;
