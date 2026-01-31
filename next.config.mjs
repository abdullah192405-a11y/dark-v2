/** @type {import('next').NextConfig} */

// Prevent glob from scanning protected directories
process.env.GLOBBY_IGNORE = 'C:\\Users\\**,C:\\Windows\\**,C:\\ProgramData\\**';
process.env.GLOBBY_OPTIONS = JSON.stringify({
  ignore: ['C:\\Users\\**', 'C:\\Windows\\**', 'C:\\ProgramData\\**', '**/Cookies/**'],
  followSymlinkedDirectories: false,
});

const nextConfig = {
  // Required by Next.js 16 if you want to use Webpack
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zafndavpzgpcbqgvosbt.supabase.co",
        pathname: "/storage/v1/object/public/**", // allow Supabase storage path
      },
      {
        protocol: "https",
        hostname: "mejemytwlemjflpcftct.supabase.co",
        pathname: "/storage/v1/object/public/**", // allow Supabase storage path
      },
      {
        protocol: "https",
        hostname: "yffvqnbnbuqcfqmuxmqo.supabase.co",
        pathname: "/storage/v1/object/public/**", // allow Supabase storage path
      },
      {
        protocol: "https",
        hostname: "jbpsuxpvazcchafiqnrf.supabase.co",
        pathname: "/storage/v1/object/public/**", // allow Supabase storage path
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },

  // Custom webpack config (keeps your project working)
  webpack(config, { isServer }) {
    // Prevent webpack/glob from scanning system directories
    config.watchOptions = {
      ignored: /node_modules|\.next|\.git|dist|build/,
      poll: false,
      aggregateTimeout: 300,
    };
    
    // Disable glob pattern scanning that causes permission issues
    if (config.module && config.module.rules) {
      config.module.rules = config.module.rules.map(rule => {
        if (rule.exclude) {
          if (typeof rule.exclude === 'function') {
            const originalExclude = rule.exclude;
            rule.exclude = (path) => {
              if (path.includes('Cookies') || path.includes('AppData')) {
                return true;
              }
              return originalExclude(path);
            };
          } else if (rule.exclude instanceof RegExp) {
            rule.exclude = new RegExp(rule.exclude.source + '|Cookies|AppData');
          }
        }
        return rule;
      });
    }

    return config;
  },

  experimental: {
    webpackBuildWorker: true,
    serverActions: {
      bodySizeLimit: '150mb',
      allowedOrigins: ['*'],
    },
  },

  // Increase payload size limits
  api: {
    bodyParser: {
      sizeLimit: '150mb',
    },
    responseLimit: '150mb',
  },

  // Middleware body size limit - MUST match server actions limit
  // This is critical for allowing large uploads through middleware
  middlewareClientMaxBodySize: '150mb',
  
  // Also set at the builder level
  httpMaxRequestSize: '150mb',
  
  // Allow streaming uploads
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
