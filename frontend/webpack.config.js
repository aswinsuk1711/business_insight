const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const babelConfig = {
  presets: [
    ['@babel/preset-env', { targets: { browsers: ['last 2 versions'] } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [
    ['module-resolver', {
      alias: { '^react-native$': 'react-native-web' },
    }],
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
  ],
};

module.exports = {
  entry: './index.web.js',
  output: {
    path: path.resolve(__dirname, 'web-build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.web.js', '.js', '.jsx', '.ts', '.tsx'],
    alias: {
      'react-native$': 'react-native-web',
      'react-native-vector-icons/MaterialCommunityIcons': path.resolve(__dirname, 'src/web-stubs/VectorIcons.js'),
      'react-native-vector-icons/Ionicons': path.resolve(__dirname, 'src/web-stubs/VectorIcons.js'),
      'react-native-vector-icons/FontAwesome': path.resolve(__dirname, 'src/web-stubs/VectorIcons.js'),
      'react-native-vector-icons/MaterialIcons': path.resolve(__dirname, 'src/web-stubs/VectorIcons.js'),
      '@react-native-async-storage/async-storage': path.resolve(__dirname, 'src/web-stubs/AsyncStorage.js'),
      'react-native-chart-kit': path.resolve(__dirname, 'src/web-stubs/ChartKit.js'),
      'react-native-svg': path.resolve(__dirname, 'src/web-stubs/Svg.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules\/(?!(react-native-web|@react-navigation|react-native-safe-area-context|react-native-screens)\/).*/,
        use: { loader: 'babel-loader', options: babelConfig },
      },
      {
        test: /\.(png|jpg|gif|svg|ttf|woff|woff2|eot)$/,
        use: { loader: 'url-loader', options: { limit: 8192 } },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
  },
};
