import { useEffect, useRef, useState, useMemo } from 'react';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate, useLocaleParam } from "@/lib/router";
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteSettings } from '@/hooks/useSanity';
import { resolveNavLabel, resolveNavPath } from '@/lib/navigation/resolve-nav-label';
import { useCmsRouteContext } from '@/lib/routing/cms-route-context';
import { useTranslation } from 'react-i18next';

const BurgerMenu = () => {
  const { t } = useTranslation();
  const locale = useLocaleParam();
  const uiLang = locale === "en" ? "en" : "nb";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { data: siteSettings } = useSiteSettings();
  const { index: cmsRouteIndex, localeMap } = useCmsRouteContext();

  const staticMenuItems = useMemo(
    () => [
      { navId: "services" },
      { navId: "pricing" },
      { navId: "clinics" },
      { navId: "about" },
      { navId: "insurance" },
      { navId: "news" },
      { navId: "contact" },
      { navId: "specialists" },
    ],
    [],
  );

  const menuItems = useMemo(() => {
    const raw = siteSettings?.mainNavigation?.length
      ? siteSettings.mainNavigation
      : staticMenuItems;
    return raw.map((item: { label?: string; path?: string; navId?: string }) => ({
      path: resolveNavPath(item, locale, cmsRouteIndex),
      label: resolveNavLabel(item, t, uiLang, localeMap),
    }));
  }, [siteSettings?.mainNavigation, staticMenuItems, t, locale, uiLang, cmsRouteIndex, localeMap]);

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

    const close = () => setIsMenuOpen(false);

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;

      const clickedInsideMenu = !!menuRef.current?.contains(target);
      const clickedOnButton = !!buttonRef.current?.contains(target);
      if (!clickedInsideMenu && !clickedOnButton) close();
    };

    document.addEventListener('pointerdown', onPointerDown, true);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [isMenuOpen]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="p-2.5 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-white/90 transition-all border border-border/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
      >
        {isMenuOpen ? <X className="h-5 w-5 text-foreground" aria-hidden="true" /> : <Menu className="h-5 w-5 text-foreground" aria-hidden="true" />}
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-3 md:mt-3 max-md:fixed max-md:inset-0 max-md:top-0 max-md:mt-0 bg-white rounded-2xl max-md:rounded-none shadow-2xl z-50 overflow-hidden min-w-[280px] max-md:min-w-0 max-md:overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.navigationMenu")}
          >
            <div className="flex items-center justify-end p-4 border-b border-border md:hidden">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-foreground/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-md"
                aria-label={t("nav.closeMenu")}
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="p-5 md:p-5 max-md:p-6">
              <h3 className="text-foreground/50 text-xs uppercase tracking-wider mb-3 max-md:mb-4 font-medium">
                {t("nav.menu")}
              </h3>
              <nav className="space-y-0.5 max-md:space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.path + item.label}
                    onClick={() => handleNavigate(item.path)}
                    className="w-full text-left py-2 px-3 max-md:py-3 max-md:px-0 text-foreground/80 hover:text-foreground hover:bg-muted max-md:hover:bg-transparent text-sm max-md:text-base font-normal transition-colors rounded-lg max-md:rounded-none"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="mt-5 pt-5 max-md:mt-8 max-md:pt-6 border-t border-border">
                <h3 className="text-foreground/50 text-xs uppercase tracking-wider mb-3 max-md:mb-4 font-medium">
                  {t("nav.quickContact")}
                </h3>
                <div className="space-y-2 max-md:space-y-3">
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 max-md:gap-3 text-sm max-md:text-base text-foreground/70 hover:text-foreground transition-colors"
                  >
                    <Phone className="h-4 w-4 max-md:h-5 max-md:w-5" />
                    {phone}
                  </a>
                  <button
                    onClick={() => handleNavigate("/kontakt")}
                    className="flex items-center gap-2 max-md:gap-3 text-sm max-md:text-base text-foreground/70 hover:text-foreground transition-colors"
                  >
                    <Mail className="h-4 w-4 max-md:h-5 max-md:w-5" />
                    {t("nav.contactForm")}
                  </button>
                  <div className="flex items-center gap-2 max-md:gap-3 text-sm max-md:text-base text-foreground/70">
                    <MapPin className="h-4 w-4 max-md:h-5 max-md:w-5" />
                    {address}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 pb-5 max-md:px-6 max-md:pb-8">
              <button
                onClick={() => handleNavigate(ctaButton.path)}
                className="w-full py-3 max-md:py-4 text-sm max-md:text-base font-normal bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl transition-colors"
              >
                {ctaButton.label}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BurgerMenu;
