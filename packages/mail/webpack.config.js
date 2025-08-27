const path = require('path');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

/** @type {(env: Record<string, any>) => import('webpack').Configuration} */
module.exports = (env) => ({
  mode: 'production',
  devtool: process.env.NODE_ENV === 'development' ? 'cheap-module-source-map' : 'source-map',
  output: {
    path: path.resolve(__dirname, './build/dist'),
    libraryTarget: 'commonjs',
  },
  entry: {
    app: './src/app.ts',
  },
  target: 'node',
  externalsPresets: { node: true },
  externals: [
    nodeExternals({ additionalModuleDirs: [path.resolve(__dirname, '../../node_modules')] }),
  ],
  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      '@app': path.resolve(__dirname, 'src/'),
    },
  },
  plugins: env.WEBPACK_SERVE && [new RunScriptWebpackPlugin({ name: 'app.js' })],
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|ico)/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name].[hash][ext][query]',
        },
      },
      {
        test: /\.pug$/,
        loader: '@disruptive-labs/pug-loader',
        options: {},
      },
      {
        test: /\.s[ac]ss$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/css/[hash].css[query]',
          publicPath: '',
        },
        use: ['sass-loader'],
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.webpack.json',
              projectReferences: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    port: 8080,
    devMiddleware: {
      writeToDisk: true,
    },
  },
});
