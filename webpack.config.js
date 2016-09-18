module.exports = {
  entry: [
    'whatwg-fetch',
    './src/index.js'
  ],
  output: {
    path: './public/webpack-output',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
 };
