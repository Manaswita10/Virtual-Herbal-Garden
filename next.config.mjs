/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Remove the experimental.appDir option
  // experimental: {
  //   appDir: true,
  // },
};

const webpackConfig = (config, { isServer }) => {
  if (!isServer) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
  }
  return config;
};

// Assign to a variable before exporting
const finalConfig = {
  ...nextConfig,
  webpack: webpackConfig,
};

export default finalConfig;