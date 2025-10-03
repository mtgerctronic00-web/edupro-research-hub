import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserCheck, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const StudentStats = () => {
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentStats();
  }, []);

  const fetchStudentStats = async () => {
    try {
      // Get total students count from user_roles table
      const { count, error } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      if (error) throw error;
      setTotalStudents(count || 0);
    } catch (error) {
      console.error('Error fetching student stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "الطلاب المسجلين",
      value: loading ? "..." : totalStudents,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/10",
      shadow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]"
    },
    {
      title: "الطلاب النشطين",
      value: loading ? "..." : totalStudents,
      icon: UserCheck,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-500/10 to-green-600/10",
      shadow: "shadow-[0_0_20px_rgba(34,197,94,0.3)]"
    },
    {
      title: "معدل النمو",
      value: loading ? "..." : `+${totalStudents}`,
      icon: TrendingUp,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-500/10 to-purple-600/10",
      shadow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]"
    }
  ];

  return (
    <div className="w-full py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            📊 إحصائيات المنصة
          </h2>
          <p className="text-muted-foreground">أعداد الطلاب والنشاط على المنصة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className={`group relative p-6 bg-gradient-to-br ${stat.bgGradient} border-primary/20 hover:border-primary/40 transition-all duration-500 hover:scale-105 hover:${stat.shadow} animate-fade-in overflow-hidden`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Animated background shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                {/* Glowing orb */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                <div className="relative flex items-center gap-4">
                  {/* Icon */}
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity`} />
                    <div className={`relative p-3 bg-gradient-to-br ${stat.gradient} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                      {stat.value}
                    </p>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${stat.gradient} group-hover:w-full transition-all duration-500`} />
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentStats;
