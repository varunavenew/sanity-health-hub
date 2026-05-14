import { locales } from "@/lib/i18n/routing";
import { NextProviders } from "@/components/providers/NextProviders";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  await params;
  return <NextProviders>{children}</NextProviders>;
}
