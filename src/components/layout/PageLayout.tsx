"use client";

import { AssetImg } from "@/components/AssetImg";
import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate, useLocaleParam } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/homepage/Footer";
import { ServicesNavMenuItem } from "@/components/layout/ServicesDropdown";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { siteNavMenuTriggerStyle } from "@/lib/navigation/site-nav-trigger-style";
import { cn } from "@/lib/utils";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { useSiteSettings } from "@/hooks/useSanity";
import { resolveNavLabel, resolveNavPath } from "@/lib/navigation/resolve-nav-label";
import { useCmsRouteContext } from "@/lib/routing/cms-route-context";
import { useTranslation } from "react-i18next";

import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { DEFAULT_MAIN_NAVIGATION, withRequiredMainNavigation } from "@/lib/navigation/default-main-navigation";
import cmWordmarkNegative from "@/assets/logos/cm-wordmark-negative.svg";

interface PageLayoutProps {
  children: React.ReactNode;
  isChatOpen: boolean;
  darkHero?: boolean;
}

export const PageLayout = ({ children, isChatOpen, darkHero = true }: PageLayoutProps) => {
  const { t } = useTranslation();
  const locale = useLocaleParam();
  const uiLang = locale === "en" ? "en" : "nb";
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomepage = /^\/(?:nb|en)?\/?$/.test(location.pathname);
  const { data: siteSettings } = useSiteSettings();
  const { index: cmsRouteIndex, localeMap } = useCmsRouteContext();

  const navItems = useMemo(() => {
    const raw = siteSettings?.mainNavigation?.length
      ? withRequiredMainNavigation(siteSettings.mainNavigation)
      : DEFAULT_MAIN_NAVIGATION;
    return raw.map((item: { _key?: string; label?: string; path?: string; navId?: string; isServicesDropdown?: boolean }) => ({
      ...item,
      label: resolveNavLabel(item, t, uiLang, localeMap),
      path: resolveNavPath(item, locale, cmsRouteIndex),
      isServicesDropdown: item.isServicesDropdown || item.navId === "services",
    }));
  }, [siteSettings?.mainNavigation, t, locale, uiLang, cmsRouteIndex, localeMap]);

  const ctaButton = useMemo(() => {
    const raw = siteSettings?.ctaButton || { navId: "bookAppointment" };
    return {
      path: resolveNavPath(
        { ...raw, navId: raw.navId || "bookAppointment" },
        locale,
        cmsRouteIndex,
      ),
      label: resolveNavLabel(
        { label: raw.label, path: raw.path, navId: raw.navId || "bookAppointment" },
        t,
        uiLang,
        localeMap,
      ),
    };
  }, [siteSettings?.ctaButton, t, locale, uiLang, cmsRouteIndex, localeMap]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsAtTop(currentScrollY < 100);

      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Combined Header - Banner + Nav that hide/show together */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          isNavVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ left: isChatOpen ? "360px" : "0" }}
      >
        {/* Navigation Bar */}
        <nav
          className={`transition-colors duration-300 ${isAtTop ? "bg-gradient-to-b from-black/70 via-black/35 to-transparent" : "bg-brand-dark/95 backdrop-blur-md"}`}
          aria-label="Hovednavigasjon"
        >
          <div className="page-shell h-16 flex items-center justify-between relative md:px-5 lg:px-16">
            <Link to="/" className="flex items-center shrink-0">
              <AssetImg
                src={cmWordmarkNegative}
                alt="CMedical"
                className="h-5 md:h-6 w-auto shrink-0"
              />
            </Link>

            {/* Main Navigation - shadcn NavigationMenu */}
            <div className="hidden md:flex items-center gap-0 lg:gap-1 text-white">
              <NavigationMenu
                className="max-w-none"
                viewportClassName="border-white/10 bg-brand-dark text-white shadow-2xl rounded-2xl"
              >
                <NavigationMenuList className="gap-0 lg:gap-1 space-x-0">
                  {navItems.map((item: { _key?: string; label?: string; path?: string; isServicesDropdown?: boolean }) =>
                    item.isServicesDropdown ? (
                      <ServicesNavMenuItem key={item._key} />
                    ) : (
                      <NavigationMenuItem key={item._key}>
                        <NavigationMenuLink asChild>
                          <Link to={item.path ?? "/"} className={cn(siteNavMenuTriggerStyle())}>
                            {item.label}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ),
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right side: Language + CTA */}
            <div className="flex items-center gap-0.5 lg:gap-1.5">
              <LanguageSelector />

              <Button
                size="sm"
                className="hidden md:inline-flex bg-accent text-accent-foreground hover:bg-accent/90 font-light rounded-2xl md:rounded-md px-2 md:px-3 lg:px-6 text-xs lg:text-sm"
                onClick={() => navigate(ctaButton.path)}
              >
                {ctaButton.label}
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/*
        Use 100% (not 100vw) for the content shell max-width.
        100vw includes the classic scrollbar gutter, so maxWidth:100vw lets
        wide children (e.g. specialists overflow-x-auto carousels) grow the
        shell to innerWidth and create a ~15px page-level horizontal scrollbar.
        min-w-0 lets the flex item shrink below intrinsic carousel min-content.
      */}
      <div className="flex min-h-screen w-full min-w-0 bg-background">
        <div
          className={cn(
            "flex-1 min-w-0 overflow-x-clip transition-all duration-300",
            isHomepage && "pb-[calc(56px+env(safe-area-inset-bottom))] md:pb-0",
          )}
          style={{
            marginLeft: isChatOpen ? "360px" : "0",
            maxWidth: isChatOpen ? "calc(100% - 360px)" : "100%",
          }}
        >
          <main id="main-content">{children}</main>
          <Footer />
        </div>
      </div>

      {isHomepage ? <MobileBottomNav /> : null}
    </>
  );
};
