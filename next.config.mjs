/** @type {import('next').NextConfig} */
const nextConfig = {
  // A chave deve ficar na raiz do objeto, não dentro de 'experimental'
  allowedDevOrigins: ['192.168.0.11'], 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qn8uyvletjhgkuuv.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;