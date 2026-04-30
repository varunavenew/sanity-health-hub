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
import AboutSpecialists from "./pages/AboutSpecialists";
import KvinnehelsePage from "./pages/themes/KvinnehelsePage";
import TverrfagligePage from "./pages/themes/TverrfagligePage";
import RobotkirurgiPage from "./pages/themes/RobotkirurgiPage";
import Aktuelt from "./pages/Aktuelt";
import ArticlePage from "./pages/ArticlePage";
import FastlegeveiledningOvergangsalder from "./pages/FastlegeveiledningOvergangsalder";
import Personvern from "./pages/Personvern";
import Karriere from "./pages/Karriere";
import KarriereDetail from "./pages/KarriereDetail";
import ClinicDetailPage from "./pages/ClinicDetailPage";
import Clinics from "./pages/Clinics";
import DesignHub from "./pages/gynekologi-design/DesignHub";
import EditorialVariant from "./pages/gynekologi-design/EditorialVariant";
import JourneyVariant from "./pages/gynekologi-design/JourneyVariant";
import AtelierVariant from "./pages/gynekologi-design/AtelierVariant";
import IndexVariant from "./pages/gynekologi-design/IndexVariant";
import ClassicPlusVariant from "./pages/gynekologi-design/ClassicPlusVariant";
import CategoryPageNew from "./pages/treatments/CategoryPageNew";
import Fertility from "./pages/treatments/Fertility";
import IconPreview from "./pages/IconPreview";

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
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname, location.hash]);
  return null;
};

const AppContent = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index isChatOpen={false} />} />
        <Route path="/icon-preview" element={<IconPreview />} />
        <Route path="/product/:id" element={<ProductDetail isChatOpen={false} />} />
        <Route path="/produkt/:id" element={<ProductDetail isChatOpen={false} />} />
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
        <Route path="/gynecology" element={<CategoryPageNew categoryId="gynekologi" isChatOpen={false} />} />
        <Route path="/gynekologi" element={<CategoryPageNew categoryId="gynekologi" isChatOpen={false} />} />
        <Route path="/fertility" element={<Fertility isChatOpen={false} />} />
        <Route path="/fertilitet" element={<Fertility isChatOpen={false} />} />
        <Route path="/urology" element={<CategoryPageNew categoryId="urologi" isChatOpen={false} />} />
        <Route path="/urologi" element={<CategoryPageNew categoryId="urologi" isChatOpen={false} />} />
        <Route path="/ortopedi" element={<CategoryPageNew categoryId="ortopedi" isChatOpen={false} />} />
        <Route path="/graviditet" element={<CategoryPageNew categoryId="graviditet" isChatOpen={false} />} />
        <Route path="/flere-fagomrader" element={<CategoryPageNew categoryId="flere-fagomrader" isChatOpen={false} />} />
        {/* Norwegian slugs */}
        <Route path="/behandlinger/gynekologi" element={<CategoryPageNew categoryId="gynekologi" isChatOpen={false} />} />
        <Route path="/behandlinger/fertilitet" element={<Fertility isChatOpen={false} />} />
        <Route path="/behandlinger/urologi" element={<CategoryPageNew categoryId="urologi" isChatOpen={false} />} />
        <Route path="/behandlinger/ortopedi" element={<CategoryPageNew categoryId="ortopedi" isChatOpen={false} />} />
        <Route path="/behandlinger/graviditet" element={<CategoryPageNew categoryId="graviditet" isChatOpen={false} />} />
        <Route path="/behandlinger/flere-fagomrader" element={<CategoryPageNew categoryId="flere-fagomrader" isChatOpen={false} />} />
        {/* Sub-treatment routes */}
        <Route path="/behandlinger/gynekologi/:subId" element={<TreatmentPage categoryId="gynekologi" isChatOpen={false} />} />
        <Route path="/behandlinger/fertilitet/:subId" element={<TreatmentPage categoryId="fertilitet" isChatOpen={false} />} />
        <Route path="/behandlinger/urologi/:subId" element={<TreatmentPage categoryId="urologi" isChatOpen={false} />} />
        <Route path="/behandlinger/ortopedi/:subId" element={<TreatmentPage categoryId="ortopedi" isChatOpen={false} />} />
        <Route path="/behandlinger/graviditet/:subId" element={<TreatmentPage categoryId="graviditet" isChatOpen={false} />} />
        <Route path="/behandlinger/flere-fagomrader/:subId" element={<TreatmentPage categoryId="flere-fagomrader" isChatOpen={false} />} />
        {/* Theme pages */}
        <Route path="/kvinnehelse" element={<KvinnehelsePage isChatOpen={false} />} />
        <Route path="/tverrfaglige-team" element={<TverrfagligePage isChatOpen={false} />} />
        <Route path="/robotassistert-kirurgi" element={<RobotkirurgiPage isChatOpen={false} />} />
        {/* Fastlegeveiledning */}
        <Route path="/fastlegeveiledning-overgangsalder" element={<FastlegeveiledningOvergangsalder isChatOpen={false} />} />
        {/* Personvern */}
        <Route path="/personvern" element={<Personvern isChatOpen={false} />} />
        {/* Karriere */}
        <Route path="/karriere" element={<Karriere isChatOpen={false} />} />
        <Route path="/karriere/:slug" element={<KarriereDetail isChatOpen={false} />} />
        {/* Aktuelt / News */}
        <Route path="/aktuelt" element={<Aktuelt isChatOpen={false} />} />
        <Route path="/aktuelt/:slug" element={<ArticlePage isChatOpen={false} />} />
        {/* Specialist routes */}
        <Route path="/om-spesialister" element={<AboutSpecialists isChatOpen={false} />} />
        <Route path="/spesialister" element={<Specialists isChatOpen={false} />} />
        <Route path="/spesialister/:slug" element={<SpecialistProfile isChatOpen={false} />} />
        {/* Booking demo */}
        <Route path="/booking" element={<BookingDemo />} />
        <Route path="/bestill-time" element={<BookingDemo />} />
        {/* Gynekologi design demos */}
        <Route path="/gynekologi-design" element={<DesignHub isChatOpen={false} />} />
        <Route path="/gynekologi-design/editorial" element={<EditorialVariant isChatOpen={false} />} />
        <Route path="/gynekologi-design/journey" element={<JourneyVariant isChatOpen={false} />} />
        <Route path="/gynekologi-design/atelier" element={<AtelierVariant isChatOpen={false} />} />
        <Route path="/gynekologi-design/index" element={<IndexVariant isChatOpen={false} />} />
        <Route path="/gynekologi-design/klassisk-plus" element={<ClassicPlusVariant isChatOpen={false} />} />
        {/* Clinic pages */}
        <Route path="/klinikker" element={<Clinics isChatOpen={false} />} />
        <Route path="/klinikker/:slug" element={<ClinicDetailPage isChatOpen={false} />} />
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
