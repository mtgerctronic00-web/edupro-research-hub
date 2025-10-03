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
      <div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl md:blur-3xl animate-float" />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10 lg:py-12 relative z-10">
        <div className="flex items-center gap-3 md:gap-4 lg:gap-6 animate-slide-up">
          <div className={`p-3 md:p-5 lg:p-6 rounded-xl md:rounded-2xl bg-gradient-to-br ${gradient} shadow-xl md:shadow-2xl animate-bounce-in hover:scale-110 hover:rotate-3 transition-all duration-500`}>
            <Icon className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text animate-slide-up">{title}</h1>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground animate-slide-up" style={{ animationDelay: '0.1s' }}>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
