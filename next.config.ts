import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  /**
   * Mirror Studio env vars into NEXT_PUBLIC_* so the browser bundle can read the
   * same project/dataset as `test/sanity` when only `SANITY_PROJECT_ID` is set.
   */
  env: {
    // Never bake "" at build time — Vercel previews without env vars would break client fetches.
    NEXT_PUBLIC_SANITY_PROJECT_ID:
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
      process.env.SANITY_PROJECT_ID ||
      "9jhqpk3a",
    NEXT_PUBLIC_SANITY_DATASET:
      process.env.NEXT_PUBLIC_SANITY_DATASET ||
      process.env.SANITY_DATASET ||
      "production",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "storage.googleapis.com", pathname: "/**" },
      { protocol: "https", hostname: "pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev", pathname: "/**" },
    ],
  },
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
  async rewrites() {
    return [
      // Top-level treatment-category landings (some English folders don't exist yet).
      { source: "/en/orthopedics", destination: "/en/ortopedi" },
      { source: "/en/pregnancy", destination: "/en/graviditet" },
      { source: "/en/more-specialties", destination: "/en/flere-fagomrader" },

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
    ];
  },
};

export default nextConfig;
