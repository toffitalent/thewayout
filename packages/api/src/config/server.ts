import { env, register } from '@two/config';

export const server = register('server', () => ({
  port: env({
    default: 3000,
    env: 'PORT',
    prefix: false,
  }),
  proxy: true,

  log: env({
    default: {
      level: 'info',
    },
    development: {
      level: 'debug',
      colors: true,
    },
    test: {
      level: 'none',
    },
  }),

  store: {
    url: env({
      default: 'redis://localhost:6379',
      env: 'API_REDIS_URL',
    }),
  },

  // Middleware
  auth: {
    //
    // NOTE: These settings are overridden in the "auth" config file
    //
    // enabled: true,
    // algorithm: 'HS256',
    // roles: [],
    // secret: '',
  },
  cache: {
    // enabled: true,
    // maxAge: 0,
  },
  cors: {
    // enabled: true,
    // origin: '',
    // allowHeaders: [],
    // allowMethods: [],
    // exposeHeaders: [],
    // maxAge: number,
  },
  csp: {
    enabled: false,
    // directives: {},
  },
  cto: {
    // enabled: true,
    // directive: '',
  },
  gzip: {
    // enabled: true
  },
  hsts: env({
    default: {
      // enabled: true,
      // maxAge: 0,
      // includeSubdomains: true,
      // preload: false,
    },
    development: {
      enabled: false,
    },
    staging: {
      maxAge: 3600,
    },
    production: {
      maxAge: 31536000,
    },
  }),
  json: {
    // enabled: true,
  },
  logger: env({
    default: {
      // enabled: true,
      // format: ':method :url :status :response-time ms - :length',
    },
    test: {
      enabled: false,
    },
    staging: {
      format:
        ':id :ip :app :user [:date] ":method :url" :status :length :response-time ":referrer" ":user-agent"',
    },
    production: {
      format:
        ':id :ip :app :user [:date] ":method :url" :status :length :response-time ":referrer" ":user-agent"',
    },
  }),
  methodOverride: {
    // enabled: true,
  },
  parser: {
    // enabled: true,
    // encoding = 'utf-8',
    // formLimit = '56kb',
    // json = true,
    // jsonLimit = '1mb',
    // multipart = false,
    // parsedMethods = ['POST', 'PUT', 'PATCH'],
    // text = false,
    // textLimit = '56kb',
    // urlencoded = true,
  },
  referrer: {
    // enabled: true,
    // directive: ['origin-when-cross-origin', 'strict-origin-when-cross-origin'],
  },
  requestId: {
    // enabled: true,
  },
  responseTime: env({
    default: {
      // enabled: true,
    },
    production: {
      enabled: false,
    },
  }),
  throttle: env({
    default: {
      // enabled: true,
      // duration: 900,
      // max: 450,
      // maxAuth: 450,
      // maxUnauth: 450,
    },
    test: {
      max: 10000,
    },
  }),
  version: {
    // enabled: true,
    availableVersions: [1],
  },
  xframe: {
    // enabled: true,
    // directive: 'deny',
  },
  xss: {
    // enabled: true,
    // mode: 'block',
  },
}));
