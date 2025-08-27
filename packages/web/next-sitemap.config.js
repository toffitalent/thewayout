const { default: config } = require('@two/config');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.PUBLIC_URL,
  generateRobotsTxt: true,
  sourceDir: 'build',
  robotsTxtOptions: {
    policies: config.environment('production')
      ? [{ userAgent: '*', allow: '/' }]
      : [{ userAgent: '*', disallow: '/' }],
  },
  exclude: ['/privacy*', '/terms*'],
};
