import { isAppLocale, locales, type AppLocale } from "@/lib/i18n/routing";
import { NextProviders } from "@/components/providers/NextProviders";
import { fetchCmsRouteIndex } from "@/lib/routing/fetch-route-index";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: localeParam } = await params;
  const locale: AppLocale = isAppLocale(localeParam) ? localeParam : "no";
  let cmsRouteIndex;
  try {
    cmsRouteIndex = await fetchCmsRouteIndex();
  } catch {
    cmsRouteIndex = undefined;
  }
  return (
    <NextProviders locale={locale} cmsRouteIndex={cmsRouteIndex}>
      {children}
    </NextProviders>
  );
}
