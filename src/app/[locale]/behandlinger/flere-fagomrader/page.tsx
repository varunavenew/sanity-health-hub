import type { Metadata } from "next";
import FlereFagomraderPage from "@/site-pages/treatments/FlereFagomraderPage";
import { createBehandlingerCategoryMetadata } from "@/lib/seo/behandlinger-metadata";

export const generateMetadata = createBehandlingerCategoryMetadata("flere-fagomrader");

export default function Page() {
  return <FlereFagomraderPage isChatOpen={false} />;
}
