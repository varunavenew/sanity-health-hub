import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Guide from "./pages/Guide";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/treatments/CategoryPage";
import TreatmentPage from "./pages/treatments/TreatmentPage";
import Priser from "./pages/Priser";
import Insurance from "./pages/Insurance";
import BookingDemo from "./pages/BookingDemo";
import Services from "./pages/Services";
import SpecialistProfile from "./pages/SpecialistProfile";
import Specialists from "./pages/Specialists";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.hash]);
  return null;
};

const AppContent = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index isChatOpen={false} />} />
        <Route path="/product/:id" element={<ProductDetail isChatOpen={false} />} />
        <Route path="/about" element={<About isChatOpen={false} />} />
        <Route path="/guide" element={<Guide isChatOpen={false} />} />
        <Route path="/contact" element={<Contact isChatOpen={false} />} />
        <Route path="/priser" element={<Priser isChatOpen={false} />} />
        <Route path="/tjenester" element={<Services isChatOpen={false} />} />
        <Route path="/tjenester-og-priser" element={<Services isChatOpen={false} />} />
        <Route path="/forsikring" element={<Insurance isChatOpen={false} />} />
        <Route path="/om-oss" element={<About isChatOpen={false} />} />
        <Route path="/kontakt" element={<Contact isChatOpen={false} />} />
        {/* Treatment category routes */}
        <Route path="/gynecology" element={<CategoryPage categoryId="gynekologi" isChatOpen={false} />} />
        <Route path="/gynekologi" element={<CategoryPage categoryId="gynekologi" isChatOpen={false} />} />
        <Route path="/fertility" element={<CategoryPage categoryId="fertilitet" isChatOpen={false} />} />
        <Route path="/fertilitet" element={<CategoryPage categoryId="fertilitet" isChatOpen={false} />} />
        <Route path="/urology" element={<CategoryPage categoryId="urologi" isChatOpen={false} />} />
        <Route path="/urologi" element={<CategoryPage categoryId="urologi" isChatOpen={false} />} />
        <Route path="/ortopedi" element={<CategoryPage categoryId="ortopedi" isChatOpen={false} />} />
        <Route path="/graviditet" element={<CategoryPage categoryId="graviditet" isChatOpen={false} />} />
        <Route path="/flere-fagomrader" element={<CategoryPage categoryId="flere-fagomrader" isChatOpen={false} />} />
        {/* Norwegian slugs */}
        <Route path="/behandlinger/gynekologi" element={<CategoryPage categoryId="gynekologi" isChatOpen={false} />} />
        <Route path="/behandlinger/fertilitet" element={<CategoryPage categoryId="fertilitet" isChatOpen={false} />} />
        <Route path="/behandlinger/urologi" element={<CategoryPage categoryId="urologi" isChatOpen={false} />} />
        <Route path="/behandlinger/ortopedi" element={<CategoryPage categoryId="ortopedi" isChatOpen={false} />} />
        <Route path="/behandlinger/graviditet" element={<CategoryPage categoryId="graviditet" isChatOpen={false} />} />
        <Route path="/behandlinger/flere-fagomrader" element={<CategoryPage categoryId="flere-fagomrader" isChatOpen={false} />} />
        {/* Sub-treatment routes */}
        <Route path="/behandlinger/gynekologi/:subId" element={<TreatmentPage categoryId="gynekologi" isChatOpen={false} />} />
        <Route path="/behandlinger/fertilitet/:subId" element={<TreatmentPage categoryId="fertilitet" isChatOpen={false} />} />
        <Route path="/behandlinger/urologi/:subId" element={<TreatmentPage categoryId="urologi" isChatOpen={false} />} />
        <Route path="/behandlinger/ortopedi/:subId" element={<TreatmentPage categoryId="ortopedi" isChatOpen={false} />} />
        <Route path="/behandlinger/graviditet/:subId" element={<TreatmentPage categoryId="graviditet" isChatOpen={false} />} />
        <Route path="/behandlinger/flere-fagomrader/:subId" element={<TreatmentPage categoryId="flere-fagomrader" isChatOpen={false} />} />
        {/* Specialist routes */}
        <Route path="/spesialister" element={<Specialists isChatOpen={false} />} />
        <Route path="/spesialister/:slug" element={<SpecialistProfile isChatOpen={false} />} />
        {/* Booking demo */}
        <Route path="/booking" element={<BookingDemo />} />
        <Route path="/bestill-time" element={<BookingDemo />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* LeadPopup moved to category pages only */}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
