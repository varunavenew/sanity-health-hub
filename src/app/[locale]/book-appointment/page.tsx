import type { Metadata } from "next";
import { renderHydratedBookingPage } from "@/lib/routing/render-booking-page";
import { buildBookingMetadata } from "@/lib/seo/route-metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildBookingMetadata(locale);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return renderHydratedBookingPage(locale);
}
