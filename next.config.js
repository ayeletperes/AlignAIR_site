const isPages = process.env.GITHUB_PAGES === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: isPages ? 'export' : undefined,
    reactStrictMode: false,
    images: { unoptimized: isPages },
    // Add headers for cross-origin isolation to enable SharedArrayBuffer
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Cross-Origin-Opener-Policy',
              value: 'same-origin',
            },
            {
              key: 'Cross-Origin-Embedder-Policy',
              value: 'require-corp',
            },
          ],
        },
      ];
    },

    // Webpack configuration to handle onnxruntime-web
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          path: false,
          os: false,
          crypto: false,
          stream: false,
          util: false,
          buffer: false,
          process: false,
        };
      }

      // Use UMD build of ONNX Runtime to avoid ESM import.meta.url issues
      config.resolve.alias = {
        ...config.resolve.alias,
        'onnxruntime-web': 'onnxruntime-web/dist/ort.min.js',
      };

      // Handle ES modules
      config.module.rules.push({
        test: /\.mjs$/,
        type: 'javascript/auto',
      });

      // Copy WASM files for ONNX Runtime
      config.module.rules.push({
        test: /\.wasm$/,
        type: 'asset/resource',
      });

      // Handle conditional exports for problematic packages
      config.resolve.conditionNames = [
        ...(config.resolve.conditionNames || []),
        'browser',
        'import',
        'default',
      ];

      // Suppress ONNX Runtime warnings (these are expected and safe to ignore)
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        {
          module: /onnxruntime-web/,
          message: /Critical dependency/,
        },
        {
          module: /ort\.bundle\.min\.mjs/,
          message: /require function is used in a way in which dependencies cannot be statically extracted/,
        },
      ];

      return config;
    },

    // Configure experimental features
    experimental: {
      esmExternals: 'loose',
    },
    
    // Exclude icon.ico from being treated as a page
    pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  };
  
module.exports = nextConfig;
