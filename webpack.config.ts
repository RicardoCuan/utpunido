/** Webpack
 * 
 * Configuración de webpack
 * 
 * 
 * @alias Webpack
 * @category app
 * @author Ricardo Cuan {@link ricardo.cuan@utp.ac.pa}
 */
import path from 'path'
import dotenv from 'dotenv'
import webpack from 'webpack'
import nodeExternals from "webpack-node-externals"
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CompressionPlugin from 'compression-webpack-plugin'


dotenv.config()
const isDev:boolean = (process.env.ENV === 'development')

const clientEntry:string[] = [path.resolve(__dirname, 'src/index.tsx')]
const serverEntry:string[] = [path.resolve(__dirname, 'src/app/ssr/index.ts')]


if (isDev) {
  clientEntry.push('react-hot-loader/patch')
  serverEntry.push('react-hot-loader/patch')
}


/** Configuración general de webpack
 * @constant
 */
const config = {
  mode: isDev ? 'development' : 'production',
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    modules: ['src', 'node_modules']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'dist'),
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,  // asd
          'css-loader',                // Translates CSS into CommonJS
          'sass-loader',               // Compiles Sass to CSS
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|gif|jpe?g|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[hash].[ext]'
            }
          }
        ],
        exclude: /node_modules/,
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, 'dist')],
    }),
    new CaseSensitivePathsPlugin(),
    isDev ? new webpack.HotModuleReplacementPlugin() : () => {},
    new MiniCssExtractPlugin({
      filename: isDev ? 'assets/app.css' : 'assets/app-[hash].css',
    }),
    isDev ? () => { } : new CompressionPlugin({
      test: /\.(css)$/,
      filename: '[path][base].gz',
    }),
  ],
}


/** Configuración del Cliente de webpack 
 * @constant
*/
const client = Object.assign({}, config, {
  name: 'client',
  target: 'web',
  entry: clientEntry,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isDev ? 'assets/app.js' : 'assets/app-[hash].js',
    publicPath: '/',
  },
  plugins: [
    // new MiniCssExtractPlugin({
    //   filename: isDev ? 'assets/app.css' : 'assets/app-[hash].css',
    // }),
    isDev ? () => { } : new CompressionPlugin({
      test: /\.(js|css|svg)$/,
      filename: '[path][base].gz',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'async',
      name: 'client',
      cacheGroups: {
        vendors: {
          name: 'vendors',
          chunks: 'all',
          reuseExistingChunk: true,
          priority: 1,
          filename: isDev ? 'assets/vendor.js' : 'assets/vendor-[hash].js',
          enforce: true,
        },
      },
    },
  },
});


/** Configuración del Server de webpack 
 * @constant
*/
const server = Object.assign({}, config, {
  name: 'server',
  target: 'node',
  externals: [nodeExternals()],
  entry: serverEntry,
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, "dist"),
    publicPath: '/',
  },
});


module.exports = [client, server];
