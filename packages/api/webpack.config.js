const path = require('path');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const glob = require('glob');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/** @type {(env: Record<string, any>) => import('webpack').Configuration} */
module.exports = (env) => ({
  mode: 'production',
  devtool: process.env.NODE_ENV === 'development' ? 'cheap-module-source-map' : 'source-map',
  output: {
    path: path.resolve(__dirname, './build'),
    libraryTarget: 'commonjs',
    clean: { keep: /^\.tsbuildinfo$/ },
  },
  cache:
    process.env.NODE_ENV === 'production'
      ? false
      : {
          type: 'filesystem',
          cacheDirectory: path.resolve(__dirname, '.cache'),
        },
  entry: {
    app: './src/app.ts',
    worker: './src/worker.ts',
    // DB migrations/seeds
    ...glob.sync('./src/db/**/*.ts').reduce((acc, filename) => {
      const { dir, name } = path.parse(filename);
      acc[`${dir.replace('./src/', '')}/${name}`] = filename;
      return acc;
    }, {}),
  },
  target: 'node',
  stats: 'errors-warnings',
  externalsPresets: { node: true },
  externals: [
    nodeExternals({ additionalModuleDirs: [path.resolve(__dirname, '../../node_modules')] }),
  ],
  optimization: {
    minimize: false,
    nodeEnv: false,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      '@app': path.resolve(__dirname, 'src/'),
    },
  },
  plugins: env.WEBPACK_SERVE && [
    new RunScriptWebpackPlugin({ name: 'app.js' }),
    new RunScriptWebpackPlugin({ name: 'worker.js' }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.build.json',
              projectReferences: true,
              transpileOnly: !process.env.WEBPACK_DEV_SERVER,
              compilerOptions: {
                noEmit: false,
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    port: 8090,
    hot: false,
    static: false,
    devMiddleware: {
      writeToDisk: true,
    },
  },
  infrastructureLogging: {
    level: 'error',
  },
});
