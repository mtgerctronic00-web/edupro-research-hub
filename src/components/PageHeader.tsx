import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

const PageHeader = ({ icon: Icon, title, description, gradient }: PageHeaderProps) => {
  return (
    <div className="bg-gradient-to-br from-card to-muted border-b border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 animate-shimmer" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-float" />
      
      <div className="container mx-auto px-8 py-12 relative z-10">
        <div className="flex items-center gap-6 animate-slide-up">
          <div className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} shadow-2xl animate-bounce-in hover:scale-110 hover:rotate-3 transition-all duration-500`}>
            <Icon className="h-12 w-12 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text animate-slide-up">{title}</h1>
            <p className="text-lg text-muted-foreground animate-slide-up" style={{ animationDelay: '0.1s' }}>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
