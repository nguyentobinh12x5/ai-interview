/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "116.118.51.65",
      },
    ],
  },
};

module.exports = nextConfig;
