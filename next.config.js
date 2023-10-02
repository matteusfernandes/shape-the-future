/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API: 'https://shape.discloud.app/',
    NEXTAUTH_URL: 'http://localhost:3000',
    NEXTAUTH_SECRET: '42919279c210e54e94138b5c20312bc8'
  }
};

module.exports = nextConfig;
