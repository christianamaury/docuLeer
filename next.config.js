/** @type {import('next').NextConfig} */

//We have to do this config in order to use our PDF
const nextConfig = {
    // Add dynamic env fallback using VERCEL_URL
    env: {
      KINDE_SITE_URL: process.env.KINDE_SITE_URL ?? `https://${process.env.VERCEL_URL}`,

      KINDE_POST_LOGOUT_REDIRECT_URL:

        process.env.KINDE_POST_LOGOUT_REDIRECT_URL ?? `https://${process.env.VERCEL_URL}`,
      KINDE_POST_LOGIN_REDIRECT_URL:
      
        process.env.KINDE_POST_LOGIN_REDIRECT_URL ?? `https://${process.env.VERCEL_URL}/dashboard`
    },
  
    async redirects() {
      return [
        {
          source: "/sign-in",
          destination: "/api/auth/login",
          permanent: true,
        },
        {
          source: "/sign-up",
          destination: "/api/auth/register",
          permanent: true,
        },
      ];
    },
  
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      config.resolve.alias.canvas = false;
      config.resolve.alias.encoding = false;
      return config;
    },
  };
  
  module.exports = nextConfig;
