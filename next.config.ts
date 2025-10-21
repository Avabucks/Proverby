import type { NextConfig } from "next";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "192.168.56.1");

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_PHP_API: isLocalhost
      ? "http://localhost:8000/api"
      : "https://proverby.it/api",
  },
};

export default nextConfig;
