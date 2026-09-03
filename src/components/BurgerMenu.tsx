import { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocaleParam } from "@/lib/router";
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteSettings } from '@/hooks/useSanity';
import { resolveNavLabel, resolveNavPath } from '@/lib/navigation/resolve-nav-label';
import { useCmsRouteContext } from '@/lib/routing/cms-route-context';
import { useTranslation } from 'react-i18next';
import { MobileNavMenuContent } from '@/components/layout/MobileNavMenuContent';
import {
  DEFAULT_MAIN_NAVIGATION,
  withRequiredMainNavigation,
} from '@/lib/navigation/default-main-navigation';
import { trackBookingMenuStartForPath } from '@/lib/tracking/seo-events';

const DESKTOP_NAV_MQ = "(min-width: 768px)";

const BurgerMenu = () => {
  const { t } = useTranslation();
  const locale = useLocaleParam();
  const uiLang = locale === "en" ? "en" : "nb";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { data: siteSettings } = useSiteSettings();
  const { index: cmsRouteIndex, localeMap } = useCmsRouteContext();

  const staticMenuItems = useMemo(() => [...DEFAULT_MAIN_NAVIGATION], []);

  const menuItems = useMemo(() => {
    const raw = siteSettings?.mainNavigation?.length
      ? withRequiredMainNavigation(siteSettings.mainNavigation)
      : staticMenuItems;
    const seen = new Set<string>();
    const deduped = raw.filter((item: { navId?: string; label?: string }) => {
      const key = item.navId || item.label;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return deduped.map((item: { label?: string; path?: string; navId?: string; isServicesDropdown?: boolean }) => ({
      path: resolveNavPath(item, locale, cmsRouteIndex),
      label: resolveNavLabel(item, t, uiLang, localeMap),
      navId: item.navId,
      isServicesDropdown: item.isServicesDropdown || item.navId === "services",
    }));
  }, [siteSettings?.mainNavigation, staticMenuItems, t, locale, uiLang, cmsRouteIndex, localeMap]);

  const moreMenuItems = useMemo(
    () => menuItems.filter((item) => !item.isServicesDropdown && item.navId !== "services"),
    [menuItems],
  );

  const ctaButton = useMemo(() => {
    const raw = siteSettings?.ctaButton || { navId: "bookAppointment" };
    return {
      path: resolveNavPath(
        { ...raw, navId: raw.navId || "bookAppointment" },
        locale,
        cmsRouteIndex,
      ),
      label: resolveNavLabel(
        { label: raw.label, path: raw.path, navId: raw.navId || 'bookAppointment' },
        t,
        uiLang,
        localeMap,
      ),
    };
  }, [siteSettings?.ctaButton, t, locale, uiLang, cmsRouteIndex, localeMap]);
  const phone = siteSettings?.phone || '22 00 12 34';
  const address = siteSettings?.address || 'Oslo, Bergen, Trondheim';

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_NAV_MQ);
    const closeOnDesktop = () => {
      if (mq.matches) setIsMenuOpen(false);
    };
    closeOnDesktop();
    mq.addEventListener("change", closeOnDesktop);
    return () => mq.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    if (window.matchMedia(DESKTOP_NAV_MQ).matches) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const close = () => setIsMenuOpen(false);

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;

      const clickedInsideMenu = !!mobileMenuRef.current?.contains(target);
      const clickedOnButton = !!buttonRef.current?.contains(target);
      if (!clickedInsideMenu && !clickedOnButton) close();
    };

    document.addEventListener('pointerdown', onPointerDown, true);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [isMenuOpen]);

  const contactPath = useMemo(() => {
    const contactItem = menuItems.find((item) => item.navId === "contact");
    return contactItem?.path || resolveNavPath({ navId: "contact" }, locale, cmsRouteIndex);
  }, [menuItems, locale, cmsRouteIndex]);

  const handleNavigate = (path: string) => {
    trackBookingMenuStartForPath(path, "header_cta");
    navigate(path);
    setIsMenuOpen(false);
  };

  const mobileMenuPanel = (
    <motion.div
      ref={mobileMenuRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] overflow-y-auto bg-brand-warm md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={t("nav.navigationMenu")}
    >
      <div className="flex items-center justify-end border-b border-border p-4">
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          className="rounded-md p-2 text-foreground/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label={t("nav.closeMenu")}
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <MobileNavMenuContent
        moreItems={moreMenuItems}
        onNavigate={handleNavigate}
        phone={phone}
        address={address}
        contactPath={contactPath}
        ctaLabel={ctaButton.label}
        ctaPath={ctaButton.path}
      />
    </motion.div>
  );

  return (
    <div className="relative md:hidden">
      <button
        ref={buttonRef}
        className="inline-flex p-2.5 bg-white rounded-2xl shadow-md hover:shadow-lg hover:bg-white/90 transition-all border border-border/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
      >
        {isMenuOpen ? (
          <X className="h-5 w-5 text-foreground" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5 text-foreground" aria-hidden="true" />
        )}
      </button>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>{isMenuOpen ? mobileMenuPanel : null}</AnimatePresence>,
          document.body,
        )}
    </div>
  );
};

export default BurgerMenu;
