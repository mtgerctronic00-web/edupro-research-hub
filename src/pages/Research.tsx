import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { FileText, Download, Eye, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Research = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data - will be replaced with database data later
  const researches = [
    {
      id: 1,
      title: "تأثير الأدوية على وظائف الكلى",
      year: "2024",
      department: "التحليلات المرضية",
      format: "PDF, Word",
      downloads: 150,
    },
    {
      id: 2,
      title: "دراسة الأمراض المعدية في المجتمع",
      year: "2024",
      department: "التحليلات المرضية",
      format: "PDF",
      downloads: 200,
    },
    {
      id: 3,
      title: "تحليل العوامل الوراثية للأمراض",
      year: "2023",
      department: "التحليلات المرضية",
      format: "PDF, Word",
      downloads: 180,
    },
  ];

  const filteredResearches = researches.filter((research) =>
    research.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <PageHeader
        icon={FileText}
        title="بحوث التخرج"
        description="بحوث تخرج احترافية متخصصة في التحليلات المرضية"
        gradient="from-primary to-secondary"
      />
      
      <div className="p-8 space-y-8">

        {/* Search Bar */}
        <div className="animate-fade-in">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="ابحث عن بحث معين..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 h-14 text-lg rounded-xl"
              />
            </div>
        </div>

        {/* Research Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResearches.map((research, index) => (
              <Card
                key={research.id}
                className="p-6 hover:shadow-lg transition-shadow animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
                      {research.year}
                    </span>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                      {research.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <p>القسم: {research.department}</p>
                  <p>الصيغة: {research.format}</p>
                  <p className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {research.downloads} تحميل
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
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

        {filteredResearches.length === 0 && (
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

export default Research;
