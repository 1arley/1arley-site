import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === "1";

const extraHosts = [
  process.env.API_BASE_URL,
  process.env.NEXT_PUBLIC_SITE_URL,
]
  .map((raw) => {
    try {
      return raw ? new URL(raw).hostname : null;
    } catch {
      return null;
    }
  })
  .filter((host): host is string => Boolean(host));

const allowedHosts = Array.from(
  new Set([
    "1arley.me",
    "*.1arley.me",
    "1arley-cms-backend.onrender.com",
    ...extraHosts,
  ]),
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isVercel ? {} : { output: "standalone", distDir: ".next-build" }),
  images: {
    remotePatterns: allowedHosts.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};

export default nextConfig;
