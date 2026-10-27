import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // اضافه کردن تنظیمات تصاویر برای دامنه‌های خارجی
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "87.107.2.216:3002",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;