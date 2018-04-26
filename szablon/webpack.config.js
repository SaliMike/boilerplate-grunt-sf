const path = require('path');

module.exports = {
  mode: 'none',
  entry: './components/main.js',
  output: {
    path: path.resolve(__dirname, 'assets/scripts'),
    filename: 'main.min.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            'babel-preset-env',
          ].map(require.resolve)
        },
      },
    ],
  },
};
