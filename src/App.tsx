import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Research from "./pages/Research";
import Seminars from "./pages/Seminars";
import FreeResources from "./pages/FreeResources";
import MyWorks from "./pages/MyWorks";
import Auth from "./pages/Auth";
import BookingPage from "./pages/BookingPage";
import MyOrders from "./pages/MyOrders";
import AdminPanel from "./pages/AdminPanel";
import SetupAdmin from "./pages/SetupAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/setup-admin" element={<SetupAdmin />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/research" element={<Research />} />
          <Route path="/seminars" element={<Seminars />} />
          <Route path="/free-resources" element={<FreeResources />} />
          <Route path="/my-works" element={<MyWorks />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
