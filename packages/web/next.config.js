const crypto = require('crypto');
const path = require('path');
const cspBuilder = require('content-security-policy-builder');
const { withSentryConfig } = require('@sentry/nextjs');
const scripts = require('./lib/scripts');

const cspHash = (scriptOrStyle, algorithm = 'sha256') =>
  `${algorithm}-${crypto.createHash(algorithm).update(scriptOrStyle).digest().toString('base64')}`;

const inlineScripts = scripts
  .filter(({ script }) => !!script)
  .map(({ script }) => `'${cspHash(script)}'`)
  .join(' ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: false,
  distDir: 'build',
  headers: async () =>
    process.env.NODE_ENV === 'production'
      ? [
          {
            source: '/(.*)',
            headers: [
              { key: 'Server', value: 'DLabs' },
              {
                key: 'Content-Security-Policy',
                value: cspBuilder({
                  directives: {
                    defaultSrc: ["'none'"],
                    baseUri: ["'self'"],
                    blockAllMixedContent: true,
                    connectSrc: ["'self'", process.env.UPLOADS_BUCKET, '*.sentry.io'],
                    fontSrc: ["'self'"],
                    formAction: ["'self'"],
                    frameAncestors: ["'none'"],
                    frameSrc: ["'self'"],
                    imgSrc: ["'self'", 'blob:', 'data:', process.env.UPLOADS_URL],
                    manifestSrc: ["'self'"],
                    mediaSrc: ["'self'"],
                    prefetchSrc: ["'self'"],
                    scriptSrc: ["'self'", inlineScripts],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    workerSrc: ["'self'"],
                    upgradeInsecureRequests: true,
                    reportUri: process.env.SENTRY_CSP,
                  },
                }),
              },
              {
                key: 'Referrer-Policy',
                value: 'origin-when-cross-origin, strict-origin-when-cross-origin',
              },
              {
                key: 'Strict-Transport-Security',
                value: 'max-age=31536000; includeSubDomains; preload',
              },
              {
                key: 'X-Content-Type-Options',
                value: 'nosniff',
              },
              {
                key: 'X-Frame-Options',
                value: 'SAMEORIGIN',
              },
              {
                key: 'X-Robots-Tag',
                value: process.env.APP_ENV === 'production' ? 'all' : 'noindex, nofollow',
              },
              {
                key: 'X-XSS-Protection',
                value: '1; mode=block',
              },
            ],
          },
        ]
      : [],
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  sentry: {
    hideSourceMaps: true,
  },
  transpilePackages: [
    '@disruptive-labs/client',
    '@disruptive-labs/ui',
    '@popperjs/core',
    '@two/shared',
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (webpackConfig, { dev, webpack }) => {
    webpackConfig.resolve.alias['@styles'] = path.resolve(__dirname, './src/styles/');

    // Enable Sentry tree-shaking
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
        __SENTRY_TRACING__: false,
      }),
    );

    if (!dev) {
      // Disable webpack cache in production builds
      webpackConfig.cache = false;

      // Override localIdentName in production
      webpackConfig.module.rules
        .find((rule) => !!rule.oneOf)
        .oneOf.forEach((moduleLoader) => {
          Array.isArray(moduleLoader.use) &&
            moduleLoader.use.forEach((l) => {
              if (
                l.loader.includes('css-loader') &&
                !l.loader.includes('postcss-loader') &&
                !!l.options.modules
              ) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { getLocalIdent: _, ...moduleOptions } = l.options.modules;

                l.options = {
                  ...l.options,
                  modules: {
                    ...moduleOptions,
                    getLocalIdent,
                    localIdentName: '[hash:base64:6]',
                  },
                };
              }
            });
        });
    }

    return webpackConfig;
  },
  redirects: () => [{ source: '/rsp/:path*', destination: '/ssp/:path*', permanent: true }],
};

const SentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  release: process.env.SENTRY_RELEASE,
  silent: true, // Suppresses all logs
  dryRun: process.env.NODE_ENV !== 'production' || !process.env.SENTRY_AUTH_TOKEN,
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(nextConfig, SentryWebpackPluginOptions);

/* eslint-disable */
// TODO: Remove once better solution found
// https://github.com/vercel/next.js/issues/10584
const loaderUtils = require('next/dist/compiled/loader-utils3');

function getLocalIdent(loaderContext, localIdentName, localName, options) {
  if (!options.context) {
    // eslint-disable-next-line no-param-reassign
    options.context = loaderContext.rootContext;
  }

  const request = path.relative(options.context, loaderContext.resourcePath).replace(/\\/g, '/');

  // eslint-disable-next-line no-param-reassign
  options.content = `${options.hashPrefix + request}+${localName}`;

  // eslint-disable-next-line no-param-reassign
  localIdentName = localIdentName.replace(/\[local\]/gi, localName);

  const hash = loaderUtils.interpolateName(loaderContext, localIdentName, options);

  return hash
    .replace(new RegExp('[^a-zA-Z0-9\\-_\u00A0-\uFFFF]', 'g'), '-')
    .replace(/^((-?[0-9])|--)/, '_$1');
}
