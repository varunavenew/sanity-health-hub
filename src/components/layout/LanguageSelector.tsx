import { useState, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { stripLocaleFromPathname, type AppLocale } from "@/lib/i18n/routing";
import { appLocaleToI18n, syncI18nLanguage } from "@/lib/i18n/sync-language";
import { invalidateSanityLocaleQueries } from "@/lib/sanity/invalidate-locale-queries";
import { resolveLocaleSwitchPath } from "@/lib/navigation/nav-path-utils";
import { useCmsRouteContext } from "@/lib/routing/cms-route-context";
import { useSiteSettings } from "@/hooks/useSanity";

const languages = [
  { code: "no", label: "Norsk", short: "NO", flag: "🇳🇴" },
  { code: "en", label: "English", short: "EN", flag: "🇬🇧" },
];

export const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { i18n, t } = useTranslation();
  const pathname = usePathname() || "/";
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: siteSettings } = useSiteSettings();
  const { localeMap } = useCmsRouteContext();

  const routeLocale = pathname.split("/").filter(Boolean)[0] === "en" ? "en" : "no";
  const currentLang = routeLocale;
  const current = languages.find((l) => l.code === currentLang) || languages[0];

  const handleSelect = (code: string) => {
    const target: AppLocale = code.startsWith("en") ? "en" : "no";
    const i18nCode = appLocaleToI18n(target);
    syncI18nLanguage(i18nCode);
    try {
      localStorage.setItem("i18n-lang", target === "en" ? "en" : "nb");
    } catch {
      /* ignore */
    }
    void invalidateSanityLocaleQueries(queryClient);
    const stripped = stripLocaleFromPathname(pathname);
    const navItems = [
      ...(siteSettings?.mainNavigation || []),
      ...(siteSettings?.footerAboutLinks || []),
      ...(siteSettings?.ctaButton ? [siteSettings.ctaButton] : []),
    ];
    const switched = resolveLocaleSwitchPath(
      stripped === "/" ? "/" : stripped,
      target,
      navItems,
      localeMap,
    );
    const nextPath = switched === "/" ? `/${target}` : `/${target}${switched}`;
    router.push(nextPath);
    // Production (Vercel): re-run the server page so homepage loads $lang from Sanity.
    router.refresh();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-all"
        aria-label={t("nav.selectLanguage")}
      >
        <span className="text-sm">{current.flag}</span>
        <span className="text-xs font-medium">{current.short}</span>
        <ChevronDown className={`w-3 h-3 opacity-60 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-brand-dark/95 backdrop-blur-md border border-white/15 rounded-lg shadow-xl overflow-hidden min-w-[150px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 transition-colors text-left"
              >
                <span>{lang.flag}</span>
                <span className="font-light">{lang.label}</span>
                {lang.code === currentLang && (
                  <Check className="w-3.5 h-3.5 ml-auto text-accent" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
