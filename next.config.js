/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! AVISO: Isso permite o deploy mesmo com erros de tipo !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Isso ignora avisos de estilo
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
