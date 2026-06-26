import { Home, LayoutGrid, CalendarPlus, Search, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSiteSettings } from "@/hooks/useSanity";

/**
 * App-style bottom navigation, mobile only.
 * Hidden on md+ via `md:hidden`.
 * Each tap target ≥ 48px; respects iOS safe-area-inset-bottom.
 */
export const MobileBottomNav = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { data: siteSettings } = useSiteSettings();
  const ctaPath = siteSettings?.ctaButton?.path || "/booking";

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path + "/");
  };

  const openSearch = () => window.dispatchEvent(new CustomEvent("cm:openSearch"));
  const openMenu = () => window.dispatchEvent(new CustomEvent("cm:openMenu"));

  const item = (active: boolean) =>
    `flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] flex-1 px-1 text-[11px] transition-colors ${
      active ? "text-foreground" : "text-foreground/55 hover:text-foreground"
    }`;

  return (
    <nav
      aria-label={t("nav.navigationMenu")}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch justify-between px-2 pt-1">
        <li className="flex-1">
          <Link to="/" className={item(isActive("/"))} aria-current={isActive("/") ? "page" : undefined}>
            <Home className="h-5 w-5" aria-hidden="true" />
            <span>Hjem</span>
          </Link>
        </li>
        <li className="flex-1">
          <Link
            to="/tjenester"
            className={item(isActive("/tjenester") || pathname.startsWith("/behandlinger"))}
            aria-current={isActive("/tjenester") ? "page" : undefined}
          >
            <LayoutGrid className="h-5 w-5" aria-hidden="true" />
            <span>Tjenester</span>
          </Link>
        </li>
        <li className="flex-1 flex justify-center">
          <button
            type="button"
            onClick={() => navigate(ctaPath)}
            aria-label="Bestill time"
            className="-mt-5 flex flex-col items-center justify-center gap-0.5 min-w-[56px]"
          >
            <span className="flex items-center justify-center h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-lg ring-4 ring-background">
              <CalendarPlus className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="text-[11px] text-foreground">Bestill</span>
          </button>
        </li>
        <li className="flex-1">
          <button type="button" onClick={openSearch} className={item(false)} aria-label="Søk">
            <Search className="h-5 w-5" aria-hidden="true" />
            <span>Søk</span>
          </button>
        </li>
        <li className="flex-1">
          <button type="button" onClick={openMenu} className={item(false)} aria-label="Meny">
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span>Meny</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default MobileBottomNav;
