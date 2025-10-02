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
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card to-muted hover:shadow-xl transition-all duration-300 animate-fade-in">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      
      <div className="p-6 relative z-10">
        <div className={`mb-4 inline-block p-4 rounded-2xl bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-muted-foreground mb-4">
          {description}
        </p>
        
        <Link to={link}>
          <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary transition-colors">
            استكشف الآن
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ServiceCard;
