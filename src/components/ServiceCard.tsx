import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  gradient: string;
}

const ServiceCard = ({ icon: Icon, title, description, link, gradient }: ServiceCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card to-muted hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-slide-up hover-lift">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      <div className="p-8 relative z-10">
        <div className={`mb-6 inline-block p-4 rounded-2xl bg-gradient-to-br ${gradient} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold mb-3 group-hover:gradient-text transition-all duration-300">
          {title}
        </h3>
        
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>
        
        <Link to={link}>
          <Button 
            variant="outline" 
            className={`w-full group-hover:bg-gradient-to-r group-hover:${gradient} group-hover:text-white group-hover:border-transparent transition-all duration-300 hover:shadow-lg`}
          >
            استكشف الآن
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ServiceCard;
