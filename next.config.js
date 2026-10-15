// Endereço real da API (Discloud), sem a barra final
const API_ORIGIN = (process.env.NEXT_PUBLIC_API || '').replace(/\/+$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // O navegador chama /backend/... no próprio domínio do site e a Vercel
  // repassa para a API. Assim não há requisição para outro domínio (sem CORS),
  // o que evita bloqueios de extensões, antivírus e filtros de rede.
  async rewrites() {
    return API_ORIGIN
      ? [{ source: '/backend/:path*', destination: `${API_ORIGIN}/:path*` }]
      : [];
  }
};

module.exports = nextConfig;
