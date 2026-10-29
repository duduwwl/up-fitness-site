import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/up-fitness-site",
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        // CSS Modules keep Next's own module pipeline; Tailwind only processes global CSS.
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

