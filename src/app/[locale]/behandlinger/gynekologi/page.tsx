import type { Metadata } from "next";
import Gynecology from "@/site-pages/treatments/Gynecology";
import { createBehandlingerCategoryMetadata } from "@/lib/seo/behandlinger-metadata";

export const generateMetadata = createBehandlingerCategoryMetadata("gynekologi");

export default function Page() {
  return <Gynecology isChatOpen={false} />;
}
