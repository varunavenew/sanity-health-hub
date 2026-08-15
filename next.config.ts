import type { NextConfig } from "next";
import path from "path";
import webpack from "webpack";
import {
  requireSanityDataset,
  requireSanityProjectId,
} from "./src/lib/sanity/dataset-env";

// Fail fast — never bake a silent dataset default into the client bundle.
// Startup banner is logged once from src/instrumentation.ts.
const sanityProjectId = requireSanityProjectId();
const sanityDataset = requireSanityDataset();

const nextConfig: NextConfig = {
  // Allow overriding when `.next` is locked (Windows EPERM on trace).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  // Pin workspace root — avoids Next.js picking up parent lockfile (Documents/package-lock.json).
  outputFileTracingRoot: path.join(__dirname),
  // Disable dev indicator panel (segment explorer can crash with React 19 on Windows).
  devIndicators: false,
  transpilePackages: [
    "next-sanity",
    "sanity",
    "@sanity/vision",
    "sanity-plugin-internationalized-array",
    "sanity-plugin-iframe-pane",
  ],
  /**
   * Mirror Studio env vars into NEXT_PUBLIC_* so the browser bundle can read the
   * same project/dataset as `test/sanity`. Values must come from env (no hardcoded dataset).
   */
  env: {
    // Embedded Studio lives at /studio — must match sanity.config basePath (see test/sanity.config.ts).
    SANITY_STUDIO_BASEPATH: "/studio",
    NEXT_PUBLIC_SANITY_PROJECT_ID: sanityProjectId,
    NEXT_PUBLIC_SANITY_DATASET: sanityDataset,
    SANITY_PROJECT_ID: sanityProjectId,
    SANITY_DATASET: sanityDataset,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "storage.googleapis.com", pathname: "/**" },
      { protocol: "https", hostname: "pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev", pathname: "/**" },
    ],
  },
  webpack: (config, { isServer }) => {
    const projectNodeModules = path.resolve(__dirname, "node_modules");

    config.resolve = config.resolve ?? {};
    config.resolve.modules = [
      projectNodeModules,
      ...(Array.isArray(config.resolve.modules)
        ? config.resolve.modules
        : config.resolve.modules
          ? [config.resolve.modules]
          : ["node_modules"]),
    ];
    // Do NOT alias `react` / `react-dom` here — App Router + RSC need package
    // export conditions (`react-server`). Forcing a file path breaks
    // LayoutRouterContext and shows: Cannot read properties of null (reading 'useContext').
    // Parent-folder React conflicts are handled by scripts/patch-react-resolution.cjs.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    if (!isServer) {
      config.plugins = config.plugins ?? [];
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
          resource.request = resource.request.replace(/^node:/, "");
        }),
      );
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
      };
    }
    return config;
  },
  async rewrites() {
    return [
      // L5E asset URLs must not match `[locale]` — serve via API route.
      {
        source: "/__l5e/assets-v1/:assetId/:filename",
        destination: "/api/l5e-assets/:assetId/:filename",
      },

      // CMS nav aliases (siteSettings paths that differ from Next.js route folders).
      { source: "/en/prices", destination: "/en/pricing" },
      { source: "/en/current", destination: "/en/news" },
      // aboutPage EN slug is `about-us` in Sanity; nav/siteSettings may still use `/about`.
      { source: "/en/about", destination: "/en/about-us" },

      // Top-level treatment-category landings (EN marketing slugs → CMS NO folder keys).
      { source: "/en/fertility", destination: "/en/fertilitet" },
      { source: "/en/gynecology", destination: "/en/gynekologi" },
      { source: "/en/urology", destination: "/en/urologi" },
      { source: "/en/orthopedics", destination: "/en/ortopedi" },
      { source: "/en/pregnancy", destination: "/en/graviditet" },
      { source: "/en/more-specialties", destination: "/en/flere-fagomrader" },

      // Listing prefixes — accept Norwegian segments on English routes (bookmarks, hardcoded links).
      { source: "/en/spesialister", destination: "/en/specialists" },
      { source: "/en/spesialister/:path*", destination: "/en/specialists/:path*" },
      { source: "/en/klinikker", destination: "/en/clinics" },
      { source: "/en/klinikker/:path*", destination: "/en/clinics/:path*" },
      { source: "/en/aktuelt", destination: "/en/news" },
      { source: "/en/aktuelt/:path*", destination: "/en/news/:path*" },

      // Treatment pages under `/behandlinger/<category>/...`.
      { source: "/en/behandlinger/fertility", destination: "/en/behandlinger/fertilitet" },
      { source: "/en/behandlinger/fertility/:subId", destination: "/en/behandlinger/fertilitet/:subId" },
      { source: "/en/behandlinger/gynecology", destination: "/en/behandlinger/gynekologi" },
      { source: "/en/behandlinger/gynecology/:subId", destination: "/en/behandlinger/gynekologi/:subId" },
      { source: "/en/behandlinger/urology", destination: "/en/behandlinger/urologi" },
      { source: "/en/behandlinger/urology/:subId", destination: "/en/behandlinger/urologi/:subId" },
      { source: "/en/behandlinger/orthopedics", destination: "/en/behandlinger/ortopedi" },
      { source: "/en/behandlinger/orthopedics/:subId", destination: "/en/behandlinger/ortopedi/:subId" },
      { source: "/en/behandlinger/pregnancy", destination: "/en/behandlinger/graviditet" },
      { source: "/en/behandlinger/pregnancy/:subId", destination: "/en/behandlinger/graviditet/:subId" },
      { source: "/en/behandlinger/more-specialties", destination: "/en/behandlinger/flere-fagomrader" },
      {
        source: "/en/behandlinger/more-specialties/:subId",
        destination: "/en/behandlinger/flere-fagomrader/:subId",
      },
    ];
  },
  async redirects() {
    return [
      { source: "/product/:id", destination: "/nb/produkt/:id", permanent: true },

      // Legacy singleton folders → CMS slug routes (defaults until Studio changes slugs).
      { source: "/:locale(nb|no)/tjenester-og-priser", destination: "/:locale/tjenester", permanent: true },
      { source: "/:locale(en)/tjenester-og-priser", destination: "/:locale/services", permanent: true },

      // EN treatment slug changed to match the term English searchers use (PCOS, not the NO abbreviation PMOS).
      { source: "/en/gynecology/pmos", destination: "/en/gynecology/pcos", permanent: true },
      { source: "/en/behandlinger/gynekologi/pmos", destination: "/en/behandlinger/gynekologi/pcos", permanent: true },

      // "sleeve-gastrektomi" recreated under flere-fagomrader/ovrige — "bariatrisk-kirurgi" was never a real category.
      { source: "/no/bariatrisk-kirurgi/sleeve-gastrektomi", destination: "/no/ovrige/sleeve-gastrektomi", permanent: true },
      { source: "/no/bariatrisk-kirurgi/:path*", destination: "/no/ovrige/:path*", permanent: true },

      // "flere-fagomrader" was a duplicate of the real category slug "ovrige" — sitemap/static
      // generation no longer emits it (see resolve-route.ts), redirect any existing links/bookmarks.
      { source: "/no/flere-fagomrader", destination: "/no/ovrige", permanent: true },
      { source: "/no/flere-fagomrader/:path*", destination: "/no/ovrige/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
