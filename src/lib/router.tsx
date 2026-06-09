"use client";

/**
 * App Router compatibility layer for legacy `react-router-dom` imports.
 * Prefixes internal paths with the active `[locale]` segment.
 */
import NextLink from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";
import {
  useCallback,
  useMemo,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import { withLocalePath, type AppLocale } from "@/lib/i18n/routing";

export function useLocaleParam(): AppLocale {
  const params = useParams<{ locale?: string }>();
  const raw = params?.locale;
  return raw === "en" ? "en" : "no";
}

export function useNavigate() {
  const router = useRouter();
  const locale = useLocaleParam();
  return useCallback(
    (to: string | number, options?: { replace?: boolean; state?: unknown }) => {
      if (typeof to === "number") {
        if (to === -1) router.back();
        return;
      }
      const href = withLocalePath(locale, to);
      if (options?.replace) router.replace(href);
      else router.push(href);
    },
    [router, locale],
  );
}

export type RRNavigateOptions = { replace?: boolean; state?: unknown };

export function useLocation(): {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
} {
  const pathnameFull = usePathname() || "/";
  const searchParams = useNextSearchParams();
  const pathname = useMemo(() => {
    const parts = pathnameFull.split("/").filter(Boolean);
    if (parts[0] === "no" || parts[0] === "en") {
      const rest = parts.slice(1);
      if (rest.length === 0) return "/";
      return `/${rest.join("/")}`;
    }
    return pathnameFull.startsWith("/") ? pathnameFull : `/${pathnameFull}`;
  }, [pathnameFull]);

  const search = useMemo(() => {
    const s = searchParams?.toString();
    return s ? `?${s}` : "";
  }, [searchParams]);

  const hash =
    typeof window !== "undefined" && window.location.hash ? window.location.hash : "";

  return { pathname, search, hash, state: null };
}

export { useParams };

/** Detail slug from `[slug]` or catch-all `[...segments]` routes. */
export function useRouteSlug(): string {
  const params = useParams<{ slug?: string; segments?: string | string[] }>();
  const pathname = usePathname() || "/";

  if (typeof params?.slug === "string" && params.slug) return params.slug;
  const segments = params?.segments;
  if (Array.isArray(segments) && segments.length > 0) {
    return segments[segments.length - 1] ?? "";
  }
  if (typeof segments === "string" && segments) return segments;

  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "no" || parts[0] === "en") return parts[parts.length - 1] ?? "";
  return parts[parts.length - 1] ?? "";
}

type LinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & {
  to: string;
  replace?: boolean;
  state?: unknown;
  children?: ReactNode;
};

export function Link({ to, replace, children, onClick, ...rest }: LinkProps) {
  const locale = useLocaleParam();
  const href = withLocalePath(locale, to);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
    },
    [onClick],
  );

  return (
    <NextLink href={href} replace={replace} onClick={handleClick} {...rest}>
      {children}
    </NextLink>
  );
}

/** React Router v6 tuple shape: `[searchParams, setSearchParams]` */
export function useSearchParams(): [
  ReturnType<typeof useNextSearchParams>,
  (next: Record<string, string | null | undefined> | URLSearchParams, opts?: { replace?: boolean }) => void,
] {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathnameFull = usePathname() || "/";

  const setSearchParams = useCallback(
    (
      next: Record<string, string | null | undefined> | URLSearchParams,
      opts?: { replace?: boolean },
    ) => {
      if (next instanceof URLSearchParams) {
        const q = next.toString();
        const url = q ? `${pathnameFull}?${q}` : pathnameFull;
        if (opts?.replace) router.replace(url);
        else router.push(url, { scroll: false });
        return;
      }
      const usp = new URLSearchParams(searchParams?.toString() ?? "");
      Object.entries(next).forEach(([key, value]) => {
        if (value === undefined || value === null) usp.delete(key);
        else usp.set(key, value);
      });
      const q = usp.toString();
      const url = q ? `${pathnameFull}?${q}` : pathnameFull;
      if (opts?.replace) router.replace(url, { scroll: false });
      else router.push(url, { scroll: false });
    },
    [router, pathnameFull, searchParams],
  );

  return [searchParams, setSearchParams];
}
