const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './client/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    //this plugin copies the html file from the template location specified below into the output path specified above
    new HtmlWebpackPlugin({
      template: './client/index.html', 
    }),
  ],
  module: {
    rules: [
      {
        test: /.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      //had to add this rule to get the css to inject into the dist folder correctly
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
    ],
  },
  devServer: {
    proxy: {
      '/': 'http://localhost:5004',
    },
    static: {
      publicPath: '/',
      directory: path.join(__dirname, 'dist'),
    },

    port: 8080,
  },
}