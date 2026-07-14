import { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate, useLocaleParam } from "@/lib/router";
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteSettings } from '@/hooks/useSanity';
import { resolveNavLabel, resolveNavPath } from '@/lib/navigation/resolve-nav-label';
import { useCmsRouteContext } from '@/lib/routing/cms-route-context';
import { useTranslation } from 'react-i18next';
import { MobileNavMenuContent } from '@/components/layout/MobileNavMenuContent';
import {
  BURGER_EXTRA_NAV_ITEMS,
  DEFAULT_MAIN_NAVIGATION,
  withRequiredMainNavigation,
} from '@/lib/navigation/default-main-navigation';

const BurgerMenu = () => {
  const { t } = useTranslation();
  const locale = useLocaleParam();
  const uiLang = locale === "en" ? "en" : "nb";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { data: siteSettings } = useSiteSettings();
  const { index: cmsRouteIndex, localeMap } = useCmsRouteContext();

  const staticMenuItems = useMemo(
    () => [...DEFAULT_MAIN_NAVIGATION, ...BURGER_EXTRA_NAV_ITEMS],
    [],
  );

  const menuItems = useMemo(() => {
    const raw = siteSettings?.mainNavigation?.length
      ? [...withRequiredMainNavigation(siteSettings.mainNavigation), ...BURGER_EXTRA_NAV_ITEMS]
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

  const servicesPath = useMemo(
    () => resolveNavPath({ navId: "services" }, locale, cmsRouteIndex),
    [locale, cmsRouteIndex],
  );

  const burgerFlatItems = useMemo(
    () =>
      menuItems.map((item) => ({
        ...item,
        path: item.isServicesDropdown ? servicesPath : item.path,
      })),
    [menuItems, servicesPath],
  );

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
    if (!isMenuOpen) return;
    if (window.matchMedia("(min-width: 768px)").matches) return;

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

      const clickedInsideMenu =
        !!mobileMenuRef.current?.contains(target) || !!menuRef.current?.contains(target);
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

  const desktopMenuPanel = (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 top-full z-50 mt-3 hidden min-w-[280px] overflow-hidden rounded-2xl bg-white shadow-2xl md:block"
      role="dialog"
      aria-modal="true"
      aria-label={t("nav.navigationMenu")}
    >
      <div className="p-5">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-foreground/50">
          {t("nav.menu")}
        </h3>
        <nav className="space-y-0.5">
          {menuItems.map((item) => (
            <button
              key={item.path + item.label}
              type="button"
              onClick={() => handleNavigate(item.path)}
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-normal text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-5 border-t border-border pt-5">
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-foreground/50">
            {t("nav.quickContact")}
          </h3>
          <div className="space-y-2">
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
            >
              <Phone className="h-4 w-4" />
              {phone}
            </a>
            <button
              type="button"
              onClick={() => handleNavigate("/kontakt")}
              className="flex items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              {t("nav.contactForm")}
            </button>
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <MapPin className="h-4 w-4" />
              {address}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <button
          type="button"
          onClick={() => handleNavigate(ctaButton.path)}
          className="w-full rounded-2xl bg-accent py-3 text-sm font-normal text-accent-foreground transition-colors hover:bg-accent/90"
        >
          {ctaButton.label}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="rounded-full border border-border/30 bg-white p-2.5 shadow-md transition-all hover:bg-white/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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

      <AnimatePresence>{isMenuOpen ? desktopMenuPanel : null}</AnimatePresence>
    </div>
  );
};

export default BurgerMenu;
