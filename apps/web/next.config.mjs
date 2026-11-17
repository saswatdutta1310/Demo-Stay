/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  optimizeFonts: false,
  images: {
    unoptimized: true,
    domains: ["images.unsplash.com", "res.cloudinary.com"]
  }
};

export default nextConfig;
