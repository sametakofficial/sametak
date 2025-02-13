import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy ayarları, geliştirirken backend'e istekleri yönlendirecek
  async rewrites() {
    return [
      {
        source: "/api/:path*", // /api/ ile başlayan her isteği yakala
        destination: "http://localhost:5000/api/:path*", // Backend'e yönlendir
      },
    ];
  },

  // Eğer başka özel ayarlar yapmak isterseniz, burada da ekleyebilirsiniz.
};

export default nextConfig;
