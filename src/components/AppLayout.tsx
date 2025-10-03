import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-3 right-3 md:top-4 md:right-4 z-50 lg:hidden w-10 h-10"
        onClick={() => setMobileMenuOpen(true)}
      >
        <Menu className="h-4 w-4 md:h-5 md:w-5" />
      </Button>

      <Sidebar 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      <main className="lg:mr-72 min-h-screen p-0 lg:p-0">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
