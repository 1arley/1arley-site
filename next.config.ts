import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isVercel ? {} : { output: "standalone", distDir: ".next-build" }),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];

    const apiHost = process.env.API_BASE_URL
      ?.replace(/\/api\/v\d+$/, "")
      .replace(/\/api$/, "");

    return [
      {
        source: "/uploads/:path*",
        destination: `${apiHost}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
