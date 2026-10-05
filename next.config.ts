import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/python-quest", destination: "/python-quest/index.html", permanent: false },
      { source: "/python-quest/", destination: "/python-quest/index.html", permanent: false },
    ];
  },
};

export default nextConfig;
