import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // The app is fully client-side, so it is exported as plain HTML/JS/CSS into
  // `out/` and can be served from any static host (Netlify, in our case).
  output: "export",
};

export default nextConfig;
