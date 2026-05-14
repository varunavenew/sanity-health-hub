import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./site-pages/Index";
import ProductDetail from "./site-pages/ProductDetail";
import About from "./site-pages/About";
import Guide from "./site-pages/Guide";
import Contact from "./site-pages/Contact";
import NotFound from "./site-pages/NotFound";
import CategoryPage from "./site-pages/treatments/CategoryPage";
import TreatmentPage from "./site-pages/treatments/TreatmentPage";
import Priser from "./site-pages/Priser";
import Insurance from "./site-pages/Insurance";
import BookingDemo from "./site-pages/BookingDemo";
import Services from "./site-pages/Services";
import SpecialistProfile from "./site-pages/SpecialistProfile";
import Specialists from "./site-pages/Specialists";
import AboutSpecialists from "./site-pages/AboutSpecialists";
import KvinnehelsePage from "./site-pages/themes/KvinnehelsePage";
import TverrfagligePage from "./site-pages/themes/TverrfagligePage";
import RobotkirurgiPage from "./site-pages/themes/RobotkirurgiPage";
import Aktuelt from "./site-pages/Aktuelt";
import ArticlePage from "./site-pages/ArticlePage";
import FastlegeveiledningOvergangsalder from "./site-pages/FastlegeveiledningOvergangsalder";
import Personvern from "./site-pages/Personvern";
import Karriere from "./site-pages/Karriere";
import KarriereDetail from "./site-pages/KarriereDetail";
import ClinicDetailPage from "./site-pages/ClinicDetailPage";
import Clinics from "./site-pages/Clinics";
import DesignHub from "./site-pages/gynekologi-design/DesignHub";
import EditorialVariant from "./site-pages/gynekologi-design/EditorialVariant";
import JourneyVariant from "./site-pages/gynekologi-design/JourneyVariant";
import AtelierVariant from "./site-pages/gynekologi-design/AtelierVariant";
import IndexVariant from "./site-pages/gynekologi-design/IndexVariant";
import ClassicPlusVariant from "./site-pages/gynekologi-design/ClassicPlusVariant";
import FertilitetDesignHub from "./site-pages/fertilitet-design/DesignHub";
import FertilitetEditorial from "./site-pages/fertilitet-design/FertilitetEditorial";
import FertilitetJourney from "./site-pages/fertilitet-design/FertilitetJourney";
import SjekkEditorial from "./site-pages/fertilitet-design/SjekkEditorial";
import SjekkJourney from "./site-pages/fertilitet-design/SjekkJourney";
import FertilitetAtelier from "./site-pages/fertilitet-design/FertilitetAtelier";
import SjekkAtelier from "./site-pages/fertilitet-design/SjekkAtelier";
import FertilitetDialog from "./site-pages/fertilitet-design/FertilitetDialog";
import FertilitetMagasin from "./site-pages/fertilitet-design/FertilitetMagasin";
import FertilitetKlinikk from "./site-pages/fertilitet-design/FertilitetKlinikk";
import SjekkDialog from "./site-pages/fertilitet-design/SjekkDialog";
import SjekkMagasin from "./site-pages/fertilitet-design/SjekkMagasin";
import SjekkKlinikk from "./site-pages/fertilitet-design/SjekkKlinikk";
import CategoryPageNew from "./site-pages/treatments/CategoryPageNew";
import UrologiPage from "./site-pages/treatments/UrologiPage";
import OrtopediPage from "./site-pages/treatments/OrtopediPage";
import FlereFagomraderPage from "./site-pages/treatments/FlereFagomraderPage";
import Fertility from "./site-pages/treatments/Fertility";
import Gynecology from "./site-pages/treatments/Gynecology";
import GynekologiSubPage from "./site-pages/treatments/GynekologiSubPage";
import FertilitetSubPage from "./site-pages/treatments/FertilitetSubPage";
import IconPreview from "./site-pages/IconPreview";
import DemoOversikt from "./site-pages/DemoOversikt";
import Godkjenning from "./site-pages/Godkjenning";

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
        <Route path="/demoer" element={<DemoOversikt isChatOpen={false} />} />
        <Route path="/design-demoer" element={<DemoOversikt isChatOpen={false} />} />
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
        <Route path="/gynecology" element={<Gynecology isChatOpen={false} />} />
        <Route path="/gynekologi" element={<Gynecology isChatOpen={false} />} />
        <Route path="/fertility" element={<Fertility isChatOpen={false} />} />
        <Route path="/fertilitet" element={<Fertility isChatOpen={false} />} />
        <Route path="/urology" element={<UrologiPage isChatOpen={false} />} />
        <Route path="/urologi" element={<UrologiPage isChatOpen={false} />} />
        <Route path="/ortopedi" element={<OrtopediPage isChatOpen={false} />} />
        <Route path="/graviditet" element={<CategoryPageNew categoryId="graviditet" isChatOpen={false} />} />
        <Route path="/flere-fagomrader" element={<FlereFagomraderPage isChatOpen={false} />} />
        {/* Norwegian slugs */}
        <Route path="/behandlinger/gynekologi" element={<Gynecology isChatOpen={false} />} />
        <Route path="/behandlinger/fertilitet" element={<Fertility isChatOpen={false} />} />
        <Route path="/behandlinger/urologi" element={<UrologiPage isChatOpen={false} />} />
        <Route path="/behandlinger/ortopedi" element={<OrtopediPage isChatOpen={false} />} />
        <Route path="/behandlinger/graviditet" element={<CategoryPageNew categoryId="graviditet" isChatOpen={false} />} />
        <Route path="/behandlinger/flere-fagomrader" element={<FlereFagomraderPage isChatOpen={false} />} />
        {/* Sub-treatment routes */}
        <Route path="/behandlinger/gynekologi/:subId" element={<GynekologiSubPage isChatOpen={false} />} />
        <Route path="/behandlinger/fertilitet/:subId" element={<FertilitetSubPage isChatOpen={false} />} />
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
        {/* Fertilitet design demos */}
        <Route path="/fertilitet-design" element={<FertilitetDesignHub isChatOpen={false} />} />
        <Route path="/fertilitet-design/fertilitet/editorial" element={<FertilitetEditorial isChatOpen={false} />} />
        <Route path="/fertilitet-design/fertilitet/journey" element={<FertilitetJourney isChatOpen={false} />} />
        <Route path="/fertilitet-design/fertilitetssjekk/editorial" element={<SjekkEditorial isChatOpen={false} />} />
        <Route path="/fertilitet-design/fertilitetssjekk/journey" element={<SjekkJourney isChatOpen={false} />} />
        <Route path="/fertilitet-design/fertilitet/atelier" element={<FertilitetAtelier isChatOpen={false} />} />
        <Route path="/fertilitet-design/fertilitetssjekk/atelier" element={<SjekkAtelier isChatOpen={false} />} />
        <Route path="/fertilitet-design/fertilitet/dialog" element={<FertilitetDialog isChatOpen={false} />} />
        <Route path="/fertilitet-design/fertilitet/magasin" element={<FertilitetMagasin isChatOpen={false} />} />
        <Route path="/fertilitet-design/fertilitet/klinikk" element={<FertilitetKlinikk isChatOpen={false} />} />
        <Route path="/fertilitet-design/fertilitetssjekk/dialog" element={<SjekkDialog isChatOpen={false} />} />
        <Route path="/fertilitet-design/fertilitetssjekk/magasin" element={<SjekkMagasin isChatOpen={false} />} />
        <Route path="/fertilitet-design/fertilitetssjekk/klinikk" element={<SjekkKlinikk isChatOpen={false} />} />
        {/* Clinic pages */}
        <Route path="/klinikker" element={<Clinics isChatOpen={false} />} />
        <Route path="/klinikker/:slug" element={<ClinicDetailPage isChatOpen={false} />} />
        {/* Internal approval tracker */}
        <Route path="/godkjenning" element={<Godkjenning />} />
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
