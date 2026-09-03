import type { Metadata } from "next";
import BookingDemo from "@/site-pages/BookingDemo";
import { buildBookingMetadata } from "@/lib/seo/route-metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildBookingMetadata(locale);
}

export default function Page() {
  return <BookingDemo />;
}
