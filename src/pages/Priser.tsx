import { useIsMobile } from "@/hooks/use-mobile";
import PriserMobile from "./PriserMobile";
import PriserDesktop from "./PriserDesktop";

interface PageProps { isChatOpen: boolean }

/**
 * Priser router: mobile customers got a redesigned single-column layout
 * (no "Vår meny" tag row, name+price on same line, +info toggles, highlighted
 * prices). Desktop remains the original layout with sticky pill nav.
 * Split per client feedback: mobile overhaul should NOT affect desktop.
 */
const Priser = (props: PageProps) => {
  const isMobile = useIsMobile();
  return isMobile ? <PriserMobile {...props} /> : <PriserDesktop {...props} />;
};

export default Priser;
