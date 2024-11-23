/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  

  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
    AWS_REGION: process.env.AWS_REGION,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    API_GATEWAY_URL: process.env.API_GATEWAY_URL,
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-api-key' },
        ],
      },
    ];
  },

  serverRuntimeConfig: {
    apiTimeout: 60000, // 60 seconds
  },

  webpack: (config, { isServer }) => {
    // Add rule for .gltf files
    config.module.rules.push({
      test: /\.(gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/',
          outputPath: 'static/',
        },
      },
    });

    // Existing webpack configuration
    if (isServer) {
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        if (entries['./pages/api/plant/[id].js']) {
          entries['./pages/api/plant/[id].js'].unshift('./src/serverLogger.js');
        }
        return entries;
      };
    }

    // Add fallbacks for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        crypto: false,
        path: false,
        stream: false,
      };
    }

    return config;
  },

  images: {
    domains: ['virtual-herbal-garden-3d-models.s3.ap-south-1.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;