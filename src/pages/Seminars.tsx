import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { Presentation, Download, Eye, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Seminars = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data
  const seminars = [
    {
      id: 1,
      title: "أساسيات التحليلات المرضية",
      category: "تحليلات مرضية",
      format: "PowerPoint, PDF",
      views: 300,
    },
    {
      id: 2,
      title: "علم الأدوية السريرية",
      category: "صيدلة",
      format: "PowerPoint",
      views: 250,
    },
    {
      id: 3,
      title: "التمريض الحديث",
      category: "تمريض",
      format: "PowerPoint, PDF",
      views: 280,
    },
  ];

  const filteredSeminars = seminars.filter((seminar) =>
    seminar.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <PageHeader
        icon={Presentation}
        title="السمنارات"
        description="عروض تقديمية احترافية شاملة لجميع التخصصات الطبية"
        gradient="from-secondary to-accent"
      />
      
      <div className="p-8 space-y-8">
        {/* Search Bar */}
        <div className="animate-fade-in">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث عن سمنار..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 h-14 text-lg rounded-xl"
            />
          </div>
        </div>

        {/* Seminars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeminars.map((seminar, index) => (
              <Card
                key={seminar.id}
                className="p-6 hover:shadow-lg transition-shadow animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-secondary/10 to-accent/10 group-hover:from-secondary/20 group-hover:to-accent/20 transition-colors">
                    <Presentation className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium mb-2">
                      {seminar.category}
                    </span>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-secondary transition-colors">
                      {seminar.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <p>الصيغة: {seminar.format}</p>
                  <p className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {seminar.views} مشاهدة
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-secondary to-accent hover:opacity-90"
                  >
                    <Download className="h-4 w-4 ml-2" />
                    تحميل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 ml-2" />
                    معاينة
                  </Button>
                </div>
              </Card>
            ))}
        </div>

        {filteredSeminars.length === 0 && (
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

export default Seminars;
