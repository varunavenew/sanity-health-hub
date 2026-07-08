import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Guide from "./pages/Guide";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/treatments/CategoryPage";
import GenericSubTreatmentPage from "./pages/treatments/GenericSubTreatmentPage";
import GastrokirurgiPage from "./pages/treatments/GastrokirurgiPage";
import GastrokirurgiMethodPage from "./pages/treatments/GastrokirurgiMethodPage";
import HudbehandlingerPage from "./pages/treatments/HudbehandlingerPage";
import HudbehandlingerMethodPage from "./pages/treatments/HudbehandlingerMethodPage";
import Priser from "./pages/Priser";
import PriserKategorikort from "./pages/demos/PriserKategorikort";
import PriserMagasin from "./pages/demos/PriserMagasin";
import PriserSpotlight from "./pages/demos/PriserSpotlight";
import HomeDemoEditorial from "./pages/home-demo/HomeDemoEditorial";
import HomeDemoKompakt from "./pages/home-demo/HomeDemoKompakt";
import HomeDemoFortelling from "./pages/home-demo/HomeDemoFortelling";
import Insurance from "./pages/Insurance";
import BookingDemo from "./pages/BookingDemo";
import Services from "./pages/Services";
import SpecialistProfile from "./pages/SpecialistProfile";
import Specialists from "./pages/Specialists";
import AboutSpecialists from "./pages/AboutSpecialists";
import KvinnehelsePage from "./pages/themes/KvinnehelsePage";

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
// Removed: /fertilitet-design experiment pages (deleted).
import CategoryPageNew from "./pages/treatments/CategoryPageNew";
import GraviditetEtterMaster from "./pages/demos/GraviditetEtterMaster";
import Graviditet from "./pages/treatments/Graviditet";
import UrologiPage from "./pages/treatments/UrologiPage";
import OrtopediPage from "./pages/treatments/OrtopediPage";
import FlereFagomraderPage from "./pages/treatments/FlereFagomraderPage";
import Fertility from "./pages/treatments/Fertility";
import Gynecology from "./pages/treatments/Gynecology";
import GynekologiSubPage from "./pages/treatments/GynekologiSubPage";
import FertilitetSubPage from "./pages/treatments/FertilitetSubPage";
import IconPreview from "./pages/IconPreview";
import DemoOversikt from "./pages/DemoOversikt";
import Godkjenning from "./pages/Godkjenning";
import MalDemo from "./pages/MalDemo";
import TipsDemo from "./pages/demos/TipsDemo";
import SpesialisterLayoutDemo from "./pages/demos/SpesialisterLayoutDemo";
import HomeDemoBlend from "./pages/home-demo/HomeDemoBlend";
import HomeDemoOverlap from "./pages/home-demo/HomeDemoOverlap";
import HomeDemoCut from "./pages/home-demo/HomeDemoCut";
import HomeDemoLek from "./pages/home-demo/HomeDemoLek";
import HomeDemoNy from "./pages/home-demo/HomeDemoNy";
import PriserInlineInfo from "./pages/demos/PriserInlineInfo";
import SpecialistDesignHub from "./pages/specialist-design/DesignHub";
import SpecialistEditorial from "./pages/specialist-design/EditorialVariant";
import SpecialistKlinisk from "./pages/specialist-design/KliniskVariant";
import SpecialistAtelier from "./pages/specialist-design/AtelierVariant";
import { useUiTranslations } from "./hooks/useUiTranslations";
import { useServiceImagesSync } from "./hooks/useServiceImages";
import Rediger from "./pages/Rediger";
import { EditableProvider } from "./lib/editable/EditableContext";
import { EditModeBar } from "./components/editable/EditModeBar";

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
  useUiTranslations();
  useServiceImagesSync();
  return (

    <>
      <Routes>
        <Route path="/" element={<HomeDemoLek isChatOpen={false} />} />
        <Route path="/hjem-demo/original" element={<Index isChatOpen={false} />} />
        <Route path="/demoer" element={<DemoOversikt isChatOpen={false} />} />
        <Route path="/design-demoer" element={<DemoOversikt isChatOpen={false} />} />
        <Route path="/icon-preview" element={<IconPreview />} />
        <Route path="/product/:id" element={<ProductDetail isChatOpen={false} />} />
        <Route path="/produkt/:id" element={<ProductDetail isChatOpen={false} />} />
        <Route path="/about" element={<About isChatOpen={false} />} />
        <Route path="/guide" element={<Guide isChatOpen={false} />} />
        <Route path="/contact" element={<Contact isChatOpen={false} />} />
        <Route path="/priser" element={<Priser isChatOpen={false} />} />
        <Route path="/demoer/priser-inline-info" element={<PriserInlineInfo isChatOpen={false} />} />
        <Route path="/demoer/priser-kategorikort" element={<PriserKategorikort isChatOpen={false} />} />
        <Route path="/demoer/priser-magasin" element={<PriserMagasin isChatOpen={false} />} />
        <Route path="/demoer/priser-spotlight" element={<PriserSpotlight isChatOpen={false} />} />
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
        <Route path="/graviditet" element={<Graviditet isChatOpen={false} />} />
        <Route path="/flere-fagomrader" element={<FlereFagomraderPage isChatOpen={false} />} />
        {/* Norwegian slugs */}
        <Route path="/behandlinger/gynekologi" element={<Gynecology isChatOpen={false} />} />
        <Route path="/behandlinger/fertilitet" element={<Fertility isChatOpen={false} />} />
        <Route path="/behandlinger/urologi" element={<UrologiPage isChatOpen={false} />} />
        <Route path="/behandlinger/ortopedi" element={<OrtopediPage isChatOpen={false} />} />
        <Route path="/behandlinger/graviditet" element={<Graviditet isChatOpen={false} />} />
        <Route path="/behandlinger/flere-fagomrader" element={<FlereFagomraderPage isChatOpen={false} />} />
        {/* Sub-treatment routes */}
        <Route path="/behandlinger/gynekologi/nipt" element={<Navigate to="/behandlinger/graviditet/nipt" replace />} />
        <Route path="/behandlinger/gynekologi/:subId" element={<GynekologiSubPage isChatOpen={false} />} />
        
        {/* Fertilitet slug aliases */}
        <Route path="/behandlinger/fertilitet/assistert-befruktning-par-single" element={<Navigate to="/behandlinger/fertilitet/assistert-befruktning-for-par-og-single" replace />} />
        <Route path="/behandlinger/fertilitet/par-og-single" element={<Navigate to="/behandlinger/fertilitet/assistert-befruktning-for-par-og-single" replace />} />
        <Route path="/behandlinger/fertilitet/fertilitetsutredning-juli" element={<Navigate to="/behandlinger/fertilitet/fertilitetsutredning-i-juli" replace />} />
        <Route path="/behandlinger/fertilitet/teamet" element={<Navigate to="/spesialister?kategori=fertilitet" replace />} />
        {/* Fjernede sider — redirect til riktig samleside i ny fertilitet-struktur */}
        <Route path="/behandlinger/fertilitet/ivf" element={<Navigate to="/behandlinger/fertilitet/assistert-befruktning" replace />} />
        <Route path="/behandlinger/fertilitet/iui" element={<Navigate to="/behandlinger/fertilitet/assistert-befruktning" replace />} />
        <Route path="/behandlinger/fertilitet/pgt" element={<Navigate to="/behandlinger/fertilitet" replace />} />
        <Route path="/behandlinger/fertilitet/psykisk-helsehjelp" element={<Navigate to="/behandlinger/fertilitet" replace />} />
        <Route path="/behandlinger/fertilitet/nedfrysing" element={<Navigate to="/behandlinger/fertilitet/eggfrys" replace />} />
        <Route path="/behandlinger/fertilitet/eggdonasjon" element={<Navigate to="/behandlinger/fertilitet/donorbehandling" replace />} />
        <Route path="/behandlinger/fertilitet/mannlig-fertilitet" element={<Navigate to="/behandlinger/fertilitet/saedanalyse" replace />} />
        <Route path="/behandlinger/fertilitet/fertilitetssjekk" element={<Navigate to="/behandlinger/fertilitet/fertilitetsutredning" replace />} />
        {/* Spesialist fjernet — redirect til oversikten */}
        <Route path="/spesialister/line-jacob" element={<Navigate to="/spesialister" replace />} />
        <Route path="/behandlinger/fertilitet/:subId" element={<FertilitetSubPage isChatOpen={false} />} />
        <Route path="/behandlinger/urologi/:subId" element={<GenericSubTreatmentPage categoryId="urologi" isChatOpen={false} />} />
        <Route path="/behandlinger/ortopedi/:subId" element={<GenericSubTreatmentPage categoryId="ortopedi" isChatOpen={false} />} />
        <Route path="/behandlinger/graviditet/:subId" element={<GenericSubTreatmentPage categoryId="graviditet" isChatOpen={false} />} />
        {/* Hudhelse — new category, sub-pages live under flere-fagomrader */}
        <Route path="/behandlinger/hudhelse" element={<Navigate to="/behandlinger/flere-fagomrader/hudhelse" replace />} />
        <Route path="/behandlinger/hudhelse/hudbehandlinger" element={<Navigate to="/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger" replace />} />
        <Route path="/behandlinger/hudhelse/hudbehandlinger/:methodId" element={<Navigate to="/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger" replace />} />
        <Route path="/behandlinger/hudhelse/behandlingsutstyr" element={<Navigate to="/behandlinger/flere-fagomrader/behandlingsutstyr" replace />} />
        <Route path="/behandlinger/hudhelse/hudpleieprodukter" element={<Navigate to="/behandlinger/flere-fagomrader/hudpleieprodukter" replace />} />
        {/* Hudhelse › Hudbehandlinger — samleområde med nested undersider */}
        <Route path="/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger" element={<HudbehandlingerPage isChatOpen={false} />} />
        <Route path="/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger/:methodId" element={<HudbehandlingerMethodPage isChatOpen={false} />} />
        <Route path="/behandlinger/flere-fagomrader/hudbehandlinger" element={<Navigate to="/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger" replace />} />
        {/* Gastrokirurgi — samleområde med nested undersider per metode */}
        <Route path="/behandlinger/flere-fagomrader/gastrokirurgi/:methodId" element={<GastrokirurgiMethodPage isChatOpen={false} />} />
        {/* Old flat URLs → redirect to nested Gastrokirurgi-undersider */}
        <Route path="/behandlinger/overvektskirurgi" element={<Navigate to="/behandlinger/flere-fagomrader/gastrokirurgi/overvektskirurgi" replace />} />
        <Route path="/behandlinger/overvektskirurgi/sleeve-gastrektomi" element={<Navigate to="/behandlinger/flere-fagomrader/gastrokirurgi/overvektskirurgi" replace />} />
        <Route path="/behandlinger/flere-fagomrader/overvektskirurgi" element={<Navigate to="/behandlinger/flere-fagomrader/gastrokirurgi/overvektskirurgi" replace />} />
        <Route path="/behandlinger/flere-fagomrader/sleeve-gastrektomi" element={<Navigate to="/behandlinger/flere-fagomrader/gastrokirurgi/overvektskirurgi" replace />} />
        <Route path="/behandlinger/flere-fagomrader/bariatrisk-kirurgi" element={<Navigate to="/behandlinger/flere-fagomrader/gastrokirurgi/overvektskirurgi" replace />} />
        <Route path="/behandlinger/flere-fagomrader/bariatrisk-kirurgi/sleeve-gastrektomi" element={<Navigate to="/behandlinger/flere-fagomrader/gastrokirurgi/overvektskirurgi" replace />} />
        <Route path="/behandlinger/flere-fagomrader/gastrokirurgi/sleeve-gastrektomi" element={<Navigate to="/behandlinger/flere-fagomrader/gastrokirurgi/overvektskirurgi" replace />} />
        <Route path="/behandlinger/flere-fagomrader/gastrokirurgi/bariatrisk-kirurgi" element={<Navigate to="/behandlinger/flere-fagomrader/gastrokirurgi/overvektskirurgi" replace />} />
        <Route path="/behandlinger/flere-fagomrader/gastrokirurgi/brokkbehandling" element={<Navigate to="/behandlinger/flere-fagomrader/gastrokirurgi/brokkoperasjon" replace />} />
        <Route path="/behandlinger/flere-fagomrader/gastrokirurgi/endetarmsplager" element={<Navigate to="/behandlinger/flere-fagomrader/gastrokirurgi/hemorroider-og-endetarmsplager" replace />} />
        <Route path="/behandlinger/flere-fagomrader/brokkoperasjon" element={<Navigate to="/behandlinger/flere-fagomrader/gastrokirurgi/brokkoperasjon" replace />} />
        <Route path="/behandlinger/flere-fagomrader/hemorroider" element={<Navigate to="/behandlinger/flere-fagomrader/gastrokirurgi/hemorroider-og-endetarmsplager" replace />} />

        {/* Gastrokirurgi landing — custom layout (skip redundant prose intro) */}
        <Route path="/behandlinger/flere-fagomrader/gastrokirurgi" element={<GastrokirurgiPage isChatOpen={false} />} />
        {/* Ernæringsfysiolog slug alias */}
        <Route path="/behandlinger/flere-fagomrader/ernaeringsfysiolog" element={<Navigate to="/behandlinger/flere-fagomrader/ernaringsfysiolog" replace />} />
        <Route path="/behandlinger/flere-fagomrader/:subId" element={<GenericSubTreatmentPage categoryId="flere-fagomrader" isChatOpen={false} />} />
        {/* Theme pages */}
        <Route path="/kvinnehelse" element={<KvinnehelsePage isChatOpen={false} />} />
        <Route path="/tverrfaglige-team" element={<Navigate to="/behandlinger/gynekologi/tverrfaglig" replace />} />
        <Route path="/robotassistert-kirurgi" element={<RobotkirurgiPage isChatOpen={false} />} />
        {/* Fastlegeveiledning */}
        <Route path="/fastlegeveiledning-overgangsalder" element={<FastlegeveiledningOvergangsalder isChatOpen={false} />} />
        {/* Personvern */}
        <Route path="/personvern" element={<Personvern isChatOpen={false} />} />
        <Route path="/vilkar" element={<Personvern isChatOpen={false} />} />
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
        {/* Eksperiment-sider slettet — alle /fertilitet-design/* peker tilbake til fertilitet-landingen */}
        <Route path="/fertilitet-design" element={<Navigate to="/behandlinger/fertilitet" replace />} />
        <Route path="/fertilitet-design/*" element={<Navigate to="/behandlinger/fertilitet" replace />} />
        {/* Clinic pages */}
        <Route path="/klinikker" element={<Clinics isChatOpen={false} />} />
        <Route path="/klinikker/:slug" element={<ClinicDetailPage isChatOpen={false} />} />
        {/* Internal approval tracker */}
        <Route path="/godkjenning" element={<Godkjenning />} />
        <Route path="/maler/:key" element={<MalDemo />} />
        <Route path="/demoer/tips" element={<TipsDemo />} />
        <Route path="/demoer/spesialister-layout" element={<SpesialisterLayoutDemo />} />
        {/* Homepage section-transition demos */}
        <Route path="/hjem-demo/blend" element={<HomeDemoBlend isChatOpen={false} />} />
        <Route path="/hjem-demo/overlap" element={<HomeDemoOverlap isChatOpen={false} />} />
        <Route path="/hjem-demo/kutt" element={<HomeDemoCut isChatOpen={false} />} />
        <Route path="/hjem-demo/lek" element={<HomeDemoLek isChatOpen={false} />} />
        <Route path="/hjem-demo/ny" element={<HomeDemoNy isChatOpen={false} />} />
        <Route path="/hjem-demo/editorial" element={<HomeDemoEditorial isChatOpen={false} />} />
        <Route path="/hjem-demo/kompakt" element={<HomeDemoKompakt isChatOpen={false} />} />
        <Route path="/hjem-demo/fortelling" element={<HomeDemoFortelling isChatOpen={false} />} />
        {/* Specialist profile design demos */}
        <Route path="/spesialist-design" element={<SpecialistDesignHub isChatOpen={false} />} />
        <Route path="/spesialist-design/editorial" element={<SpecialistEditorial isChatOpen={false} />} />
        <Route path="/spesialist-design/klinisk" element={<SpecialistKlinisk isChatOpen={false} />} />
        <Route path="/spesialist-design/atelier" element={<SpecialistAtelier isChatOpen={false} />} />
        {/* Internal editor */}
        <Route path="/rediger" element={<Rediger />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <EditModeBar />
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
