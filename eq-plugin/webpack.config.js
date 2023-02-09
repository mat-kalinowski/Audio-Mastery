const path = require('path')

// webpack.config.js
module.exports = {
  entry: [
    './src/eq.js',
    './src/knobs.js',
    './src/css/eq.css'
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: './dist',
    filename: 'bundle.js'
  },
  resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss'],
        modules: ['src', 'node_modules'] // Assuming that your files are inside the src dir
  },
  devServer: {
    static: {
        directory: path.join(__dirname, '/')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "script-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
              sourceMap: true,
            }
          }
        ]
      }
    ]
  }
};