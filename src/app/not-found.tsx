import type { Metadata } from "next";
import NotFound from "@/site-pages/NotFound";

export const metadata: Metadata = {
  title: { absolute: "Denne siden har fått nytt hjem | CMedical" },
  robots: { index: false, follow: false },
};

export default function RootNotFound() {
  return <NotFound />;
}
