import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

const PageHeader = ({ icon: Icon, title, description, gradient }: PageHeaderProps) => {
  return (
    <div className="bg-gradient-to-br from-card to-muted border-b border-border">
      <div className="container mx-auto px-8 py-12">
        <div className="flex items-center gap-6 animate-fade-in">
          <div className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} shadow-xl`}>
            <Icon className="h-12 w-12 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            <p className="text-lg text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
