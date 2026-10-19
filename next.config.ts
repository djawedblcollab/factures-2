import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  outputFileTracingIncludes: {
    "/api/factures": ["./node_modules/@sparticuz/chromium/bin/**"],
  },
};

export default nextConfig;
