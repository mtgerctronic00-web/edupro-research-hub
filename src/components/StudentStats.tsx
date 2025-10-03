import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserCheck, TrendingUp, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

const StudentStats = () => {
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [animatedValues, setAnimatedValues] = useState({
    registered: 0,
    active: 0,
    growth: 0
  });

  useEffect(() => {
    fetchStudentStats();
  }, []);

  useEffect(() => {
    if (!loading && totalStudents > 0) {
      // Animate numbers counting up
      const duration = 2000;
      const steps = 60;
      const increment = totalStudents / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setAnimatedValues({
            registered: Math.floor(increment * currentStep),
            active: Math.floor(increment * currentStep),
            growth: Math.floor(increment * currentStep)
          });
        } else {
          clearInterval(timer);
          setAnimatedValues({
            registered: totalStudents,
            active: totalStudents,
            growth: totalStudents
          });
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [loading, totalStudents]);

  const fetchStudentStats = async () => {
    try {
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
      value: loading ? "..." : animatedValues.registered,
      icon: Users,
      gradient: "from-blue-500 via-blue-600 to-cyan-500",
      bgGradient: "from-blue-500/10 via-blue-600/10 to-cyan-500/10",
      shadow: "shadow-[0_0_40px_rgba(59,130,246,0.4)]",
      borderGlow: "border-blue-500/30"
    },
    {
      title: "الطلاب النشطين",
      value: loading ? "..." : animatedValues.active,
      icon: UserCheck,
      gradient: "from-green-500 via-emerald-600 to-teal-500",
      bgGradient: "from-green-500/10 via-emerald-600/10 to-teal-500/10",
      shadow: "shadow-[0_0_40px_rgba(34,197,94,0.4)]",
      borderGlow: "border-green-500/30"
    },
    {
      title: "معدل النمو",
      value: loading ? "..." : `+${animatedValues.growth}`,
      icon: TrendingUp,
      gradient: "from-purple-500 via-pink-600 to-rose-500",
      bgGradient: "from-purple-500/10 via-pink-600/10 to-rose-500/10",
      shadow: "shadow-[0_0_40px_rgba(168,85,247,0.4)]",
      borderGlow: "border-purple-500/30"
    }
  ];

  return (
    <div className="w-full py-16 px-4 relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Animated gradient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-2 mb-4 px-6 py-2 rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">إحصائيات حية</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
            📊 إحصائيات المنصة
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            أعداد الطلاب المسجلين والنشاط المباشر على منصة EduPro
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className={`group relative p-8 bg-gradient-to-br ${stat.bgGradient} border-2 ${stat.borderGlow} hover:border-primary/60 transition-all duration-500 hover:scale-[1.05] hover:${stat.shadow} animate-fade-in overflow-hidden backdrop-blur-sm`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Grid overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, currentColor 1px, transparent 1px),
                      linear-gradient(to bottom, currentColor 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}
                />
                
                {/* Animated corner accents */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-20 rounded-bl-full transform scale-0 group-hover:scale-100 transition-transform duration-500`} />
                <div className={`absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr ${stat.gradient} opacity-20 rounded-tr-full transform scale-0 group-hover:scale-100 transition-transform duration-500`} />
                
                {/* Animated background shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1500" />
                
                {/* Multiple glowing orbs */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700`} />
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 animate-pulse`} />

                <div className="relative">
                  {/* Icon Section */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="relative">
                      {/* Icon glow effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse`} />
                      <div className={`relative p-4 bg-gradient-to-br ${stat.gradient} rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl`}>
                        <Icon className="h-10 w-10 text-white drop-shadow-lg" />
                      </div>
                    </div>
                    
                    {/* Floating sparkles */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Sparkles className="h-6 w-6 text-primary animate-bounce" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <div className="relative">
                      <p className={`text-5xl md:text-6xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent drop-shadow-sm group-hover:scale-110 transition-transform duration-300 inline-block`}>
                        {stat.value}
                      </p>
                      {/* Number glow */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                    </div>
                    
                    {/* Progress bar */}
                    <div className="h-1.5 bg-background/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 group-hover:w-full`}
                        style={{ width: '70%' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Animated border */}
                <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md`} />
                
                {/* Bottom accent line with animation */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`h-full bg-gradient-to-r ${stat.gradient} animate-shimmer bg-[length:200%_100%]`} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom decorative text */}
        <div className="text-center mt-10 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            البيانات محدثة مباشرة من قاعدة البيانات
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentStats;
