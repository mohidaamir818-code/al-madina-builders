import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Expose Maps key to the browser for Maps JavaScript API (restrict by HTTP referrer in Cloud Console).
  // Server routes still read process.env.GOOGLE_MAPS_API_KEY directly for Places REST.
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || "",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
