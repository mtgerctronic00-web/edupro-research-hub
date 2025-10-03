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
import Shop from "./pages/Shop";
import Notifications from "./pages/Notifications";
import PaymentInfo from "./pages/PaymentInfo";
import Support from "./pages/Support";
import FreeSample from "./pages/FreeSample";
import Modifications from "./pages/Modifications";
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
          <Route path="/shop" element={<Shop />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/payment-info" element={<PaymentInfo />} />
          <Route path="/support" element={<Support />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/research" element={<Research />} />
          <Route path="/seminars" element={<Seminars />} />
          <Route path="/free-resources" element={<FreeResources />} />
          <Route path="/my-works" element={<MyWorks />} />
          <Route path="/free-sample" element={<FreeSample />} />
          <Route path="/modifications" element={<Modifications />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
